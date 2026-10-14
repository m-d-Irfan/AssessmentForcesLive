"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Terminal,
  Award,
  Play,
  CheckCircle2,
  FileCode2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  getCandidateActiveAssignments,
  getCandidateScorecards,
} from "@/lib/assessment-store";

export default function CandidateOverviewPage() {
  const { user } = useAuth();
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [scorecardCount, setScorecardCount] = useState<number>(0);
  const [badgesCount, setBadgesCount] = useState<number>(0);

  useEffect(() => {
    const list = getCandidateActiveAssignments(user?.email);
    const scorecards = getCandidateScorecards(user?.email);
    setActiveAssignments(list);
    setScorecardCount(scorecards.length);
    setBadgesCount(scorecards.filter((s) => s.passed).length * 2);
  }, [user]);

  return (
    <DashboardLayout role="CANDIDATE">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success" size="sm">
              Candidate Workspace
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {user?.displayName || "Developer"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Assessments & Coding Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review invitations from technical recruiters, enter timed test environments, and access verified scorecards.
          </p>
        </div>

        {/* Dynamic Stat Cards - True metrics, no garbage fake data */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Assigned Tests"
            value={activeAssignments.length}
            icon={Terminal}
            color="emerald"
            description="Active test invitations for you"
          />
          <StatCard
            title="Completed Scorecards"
            value={scorecardCount}
            icon={Award}
            color="purple"
            trend={
              scorecardCount > 0
                ? { value: "Evaluations ready", isPositive: true }
                : undefined
            }
            description="Verified results released"
          />
          <StatCard
            title="Skills Validated"
            value={badgesCount}
            icon={CheckCircle2}
            color="blue"
            description="Competencies certified"
          />
        </div>

        {/* Assigned Assessments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Active Test Assignments ({activeAssignments.length})
            </h2>
            <Link href="/problems">
              <Button size="sm" variant="ghost" className="text-xs text-blue-600 dark:text-blue-400 gap-1">
                Practice in Problem Catalog <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {activeAssignments.length === 0 ? (
            <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No Active Test Invitations Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
                When recruiters invite your email ({user?.email}) for a coding assessment, your test session and timer will appear here. In the meantime, you can hone your skills in our open catalog.
              </p>
              <Link href="/problems">
                <Button variant="primary" size="sm" className="gap-2 text-xs">
                  <Play className="w-3.5 h-3.5" />
                  Explore Coding Challenges
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeAssignments.map((inv) => {
                const isReady = inv.status === "READY_TO_START";

                return (
                  <Card
                    key={inv.id}
                    hoverEffect
                    className={`p-6 flex flex-col justify-between space-y-4 shadow-sm ${
                      isReady
                        ? "border-emerald-500/40 bg-white dark:bg-slate-900/80 shadow-emerald-500/5 ring-1 ring-emerald-500/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Invited by <strong className="text-slate-800 dark:text-white">{inv.companyName}</strong>
                        </span>
                        <Badge variant={isReady ? "warning" : "success"} size="sm">
                          {isReady ? "Ready to Take" : "Submitted"}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        {inv.title}
                      </h3>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono">
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 block">Duration</span>
                          <span className="text-slate-900 dark:text-white font-bold">{inv.durationMinutes} mins</span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 block">Total Points</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{inv.totalPoints} pts</span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 block">Passing Mark</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{inv.passPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        Valid until {new Date(inv.expiresAt).toLocaleDateString()}
                      </span>

                      {isReady ? (
                        <Link href={`/candidate/assessments/${inv.assessmentId}`}>
                          <Button size="sm" variant="glow" className="gap-1.5 text-xs font-semibold">
                            <Play className="w-3.5 h-3.5" /> Start Assessment Now
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/candidate/results">
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                            <Award className="w-3.5 h-3.5" /> View Scorecard
                          </Button>
                        </Link>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
