export interface CandidateRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  score: number;
  status: "Passed" | "Under Review" | "Shortlisted" | "Rejected";
  completedAt: string;
  experience: string;
  topSkills: string[];
}

export interface AssessmentRecord {
  id: string;
  title: string;
  category: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  duration: number; // minutes
  questionsCount: number;
  passingScore: number;
  totalSubmissions: number;
  averageScore: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
}

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
}

export const MOCK_CANDIDATES: CandidateRecord[] = [
  {
    id: "cand-1",
    name: "Alex Vance",
    email: "alex.vance@techcorp.io",
    role: "Senior Fullstack Engineer",
    score: 96,
    status: "Shortlisted",
    completedAt: "2026-10-10",
    experience: "5+ Years",
    topSkills: ["TypeScript", "Next.js", "PostgreSQL", "System Design"],
  },
  {
    id: "cand-2",
    name: "Sophia Chen",
    email: "sophia.chen@devmail.com",
    role: "Backend Architect",
    score: 91,
    status: "Passed",
    completedAt: "2026-10-09",
    experience: "6 Years",
    topSkills: ["Node.js", "Redis", "Distributed Systems", "Docker"],
  },
  {
    id: "cand-3",
    name: "Marcus Brody",
    email: "m.brody@cloudscale.net",
    role: "React / Frontend Specialist",
    score: 84,
    status: "Under Review",
    completedAt: "2026-10-08",
    experience: "3 Years",
    topSkills: ["React 19", "Tailwind CSS", "GraphQL", "Web Vitals"],
  },
  {
    id: "cand-4",
    name: "Elena Rostova",
    email: "elena.r@fintechhub.org",
    role: "Algorithm & Core Systems",
    score: 98,
    status: "Shortlisted",
    completedAt: "2026-10-07",
    experience: "7 Years",
    topSkills: ["Algorithms", "Concurrency", "Database Optimization"],
  },
  {
    id: "cand-5",
    name: "David Kim",
    email: "david.k@startupstudio.dev",
    role: "Junior Software Developer",
    score: 68,
    status: "Rejected",
    completedAt: "2026-10-06",
    experience: "1 Year",
    topSkills: ["JavaScript", "HTML/CSS", "Git Basics"],
  },
];

export const MOCK_ASSESSMENTS: AssessmentRecord[] = [
  {
    id: "assess-1",
    title: "Senior Fullstack Engineering Assessment",
    category: "Fullstack",
    difficulty: "HARD",
    duration: 90,
    questionsCount: 4,
    passingScore: 75,
    totalSubmissions: 38,
    averageScore: 82,
    status: "ACTIVE",
  },
  {
    id: "assess-2",
    title: "Frontend Core: React, DOM, & Asynchronous State",
    category: "Frontend",
    difficulty: "MEDIUM",
    duration: 60,
    questionsCount: 3,
    passingScore: 70,
    totalSubmissions: 64,
    averageScore: 78,
    status: "ACTIVE",
  },
  {
    id: "assess-3",
    title: "Backend Concurrency & SQL Optimization Benchmark",
    category: "Backend",
    difficulty: "HARD",
    duration: 75,
    questionsCount: 3,
    passingScore: 80,
    totalSubmissions: 29,
    averageScore: 74,
    status: "ACTIVE",
  },
  {
    id: "assess-4",
    title: "Junior JavaScript Fundamentals & Algorithmic Foundations",
    category: "Algorithms",
    difficulty: "EASY",
    duration: 45,
    questionsCount: 5,
    passingScore: 60,
    totalSubmissions: 112,
    averageScore: 69,
    status: "ACTIVE",
  },
];

export const MOCK_ADMIN_METRICS: MetricCardData[] = [
  {
    title: "Total Registered Developers",
    value: "1,428",
    change: "+14.2% this month",
    isPositive: true,
    description: "Active candidates across all seniority tracks",
  },
  {
    title: "Assessments Evaluated",
    value: "3,892",
    change: "+28.6% this week",
    isPositive: true,
    description: "Successfully graded submissions with telemetry",
  },
  {
    title: "Active Enterprise Teams",
    value: "84",
    change: "+6 new accounts",
    isPositive: true,
    description: "Companies issuing technical evaluations",
  },
  {
    title: "Gross Evaluation Revenue",
    value: "$42,650",
    change: "+19.8% MRR",
    isPositive: true,
    description: "Stripe processed subscription and credit billings",
  },
];
