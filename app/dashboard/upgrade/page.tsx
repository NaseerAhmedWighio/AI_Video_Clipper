"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  Star,
  ArrowUpRight,
  CreditCard,
  Shield,
  Clock,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    icon: Sparkles,
    color: "from-gray-500/20 to-gray-500/10",
    features: [
      "5 videos/month",
      "Basic AI analysis",
      "720p export",
      "Email support",
      "Standard processing speed",
    ],
    cta: "Current Plan",
    current: true,
    disabled: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For content creators",
    icon: Zap,
    color: "from-purple-500/20 to-purple-500/10",
    features: [
      "50 videos/month",
      "Advanced AI analysis",
      "1080p export",
      "Priority support",
      "Custom captions",
      "Bulk export",
      "Faster processing",
      "No watermarks",
    ],
    cta: "Upgrade to Pro",
    current: false,
    disabled: false,
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For teams & agencies",
    icon: Crown,
    color: "from-emerald-500/20 to-emerald-500/10",
    features: [
      "Unlimited videos",
      "Premium AI models",
      "4K export",
      "24/7 support",
      "API access",
      "Custom branding",
      "Team management",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    current: false,
    disabled: false,
  },
];

const faqs = [
  {
    question: "What happens when I exceed my video limit?",
    answer:
      "You'll be notified when you're close to your limit. You can upgrade anytime or wait for the next billing cycle.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel anytime. You'll continue to have access to your plan until the end of the billing period.",
  },
  {
    question: "How long does video processing take?",
    answer:
      "Processing time depends on video length and your plan. Pro users get priority processing (2-5x faster than free tier).",
  },
];

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = (planName: string) => {
    if (planName === "Free") return;
    setSelectedPlan(planName);
    toast(`${planName} plan — payment integration coming soon!`);
    setTimeout(() => setSelectedPlan(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-white/70">
            Pricing
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          Upgrade Your Plan
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Unlock more processing power, higher quality exports, and priority
          support
        </p>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: i * 0.1,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            <Card
              className={
                plan.highlighted
                  ? "ring-2 ring-purple-500/50"
                  : undefined
              }
            >
              <div className="space-y-6">
                {/* Plan Header */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}
                  >
                    <plan.icon className="w-6 h-6 text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-sm text-white/50">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period !== "forever" && (
                    <span className="text-white/50">{plan.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="w-full"
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={plan.disabled}
                  isLoading={selectedPlan === plan.name}
                >
                  {plan.current ? (
                    <>
                      <Check className="w-4 h-4" />
                      {plan.cta}
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        <Card>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Feature Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm text-white/60">
                      Feature
                    </th>
                    <th className="text-center py-3 px-4 text-sm text-white/70">
                      Free
                    </th>
                    <th className="text-center py-3 px-4 text-sm text-purple-400">
                      Pro
                    </th>
                    <th className="text-center py-3 px-4 text-sm text-emerald-400">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Videos/month", free: "5", pro: "50", enterprise: "Unlimited" },
                    { feature: "Export quality", free: "720p", pro: "1080p", enterprise: "4K" },
                    { feature: "AI model", free: "Basic", pro: "Advanced", enterprise: "Premium" },
                    { feature: "Processing speed", free: "Standard", pro: "Priority", enterprise: "Fastest" },
                    { feature: "Custom captions", free: "✕", pro: "✓", enterprise: "✓" },
                    { feature: "Bulk export", free: "✕", pro: "✓", enterprise: "✓" },
                    { feature: "API access", free: "✕", pro: "✕", enterprise: "✓" },
                    { feature: "Team members", free: "1", pro: "3", enterprise: "Unlimited" },
                    { feature: "Support", free: "Email", pro: "Priority", enterprise: "24/7" },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-white/70">
                        {row.feature}
                      </td>
                      <td className="py-3 px-4 text-sm text-white/50 text-center">
                        {row.free}
                      </td>
                      <td className="py-3 px-4 text-sm text-white/70 text-center">
                        {row.pro}
                      </td>
                      <td className="py-3 px-4 text-sm text-white/70 text-center">
                        {row.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* FAQs */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">
            Frequently Asked Questions
          </h2>

          {faqs.map((faq, i) => (
            <Card key={i}>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  {faq.question}
                </h3>
                <p className="text-white/60 leading-relaxed">{faq.answer}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="flex flex-wrap items-center justify-center gap-8 py-8 text-white/40"
      >
        {[
          { icon: Shield, label: "Secure Payment" },
          { icon: CreditCard, label: "All Cards Accepted" },
          { icon: Clock, label: "Cancel Anytime" },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2">
            <badge.icon className="w-5 h-5" />
            <span className="text-sm">{badge.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
