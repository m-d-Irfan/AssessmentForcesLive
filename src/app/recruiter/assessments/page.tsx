"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { Assessment, Problem } from "@/types";
import {
  Layers,
  PlusCircle,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle,
  FileCode2,
} from "lucide-react";
import { toast } from "sonner";

const AVAILABLE_PROBLEMS: { id: string; title: string; type: string; difficulty: string; points: number }[] = [
  { id: "seed_problem_typescript", title: "TypeScript Type Safety & Structural Shape Evaluation", type: "SINGLE_CHOICE", difficulty: "EASY", points: 10 },
  { id: "prob_async_eventloop", title: "Node.js Event Loop Phases & Microtask Queue Priority", type: "MULTIPLE_CHOICE", difficulty: "MEDIUM", points: 15 },
  { id: "prob_lru_cache_algorithm", title: "Least Recently Used (LRU) Cache Implementation in O(1)", type: "CODE", difficulty: "HARD", points: 25 },
  { id: "prob_postgres_indexing", title: "PostgreSQL B-Tree & GIN Index Optimization for JSONB", type: "SINGLE_CHOICE", difficulty: "MEDIUM", points: 15 },
];

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: "seed_assessment_backend",
    title: "Backend Developer Fundamentals",
    description: "Evaluates core Node.js runtime, asynchronous event loops, and TypeScript typing.",
    durationMinutes: 30,
    passPercentage: 60,
    totalPoints: 10,
    status: "PUBLISHED",
    createdAt: "2026-10-01T10:00:00.000Z",
    _count: {
      items: 1,
      invitations: 14,
      attempts: 8,
    },
  },
  {
    id: "asst_fullstack_benchmark",
    title: "Senior Full-Stack Architecture Challenge",
    description: "In-depth testing covering PostgreSQL indexing, database transactions, and LRU algorithmic cache.",
    durationMinutes: 60,
    passPercentage: 70,
    totalPoints: 50,
    status: "PUBLISHED",
    createdAt: "2026-10-05T14:30:00.000Z",
    _count: {
      items: 3,
      invitations: 22,
      attempts: 16,
    },
  },
];

export default function RecruiterAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Wizard State
  const [wizardData, setWizardData] = useState({
    title: "",
    description: "",
    durationMinutes: 45,
    passPercentage: 65,
    selectedProblemIds: ["seed_problem_typescript", "prob_async_eventloop"],
    pointsMap: {
      seed_problem_typescript: 10,
      prob_async_eventloop: 15,
      prob_lru_cache_algorithm: 25,
      prob_postgres_indexing: 15,
    } as Record<string, number>,
  });

  const toggleProblemSelection = (id: string) => {
    setWizardData((prev) => {
      const exists = prev.selectedProblemIds.includes(id);
      return {
        ...prev,
        selectedProblemIds: exists
          ? prev.selectedProblemIds.filter((p) => p !== id)
          : [...prev.selectedProblemIds, id],
      };
    });
  };

  const calculateTotalPoints = () => {
    return wizardData.selectedProblemIds.reduce(
      (sum, id) => sum + (wizardData.pointsMap[id] || 10),
      0
    );
  };

  const handleFinishWizard = async () => {
    if (!wizardData.title.trim()) {
      toast.error("Please provide an assessment title");
      setCurrentStep(1);
      return;
    }
    if (wizardData.selectedProblemIds.length === 0) {
      toast.error("Please select at least 1 problem for the assessment");
      setCurrentStep(2);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate / POST to backend
      await new Promise((r) => setTimeout(r, 600));

      const newAssessment: Assessment = {
        id: `asst_${Date.now()}`,
        title: wizardData.title,
        description: wizardData.description || null,
        durationMinutes: Number(wizardData.durationMinutes),
        passPercentage: Number(wizardData.passPercentage),
        totalPoints: calculateTotalPoints(),
        status: "PUBLISHED",
        createdAt: new Date().toISOString(),
        _count: {
          items: wizardData.selectedProblemIds.length,
          invitations: 0,
          attempts: 0,
        },
      };

      setAssessments([newAssessment, ...assessments]);
      toast.success(`Assessment "${newAssessment.title}" created & published!`);
      setIsWizardOpen(false);
      setCurrentStep(1);
      setWizardData({
        title: "",
        description: "",
        durationMinutes: 45,
        passPercentage: 65,
        selectedProblemIds: ["seed_problem_typescript"],
        pointsMap: { seed_problem_typescript: 10 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Assessment Management & Authoring
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Design timed assessment programs, calibrate pass thresholds, and review published challenge sets.
            </p>
          </div>

          <Button
            variant="glow"
            size="sm"
            onClick={() => setIsWizardOpen(true)}
            className="gap-2 text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Launch 3-Step Creation Wizard
          </Button>
        </div>

        {/* MULTI-STEP CREATION WIZARD MODAL */}
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
            <Card className="w-full max-w-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl relative max-h-[90vh] flex flex-col">
              {/* Wizard Step Indicator Bar */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCode2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    Assessment Creation Wizard
                  </h2>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsWizardOpen(false)}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div
                    className={`p-2 rounded-lg text-center font-semibold border ${
                      currentStep === 1
                        ? "bg-blue-600/10 dark:bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-300"
                        : currentStep > 1
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500"
                    }`}
                  >
                    1. Info & Time
                  </div>
                  <div
                    className={`p-2 rounded-lg text-center font-semibold border ${
                      currentStep === 2
                        ? "bg-blue-600/10 dark:bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-300"
                        : currentStep > 2
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500"
                    }`}
                  >
                    2. Problem Bank
                  </div>
                  <div
                    className={`p-2 rounded-lg text-center font-semibold border ${
                      currentStep === 3
                        ? "bg-blue-600/10 dark:bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-300"
                        : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500"
                    }`}
                  >
                    3. Review & Launch
                  </div>
                </div>
              </div>

              {/* Wizard Content Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {/* STEP 1: Basic Info & Constraints */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Assessment Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lead TypeScript Backend Benchmark"
                        value={wizardData.title}
                        onChange={(e) =>
                          setWizardData({ ...wizardData, title: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Instructions / Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Explain instructions, rules, and expectations for the applicant..."
                        value={wizardData.description}
                        onChange={(e) =>
                          setWizardData({ ...wizardData, description: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Duration (Minutes)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="180"
                          value={wizardData.durationMinutes}
                          onChange={(e) =>
                            setWizardData({
                              ...wizardData,
                              durationMinutes: Number(e.target.value),
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Pass Percentage (%)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          value={wizardData.passPercentage}
                          onChange={(e) =>
                            setWizardData({
                              ...wizardData,
                              passPercentage: Number(e.target.value),
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Problem Selection & Points */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Select which questions to include in this assessment. Candidates will be presented with each item in sequence.
                    </p>

                    <div className="space-y-2.5">
                      {AVAILABLE_PROBLEMS.map((prob) => {
                        const isSelected = wizardData.selectedProblemIds.includes(prob.id);
                        return (
                          <div
                            key={prob.id}
                            onClick={() => toggleProblemSelection(prob.id)}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-600/10 border-blue-500 text-slate-900 dark:text-white"
                                : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center border text-xs ${
                                  isSelected
                                    ? "bg-blue-600 border-blue-500 text-white"
                                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                                }`}
                              >
                                {isSelected ? "✓" : ""}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                  {prob.title}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                  {prob.type} • {prob.difficulty}
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                                {wizardData.pointsMap[prob.id] || prob.points} pts
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Selected Items:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {wizardData.selectedProblemIds.length} Problems (Total: {calculateTotalPoints()} Points)
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 3: Review & Launch */}
                {currentStep === 3 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {wizardData.title || "Untitled Assessment"}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {wizardData.description || "No description provided."}
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-900 font-mono">
                        <div>
                          <span className="text-slate-500 block">Duration</span>
                          <span className="text-slate-900 dark:text-white font-bold">{wizardData.durationMinutes} mins</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Pass Threshold</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{wizardData.passPercentage}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Total Points</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{calculateTotalPoints()} pts</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="font-semibold text-blue-700 dark:text-blue-300">Ready for Candidate Dispatch</div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Once launched, this assessment will be available in your candidate invitations dispatch dropdown.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Footer Navigation */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((c) => c - 1)}
                  className="gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>

                {currentStep < 3 ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      if (currentStep === 1 && !wizardData.title.trim()) {
                        toast.error("Please enter a title");
                        return;
                      }
                      setCurrentStep((c) => c + 1);
                    }}
                    className="gap-1.5"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="glow"
                    isLoading={isLoading}
                    onClick={handleFinishWizard}
                    className="gap-1.5"
                  >
                    Publish Assessment <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Existing Assessments Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Assessment Title</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Problems</th>
                  <th className="px-5 py-3.5">Pass Mark</th>
                  <th className="px-5 py-3.5">Candidates</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {assessments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 max-w-sm line-clamp-1">
                        {item.description || "No description provided"}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        ID: {item.id}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-4 font-mono">
                      {item.durationMinutes} mins
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item._count?.items || 1} items ({item.totalPoints} pts)
                    </td>
                    <td className="px-5 py-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {item.passPercentage}%
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">
                      {item._count?.invitations || 0} invited • {item._count?.attempts || 0} taken
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href="/recruiter/candidates">
                        <Button size="sm" variant="outline" className="text-xs gap-1">
                          <Send className="w-3.5 h-3.5" /> Invite
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
    </DashboardLayout>
  );
}
