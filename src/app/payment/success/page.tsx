"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Receipt,
  Send,
} from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id") || "cs_test_devassess_live";
  const packageName = searchParams.get("package") || "Growth Package";
  const credits = searchParams.get("credits") || "50";
  const amount = searchParams.get("amount") || "2000";
  const currency = searchParams.get("currency") || "BDT";

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <Card className="p-8 sm:p-10 border-emerald-500/30 bg-white dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl space-y-6 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <Badge variant="success" size="sm">
          Stripe Payment Verified
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Payment Processed Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Your invitation credit package has been processed and credited to your company balance.
        </p>
      </div>

      {/* Invoice Breakdown Card */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-left space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1.5 font-sans font-medium text-slate-700 dark:text-slate-300">
            <Receipt className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Stripe Session
          </span>
          <span className="text-slate-800 dark:text-slate-200">{sessionId.substring(0, 16)}...</span>
        </div>

        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
          <span className="font-sans font-medium text-slate-700 dark:text-slate-300">Package Name</span>
          <span className="text-slate-900 dark:text-white font-semibold">{packageName}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
          <span className="font-sans font-medium text-slate-700 dark:text-slate-300">Credits Added</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{credits} Credits</span>
        </div>

        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
          <span className="font-sans font-medium text-slate-700 dark:text-slate-300">Amount Charged</span>
          <span className="text-slate-900 dark:text-white font-bold">{amount} {currency}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="font-sans font-medium text-slate-700 dark:text-slate-300">Payment Gateway</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Stripe Checkout</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/recruiter/candidates" className="w-full sm:w-auto">
          <Button variant="glow" className="w-full gap-2 text-xs">
            <Send className="w-4 h-4" />
            Dispatch Candidate Invitations
          </Button>
        </Link>
        <Link href="/recruiter/billing" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full text-xs">
            Return to Billing
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07080c] transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          <Suspense fallback={<div className="text-center text-slate-500 dark:text-slate-400">Loading receipt...</div>}>
            <PaymentSuccessContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
