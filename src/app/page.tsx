import React from "react";
import Link from "next/link";
import {
  Code2,
  Terminal,
  ShieldCheck,
  Briefcase,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-28 overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
              Assess Developers with{" "}
              <span className="gradient-text">Uncompromising Precision</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Conduct robust technical evaluations, administer timed assessments, auto-grade algorithmic challenges, and review candidate talent pipelines with comprehensive multi-role workflows.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="glow" className="w-full gap-2 text-base">
                  Try 1-Click Demo Logins
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/problems" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full gap-2 text-base">
                  Explore Challenge Catalog
                </Button>
              </Link>
            </div>

            {/* Interactive Code Preview Window */}
            <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden text-left relative glow-indigo">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    assessment_engine.ts — DevGauge Live Session
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">
                    Automated Runner Active
                  </Badge>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto space-y-1">
                <p className="text-purple-400">
                  <span className="text-blue-400">interface</span> CandidateAssessmentSubmission &#123;
                </p>
                <p className="pl-4 text-slate-400">
                  candidateId: <span className="text-emerald-300">&quot;cmv2_candidate_4&quot;</span>;
                </p>
                <p className="pl-4 text-slate-400">
                  assessment: <span className="text-emerald-300">&quot;Backend Engineer Benchmark&quot;</span>;
                </p>
                <p className="pl-4 text-slate-400">
                  status: <span className="text-amber-400">&quot;SCORED&quot;</span>;
                </p>
                <p className="pl-4 text-slate-400">
                  score: <span className="text-cyan-400">92.5</span>; maximumScore: <span className="text-cyan-400">100.0</span>;
                </p>
                <p className="text-purple-400">&#125;</p>
                <p className="pt-2 text-slate-500">
                  // Auto-grading result generated via Neon Postgres + Upstash Redis
                </p>
                <p className="text-emerald-400">
                  ✔ 14/14 automated test assertions passed in 184ms
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 ROLES ARCHITECTURE SECTION */}
        <section className="py-20 border-y border-slate-900 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="info" className="mb-3">
                Tailored for 3 Primary Roles
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Built for Everyone in the Hiring Lifecycle
              </h2>
              <p className="text-slate-400 mt-4 text-sm sm:text-base">
                Role-based authorization and customized portals designed for Platform Administrators, Technical Recruiters, and Software Candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Role 1: Admin */}
              <Card hoverEffect className="space-y-4 border-purple-500/20 bg-slate-900/40">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Platform Admin</h3>
                  <Badge variant="purple" size="sm">System Owner</Badge>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full system oversight: view platform metrics, manage user statuses, inspect company credit balances, audit system logs, and adjust ledger records.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    System Analytics & Request Metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    User & Company Suspension / Activation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    Security Audit Trail & Credit Adjustments
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="w-full">
                      View Admin Workspace
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Role 2: Recruiter */}
              <Card hoverEffect className="space-y-4 border-blue-500/20 bg-slate-900/40">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Technical Recruiter</h3>
                  <Badge variant="info" size="sm">Hiring Team</Badge>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Design assessments using our multi-step wizard, invite candidate pools, purchase credit packages via Stripe checkout, and manually score submissions.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    Multi-step Assessment Creation Wizard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    Candidate Invitations & Pipeline Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    Credit Packages & Stripe Payments
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/recruiter">
                    <Button variant="outline" size="sm" className="w-full">
                      View Recruiter Portal
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Role 3: Candidate */}
              <Card hoverEffect className="space-y-4 border-emerald-500/20 bg-slate-900/40">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Terminal className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Candidate / Developer</h3>
                  <Badge variant="success" size="sm">Engineer</Badge>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Access assigned tests, take timed assessments with live countdowns, submit code and multiple-choice answers, and view performance breakdowns.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Timed Testing Runner with Auto-Save
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Comprehensive Scorecards & Results
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Developer Profile & Skill Tags
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/candidate">
                    <Button variant="outline" size="sm" className="w-full">
                      View Candidate Portal
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* STATS COUNTERS */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">99.8%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Uptime SLA</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono">15,000+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Assessments Taken</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">&lt;200ms</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Submission Latency</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">3 Roles</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Role-Based Security</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
