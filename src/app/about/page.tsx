import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Target, Award, Users, Terminal, Cpu } from "lucide-react";

export const metadata = {
  title: "About Us | DevAssess",
  description: "Learn about DevAssess mission to modernize engineering assessment and technical recruitment.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="info" className="mb-3">
            Our Mission & Architecture
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Redefining Technical Assessments for Modern Engineering
          </h1>
          <p className="text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            DevAssess was engineered to replace outdated, unstructured whiteboard interviews with objective, real-time code execution environments and multi-stage evaluation pipelines.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Objective Grading</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every coding challenge and technical assessment is evaluated with deterministic test cases, edge condition analysis, and memory/time limit checks.
            </p>
          </Card>

          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Anti-Cheat Safeguards</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Timed sessions, automated submission integrity checks, and browser focus telemetry ensure high test validity and fairness for candidates.
            </p>
          </Card>

          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Actionable Scorecards</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Recruiters receive deep candidate performance analytics, skill radar profiles, and code playback to make high-confidence hiring decisions.
            </p>
          </Card>
        </div>

        {/* Architecture & Tech Stack */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-4xl mx-auto mb-16">
          <Badge variant="purple" className="mb-4">
            High-Performance Fullstack Architecture
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Powered by Next.js App Router, Neon Postgres & Upstash Redis
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Built for enterprise-grade scalability with sub-millisecond session caching, zero cold-start relational persistence, and role-based security headers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Cpu className="w-5 h-5 text-blue-400 mb-2" />
              <div className="font-semibold text-white text-sm">Next.js 15+</div>
              <div className="text-xs text-slate-400">Server Components & App Router</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Terminal className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-semibold text-white text-sm">Neon PostgreSQL</div>
              <div className="text-xs text-slate-400">Serverless Relational Engine</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Users className="w-5 h-5 text-purple-400 mb-2" />
              <div className="font-semibold text-white text-sm">Upstash Redis</div>
              <div className="text-xs text-slate-400">REST Rate Limiting & Cache</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <ShieldCheck className="w-5 h-5 text-amber-400 mb-2" />
              <div className="font-semibold text-white text-sm">Stripe Payments</div>
              <div className="text-xs text-slate-400">Instant Credit Top-ups</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
