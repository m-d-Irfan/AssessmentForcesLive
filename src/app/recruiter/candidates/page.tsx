"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invitation } from "@/types";
import {
  Send,
  Mail,
  Users,
  Copy,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: "inv_demo_cand",
    assessmentId: "seed_assessment_backend",
    candidateEmail: "candidate@devassess.local",
    candidateId: "seed_candidate",
    status: "STARTED",
    token: "token_cand_demo_session",
    expiresAt: "2026-10-18T10:00:00.000Z",
    assessment: {
      id: "seed_assessment_backend",
      title: "Backend Developer Fundamentals",
      description: null,
      durationMinutes: 30,
      passPercentage: 60,
      totalPoints: 10,
      status: "PUBLISHED",
      createdAt: "2026-10-01",
    },
    createdAt: "2026-10-10T12:00:00.000Z",
  },
  {
    id: "inv_alex_fullstack",
    assessmentId: "seed_assessment_backend",
    candidateEmail: "alex.mercer@gmail.com",
    candidateId: null,
    status: "PENDING",
    token: "token_alex_7982",
    expiresAt: "2026-10-17T15:00:00.000Z",
    assessment: {
      id: "seed_assessment_backend",
      title: "Backend Developer Fundamentals",
      description: null,
      durationMinutes: 30,
      passPercentage: 60,
      totalPoints: 10,
      status: "PUBLISHED",
      createdAt: "2026-10-01",
    },
    createdAt: "2026-10-09T14:20:00.000Z",
  },
];

export default function RecruiterCandidatesPage() {
  const [invitations, setInvitations] = useState<Invitation[]>(INITIAL_INVITATIONS);
  const [email, setEmail] = useState("");
  const [assessmentId, setAssessmentId] = useState("seed_assessment_backend");
  const [expiryDays, setExpiryDays] = useState("7");
  const [isSending, setIsSending] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid candidate email");
      return;
    }

    setIsSending(true);
    try {
      await new Promise((r) => setTimeout(r, 600));

      const newInv: Invitation = {
        id: `inv_${Date.now()}`,
        assessmentId,
        candidateEmail: email.trim().toLowerCase(),
        candidateId: null,
        status: "PENDING",
        token: `token_${Math.random().toString(36).substring(2, 12)}`,
        expiresAt: new Date(
          Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000
        ).toISOString(),
        assessment: {
          id: assessmentId,
          title: "Backend Developer Fundamentals",
          description: null,
          durationMinutes: 30,
          passPercentage: 60,
          totalPoints: 10,
          status: "PUBLISHED",
          createdAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      };

      setInvitations([newInv, ...invitations]);
      toast.success(`Invitation dispatched to ${email}! 1 credit deducted.`);
      setEmail("");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/candidate?token=${token}`;
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied to clipboard!");
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Candidate Pipeline & Test Invitations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dispatch timed test tokens to applicant emails and monitor assessment session starts in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dispatch Form Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
                <Send className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Send New Invitation</h3>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Candidate Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Assessment *
                  </label>
                  <select
                    value={assessmentId}
                    onChange={(e) => setAssessmentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="seed_assessment_backend">Backend Developer Fundamentals (30 mins)</option>
                    <option value="asst_fullstack_benchmark">Senior Full-Stack Architecture Challenge (60 mins)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Token Validity (Days)
                  </label>
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="3">3 Days</option>
                    <option value="7">7 Days (Default)</option>
                    <option value="14">14 Days</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 text-[11px] text-blue-800 dark:text-slate-300">
                  ⚡ Costs 1 credit from your available balance.
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSending}
                  className="w-full text-xs font-semibold gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Token
                </Button>
              </form>
            </Card>
          </div>

          {/* Pipeline Invitations Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Active Candidate Invitations ({invitations.length})
              </h2>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">Candidate Email</th>
                      <th className="px-5 py-3.5 font-bold">Assessment</th>
                      <th className="px-5 py-3.5 font-bold">Status</th>
                      <th className="px-5 py-3.5 font-bold">Expires</th>
                      <th className="px-5 py-3.5 font-bold text-right">Direct Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {inv.candidateEmail}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            ID: {inv.id}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          {inv.assessment?.title}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={inv.status} />
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                          {new Date(inv.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyLink(inv.token)}
                            className="text-xs gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copy Link
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
