"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

export default function MyVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get("/videos");
      setVideos(response.data.videos || []);
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
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch {
      toast.error("Failed to delete video");
    }
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
            My Videos
          </h1>
          <p className="text-white/60">
            All your uploaded videos ({videos.length})
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button variant="primary">
            <Sparkles className="w-4 h-4" />
            Upload New Video
          </Button>
        </Link>
      </motion.div>

      {/* Video Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="bg-white/5 ring-1 ring-white/10 p-1.5 rounded-[2rem]">
            <div className="bg-black/40 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-[calc(2rem-0.375rem)] p-12 text-center space-y-4">
              <Video className="w-16 h-16 text-white/30 mx-auto" />
              <h3 className="text-xl font-semibold text-white">No videos yet</h3>
              <p className="text-white/60 max-w-md mx-auto">
                Upload your first video to start generating viral short clips
              </p>
              <Link href="/dashboard/upload">
                <Button variant="primary">Upload Video</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: i * 0.05,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <VideoCard video={video} onDelete={handleDelete} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
