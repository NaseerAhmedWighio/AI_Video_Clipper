"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Key,
  Save,
  Trash2,
  Bell,
  Moon,
  Monitor,
  Sun,
  Video,
  Clock,
  AlertTriangle,
  Check,
  Upload,
  Image,
  X,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [maxDuration, setMaxDuration] = useState(30);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");

  // Logo upload state
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoFileRef = useState<HTMLInputElement | null>(null)[0];
  const logoInputRef = (el: HTMLInputElement | null) => {
    if (el) {
      // Store ref
      (window as any).__logoInput = el;
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setLogoUrl((user as any).logo_url || null);
    }
    // Also fetch user profile to get latest logo_url
    api.get("/me").then((res) => {
      const u = res.data;
      if (u.logo_url) {
        const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
        setLogoUrl(`${backendBase}${u.logo_url}`);
      }
    }).catch(() => {});
  }, [user]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload-logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Prepend backend base URL for display
      const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
      setLogoUrl(`${backendBase}${res.data.logo_url}`);
      toast.success("Logo uploaded successfully!");
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setLogoUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    toast.success("Logo removed (will not be used in new videos)");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Update name (email is locked)
      await api.put("/me", { name });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    toast("Password change coming soon!");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account?\n\nThis will delete all your videos and shorts. This action CANNOT be undone."
      )
    ) {
      toast.error("Account deletion coming soon!");
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Settings
        </h1>
        <p className="text-white/60">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Profile</h2>
                <p className="text-sm text-white/50">Update your personal info</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white/70" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 ring-1 ring-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70" htmlFor="email">
                  Email (cannot be changed)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="w-full bg-white/5 ring-1 ring-white/10 rounded-xl pl-10 pr-4 py-3 text-white/40 cursor-not-allowed"
                    title="Email address cannot be changed after registration"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded">Locked</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveProfile}
                isLoading={saving}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Watermark Logo Settings */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Image className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Watermark Logo</h2>
                <p className="text-sm text-white/50">
                  Your logo will appear on all generated shorts (top-left corner)
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Logo Preview */}
              <div className="relative w-24 h-24 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoUrl ? (
                  <>
                    <img
                      src={logoUrl}
                      alt="Your logo"
                      className="w-20 h-20 object-contain"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </>
                ) : (
                  <Image className="w-8 h-8 text-white/20" />
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                {logoUrl ? (
                  <div>
                    <p className="text-sm text-white font-medium">Logo is set</p>
                    <p className="text-xs text-white/40 mt-1">
                      Upload a new logo to replace it. Supports PNG, JPG, WebP, GIF.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-white/60">No logo uploaded yet</p>
                    <p className="text-xs text-white/30 mt-1">
                      Upload a logo (PNG with transparency recommended) to watermark your shorts
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl text-sm font-medium cursor-pointer hover:bg-purple-500/30 transition-all">
                      {logoUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          {logoUrl ? "Replace Logo" : "Upload Logo"}
                        </>
                      )}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Security</h2>
                <p className="text-sm text-white/50">Password and authentication</p>
              </div>
            </div>

            <Button variant="secondary" size="sm" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Processing Settings */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Video Processing</h2>
                <p className="text-sm text-white/50">Configure processing defaults</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">
                Max Video Duration (minutes): {maxDuration}
              </label>
              <input
                type="range"
                min={5}
                max={60}
                value={maxDuration}
                onChange={(e) => setMaxDuration(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-white/40">
                <span>5 min</span>
                <span>60 min</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
                <p className="text-sm text-white/50">Manage notification preferences</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Processing Complete</p>
                <p className="text-sm text-white/50">
                  Get notified when video processing finishes
                </p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications ? "bg-purple-500" : "bg-white/20"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        <Card className="ring-2 ring-red-500/30">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
                <p className="text-sm text-white/50">Irreversible actions</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl">
              <div>
                <p className="text-white font-medium">Delete Account</p>
                <p className="text-sm text-white/50">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4 text-red-400" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
