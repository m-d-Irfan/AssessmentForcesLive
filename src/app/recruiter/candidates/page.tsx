"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invitation, Assessment } from "@/types";
import {
  Send,
  Users,
  Copy,
  PlusCircle,
  Clock,
  Coins,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import {
  getAssessments,
  getInvitations,
  sendInvitation,
  getCompanyCredits,
} from "@/lib/assessment-store";

function CandidateInvitationsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const preselectedAsstId = searchParams.get("asst");

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [email, setEmail] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [isSending, setIsSending] = useState(false);
  const [credits, setCredits] = useState(10);

  // Sync assessments and invitations
  const syncStore = () => {
    const assts = getAssessments(user?.email);
    setAssessments(assts);
    if (assts.length > 0) {
      if (preselectedAsstId && assts.some((a) => a.id === preselectedAsstId)) {
        setAssessmentId(preselectedAsstId);
      } else if (!assessmentId) {
        setAssessmentId(assts[0].id);
      }
    }
    setInvitations(getInvitations(user?.email));
    setCredits(getCompanyCredits());
  };

  useEffect(() => {
    syncStore();
    const handleUpdate = () => syncStore();
    window.addEventListener("assessments_updated", handleUpdate);
    window.addEventListener("invitations_updated", handleUpdate);
    window.addEventListener("credits_updated", handleUpdate);
    return () => {
      window.removeEventListener("assessments_updated", handleUpdate);
      window.removeEventListener("invitations_updated", handleUpdate);
      window.removeEventListener("credits_updated", handleUpdate);
    };
  }, [user, preselectedAsstId]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid candidate email address");
      return;
    }
    if (!assessmentId) {
      toast.error("Please select an assessment to invite the candidate to");
      return;
    }
    if (credits <= 0) {
      toast.error("Insufficient credit balance! Please top up credits in Billing.");
      return;
    }

    const selectedAsst = assessments.find((a) => a.id === assessmentId);
    if (!selectedAsst) {
      toast.error("Selected assessment was not found.");
      return;
    }

    setIsSending(true);
    try {
      await new Promise((r) => setTimeout(r, 400));

      const newInv = sendInvitation({
        candidateEmail: email,
        assessmentId: selectedAsst.id,
        assessmentTitle: selectedAsst.title,
        durationMinutes: selectedAsst.durationMinutes,
        expiryDays: Number(expiryDays),
      });

      setInvitations([newInv, ...invitations]);
      setCredits(getCompanyCredits());
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
                  required
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Assessment *
                  </label>
                  <a
                    href="/recruiter/assessments"
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    + New Assessment
                  </a>
                </div>

                {assessments.length === 0 ? (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
                    No assessments created yet. Please create an assessment first.
                  </div>
                ) : (
                  <select
                    value={assessmentId}
                    onChange={(e) => setAssessmentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {assessments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title} ({a.durationMinutes} mins)
                      </option>
                    ))}
                  </select>
                )}
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

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 text-[11px] text-blue-800 dark:text-slate-300 flex items-center justify-between">
                <span>⚡ Deducts 1 credit upon send</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {credits} Available
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={assessments.length === 0}
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

          {invitations.length === 0 ? (
            <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No Invitations Dispatched Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed">
                Enter a candidate&apos;s email address in the form on the left to generate their timed access token and monitor their test progress.
              </p>
            </Card>
          ) : (
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
                          {inv.assessment?.title || "Assessment"}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecruiterCandidatesPage() {
  return (
    <DashboardLayout role="RECRUITER">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading invitations...</div>}>
        <CandidateInvitationsContent />
      </Suspense>
    </DashboardLayout>
  );
}
