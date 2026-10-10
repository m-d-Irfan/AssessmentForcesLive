"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditPackage, Payment } from "@/types";
import {
  CreditCard,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "pkg_starter",
    name: "Starter Package",
    description: "10 Candidate invitations for specialized hiring.",
    credits: 10,
    price: 500,
    currency: "BDT",
    isActive: true,
  },
  {
    id: "pkg_growth",
    name: "Growth Package",
    description: "50 Candidate invitations for scaling engineering teams.",
    credits: 50,
    price: 2000,
    currency: "BDT",
    isActive: true,
  },
  {
    id: "pkg_scale",
    name: "Enterprise Scale",
    description: "100 Candidate invitations with priority telemetry.",
    credits: 100,
    price: 3500,
    currency: "BDT",
    isActive: true,
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "pay_demo_01",
    companyId: "seed_company",
    initiatedById: "seed_recruiter",
    creditPackageId: "pkg_starter",
    provider: "STRIPE",
    status: "COMPLETED",
    amount: 500,
    currency: "BDT",
    credits: 10,
    merchantInvoiceNumber: "INV-2026-0091",
    completedAt: "2026-10-08T11:20:00.000Z",
    createdAt: "2026-10-08T11:18:00.000Z",
  },
];

export default function RecruiterBillingPage() {
  const router = useRouter();
  const [selectedPkg, setSelectedPkg] = useState<CreditPackage>(CREDIT_PACKAGES[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);

  const handleInitiateStripePayment = async () => {
    setIsProcessing(true);
    toast.loading("Initiating Stripe Test Mode Checkout...", { id: "stripe-init" });

    try {
      // Simulate Stripe Checkout session generation
      await new Promise((r) => setTimeout(r, 1200));
      toast.dismiss("stripe-init");
      toast.success("Redirecting to Stripe Gateway...");

      const sessionId = `cs_test_${Math.random().toString(36).substring(2, 16)}`;
      const successUrl = `/payment/success?session_id=${sessionId}&package=${encodeURIComponent(
        selectedPkg.name
      )}&credits=${selectedPkg.credits}&amount=${selectedPkg.price}&currency=${selectedPkg.currency}`;

      router.push(successUrl);
    } catch {
      toast.dismiss("stripe-init");
      toast.error("Payment initiation failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Credit Packages & Stripe Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Top up candidate invitation credits using Stripe test mode processing. 1 credit unlocks 1 full candidate assessment invitation.
          </p>
        </div>

        {/* Current Balance Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Coins className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider block">
                Current Available Credits
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-0.5">
                50 Credits
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Sufficient for 50 candidate invitations across all published tests.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" size="lg" className="gap-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4" /> Stripe Test Mode Active
            </Badge>
          </div>
        </div>

        {/* Credit Packages Selection */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            Select Top-Up Package
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CREDIT_PACKAGES.map((pkg) => {
              const isSelected = selectedPkg.id === pkg.id;

              return (
                <Card
                  key={pkg.id}
                  hoverEffect
                  onClick={() => setSelectedPkg(pkg)}
                  className={`p-6 cursor-pointer relative flex flex-col justify-between transition-all ${
                    isSelected
                      ? "border-blue-500 bg-slate-900/90 shadow-xl shadow-blue-500/15"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                  }`}
                >
                  {pkg.credits === 50 && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="info" size="sm" className="bg-blue-600 text-white font-bold">
                        Popular
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{pkg.name}</h3>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-blue-500 bg-blue-500 text-white text-[10px]"
                            : "border-slate-700"
                        }`}
                      >
                        {isSelected && "✓"}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="pt-3">
                      <span className="text-2xl font-extrabold text-white font-mono">
                        {pkg.price} {pkg.currency}
                      </span>
                      <span className="text-xs text-slate-400 ml-1.5 font-mono">
                        ({pkg.credits} Credits)
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 text-[11px] text-slate-400">
                    Unit price: {Math.round(pkg.price / pkg.credits)} {pkg.currency} / candidate
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Checkout Action Card */}
          <Card className="p-6 border-slate-800 bg-slate-900/70 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">
                Selected: {selectedPkg.name} ({selectedPkg.credits} Credits)
              </div>
              <div className="text-xs text-slate-400">
                Total Due: <span className="text-white font-bold font-mono">{selectedPkg.price} {selectedPkg.currency}</span> via Stripe Test Card
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/payment/cancel")}
                className="text-xs"
              >
                Test Cancel Flow
              </Button>
              <Button
                variant="glow"
                size="md"
                isLoading={isProcessing}
                onClick={handleInitiateStripePayment}
                className="gap-2 text-xs font-semibold w-full sm:w-auto"
              >
                <CreditCard className="w-4 h-4" />
                Pay {selectedPkg.price} {selectedPkg.currency} with Stripe
              </Button>
            </div>
          </Card>
        </div>

        {/* Payment Receipts History Table */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-purple-400" />
            Payment History & Invoices
          </h2>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Invoice #</th>
                    <th className="px-5 py-3.5">Provider</th>
                    <th className="px-5 py-3.5">Credits</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Completed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-white">
                        {p.merchantInvoiceNumber}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="purple" size="sm">
                          {p.provider}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-blue-400">
                        +{p.credits} Credits
                      </td>
                      <td className="px-5 py-4 font-mono">
                        {p.amount} {p.currency}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-slate-400 text-[11px]">
                        {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
