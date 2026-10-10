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
      name: "Starter Package",
      price: "500 BDT",
      equivalent: "$5 USD",
      credits: 10,
      description: "Ideal for small teams hiring for 1-2 specialized engineering positions.",
      popular: false,
      features: [
        "10 Candidate invitation credits",
        "Algorithmic & Multiple-choice problems",
        "Deterministic automated auto-grading",
        "Timed attempt monitoring",
        "Basic performance scorecards",
        "Email support",
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
      features: [
        "50 Candidate invitation credits",
        "Custom problem authoring sandbox",
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
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" className="mb-3">
            Pay As You Hire
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Simple, Transparent Candidate Credits
          </h1>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            Purchase credits using test Stripe checkout or bKash gateway. 1 credit equals 1 complete candidate assessment invitation.
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
                  ? "border-blue-500/50 bg-slate-900/90 shadow-2xl shadow-blue-500/10"
                  : "bg-slate-900/50"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="info" size="sm" className="bg-blue-600 text-white font-bold border-blue-400">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-slate-400">({pkg.equivalent})</span>
                </div>
                <p className="text-xs text-blue-400 font-semibold mb-6">
                  {pkg.credits} Invitations ({Math.round(parseInt(pkg.price) / pkg.credits)} BDT / candidate)
                </p>

                <div className="space-y-3 pt-6 border-t border-slate-800 text-xs text-slate-300">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-800">
                <Link href="/recruiter/billing">
                  <Button
                    variant={pkg.popular ? "glow" : "primary"}
                    className="w-full gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Buy {pkg.name.split(" ")[0]} Credits
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Security / Guarantee Banner */}
        <div className="p-8 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed Test Mode Processing</h4>
              <p className="text-xs text-slate-400">
                Powered by Stripe test checkout and SSLCommerz test mode. Fully functional payment success and cancellation workflows.
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
