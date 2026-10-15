import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Shield, Zap } from "lucide-react";

export const metadata = {
  title: "Pricing & Credit Packages | AssessmentForces",
  description: "Transparent, credit-based pricing for technical recruiter teams and enterprise engineering companies.",
};

export default function PricingPage() {
  const packages = [
    {
      id: "starter",
      name: "Free Starter Tier",
      price: "0 BDT",
      equivalent: "100% Free",
      credits: 10,
      description: "10 complimentary candidate invitations included free for every recruiter organization.",
      popular: false,
      badge: "Free Forever",
      features: [
        "10 Free Candidate invitation credits",
        "Algorithmic & Multiple-choice problems",
        "Deterministic automated auto-grading",
        "Timed attempt monitoring",
        "Basic performance scorecards",
        "No credit card required (Instant access)",
      ],
    },
    {
      id: "growth",
      name: "Growth Package",
      price: "2,000 BDT",
      equivalent: "$20 USD",
      credits: 50,
      description: "Designed for scaling startups and fast-moving technical recruiters.",
      popular: true,
      badge: "Most Popular",
      features: [
        "50 Candidate invitation credits",
        "Custom problem authoring environment",
        "Multi-step assessment wizard",
        "Detailed code telemetry & error logs",
        "Manual evaluation rubrics",
        "Priority recruiter support",
        "Candidate export to CSV/JSON",
      ],
    },
    {
      id: "scale",
      name: "Enterprise Scale",
      price: "3,500 BDT",
      equivalent: "$35 USD",
      credits: 100,
      description: "For high-volume recruitment drives, hackathons, and university hiring.",
      popular: false,
      badge: "High Volume",
      features: [
        "100 Candidate invitation credits",
        "Unlimited custom problem versions",
        "Full recruiter pipeline access",
        "Automated result release toggles",
        "Custom pass percentage thresholding",
        "Dedicated account assistance",
        "Stripe instant checkout receipts",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" className="mb-3">
            Pay As You Hire
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple, Transparent Candidate Credits
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg">
            Start with 10 complimentary credits or purchase packages using secure Stripe Checkout. 1 credit equals 1 complete candidate assessment invitation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              hoverEffect
              glow={pkg.popular}
              className={`flex flex-col justify-between relative ${
                pkg.popular
                  ? "border-blue-500 bg-white dark:bg-slate-900/90 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : pkg.id === "starter"
                  ? "bg-white dark:bg-slate-900/50 border-emerald-500/40 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20"
                  : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
              }`}
            >
              {pkg.popular ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="info" size="sm" className="bg-blue-600 text-white font-bold border-blue-400 shadow-sm">
                    Most Popular
                  </Badge>
                </div>
              ) : pkg.id === "starter" ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="success" size="sm" className="bg-emerald-600 text-white font-bold border-emerald-400 shadow-sm">
                    100% Free
                  </Badge>
                </div>
              ) : null}

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{pkg.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-3xl sm:text-4xl font-extrabold font-mono ${pkg.id === "starter" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                    {pkg.price}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">({pkg.equivalent})</span>
                </div>
                <p className={`text-xs font-semibold mb-6 ${pkg.id === "starter" ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}`}>
                  {pkg.id === "starter"
                    ? "10 Free Invitations (0 BDT / No Card Needed)"
                    : `${pkg.credits} Invitations (${Math.round(parseInt(pkg.price.replace(/,/g, "")) / pkg.credits)} BDT / candidate)`}
                </p>

                <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800">
                <Link href={pkg.id === "starter" ? "/register" : "/recruiter/billing"}>
                  <Button
                    variant={pkg.popular ? "glow" : pkg.id === "starter" ? "outline" : "primary"}
                    className={`w-full gap-2 ${pkg.id === "starter" ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30" : ""}`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {pkg.id === "starter" ? "Claim 10 Free Credits" : `Buy ${pkg.name.split(" ")[0]} Credits`}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Security / Guarantee Banner */}
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-none flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enterprise-Grade Secure Checkout</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Powered by Stripe Checkout. Real-time automatic credit replenishment and encrypted payment receipts.
              </p>
            </div>
          </div>
          <Link href="/login" className="shrink-0">
            <Button variant="outline" size="sm">
              Log in to Top Up
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
