"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle2,
  Calendar,
  FileText,
  Download,
  Share2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface Scorecard {
  id: string;
  assessmentTitle: string;
  companyName: string;
  completedAt: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  evaluatorNotes: string;
  skillsAssessed: string[];
}

const SCORECARDS: Scorecard[] = [
  {
    id: "res_backend_90",
    assessmentTitle: "Backend Developer Fundamentals",
    companyName: "Demo Technologies",
    completedAt: "2026-10-10T12:22:15.000Z",
    score: 9.0,
    maxScore: 10.0,
    percentage: 90,
    passed: true,
    evaluatorNotes:
      "Candidate demonstrated superior grasp of structural typing and asynchronous event loop phases.",
    skillsAssessed: ["TypeScript", "Node.js", "Asynchronous Systems"],
  },
  {
    id: "res_fullstack_82",
    assessmentTitle: "Senior Full-Stack Architecture Challenge",
    companyName: "Fintech Labs Global",
    completedAt: "2026-10-06T15:45:00.000Z",
    score: 41.0,
    maxScore: 50.0,
    percentage: 82,
    passed: true,
    evaluatorNotes:
      "Well-structured LRU cache algorithm with correct O(1) time complexity. Clean edge condition handling.",
    skillsAssessed: ["PostgreSQL", "Data Structures", "Caching"],
  },
];

export default function CandidateResultsPage() {
  const [selectedScorecard, setSelectedScorecard] = useState<Scorecard>(SCORECARDS[0]);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/candidate/results?verify=${selectedScorecard.id}`
    );
    toast.success("Verifiable scorecard link copied to clipboard!");
  };

  return (
    <DashboardLayout role="CANDIDATE">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Assessment Results & Scorecards
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your verified technical performance scorecards, pass percentages, and evaluator feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Completed Tests List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Completed Tests ({SCORECARDS.length})
            </h2>

            {SCORECARDS.map((item) => {
              const isSelected = item.id === selectedScorecard.id;

              return (
                <Card
                  key={item.id}
                  hoverEffect
                  onClick={() => setSelectedScorecard(item)}
                  className={`p-5 cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? "border-emerald-500/60 bg-emerald-950/20 shadow-xl shadow-emerald-500/5"
                      : "border-slate-800 bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-white">
                      {item.assessmentTitle}
                    </span>
                    <Badge variant={item.passed ? "success" : "danger"} size="sm">
                      {item.passed ? "PASSED" : "FAILED"}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400">
                    Evaluated by <strong className="text-slate-200">{item.companyName}</strong>
                  </p>

                  <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-slate-800">
                    <span className="text-slate-400">
                      Score: <strong className="text-emerald-400 font-bold">{item.percentage}%</strong>
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(item.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Detailed Selected Scorecard */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-slate-800 bg-slate-900/70 space-y-8">
              {/* Scorecard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                  <Badge variant="success" size="sm" className="mb-2">
                    Verified Technical Performance
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {selectedScorecard.assessmentTitle}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
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
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Total Points</span>
                  <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">
                    {selectedScorecard.score} / {selectedScorecard.maxScore}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Percentage</span>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                    {selectedScorecard.percentage}%
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Decision</span>
                  <div className="text-3xl font-extrabold text-white font-mono mt-1">
                    {selectedScorecard.passed ? "PASSED" : "FAILED"}
                  </div>
                </div>
              </div>

              {/* Evaluator Feedback */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Technical Evaluator Notes & Feedback
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  &ldquo;{selectedScorecard.evaluatorNotes}&rdquo;
                </p>
              </div>

              {/* Skills Assessed */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block">
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
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
