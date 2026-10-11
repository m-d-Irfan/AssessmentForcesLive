import React from "react";
import Link from "next/link";
import { Code2, Globe, ShieldCheck, Heart } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Logo href="/" size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering top engineering teams and recruiters to evaluate candidate skills through real-time code environments, timed assessments, and automated scoring.
            </p>
            <div className="flex items-center gap-3 text-slate-500">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Product & Tests
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Assessment Engine
                </Link>
              </li>
              <li>
                <Link href="/problems" className="hover:text-white transition-colors">
                  Problem Catalog
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Credit Packages
                </Link>
              </li>
              <li>
                <Link href="/candidate" className="hover:text-white transition-colors">
                  Candidate Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Role Dashboards */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Role Dashboards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Admin Console
                </Link>
              </li>
              <li>
                <Link href="/recruiter" className="hover:text-white transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/candidate" className="hover:text-white transition-colors">
                  Candidate Workspace
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  One-Click Demo Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About AssessmentForces
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Support & Contact
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Security & GDPR</span>
              </li>
              <li>
                <span className="text-slate-500">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 AssessmentForces Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Advanced Technical Hiring
          </p>
        </div>
      </div>
    </footer>
  );
}
