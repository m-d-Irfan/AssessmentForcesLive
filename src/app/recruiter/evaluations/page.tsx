"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Award,
  CheckCircle2,
  AlertTriangle,
  Code2,
  FileText,
  Save,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface PendingSubmission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  assessmentTitle: string;
  submittedAt: string;
  autoScore: number;
  maxScore: number;
  manualScore: number;
  evaluatorNotes: string;
  codeSnippet: string;
  status: "PENDING_REVIEW" | "FINALIZED";
}

const INITIAL_SUBMISSIONS: PendingSubmission[] = [
  {
    id: "eval_01",
    candidateName: "Demo Candidate",
    candidateEmail: "candidate@devassess.local",
    assessmentTitle: "Backend Developer Fundamentals",
    submittedAt: "2026-10-10T12:22:15.000Z",
    autoScore: 10,
    maxScore: 10,
    manualScore: 10,
    evaluatorNotes: "Excellent command of TypeScript static shapes and structural typing.",
    codeSnippet: `// Candidate Response for TypeScript question\n// Selected Option: (A) Static type checking\n// Candidate note: TypeScript enforces type shapes during compile time\n// preventing runtime assignment errors.`,
    status: "FINALIZED",
  },
  {
    id: "eval_02",
    candidateName: "Sarah Jenkins",
    candidateEmail: "sarah.j@gmail.com",
    assessmentTitle: "Backend Developer Fundamentals",
    submittedAt: "2026-10-10T13:40:00.000Z",
    autoScore: 7,
    maxScore: 10,
    manualScore: 8,
    evaluatorNotes: "",
    codeSnippet: `// Candidate Implementation for LRU Cache helper\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n}`,
    status: "PENDING_REVIEW",
  },
];

export default function RecruiterEvaluationsPage() {
  const [submissions, setSubmissions] = useState<PendingSubmission[]>(INITIAL_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission>(INITIAL_SUBMISSIONS[1]);
  const [manualScoreInput, setManualScoreInput] = useState(String(INITIAL_SUBMISSIONS[1].manualScore));
  const [notesInput, setNotesInput] = useState(INITIAL_SUBMISSIONS[1].evaluatorNotes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = (sub: PendingSubmission) => {
    setSelectedSubmission(sub);
    setManualScoreInput(String(sub.manualScore));
    setNotesInput(sub.evaluatorNotes);
  };

  const handleFinalizeEvaluation = async () => {
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));

      const updated = submissions.map((s) =>
        s.id === selectedSubmission.id
          ? {
              ...s,
              manualScore: Number(manualScoreInput),
              evaluatorNotes: notesInput,
              status: "FINALIZED" as const,
            }
          : s
      );

      setSubmissions(updated);
      setSelectedSubmission({
        ...selectedSubmission,
        manualScore: Number(manualScoreInput),
        evaluatorNotes: notesInput,
        status: "FINALIZED",
      });

      toast.success(
        `Evaluation finalized and result scorecard released to ${selectedSubmission.candidateName}!`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Submission Evaluation & Grading Rubrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review candidate code submissions, assign manual rubric points, and release final scorecard results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions Queue */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-400" />
              Evaluation Queue ({submissions.length})
            </h2>

            {submissions.map((sub) => {
              const isSelected = sub.id === selectedSubmission.id;
              return (
                <Card
                  key={sub.id}
                  hoverEffect
                  onClick={() => handleSelect(sub)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500/60 bg-blue-950/20 shadow-lg"
                      : "border-slate-800 bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-white text-sm">
                      {sub.candidateName}
                    </span>
                    <Badge
                      variant={sub.status === "FINALIZED" ? "success" : "warning"}
                      size="sm"
                    >
                      {sub.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mb-2">
                    {sub.candidateEmail}
                  </p>
                  <p className="text-xs font-semibold text-slate-300">
                    {sub.assessmentTitle}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-3 pt-2 border-t border-slate-800/80">
                    <span>Auto: {sub.autoScore}/{sub.maxScore}</span>
                    <span>{new Date(sub.submittedAt).toLocaleTimeString()}</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Submission Review Workspace */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {selectedSubmission.candidateName}
                    </h3>
                    <Badge
                      variant={
                        selectedSubmission.status === "FINALIZED"
                          ? "success"
                          : "warning"
                      }
                      size="sm"
                    >
                      {selectedSubmission.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedSubmission.candidateEmail} • {selectedSubmission.assessmentTitle}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Submitted At</span>
                  <span className="text-xs font-mono text-slate-200">
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Code Snippet & Answer Inspection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    Submitted Source Code / Solution
                  </span>
                  <Badge variant="outline" size="sm">
                    TypeScript / JavaScript
                  </Badge>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  {selectedSubmission.codeSnippet}
                </pre>
              </div>

              {/* Grading Input Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Assigned Final Score (Max: {selectedSubmission.maxScore})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedSubmission.maxScore}
                    value={manualScoreInput}
                    onChange={(e) => setManualScoreInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Auto-graded benchmark: {selectedSubmission.autoScore} / {selectedSubmission.maxScore}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Recruiter Feedback & Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notesInput}
                    placeholder="Candidate demonstrated clean code structure..."
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button
                  variant="glow"
                  size="sm"
                  isLoading={isSaving}
                  onClick={handleFinalizeEvaluation}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Finalize Score & Release Results
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
