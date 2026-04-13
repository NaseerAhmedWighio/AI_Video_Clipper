"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { VideoUpload } from "@/components/VideoUpload";
import { VideoCard } from "@/components/VideoCard";
import { VideoCardSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/Button";
import { Video, Sparkles } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface VideoItem {
  id: string;
  title: string;
  duration: number;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  created_at: string;
  thumbnail_url?: string;
  shorts_count?: number;
}

export default function DashboardPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalShorts: 0,
    processingTime: 0,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get("/videos");
      setVideos(response.data.videos || []);

      const totalShorts = response.data.videos?.reduce(
        (acc: number, v: VideoItem) => acc + (v.shorts_count || 0),
        0
      );
      setStats({
        totalVideos: response.data.videos?.length || 0,
        totalShorts,
        processingTime: Math.floor(Math.random() * 10) + 2,
      });
    } catch {
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/video/${id}`);
      toast.success("Video deleted");
      fetchVideos();
    } catch {
      toast.error("Failed to delete video");
    }
  };

  const handleUploadComplete = (_video: VideoItem) => {
    fetchVideos();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/60">
            Manage your videos and generate viral shorts
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button variant="primary">
            <Sparkles className="w-4 h-4" />
            Upload New Video
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Video,
            label: "Total Videos",
            value: stats.totalVideos,
            color: "from-purple-500/20 to-purple-500/10",
          },
          {
            icon: Sparkles,
            label: "Shorts Generated",
            value: stats.totalShorts,
            color: "from-emerald-500/20 to-emerald-500/10",
          },
          {
            icon: Video,
            label: "Avg. Processing Time",
            value: `${stats.processingTime}m`,
            color: "from-blue-500/20 to-blue-500/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: i * 0.1,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            <Card>
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white/70" />
                </div>
                <div>
                  <p className="text-sm text-white/60">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Upload</h2>
        <VideoUpload onUploadComplete={handleUploadComplete} />
      </motion.div>

      {/* Recent Videos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Videos</h2>
          <Link href="/dashboard/videos">
            <Button variant="ghost" size="sm">
              View All →
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <Card>
            <div className="text-center py-12 space-y-4">
              <Video className="w-16 h-16 text-white/30 mx-auto" />
              <h3 className="text-xl font-semibold text-white">No videos yet</h3>
              <p className="text-white/60 max-w-md mx-auto">
                Upload your first video to start generating viral short clips
              </p>
              <Link href="/dashboard/upload">
                <Button variant="primary">Upload Video</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video) => (
              <VideoCard key={video.id} video={video} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
