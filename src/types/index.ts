export type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  expiresInSeconds: number;
}

export type ProblemType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "SHORT_TEXT" | "CODE";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type ProblemStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ProblemOption {
  id?: string;
  label: string;
  content: string;
  isCorrect?: boolean;
  order: number;
}

export interface ProblemVersion {
  id: string;
  version: number;
  prompt: string;
  explanation?: string | null;
  options?: ProblemOption[];
}

export interface Problem {
  id: string;
  title: string;
  type: ProblemType;
  difficulty: Difficulty;
  status: ProblemStatus;
  companyId?: string | null;
  currentVersion?: ProblemVersion;
  versions?: ProblemVersion[];
  createdAt: string;
}

export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface AssessmentItem {
  id: string;
  assessmentId: string;
  problemVersionId: string;
  points: number;
  order: number;
  problemVersion?: ProblemVersion & {
    problem?: Problem;
  };
}

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  passPercentage: number;
  totalPoints: number;
  status: AssessmentStatus;
  companyId?: string | null;
  items?: AssessmentItem[];
  _count?: {
    items: number;
    invitations: number;
    attempts: number;
  };
  createdAt: string;
}

export type InvitationStatus = "PENDING" | "STARTED" | "EXPIRED" | "REVOKED";

export interface Invitation {
  id: string;
  assessmentId: string;
  candidateEmail: string;
  candidateId?: string | null;
  status: InvitationStatus;
  token: string;
  expiresAt: string;
  assessment?: Assessment;
  createdAt: string;
}

export type AttemptStatus =
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "AUTO_SUBMITTED"
  | "EVALUATING"
  | "SCORED"
  | "RESULT_RELEASED";

export interface Attempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  totalScore: number | null;
  maximumScore: number;
  percentage: number | null;
  passed: boolean | null;
  assessment?: Assessment;
  candidate?: User;
  result?: Result;
}

export interface Result {
  id: string;
  attemptId: string;
  score: number;
  maximumScore: number;
  percentage: number;
  passed: boolean;
  summary: string | null;
  releasedAt: string | null;
}

export interface CreditPackage {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  price: number;
  currency: string;
  isActive: boolean;
}

export interface Payment {
  id: string;
  companyId: string;
  initiatedById: string;
  creditPackageId: string;
  provider: string;
  status: "CREATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  amount: number;
  currency: string;
  credits: number;
  merchantInvoiceNumber: string;
  completedAt: string | null;
  createdAt: string;
  creditPackage?: CreditPackage;
}

export interface AuditLog {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  ipAddress: string | null;
  createdAt: string;
  actor?: {
    email: string;
    displayName: string;
    role: string;
  };
}
