"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Assessment, CompanyProblem, CompanyMember } from "@/types";
import {
  Layers,
  PlusCircle,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Edit2,
  Trash2,
  Code2,
  Users,
  UserPlus,
  Briefcase,
  FileCode2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import {
  getAssessments,
  saveAssessment,
  deleteAssessment,
  getCompanyProblems,
  saveCompanyProblem,
  getCompanyMembers,
  inviteCompanyMember,
  removeCompanyMember,
} from "@/lib/assessment-store";

export default function RecruiterAssessmentsPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [problems, setProblems] = useState<CompanyProblem[]>([]);
  const [members, setMembers] = useState<CompanyMember[]>([]);

  const [activeTab, setActiveTab] = useState<"assessments" | "problems" | "team">("assessments");

  // Assessment Wizard & Edit State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [wizardData, setWizardData] = useState({
    title: "",
    description: "",
    durationMinutes: 45,
    passPercentage: 65,
    selectedProblemIds: [] as string[],
    pointsMap: {} as Record<string, number>,
  });

  // Custom Problem Modal State
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [problemForm, setProblemForm] = useState({
    title: "",
    category: "Full-Stack & Algorithms",
    difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD",
    type: "CODE" as "CODE" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE",
    points: 20,
    description: "",
    starterCode: "function solution(input) {\n  // your implementation here\n}",
  });

  // Team Invite Modal State
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    designation: "Technical Interviewer",
    role: "INTERVIEWER" as "ADMIN" | "INTERVIEWER" | "MEMBER",
    assessmentId: "",
  });

  // Load and sync store data
  const loadData = () => {
    setAssessments(getAssessments(user?.email));
    setProblems(getCompanyProblems());
    setMembers(getCompanyMembers(user?.email));
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("assessments_updated", handleUpdate);
    window.addEventListener("problems_updated", handleUpdate);
    window.addEventListener("members_updated", handleUpdate);
    return () => {
      window.removeEventListener("assessments_updated", handleUpdate);
      window.removeEventListener("problems_updated", handleUpdate);
      window.removeEventListener("members_updated", handleUpdate);
    };
  }, [user]);

  // Open Wizard in "Create" mode
  const handleOpenCreateWizard = () => {
    setEditingAssessmentId(null);
    setCurrentStep(1);
    setWizardData({
      title: "",
      description: "",
      durationMinutes: 45,
      passPercentage: 65,
      selectedProblemIds: problems.length > 0 ? [problems[0].id] : [],
      pointsMap: problems.reduce((acc, p) => ({ ...acc, [p.id]: p.points || 15 }), {}),
    });
    setIsWizardOpen(true);
  };

  // Open Wizard in "Edit" mode
  const handleOpenEditWizard = (asst: Assessment) => {
    setEditingAssessmentId(asst.id);
    setCurrentStep(1);
    setWizardData({
      title: asst.title,
      description: asst.description || "",
      durationMinutes: asst.durationMinutes,
      passPercentage: asst.passPercentage,
      selectedProblemIds: problems.slice(0, Math.max(1, asst._count?.items || 1)).map((p) => p.id),
      pointsMap: problems.reduce((acc, p) => ({ ...acc, [p.id]: p.points || 15 }), {}),
    });
    setIsWizardOpen(true);
  };

  // Delete Assessment
  const handleDeleteAssessment = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete assessment "${title}"?`)) {
      const updated = deleteAssessment(id);
      setAssessments(updated);
      toast.success(`Assessment "${title}" deleted.`);
    }
  };

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
      (sum, id) => sum + (wizardData.pointsMap[id] || 15),
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
      await new Promise((r) => setTimeout(r, 400));

      const updatedAsst: Assessment = {
        id: editingAssessmentId || `asst_${Date.now()}`,
        title: wizardData.title.trim(),
        description: wizardData.description.trim() || null,
        durationMinutes: Number(wizardData.durationMinutes),
        passPercentage: Number(wizardData.passPercentage),
        totalPoints: calculateTotalPoints(),
        status: "PUBLISHED",
        createdAt: new Date().toISOString(),
        _count: {
          items: wizardData.selectedProblemIds.length,
          invitations: editingAssessmentId
            ? assessments.find((a) => a.id === editingAssessmentId)?._count?.invitations || 0
            : 0,
          attempts: editingAssessmentId
            ? assessments.find((a) => a.id === editingAssessmentId)?._count?.attempts || 0
            : 0,
        },
      };

      const updatedList = saveAssessment(updatedAsst);
      setAssessments(updatedList);
      toast.success(
        editingAssessmentId
          ? `Assessment "${updatedAsst.title}" updated successfully!`
          : `Assessment "${updatedAsst.title}" published and added to invitation list!`
      );
      setIsWizardOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Create Company Problem
  const handleCreateProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemForm.title.trim()) {
      toast.error("Problem title is required");
      return;
    }
    if (!problemForm.description.trim()) {
      toast.error("Problem description is required");
      return;
    }

    const created = saveCompanyProblem(problemForm);
    setProblems(getCompanyProblems());
    setIsProblemModalOpen(false);
    setProblemForm({
      title: "",
      category: "Full-Stack & Algorithms",
      difficulty: "MEDIUM",
      type: "CODE",
      points: 20,
      description: "",
      starterCode: "function solution(input) {\n  // your implementation here\n}",
    });
    toast.success(`Problem "${created.title}" created and added to company bank!`);
  };

  // Invite Team Member
  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    inviteCompanyMember(memberForm);
    setMembers(getCompanyMembers(user?.email));
    setIsMemberModalOpen(false);
    setMemberForm({
      name: "",
      email: "",
      designation: "Technical Interviewer",
      role: "INTERVIEWER",
      assessmentId: "",
    });
    toast.success(`Team invitation sent to ${memberForm.email}!`);
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="space-y-6">
        {/* Header with Title & Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Company Assessments & Question Bank
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Create and manage proprietary assessments, author custom coding challenges, and invite hiring team members.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProblemModalOpen(true)}
              className="gap-1.5 text-xs border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
            >
              <Code2 className="w-4 h-4" />
              Create Custom Problem
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMemberModalOpen(true)}
              className="gap-1.5 text-xs border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              <UserPlus className="w-4 h-4" />
              Invite Team Member
            </Button>

            <Button
              variant="glow"
              size="sm"
              onClick={handleOpenCreateWizard}
              className="gap-1.5 text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              New Assessment
            </Button>
          </div>
        </div>

        {/* Tab Controls: Assessments | Problem Bank | Team Members */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("assessments")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "assessments"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            Assessments ({assessments.length})
          </button>

          <button
            onClick={() => setActiveTab("problems")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "problems"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            Question Bank ({problems.length})
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "team"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            Hiring Team & Collaborators ({members.length})
          </button>
        </div>

        {/* ============================================================
            TAB 1: ASSESSMENTS LIST
        ============================================================ */}
        {activeTab === "assessments" && (
          <div className="space-y-4">
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
                      <th className="px-5 py-3.5">Activity</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {assessments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm line-clamp-1">
                            {item.description || "No description provided"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
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
                        <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                          {item._count?.invitations || 0} invited • {item._count?.attempts || 0} taken
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href={`/recruiter/candidates?asst=${item.id}`}>
                              <Button size="sm" variant="outline" className="text-xs gap-1 py-1 px-2.5">
                                <Send className="w-3 h-3 text-blue-500" /> Invite
                              </Button>
                            </Link>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEditWizard(item)}
                              title="Edit Assessment"
                              className="text-xs p-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAssessment(item.id, item.title)}
                              title="Delete Assessment"
                              className="text-xs p-1.5 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: QUESTION BANK (RECRUITER CAN CREATE & BROWSE PROBLEMS)
        ============================================================ */}
        {activeTab === "problems" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Company problems authored by your hiring team. Can be included in any assessment.
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsProblemModalOpen(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Author New Problem
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {problems.map((prob) => (
                <Card key={prob.id} className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {prob.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {prob.title}
                      </h3>
                    </div>
                    <Badge variant={prob.difficulty === "EASY" ? "success" : prob.difficulty === "HARD" ? "danger" : "warning"} size="sm">
                      {prob.difficulty}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {prob.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                    <span>Type: {prob.type}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{prob.points} Points</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: HIRING TEAM & COLLABORATORS
        ============================================================ */}
        {activeTab === "team" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Team members with access to evaluate submissions and dispatch assessment tokens.
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsMemberModalOpen(true)}
                className="gap-1.5 text-xs"
              >
                <UserPlus className="w-3.5 h-3.5" /> Invite Team Member
              </Button>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Member Name</th>
                      <th className="px-5 py-3.5">Email</th>
                      <th className="px-5 py-3.5">Designation</th>
                      <th className="px-5 py-3.5">Access Role</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {members.map((mem) => (
                      <tr key={mem.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40">
                        <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                          {mem.name}
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">
                          {mem.email}
                        </td>
                        <td className="px-5 py-4">
                          {mem.designation}
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="purple" size="sm">
                            {mem.role}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updated = removeCompanyMember(mem.id);
                              setMembers(updated);
                              toast.info(`Removed ${mem.name} from company team.`);
                            }}
                            className="text-xs text-rose-500 hover:text-rose-700"
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            MODAL 1: ASSESSMENT CREATION & EDITING WIZARD
        ============================================================ */}
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
            <Card className="w-full max-w-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl relative max-h-[90vh] flex flex-col">
              {/* Wizard Step Indicator Bar */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCode2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    {editingAssessmentId ? "Edit Assessment Program" : "Assessment Creation Wizard"}
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
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

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Select which questions to include in this assessment.
                    </p>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto">
                      {problems.map((prob) => {
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
                                  {prob.category} • {prob.difficulty}
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

                {currentStep === 3 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {wizardData.title || "Untitled Assessment"}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {wizardData.description || "No description provided."}
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono">
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
                        Once saved, this assessment immediately syncs with candidate test invitations and token dispatchers.
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
                        toast.error("Please enter an assessment title");
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
                    {editingAssessmentId ? "Save Changes" : "Publish Assessment"} <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ============================================================
            MODAL 2: CREATE CUSTOM PROBLEM (RECRUITER CAN AUTHOR QUESTIONS)
        ============================================================ */}
        {isProblemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
            <Card className="w-full max-w-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl relative max-h-[90vh] flex flex-col p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-purple-500" />
                  Author Custom Assessment Problem
                </h3>
                <Button size="icon" variant="ghost" onClick={() => setIsProblemModalOpen(false)}>
                  ✕
                </Button>
              </div>

              <form onSubmit={handleCreateProblem} className="space-y-3 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asynchronous Retry Mechanism with Exponential Backoff"
                    value={problemForm.title}
                    onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category / Topic
                    </label>
                    <input
                      type="text"
                      value={problemForm.category}
                      onChange={(e) => setProblemForm({ ...problemForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={problemForm.difficulty}
                      onChange={(e) => setProblemForm({ ...problemForm, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    >
                      <option value="EASY">EASY</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Evaluation Type
                    </label>
                    <select
                      value={problemForm.type}
                      onChange={(e) => setProblemForm({ ...problemForm, type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    >
                      <option value="CODE">Code Implementation</option>
                      <option value="SINGLE_CHOICE">Single Choice Question</option>
                      <option value="MULTIPLE_CHOICE">Multiple Choice Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Max Points
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={problemForm.points}
                      onChange={(e) => setProblemForm({ ...problemForm, points: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Problem Prompt & Specifications *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide detailed algorithmic constraints, input parameters, and expected return value..."
                    value={problemForm.description}
                    onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Starter Code Template (for candidate)
                  </label>
                  <textarea
                    rows={3}
                    value={problemForm.starterCode}
                    onChange={(e) => setProblemForm({ ...problemForm, starterCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <Button type="submit" variant="glow" className="w-full text-xs">
                  Save & Add to Question Bank
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* ============================================================
            MODAL 3: INVITE COMPANY MEMBER
        ============================================================ */}
        {isMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
            <Card className="w-full max-w-md border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl relative p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  Invite Team Member
                </h3>
                <Button size="icon" variant="ghost" onClick={() => setIsMemberModalOpen(false)}>
                  ✕
                </Button>
              </div>

              <form onSubmit={handleInviteMember} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Member Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.io"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend Interviewer"
                    value={memberForm.designation}
                    onChange={(e) => setMemberForm({ ...memberForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Permission Role
                  </label>
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="INTERVIEWER">Technical Interviewer (Evaluate Submissions)</option>
                    <option value="ADMIN">Recruiting Admin (Full authoring & dispatch)</option>
                    <option value="MEMBER">Viewer / Observer</option>
                  </select>
                </div>

                <Button type="submit" variant="primary" className="w-full text-xs">
                  Send Invitation
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
