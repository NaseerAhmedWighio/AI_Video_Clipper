"use client";

import { Card, CardMinimal } from "./Card";
import { Button } from "./Button";
import { motion } from "framer-motion";
import {
  Download,
  Copy,
  Play,
  TrendingUp,
  Check,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Backend base URL — used for serving output files directly
const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";

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

interface ShortCardProps {
  short: Short;
  index: number;
}

/** Convert a relative video_url (e.g. "/output/xxx.mp4") to the full backend URL */
function toBackendUrl(videoUrl: string | undefined): string | undefined {
  if (!videoUrl) return undefined;
  if (videoUrl.startsWith("http")) return videoUrl; // already absolute
  return `${BACKEND_BASE}${videoUrl}`;
}

export function ShortCard({ short, index }: ShortCardProps) {
  const [copied, setCopied] = useState(false);

  const downloadShort = async () => {
    const fullUrl = toBackendUrl(short.video_url);
    if (!fullUrl) {
      toast.error("No video file available for download");
      return;
    }
    try {
      toast.loading("Downloading...");
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${short.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Downloaded!");
    } catch {
      toast.dismiss();
      toast.error("Failed to download video");
    }
  };

  const copyCaption = async () => {
    await navigator.clipboard.writeText(short.caption);
    setCopied(true);
    toast.success("Caption copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const duration = short.end_time - short.start_time;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-white/60";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "High";
    if (score >= 60) return "Medium";
    return "Low";
  };

  return (
    <motion.div
      initial={{ y: 24, opacity: 0, filter: "blur(4px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      <Card>
        <div className="space-y-4">
          {/* Video Preview */}
          <div className="relative aspect-[9/16] max-w-[280px] mx-auto bg-gradient-to-br from-purple-500/20 to-emerald-500/20 rounded-xl overflow-hidden group">
            {short.video_url ? (
              <video
                src={toBackendUrl(short.video_url)}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white/70" />
                </div>
                <p className="text-xs text-white/50">Preview not available</p>
              </div>
            )}

            {/* Virality Score Badge */}
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg">
              <div className="flex items-center gap-1">
                <TrendingUp
                  className={`w-3 h-3 ${getScoreColor(short.virality_score)}`}
                />
                <span
                  className={`text-xs font-medium ${getScoreColor(
                    short.virality_score
                  )}`}
                >
                  {short.virality_score}%
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white text-center">{short.title}</h3>

            <div className="flex items-center justify-center gap-3 text-xs text-white/50">
              <span>Duration: {duration}s</span>
              <span>•</span>
              <span>
                Virality:{" "}
                <span className={getScoreColor(short.virality_score)}>
                  {getScoreLabel(short.virality_score)}
                </span>
              </span>
            </div>

            {/* Caption Preview */}
            <CardMinimal>
              <p className="text-xs text-white/70 line-clamp-2 text-center">
                {short.caption}
              </p>
            </CardMinimal>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={downloadShort}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={copyCaption}>
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
