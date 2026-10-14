"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Download,
  Share2,
  FileCheck2,
  Play,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { getCandidateScorecards, ScorecardRecord } from "@/lib/assessment-store";

export default function CandidateResultsPage() {
  const { user } = useAuth();
  const [scorecards, setScorecards] = useState<ScorecardRecord[]>([]);
  const [selectedScorecard, setSelectedScorecard] = useState<ScorecardRecord | null>(null);

  useEffect(() => {
    const list = getCandidateScorecards(user?.email);
    setScorecards(list);
    if (list.length > 0) {
      setSelectedScorecard(list[0]);
    }
  }, [user]);

  const handleShare = () => {
    if (!selectedScorecard) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/candidate/results?verify=${selectedScorecard.id}`
    );
    toast.success("Verifiable scorecard link copied to clipboard!");
  };

  return (
    <DashboardLayout role="CANDIDATE">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Assessment Results & Scorecards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access your verified technical performance scorecards, pass percentages, and evaluator feedback.
          </p>
        </div>

        {scorecards.length === 0 ? (
          <Card className="p-10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No Completed Scorecards Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              You haven&apos;t taken or submitted any technical assessments under this account ({user?.email}). When you complete an assigned test, your detailed performance breakdown, points, and evaluator notes will appear here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/candidate">
                <Button variant="primary" size="sm" className="gap-2 text-xs">
                  <FileCheck2 className="w-4 h-4" />
                  View Active Test Assignments
                </Button>
              </Link>
              <Link href="/problems">
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Play className="w-4 h-4" />
                  Practice Code Challenges
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Completed Tests List */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Completed Tests ({scorecards.length})
              </h2>

              {scorecards.map((item) => {
                const isSelected = selectedScorecard?.id === item.id;

                return (
                  <Card
                    key={item.id}
                    hoverEffect
                    onClick={() => setSelectedScorecard(item)}
                    className={`p-5 cursor-pointer transition-all space-y-3 shadow-sm ${
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.assessmentTitle}
                      </span>
                      <Badge variant={item.passed ? "success" : "danger"} size="sm">
                        {item.passed ? "PASSED" : "FAILED"}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Evaluated by <strong className="text-slate-800 dark:text-slate-200">{item.companyName}</strong>
                    </p>

                    <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">
                        Score: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{item.percentage}%</strong>
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                        {new Date(item.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Detailed Selected Scorecard */}
            {selectedScorecard && (
              <div className="lg:col-span-2">
                <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm space-y-8">
                  {/* Scorecard Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
                    <div>
                      <Badge variant="success" size="sm" className="mb-2">
                        Verified Technical Performance
                      </Badge>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                        {selectedScorecard.assessmentTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Administered by {selectedScorecard.companyName} • Certificate #{selectedScorecard.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleShare}
                        className="text-xs gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toast.success("Scorecard PDF exported successfully!")}
                        className="text-xs gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </Button>
                    </div>
                  </div>

                  {/* Big Score Visualizer */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-500 uppercase font-semibold">Total Points</span>
                      <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1">
                        {selectedScorecard.score} / {selectedScorecard.maxScore}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-500 uppercase font-semibold">Percentage</span>
                      <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                        {selectedScorecard.percentage}%
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-500 uppercase font-semibold">Decision</span>
                      <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                        {selectedScorecard.passed ? "PASSED" : "FAILED"}
                      </div>
                    </div>
                  </div>

                  {/* Evaluator Notes & Feedback Box */}
                  <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-950 border border-blue-200/80 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      <MessageSquare className="w-4 h-4" />
                      Technical Evaluator Notes & Feedback
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      &ldquo;{selectedScorecard.evaluatorNotes || "No specific feedback notes entered by evaluator."}&rdquo;
                    </p>
                  </div>

                  {/* Skills Assessed */}
                  {selectedScorecard.skillsAssessed && selectedScorecard.skillsAssessed.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                        Validated Competencies
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedScorecard.skillsAssessed.map((skill, i) => (
                          <Badge key={i} variant="purple" size="md">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
