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
  Inbox,
} from "lucide-react";
import { Attempt } from "@/types";
import { useAuth } from "@/context/auth-context";
import {
  getAssessments,
  getInvitations,
  getCompanyCredits,
  isDemoRecruiter,
} from "@/lib/assessment-store";

const DEMO_ATTEMPTS: Attempt[] = [
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
      displayName: "Sarah J.",
      email: "sarah.j@gmail.com",
      avatarUrl: null,
      role: "CANDIDATE",
      status: "ACTIVE",
      emailVerifiedAt: null,
      createdAt: "2026-10-02",
    },
  },
];

export default function RecruiterOverviewPage() {
  const { user } = useAuth();
  const [assessmentsCount, setAssessmentsCount] = useState(0);
  const [invitationsCount, setInvitationsCount] = useState(0);
  const [credits, setCredits] = useState(10);
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const assts = getAssessments(user?.email);
    const invs = getInvitations(user?.email);
    const crd = getCompanyCredits();

    setAssessmentsCount(assts.length);
    setInvitationsCount(invs.length);
    setCredits(crd);

    if (isDemoRecruiter(user?.email)) {
      setRecentAttempts(DEMO_ATTEMPTS);
    } else {
      setRecentAttempts([]);
    }
  }, [user]);

  return (
    <DashboardLayout role="RECRUITER">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info" size="sm">
                Recruiter Organization
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {user?.companyName ? `${user.companyName} • ` : ""}
                {user?.designation || "Hiring Team"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recruitment Pipeline Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Monitor active assessments, dispatch tokens to candidates, and review code submissions in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/recruiter/assessments">
              <Button size="sm" variant="glow" className="gap-2 text-xs">
                <PlusCircle className="w-4 h-4" />
                New Assessment
              </Button>
            </Link>
            <Link href="/recruiter/candidates">
              <Button size="sm" variant="primary" className="gap-2 text-xs">
                <Send className="w-4 h-4" />
                Invite Candidate
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Available Credits"
            value={`${credits} Credits`}
            icon={Coins}
            color="blue"
            trend={{ value: "1 credit = 1 candidate", isPositive: true }}
            description="Balance ready for invitations"
          />
          <StatCard
            title="Active Assessments"
            value={assessmentsCount}
            icon={Layers}
            color="purple"
            description="Published challenge programs"
          />
          <StatCard
            title="Active Invitations"
            value={invitationsCount}
            icon={Send}
            color="indigo"
            description="Candidates in pipeline"
          />
          <StatCard
            title="Submissions Scored"
            value={recentAttempts.filter((a) => a.status === "SCORED").length}
            icon={CheckCircle2}
            color="emerald"
            description="Completed evaluations"
          />
        </div>

        {/* Action Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" /> Quick Assessment Wizard
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Launch a New Developer Assessment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Assemble coding challenges, specify passing thresholds, and generate timed invitation links in 3 steps.
              </p>
            </div>

            <Link href="/recruiter/assessments">
              <Button variant="glow" size="sm" className="w-full gap-2 text-xs font-semibold">
                Open 3-Step Wizard <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>

          <Card className="lg:col-span-1 p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-4 h-4" /> Candidate Invitations
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Invite Applicants by Email
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dispatch timed exam access tokens. Applicants receive direct session links without needing pre-existing logins.
              </p>
            </div>

            <Link href="/recruiter/candidates">
              <Button variant="primary" size="sm" className="w-full gap-2 text-xs font-semibold">
                Dispatch Test Tokens <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>

          <Card className="lg:col-span-1 p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4" /> Credit Billing & Free Plan
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Claim Free Credits or Top Up
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every recruiter gets 10 free credits. Top up volume packages with secure Stripe Checkout.
              </p>
            </div>

            <Link href="/recruiter/billing">
              <Button variant="secondary" size="sm" className="w-full gap-2 text-xs font-semibold">
                Manage Credit Balance <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent Attempts Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Recent Candidate Test Attempts
            </h2>
            <Link href="/recruiter/evaluations">
              <Button size="sm" variant="ghost" className="text-xs text-blue-600 dark:text-blue-400">
                View Evaluation Queue →
              </Button>
            </Link>
          </div>

          {recentAttempts.length === 0 ? (
            <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No Candidate Attempts Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed">
                When candidates start and submit code tests using your invitation tokens, their live progress and test scores will appear here.
              </p>
              <Link href="/recruiter/candidates">
                <Button variant="primary" size="sm" className="gap-2 text-xs">
                  <Send className="w-3.5 h-3.5" />
                  Send First Invitation
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-5 py-3.5">Assessment</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Score</th>
                      <th className="px-5 py-3.5">Started At</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {recentAttempts.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {attempt.candidate?.displayName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {attempt.candidate?.email}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          {attempt.assessment?.title}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={attempt.status} />
                        </td>
                        <td className="px-5 py-4 font-mono">
                          {attempt.totalScore !== null ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {attempt.totalScore}/{attempt.maximumScore} ({attempt.percentage}%)
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {new Date(attempt.startedAt).toLocaleTimeString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link href="/recruiter/evaluations">
                            <Button size="sm" variant="outline" className="text-xs">
                              Review Rubric
                            </Button>
                          </Link>
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
    </DashboardLayout>
  );
}
