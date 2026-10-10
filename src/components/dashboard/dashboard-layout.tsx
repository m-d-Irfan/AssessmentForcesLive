"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  LayoutDashboard,
  ShieldCheck,
  Users,
  FileText,
  Briefcase,
  Layers,
  Send,
  CheckSquare,
  CreditCard,
  Terminal,
  Award,
  User,
  LogOut,
  Menu,
  X,
  Coins,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "ADMIN" | "RECRUITER" | "CANDIDATE";
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const adminNav: NavItem[] = [
    { label: "Overview & Analytics", href: "/admin", icon: LayoutDashboard },
    { label: "Manage Users & Companies", href: "/admin/manage", icon: Users },
    { label: "Audit Logs & Reports", href: "/admin/reports", icon: FileText },
  ];

  const recruiterNav: NavItem[] = [
    { label: "Pipeline Overview", href: "/recruiter", icon: LayoutDashboard },
    { label: "Assessments & Wizard", href: "/recruiter/assessments", icon: Layers },
    { label: "Candidate Invitations", href: "/recruiter/candidates", icon: Send },
    { label: "Submission Evaluations", href: "/recruiter/evaluations", icon: CheckSquare },
    { label: "Credit Billing & Stripe", href: "/recruiter/billing", icon: CreditCard },
  ];

  const candidateNav: NavItem[] = [
    { label: "My Assessments", href: "/candidate", icon: Terminal },
    { label: "Results & Scorecards", href: "/candidate/results", icon: Award },
    { label: "Developer Profile", href: "/candidate/profile", icon: User },
  ];

  const currentNav =
    role === "ADMIN"
      ? adminNav
      : role === "RECRUITER"
      ? recruiterNav
      : candidateNav;

  const roleLabel =
    role === "ADMIN"
      ? "Platform Admin"
      : role === "RECRUITER"
      ? "Recruiter Portal"
      : "Candidate Workspace";

  const roleBadgeVariant =
    role === "ADMIN" ? "purple" : role === "RECRUITER" ? "info" : "success";

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-extrabold text-white text-base">
            Assessment<span className="text-blue-500">Forces</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={roleBadgeVariant} size="sm">
            {role}
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-200 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 flex flex-col flex-1">
          {/* Brand & Portal title */}
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-800/80">
            <Link href="/" className="flex flex-col">
              <span className="font-extrabold text-base text-white">
                Assessment<span className="text-blue-500">Forces</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">
                {roleLabel}
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 flex-1">
            <div className="text-[10px] uppercase font-semibold text-slate-500 px-3 mb-2 tracking-wider">
              Navigation
            </div>
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Recruiter Credit Balance Badge or Candidate Test Notice */}
          {role === "RECRUITER" && (
            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 my-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-blue-400" /> Company Credits
                </span>
                <span className="text-xs font-extrabold text-blue-400 font-mono">
                  Active
                </span>
              </div>
              <Link href="/recruiter/billing">
                <span className="text-[10px] text-blue-300/80 hover:text-blue-200 flex items-center gap-1 mt-1">
                  Top up credits with Stripe <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </Link>
            </div>
          )}

          {/* Quick External Links */}
          <div className="pt-2 border-t border-slate-800/60 space-y-1">
            <Link
              href="/problems"
              className="flex items-center justify-between px-3 py-1.5 text-slate-400 hover:text-slate-200 text-xs rounded-lg hover:bg-slate-900/40"
            >
              <span>Problem Catalog</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-1.5 text-slate-400 hover:text-slate-200 text-xs rounded-lg hover:bg-slate-900/40"
            >
              <span>Home Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {user?.displayName || "Authorized User"}
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono">
                {user?.email || "user@devassess.local"}
              </div>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={logout}
            title="Sign Out"
            className="text-slate-400 hover:text-rose-400 shrink-0 ml-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
