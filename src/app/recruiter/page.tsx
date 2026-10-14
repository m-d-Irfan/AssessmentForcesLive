"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Send,
  Coins,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  PlusCircle,
  FileCode2,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Assessment, Attempt } from "@/types";

export default function RecruiterOverviewPage() {
  const [stats, setStats] = useState({
    activeAssessments: 3,
    pendingInvitations: 14,
    completedSubmissions: 28,
    availableCredits: 50,
  });

  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([
    {
      id: "att_01",
      assessmentId: "seed_assessment_backend",
      candidateId: "seed_candidate",
      status: "SCORED",
      startedAt: "2026-10-10T12:00:00.000Z",
      expiresAt: "2026-10-10T12:30:00.000Z",
      submittedAt: "2026-10-10T12:22:15.000Z",
      totalScore: 9,
      maximumScore: 10,
      percentage: 90,
      passed: true,
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
      candidate: {
        id: "seed_candidate",
        displayName: "Demo Candidate",
        email: "candidate@devassess.local",
        avatarUrl: null,
        role: "CANDIDATE",
        status: "ACTIVE",
        emailVerifiedAt: null,
        createdAt: "2026-10-01",
      },
    },
    {
      id: "att_02",
      assessmentId: "seed_assessment_backend",
      candidateId: "cand_sarah_9",
      status: "IN_PROGRESS",
      startedAt: "2026-10-10T13:10:00.000Z",
      expiresAt: "2026-10-10T13:40:00.000Z",
      submittedAt: null,
      totalScore: null,
      maximumScore: 10,
      percentage: null,
      passed: null,
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
      candidate: {
        id: "cand_sarah_9",
        displayName: "Sarah Jenkins",
        email: "sarah.j@gmail.com",
        avatarUrl: null,
        role: "CANDIDATE",
        status: "ACTIVE",
        emailVerifiedAt: null,
        createdAt: "2026-10-02",
      },
    },
  ]);

  useEffect(() => {
    async function fetchRecruiterData() {
      try {
        const credits = await api.get<any>("/credits/balance").catch(() => null);
        if (credits?.availableCredits !== undefined) {
          setStats((prev) => ({ ...prev, availableCredits: credits.availableCredits }));
        }
      } catch {
        // Fallback
      }
    }
    fetchRecruiterData();
  }, []);

  return (
    <DashboardLayout role="RECRUITER">
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info" size="sm">
                Recruiter Portal
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Enterprise Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Talent Assessment Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage engineering evaluations, send candidate invitations, and evaluate test submissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/recruiter/billing">
              <Button size="sm" variant="outline" className="gap-2 text-xs">
                <Coins className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                {stats.availableCredits} Credits Available
              </Button>
            </Link>
            <Link href="/recruiter/assessments">
              <Button size="sm" variant="glow" className="gap-2 text-xs">
                <PlusCircle className="w-4 h-4" />
                Create Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Active Tests"
            value={stats.activeAssessments}
            icon={Layers}
            color="blue"
            description="Published & open tests"
          />
          <StatCard
            title="Invited Candidates"
            value={stats.pendingInvitations}
            icon={Send}
            color="indigo"
            trend={{ value: "5 this week", isPositive: true }}
            description="Awaiting start or in progress"
          />
          <StatCard
            title="Submissions Scored"
            value={stats.completedSubmissions}
            icon={CheckCircle2}
            color="emerald"
            description="Evaluated with results released"
          />
          <StatCard
            title="Invitation Credits"
            value={stats.availableCredits}
            icon={Coins}
            color="amber"
            description="Stripe top-up enabled"
          />
        </div>

        {/* Quick Action Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect className="space-y-3 border-slate-200 dark:border-blue-500/20 bg-white dark:bg-slate-900/40 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FileCode2 className="w-5 h-5" />
              </div>
              <Badge variant="info" size="sm">Wizard</Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Assessment</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Build a multi-problem benchmark test with timing limits and pass mark percentages.
            </p>
            <Link href="/recruiter/assessments">
              <Button variant="secondary" size="sm" className="w-full text-xs mt-2">
                Open Wizard
              </Button>
            </Link>
          </Card>

          <Card hoverEffect className="space-y-3 border-slate-200 dark:border-indigo-500/20 bg-white dark:bg-slate-900/40 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Send className="w-5 h-5" />
              </div>
              <Badge variant="purple" size="sm">Dispatch</Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Invitations</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Email unique assessment tokens to candidate applicants with single-click start links.
            </p>
            <Link href="/recruiter/candidates">
              <Button variant="secondary" size="sm" className="w-full text-xs mt-2">
                Candidate Pipeline
              </Button>
            </Link>
          </Card>

          <Card hoverEffect className="space-y-3 border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-slate-900/40 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <Badge variant="success" size="sm">Grading</Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Review Submissions</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Grade candidate short-text responses, inspect automated code test passes, and release scores.
            </p>
            <Link href="/recruiter/evaluations">
              <Button variant="secondary" size="sm" className="w-full text-xs mt-2">
                Evaluation Queue
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent Candidate Attempts Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Recent Candidate Attempts
            </h2>
            <Link href="/recruiter/candidates">
              <Button variant="ghost" size="sm" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                View All Pipeline
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Candidate</th>
                    <th className="px-5 py-3.5">Assessment</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Score</th>
                    <th className="px-5 py-3.5">Result</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {recentAttempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {att.candidate?.displayName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {att.candidate?.email}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        {att.assessment?.title}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={att.status} />
                      </td>
                      <td className="px-5 py-4 font-mono">
                        {att.totalScore !== null
                          ? `${att.totalScore} / ${att.maximumScore} (${att.percentage}%)`
                          : "In progress"}
                      </td>
                      <td className="px-5 py-4">
                        {att.passed === null ? (
                          <span className="text-slate-500 font-mono text-[10px]">Pending</span>
                        ) : att.passed ? (
                          <Badge variant="success" size="sm">PASSED</Badge>
                        ) : (
                          <Badge variant="danger" size="sm">FAILED</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href="/recruiter/evaluations">
                          <Button size="sm" variant="outline" className="text-xs">
                            Review Submission
                          </Button>
                        </Link>
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
