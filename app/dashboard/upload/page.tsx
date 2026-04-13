"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { VideoUpload } from "@/components/VideoUpload";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Sparkles, ArrowLeft, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Link from "next/link";

export default function UploadPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<any>(null);

  const handleUploadComplete = async (video: any) => {
    setUploadedVideo(video);

    // Auto-start processing
    try {
      setProcessing(true);
      await api.post(`/process-video/${video.id}`);
      toast.success("Video processing started!");
      router.push(`/dashboard/video/${video.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to start processing");
      setProcessing(false);
    }
  };

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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Upload Video
        </h1>
        <p className="text-white/60">
          Upload a long-form video to generate viral shorts
        </p>
      </motion.div>

      {/* Upload */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      >
        <VideoUpload onUploadComplete={handleUploadComplete} />
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
      >
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-blue-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">
                What happens next?
              </h3>
              <ul className="space-y-2 text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">1.</span>
                  <span>Audio is extracted and transcribed using AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">2.</span>
                  <span>AI analyzes the transcript for viral moments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">3.</span>
                  <span>Short clips are generated with captions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">4.</span>
                  <span>You can download and share your shorts</span>
                </li>
              </ul>
              <p className="text-sm text-white/40 pt-2">
                Processing typically takes 5-15 minutes depending on video length
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Processing Status */}
      {processing && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Processing Video...
                </h3>
                <p className="text-white/60">
                  This may take a few minutes. We'll notify you when it's ready.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
