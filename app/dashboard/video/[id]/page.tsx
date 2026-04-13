"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { ShortCard } from "@/components/ShortCard";
import { ShortCardSkeleton, VideoCardSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/Button";
import { VideoCard } from "@/components/VideoCard";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Play,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface Video {
  id: string;
  title: string;
  duration: number;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  error_message?: string | null;
  created_at: string;
  updated_at?: string | null;
  thumbnail_url?: string;
  shorts_count?: number;
}

interface Short {
  id: string;
  video_id: string;
  title: string;
  start_time: number;
  end_time: number;
  virality_score: number;
  caption: string;
  video_url?: string;
}

const POLL_INTERVAL_MS = 3000; // Poll every 3 seconds

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Refs for polling management
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoIdRef = useRef(videoId);

  // Clear any existing polling
  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Start polling for status updates
  const startPolling = useCallback(() => {
    clearPolling();
    pollIntervalRef.current = setInterval(() => {
      fetchVideoDetails(true); // silent fetch for polling
    }, POLL_INTERVAL_MS);
  }, [clearPolling]);

  // Update videoId ref when it changes
  useEffect(() => {
    videoIdRef.current = videoId;
  }, [videoId]);

  // Cleanup polling on unmount or videoId change
  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, [clearPolling]);

  const fetchVideoDetails = async (silent = false) => {
    try {
      const [videoRes, shortsRes] = await Promise.all([
        api.get(`/video/${videoIdRef.current}`),
        api.get(`/shorts/${videoIdRef.current}`),
      ]);

      const videoData = videoRes.data;
      setVideo(videoData);
      setShorts(shortsRes.data.shorts || []);

      // Stop polling if video is completed or failed
      if (videoData.status === "completed" || videoData.status === "failed") {
        clearPolling();
        setProcessing(false);
        if (videoData.status === "failed" && !silent) {
          toast.error(`Processing failed: ${videoData.error_message || "Unknown error"}`);
        }
        if (videoData.status === "completed" && !silent) {
          toast.success("Video processing completed!");
        }
      }
    } catch (err: any) {
      if (!silent) {
        toast.error("Failed to load video details");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  const handleProcessVideo = async () => {
    try {
      setProcessing(true);
      await api.post(`/process-video/${videoId}`);
      toast.success("Processing started!");

      // Start polling immediately
      startPolling();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to start processing");
      setProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    try {
      const response = await api.get(`/shorts/${videoId}/download-all`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `shorts-${videoId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download");
    }
  };

  const handleDelete = async () => {
    if (!video) return;
    if (!window.confirm(`Delete "${video.title}"?\nThis cannot be undone.`)) return;
    try {
      await api.delete(`/video/${videoId}`);
      toast.success("Video deleted");
      router.push("/dashboard/videos");
    } catch {
      toast.error("Failed to delete video");
    }
  };

  const statusConfig = {
    pending: {
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      icon: <Clock className="w-5 h-5" />,
      label: "Pending",
    },
    processing: {
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      label: "Processing",
    },
    completed: {
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Completed",
    },
    failed: {
      color: "text-red-400",
      bg: "bg-red-400/10",
      icon: <AlertCircle className="w-5 h-5" />,
      label: "Failed",
    },
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <VideoCardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <ShortCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-white/60">Video not found</p>
          <Link href="/dashboard">
            <Button variant="primary" className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const status = statusConfig[video.status];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {video.title}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${status.color} ${status.bg}`}
              >
                {status.icon}
                {status.label}
              </span>
              <span className="text-white/50">
                Duration: {Math.floor(video.duration / 60)}:
                {(video.duration % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {video.status === "completed" && shorts.length > 0 && (
              <Button variant="secondary" onClick={handleDownloadAll}>
                <Download className="w-4 h-4" />
                Download All ({shorts.length})
              </Button>
            )}
            {(video.status === "pending" || video.status === "failed") && (
              <Button
                variant="primary"
                onClick={handleProcessVideo}
                isLoading={processing}
              >
                <RefreshCw className="w-4 h-4" />
                {video.status === "failed" ? "Retry" : "Process Video"}
              </Button>
            )}
            <Button variant="ghost" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 text-red-400" />
              Delete
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Video Preview */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      >
        <Card>
          <div className="aspect-video bg-black/40 rounded-xl overflow-hidden flex items-center justify-center">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Play className="w-20 h-20 text-white/30" />
            )}
          </div>
        </Card>
      </motion.div>

      {/* Processing Progress */}
      {video.status === "processing" && (
        <Card>
          <div className="py-8 px-6 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <h3 className="text-xl font-semibold text-white">
                Processing Video...
              </h3>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-between text-sm text-white/60 mb-1">
                <span>Progress</span>
                <span>{video.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(video.progress, 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-center text-white/40 text-sm mt-2">
                This may take a few minutes. Status updates automatically.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Failed State with Error Details */}
      {video.status === "failed" && (
        <Card>
          <div className="py-8 px-6 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <h3 className="text-xl font-semibold text-red-400">
                Processing Failed
              </h3>
            </div>
            {video.error_message && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-red-300 text-sm font-mono break-all">
                  {video.error_message}
                </p>
              </div>
            )}
            <div className="flex justify-center">
              <Button variant="primary" onClick={handleProcessVideo} isLoading={processing}>
                <RefreshCw className="w-4 h-4" />
                Retry Processing
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Shorts Section */}
      {video.status === "completed" && (
        <div>
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-2xl font-bold text-white">
              Generated Shorts ({shorts.length})
            </h2>
          </motion.div>

          {shorts.length === 0 ? (
            <Card>
              <div className="text-center py-12 space-y-4">
                <Play className="w-16 h-16 text-white/30 mx-auto" />
                <h3 className="text-xl font-semibold text-white">
                  No shorts generated yet
                </h3>
                <p className="text-white/60">
                  Try processing the video again
                </p>
                <Button variant="primary" onClick={handleProcessVideo}>
                  <RefreshCw className="w-4 h-4" />
                  Process Video
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shorts.map((short, i) => (
                <ShortCard key={short.id} short={short} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
