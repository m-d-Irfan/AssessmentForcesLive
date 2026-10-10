import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code,
  CheckCircle,
  Clock,
  Sparkles,
  BarChart3,
  Users2,
  Workflow,
  Lock,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Features & Assessment Engine | AssessmentForces",
  description: "Explore the comprehensive developer testing, auto-grading, and recruitment assessment tools provided by AssessmentForces.",
};

export default function ServicesPage() {
  const services = [
    {
      icon: Code,
      title: "Interactive Coding Sandbox",
      description:
        "Full in-browser coding environment supporting TypeScript, JavaScript, Python, and SQL with real-time syntax checking and test case verification.",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Workflow,
      title: "Multi-Step Assessment Creation",
      description:
        "Technical recruiters can compose custom tests combining algorithmic problems, multiple-choice questions, and short technical answers with customized point distributions.",
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      icon: Clock,
      title: "Timed Candidate Attempts",
      description:
        "Built-in countdown timers, auto-save buffers, and automated submission guarantees on expiry to ensure a uniform testing window for all applicants.",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: BarChart3,
      title: "Automated & Manual Scoring",
      description:
        "Hybrid evaluation pipelines allowing automated grading for deterministic problems coupled with recruiter review rubrics for subjective questions.",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Users2,
      title: "Candidate Pipeline Tracking",
      description:
        "Manage applicant lifecycle from email invitation dispatch to completion, scoring, and candidate hiring status decisions.",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: Lock,
      title: "Role-Based Access Control",
      description:
        "Granular separation of privileges across Admin, Recruiter, and Candidate users with route middleware protection and session rotation.",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="info" className="mb-3">
            Core Assessment Capabilities
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comprehensive Suite for Engineering Assessment
          </h1>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            Everything your talent acquisition team and engineering hiring managers need to vet high-caliber software developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} hoverEffect className="space-y-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* CTA Callout */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready to Streamline Your Technical Hiring?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
            Test candidate skills with high-accuracy benchmarks or jump straight into the candidate simulator.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" variant="glow" className="gap-2">
                Explore Demo Portals <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="secondary">
                View Credit Pricing
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
