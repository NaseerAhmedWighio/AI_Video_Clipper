"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileVideo, X, CheckCircle } from "lucide-react";
import { Card } from "./Card";
import { cn, formatFileSize } from "@/lib/utils";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface VideoUploadProps {
  onUploadComplete?: (video: any) => void;
}

export function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const { user } = useAuth();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a video file");
        return;
      }

      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error("File size must be less than 500MB");
        return;
      }

      setUploadedFile({ name: file.name, size: file.size });
      setUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload-video", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setProgress(percentCompleted);
          },
        });

        toast.success("Video uploaded successfully!");
        onUploadComplete?.(response.data);
        setUploadedFile(null);
      } catch (error: any) {
        toast.error(error.response?.data?.detail || "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
    maxFiles: 1,
  });

  const cancelUpload = () => {
    setUploadedFile(null);
    setUploading(false);
    setProgress(0);
  };

  return (
    <Card className="w-full">
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-[1.5rem] p-12 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer",
            isDragActive
              ? "border-white/40 bg-white/10 scale-[1.02]"
              : "border-white/20 hover:border-white/30 hover:bg-white/5"
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"
            >
              <Upload className="w-8 h-8 text-white/70" />
            </motion.div>

            <div className="text-center">
              <p className="text-lg font-medium text-white mb-1">
                {isDragActive ? "Drop your video here" : "Upload your video"}
              </p>
              <p className="text-sm text-white/50">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-white/30 mt-2">
                MP4, MOV, AVI, MKV, WebM (max 500MB)
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {uploadedFile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden"
            >
              <div className="bg-white/5 ring-1 ring-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileVideo className="w-5 h-5 text-white/70" />
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                  </div>
                  {!uploading && (
                    <button
                      onClick={cancelUpload}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Uploading...</span>
                      <span className="text-white/50">{progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {!uploading && progress === 100 && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Upload complete</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
