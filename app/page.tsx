"use client";

import { motion, useInView } from "framer-motion";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Navbar } from "@/components/Navbar";
import {
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  Video,
  Scissors,
  Download,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 64, opacity: 0, filter: "blur(4px)" }}
      animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.32, 0.72, 0, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] bg-[#050505] overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative py-40 md:py-52 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-xl mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-white/70">
                AI-Powered Video Processing
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight">
              Turn Long Videos
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Into Viral Shorts
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Upload your long-form content and let our AI extract the most
              engaging moments. Perfect for TikTok, Reels, and YouTube Shorts.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="secondary" size="lg">
                  See How It Works
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="flex items-center justify-center gap-6 mt-12 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>5 free videos/month</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-40 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-white/70">
                  Features
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white">
                Everything You Need
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Powerful AI tools to transform your content into viral-worthy
                short clips
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Video,
                title: "Smart Upload",
                description:
                  "Drag & drop your videos. We handle MP4, MOV, AVI, and more.",
              },
              {
                icon: Sparkles,
                title: "AI Analysis",
                description:
                  "Our AI transcribes and identifies the most engaging moments.",
              },
              {
                icon: Scissors,
                title: "Auto Clipping",
                description:
                  "Automatically extracts vertical clips with captions.",
              },
              {
                icon: TrendingUp,
                title: "Virality Score",
                description:
                  "Each clip gets a score based on engagement potential.",
              },
              {
                icon: Clock,
                title: "Time Saver",
                description: "What took hours now takes minutes. 10x faster.",
              },
              {
                icon: Download,
                title: "Easy Export",
                description: "Download individual clips or bulk export all.",
              },
            ].map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Card>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-emerald-500/20 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white/70" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-40 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-white/70">
                  How It Works
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white">
                3 Simple Steps
              </h2>
            </div>
          </AnimatedSection>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Upload Your Video",
                description:
                  "Drag and drop your long-form video. We support all major video formats up to 30 minutes.",
              },
              {
                step: "02",
                title: "AI Analyzes Content",
                description:
                  "Our AI transcribes audio, identifies key moments, and selects the most engaging clips.",
              },
              {
                step: "03",
                title: "Download & Share",
                description:
                  "Get multiple vertical clips with captions, ready to post on TikTok, Reels, or Shorts.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <Card>
                  <div className="flex items-start gap-6 md:gap-12">
                    <div className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                      {item.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-40 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-white/70">
                  Pricing
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-white/60">
                Start free, upgrade when you need more
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for getting started",
                features: [
                  "5 videos/month",
                  "Basic AI analysis",
                  "720p export",
                  "Email support",
                ],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$29",
                description: "For content creators",
                features: [
                  "50 videos/month",
                  "Advanced AI analysis",
                  "1080p export",
                  "Priority support",
                  "Custom captions",
                  "Bulk export",
                ],
                cta: "Start Free Trial",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "$99",
                description: "For teams & agencies",
                features: [
                  "Unlimited videos",
                  "Premium AI models",
                  "4K export",
                  "24/7 support",
                  "API access",
                  "Custom branding",
                  "Team management",
                ],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((plan, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Card
                  className={
                    plan.highlighted
                      ? "ring-2 ring-purple-500/50"
                      : undefined
                  }
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-5xl font-bold text-white">
                          {plan.price}
                        </span>
                        {plan.price !== "$0" && (
                          <span className="text-white/50">/month</span>
                        )}
                      </div>
                      <p className="text-white/60">{plan.description}</p>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/signup">
                      <Button
                        variant={plan.highlighted ? "primary" : "secondary"}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 px-4">
        <AnimatedSection>
          <Card className="max-w-4xl mx-auto">
            <div className="text-center space-y-8 py-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Create Viral Shorts?
              </h2>
              <p className="text-lg text-white/60 max-w-xl mx-auto">
                Join thousands of creators using AI to scale their short-form
                content
              </p>
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </Card>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ClipAI</span>
              </div>
              <p className="text-sm text-white/50">
                AI-powered video shorts generator for modern creators.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Changelog", "Docs"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Cookies"],
              },
            ].map((col, i) => (
              <div key={i} className="space-y-4">
                <h4 className="font-semibold text-white">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/40">
            <p>
              © {new Date().getFullYear()} ClipAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
