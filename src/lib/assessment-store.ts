"use client";

import { Assessment, Invitation, CompanyMember, CompanyProblem } from "@/types";

export interface ScorecardRecord {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  companyName: string;
  candidateEmail: string;
  completedAt: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  evaluatorNotes: string;
  skillsAssessed: string[];
}

const SEED_ASSESSMENTS: Assessment[] = [
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

const SEED_PROBLEMS: CompanyProblem[] = [
  {
    id: "seed_problem_typescript",
    title: "TypeScript Type Safety & Structural Shape Evaluation",
    type: "SINGLE_CHOICE",
    difficulty: "EASY",
    category: "TypeScript",
    description: "Evaluates compile-time structural shape matching and type assertion safety.",
    points: 10,
    createdAt: "2026-10-01",
  },
  {
    id: "prob_async_eventloop",
    title: "Node.js Event Loop Phases & Microtask Queue Priority",
    type: "MULTIPLE_CHOICE",
    difficulty: "MEDIUM",
    category: "Node.js & Concurrency",
    description: "Test execution order of process.nextTick, Promise microtasks, and timer queues.",
    points: 15,
    createdAt: "2026-10-02",
  },
  {
    id: "prob_lru_cache_algorithm",
    title: "Least Recently Used (LRU) Cache Implementation in O(1)",
    type: "CODE",
    difficulty: "HARD",
    category: "Data Structures",
    description: "Implement get(key) and put(key, value) in strictly O(1) average time complexity.",
    starterCode: "class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    // your code here\n  }\n  put(key, value) {\n    // your code here\n  }\n}",
    points: 25,
    createdAt: "2026-10-03",
  },
  {
    id: "prob_postgres_indexing",
    title: "PostgreSQL B-Tree & GIN Index Optimization for JSONB",
    type: "SINGLE_CHOICE",
    difficulty: "MEDIUM",
    category: "Database Engineering",
    description: "Determine the correct indexing strategy for fast deep JSON path filtering.",
    points: 15,
    createdAt: "2026-10-04",
  },
];

const SEED_INVITATIONS: Invitation[] = [
  {
    id: "inv_demo_cand",
    assessmentId: "seed_assessment_backend",
    candidateEmail: "candidate@devassess.local",
    candidateId: "seed_candidate",
    status: "STARTED",
    token: "token_cand_demo_session",
    expiresAt: "2026-10-18T10:00:00.000Z",
    assessment: SEED_ASSESSMENTS[0],
    createdAt: "2026-10-10T12:00:00.000Z",
  },
  {
    id: "inv_alex_fullstack",
    assessmentId: "seed_assessment_backend",
    candidateEmail: "alex.mercer@gmail.com",
    candidateId: null,
    status: "PENDING",
    token: "token_alex_7982",
    expiresAt: "2026-10-17T15:00:00.000Z",
    assessment: SEED_ASSESSMENTS[0],
    createdAt: "2026-10-09T14:20:00.000Z",
  },
];

const SEED_SCORECARDS: ScorecardRecord[] = [
  {
    id: "res_backend_90",
    assessmentId: "seed_assessment_backend",
    assessmentTitle: "Backend Developer Fundamentals",
    companyName: "Demo Technologies",
    candidateEmail: "candidate@devassess.local",
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
    assessmentId: "asst_fullstack_benchmark",
    assessmentTitle: "Senior Full-Stack Architecture Challenge",
    companyName: "Fintech Labs Global",
    candidateEmail: "candidate@devassess.local",
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

const SEED_MEMBERS: CompanyMember[] = [
  {
    id: "mem_sarah",
    name: "Sarah Chen",
    email: "sarah.chen@company.io",
    designation: "Senior Engineering Manager",
    role: "ADMIN",
    createdAt: "2026-10-01",
  },
  {
    id: "mem_david",
    name: "David Kim",
    email: "david.k@company.io",
    designation: "Staff Backend Architect",
    role: "INTERVIEWER",
    assessmentId: "seed_assessment_backend",
    createdAt: "2026-10-05",
  },
];

// Helper to check if user is the demo seed recruiter
export function isDemoRecruiter(email?: string | null): boolean {
  if (!email) return false;
  const e = email.toLowerCase();
  return e === "recruiter@devassess.local" || e === "admin@gmail.com";
}

// Helper to check if user is the demo candidate
export function isDemoCandidate(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === "candidate@devassess.local";
}

/* ============================================================
   ASSESSMENT STORE
============================================================ */

export function getAssessments(userEmail?: string | null): Assessment[] {
  if (typeof window === "undefined") return SEED_ASSESSMENTS;

  const raw = localStorage.getItem("devassess_assessments");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }

  // If first time initializing:
  // For demo recruiter or admin, seed default assessments
  if (isDemoRecruiter(userEmail)) {
    localStorage.setItem("devassess_assessments", JSON.stringify(SEED_ASSESSMENTS));
    return SEED_ASSESSMENTS;
  }

  // For a newly registered real recruiter: provide an initial starter template
  // so they have something to see and test with immediately, or their custom ones!
  const initial = [
    {
      ...SEED_ASSESSMENTS[0],
      id: "asst_starter_evaluation",
      title: "Full-Stack Engineer Screening Assessment",
      description: "Default screening assessment for engineering applicants.",
      _count: { items: 2, invitations: 0, attempts: 0 },
    },
  ];
  localStorage.setItem("devassess_assessments", JSON.stringify(initial));
  return initial;
}

export function saveAssessment(assessment: Assessment): Assessment[] {
  if (typeof window === "undefined") return [assessment];
  const list = getAssessments();
  const existingIdx = list.findIndex((a) => a.id === assessment.id);

  let updated: Assessment[];
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = assessment;
  } else {
    updated = [assessment, ...list];
  }

  localStorage.setItem("devassess_assessments", JSON.stringify(updated));
  window.dispatchEvent(new Event("assessments_updated"));
  return updated;
}

export function deleteAssessment(id: string): Assessment[] {
  if (typeof window === "undefined") return [];
  const list = getAssessments();
  const updated = list.filter((a) => a.id !== id);
  localStorage.setItem("devassess_assessments", JSON.stringify(updated));
  window.dispatchEvent(new Event("assessments_updated"));
  return updated;
}

export function getAssessmentById(id: string): Assessment | undefined {
  const list = getAssessments();
  return list.find((a) => a.id === id);
}

/* ============================================================
   COMPANY CUSTOM PROBLEMS STORE
============================================================ */

export function getCompanyProblems(): CompanyProblem[] {
  if (typeof window === "undefined") return SEED_PROBLEMS;

  const raw = localStorage.getItem("devassess_company_problems");
  if (raw) {
    try {
      const custom = JSON.parse(raw);
      if (Array.isArray(custom)) {
        return [...custom, ...SEED_PROBLEMS];
      }
    } catch {}
  }
  return SEED_PROBLEMS;
}

export function saveCompanyProblem(
  problem: Omit<CompanyProblem, "id" | "createdAt">
): CompanyProblem {
  const newProblem: CompanyProblem = {
    ...problem,
    id: `prob_custom_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("devassess_company_problems");
    let list: CompanyProblem[] = [];
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {}
    }
    list = [newProblem, ...list];
    localStorage.setItem("devassess_company_problems", JSON.stringify(list));
    window.dispatchEvent(new Event("problems_updated"));
  }
  return newProblem;
}

/* ============================================================
   INVITATIONS STORE
============================================================ */

export function getInvitations(userEmail?: string | null): Invitation[] {
  if (typeof window === "undefined") return isDemoRecruiter(userEmail) ? SEED_INVITATIONS : [];

  const raw = localStorage.getItem("devassess_invitations");
  if (raw) {
    try {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    } catch {}
  }

  if (isDemoRecruiter(userEmail)) {
    localStorage.setItem("devassess_invitations", JSON.stringify(SEED_INVITATIONS));
    return SEED_INVITATIONS;
  }

  return [];
}

export function sendInvitation(
  invitationData: {
    candidateEmail: string;
    assessmentId: string;
    assessmentTitle: string;
    durationMinutes: number;
    expiryDays: number;
  }
): Invitation {
  const newInv: Invitation = {
    id: `inv_${Date.now()}`,
    assessmentId: invitationData.assessmentId,
    candidateEmail: invitationData.candidateEmail.trim().toLowerCase(),
    candidateId: null,
    status: "PENDING",
    token: `token_${Math.random().toString(36).substring(2, 12)}`,
    expiresAt: new Date(
      Date.now() + Number(invitationData.expiryDays) * 24 * 60 * 60 * 1000
    ).toISOString(),
    assessment: {
      id: invitationData.assessmentId,
      title: invitationData.assessmentTitle,
      description: null,
      durationMinutes: invitationData.durationMinutes,
      passPercentage: 60,
      totalPoints: 10,
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const current = getInvitations();
    const updated = [newInv, ...current];
    localStorage.setItem("devassess_invitations", JSON.stringify(updated));
    deductCompanyCredit();
    window.dispatchEvent(new Event("invitations_updated"));
  }

  return newInv;
}

/* ============================================================
   CANDIDATE VIEW (AVOID GARBAGE DATA FOR NEW USERS)
============================================================ */

export function getCandidateActiveAssignments(userEmail?: string | null) {
  if (!userEmail) return [];

  // If demo candidate, show demo data
  if (isDemoCandidate(userEmail)) {
    return [
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
    ];
  }

  // Real user: check if recruiters sent invitations to their email
  const invitations = getInvitations();
  const cleanEmail = userEmail.trim().toLowerCase();
  const userInvs = invitations.filter(
    (inv) => inv.candidateEmail.toLowerCase() === cleanEmail
  );

  return userInvs.map((inv) => ({
    id: inv.id,
    assessmentId: inv.assessmentId,
    title: inv.assessment?.title || "Assigned Coding Evaluation",
    companyName: "Verified Hiring Partner",
    durationMinutes: inv.assessment?.durationMinutes || 45,
    totalPoints: inv.assessment?.totalPoints || 10,
    passPercentage: inv.assessment?.passPercentage || 60,
    status: inv.status === "PENDING" ? "READY_TO_START" : inv.status,
    expiresAt: inv.expiresAt,
  }));
}

export function getCandidateScorecards(userEmail?: string | null): ScorecardRecord[] {
  if (!userEmail) return [];

  // Demo user gets seed scorecards
  if (isDemoCandidate(userEmail)) {
    return SEED_SCORECARDS;
  }

  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem("devassess_scorecards");
  if (raw) {
    try {
      const list: ScorecardRecord[] = JSON.parse(raw);
      const cleanEmail = userEmail.trim().toLowerCase();
      return list.filter((s) => s.candidateEmail.toLowerCase() === cleanEmail);
    } catch {}
  }

  return [];
}

export function saveScorecard(scorecard: ScorecardRecord) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("devassess_scorecards");
  let list: ScorecardRecord[] = [];
  if (raw) {
    try {
      list = JSON.parse(raw);
    } catch {}
  }
  const idx = list.findIndex((s) => s.id === scorecard.id);
  if (idx >= 0) {
    list[idx] = scorecard;
  } else {
    list = [scorecard, ...list];
  }
  localStorage.setItem("devassess_scorecards", JSON.stringify(list));
  window.dispatchEvent(new Event("scorecards_updated"));
}

/* ============================================================
   RECRUITER CREDITS (FREE 10 CREDITS FOR ALL RECRUITERS)
============================================================ */

export function getCompanyCredits(): number {
  if (typeof window === "undefined") return 10;

  const raw = localStorage.getItem("devassess_company_credits");
  if (raw !== null) {
    const val = parseInt(raw, 10);
    if (!isNaN(val)) return val;
  }

  // Every recruiter automatically receives 10 free credits!
  localStorage.setItem("devassess_company_credits", "10");
  return 10;
}

export function setCompanyCredits(amount: number): number {
  if (typeof window === "undefined") return amount;
  localStorage.setItem("devassess_company_credits", String(Math.max(0, amount)));
  window.dispatchEvent(new Event("credits_updated"));
  return Math.max(0, amount);
}

export function addCompanyCredits(amount: number): number {
  const current = getCompanyCredits();
  const next = current + amount;
  setCompanyCredits(next);
  return next;
}

export function deductCompanyCredit(): number {
  const current = getCompanyCredits();
  const next = Math.max(0, current - 1);
  setCompanyCredits(next);
  return next;
}

export function claimFreeStarterCredits(): boolean {
  if (typeof window === "undefined") return false;
  const claimed = localStorage.getItem("devassess_claimed_free_starter");
  if (claimed === "true") return false;

  addCompanyCredits(10);
  localStorage.setItem("devassess_claimed_free_starter", "true");
  window.dispatchEvent(new Event("credits_updated"));
  return true;
}

export function isFreeStarterClaimed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("devassess_claimed_free_starter") === "true";
}

/* ============================================================
   COMPANY TEAM MEMBERS / COLLABORATORS
============================================================ */

export function getCompanyMembers(userEmail?: string | null): CompanyMember[] {
  if (typeof window === "undefined") return isDemoRecruiter(userEmail) ? SEED_MEMBERS : [];

  const raw = localStorage.getItem("devassess_company_members");
  if (raw) {
    try {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    } catch {}
  }

  if (isDemoRecruiter(userEmail)) {
    localStorage.setItem("devassess_company_members", JSON.stringify(SEED_MEMBERS));
    return SEED_MEMBERS;
  }

  return [];
}

export function inviteCompanyMember(data: {
  name: string;
  email: string;
  designation: string;
  role: "ADMIN" | "INTERVIEWER" | "MEMBER";
  assessmentId?: string | null;
}): CompanyMember {
  const newMember: CompanyMember = {
    id: `mem_${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    designation: data.designation.trim(),
    role: data.role,
    assessmentId: data.assessmentId || null,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const list = getCompanyMembers();
    const updated = [newMember, ...list];
    localStorage.setItem("devassess_company_members", JSON.stringify(updated));
    window.dispatchEvent(new Event("members_updated"));
  }

  return newMember;
}

export function removeCompanyMember(id: string): CompanyMember[] {
  if (typeof window === "undefined") return [];
  const list = getCompanyMembers();
  const updated = list.filter((m) => m.id !== id);
  localStorage.setItem("devassess_company_members", JSON.stringify(updated));
  window.dispatchEvent(new Event("members_updated"));
  return updated;
}
