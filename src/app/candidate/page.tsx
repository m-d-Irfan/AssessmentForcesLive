"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Award,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function CandidateOverviewPage() {
  const [activeInvitations, setActiveInvitations] = useState([
    {
      id: "inv_backend_01",
      assessmentId: "seed_assessment_backend",
      title: "Backend Developer Fundamentals",
      companyName: "Demo Technologies",
      durationMinutes: 30,
      totalPoints: 10,
      passPercentage: 60,
      status: "READY_TO_START",
      expiresAt: "2026-10-18T10:00:00.000Z",
    },
    {
      id: "inv_arch_02",
      assessmentId: "asst_fullstack_benchmark",
      title: "Senior Full-Stack Architecture Challenge",
      companyName: "Fintech Labs Global",
      durationMinutes: 60,
      totalPoints: 50,
      passPercentage: 70,
      status: "COMPLETED",
      expiresAt: "2026-10-12T15:00:00.000Z",
    },
  ]);

  return (
    <DashboardLayout role="CANDIDATE">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success" size="sm">
              Candidate Workspace
            </Badge>
            <span className="text-xs text-slate-400 font-mono">Verified Developer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Assessments & Coding Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review invitations from technical recruiters, enter timed test environments, and access verified scorecards.
          </p>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Assigned Tests"
            value="2"
            icon={Terminal}
            color="emerald"
            description="Active & completed invitations"
          />
          <StatCard
            title="Completed Scorecards"
            value="1"
            icon={Award}
            color="purple"
            trend={{ value: "90% Pass Rate", isPositive: true }}
            description="Verified results released"
          />
          <StatCard
            title="Skill Badges Earned"
            value="3"
            icon={Sparkles}
            color="blue"
            description="TypeScript, Node.js, SQL"
          />
        </div>

        {/* Assigned Assessments Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-emerald-400" />
            Active Test Assignments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeInvitations.map((inv) => {
              const isReady = inv.status === "READY_TO_START";

              return (
                <Card
                  key={inv.id}
                  hoverEffect
                  className={`p-6 flex flex-col justify-between space-y-4 ${
                    isReady
                      ? "border-emerald-500/30 bg-slate-900/80 shadow-xl shadow-emerald-500/5"
                      : "border-slate-800 bg-slate-900/40"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">
                        Invited by <strong className="text-white">{inv.companyName}</strong>
                      </span>
                      <Badge variant={isReady ? "warning" : "success"} size="sm">
                        {isReady ? "Ready to Take" : "Submitted"}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                      {inv.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block">Duration</span>
                        <span className="text-white font-bold">{inv.durationMinutes} mins</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Total Points</span>
                        <span className="text-blue-400 font-bold">{inv.totalPoints} pts</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Passing Mark</span>
                        <span className="text-emerald-400 font-bold">{inv.passPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                    <span className="text-[10px] text-slate-500 font-mono">
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
        </div>
      </div>
    </DashboardLayout>
  );
}
