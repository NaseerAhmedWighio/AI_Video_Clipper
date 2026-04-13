"use client";

import { Card } from "./Card";
import { Button } from "./Button";
import { formatDuration, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Play,
  Trash2,
  Eye,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Video {
  id: string;
  title: string;
  duration: number;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  created_at: string;
  thumbnail_url?: string;
  shorts_count?: number;
}

interface VideoCardProps {
  video: Video;
  onDelete?: (id: string) => void;
}

export function VideoCard({ video, onDelete }: VideoCardProps) {
  const [deleting, setDeleting] = useState(false);

  const statusConfig = {
    pending: {
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      icon: <Clock className="w-3 h-3" />,
      label: "Pending",
    },
    processing: {
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      label: "Processing",
    },
    completed: {
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      icon: <CheckCircle className="w-3 h-3" />,
      label: "Completed",
    },
    failed: {
      color: "text-red-400",
      bg: "bg-red-400/10",
      icon: <AlertCircle className="w-3 h-3" />,
      label: "Failed",
    },
  };

  const status = statusConfig[video.status];

  const handleDelete = () => {
    if (window.confirm(`Delete "${video.title}"?\nThis action cannot be undone.`)) {
      setDeleting(true);
      onDelete?.(video.id);
    }
  };

  return (
    <motion.div
      initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
    >
      <Card>
        <div className="space-y-4">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-white/5 rounded-xl overflow-hidden group">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-12 h-12 text-white/30" />
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Link href={`/dashboard/video/${video.id}`}>
                <Button variant="primary" size="sm">
                  View Details
                </Button>
              </Link>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white">
              {formatDuration(video.duration)}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-white truncate">{video.title}</h3>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.color} ${status.bg}`}
              >
                {status.icon}
                {status.label}
              </span>
            </div>

            {/* Progress bar for processing videos */}
            {video.status === "processing" && (
              <div>
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>Processing</span>
                  <span>{video.progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(video.progress, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-white/50">
              <span>{formatDate(video.created_at)}</span>
              {video.shorts_count !== undefined && video.shorts_count > 0 && (
                <span>{video.shorts_count} shorts</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/dashboard/video/${video.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                <Eye className="w-4 h-4" />
                View
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
