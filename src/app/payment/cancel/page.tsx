"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07080c] transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-amber-500/10 dark:bg-amber-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          <Card className="p-8 sm:p-10 border-amber-500/30 bg-white dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <Badge variant="warning" size="sm">
                Checkout Terminated
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Payment Was Cancelled
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No credit card charges were processed. You can retry checkout anytime or select a different invitation credit package.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 text-left space-y-1">
              <p className="font-semibold text-slate-900 dark:text-slate-200">Need Assistance?</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                If you encountered an issue during payment, please reach out to our team at support@devassess.local.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/recruiter/billing" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full gap-2 text-xs">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Return to Credit Packages
                </Button>
              </Link>
              <Link href="/recruiter" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full text-xs">
                  Recruiter Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
