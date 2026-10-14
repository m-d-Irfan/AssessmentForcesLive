"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
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
  Lock,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ThemeToggle } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { getCompanyCredits } from "@/lib/assessment-store";

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
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [credits, setCredits] = useState<number>(10);

  // Sync recruiter credits
  useEffect(() => {
    if (role === "RECRUITER") {
      setCredits(getCompanyCredits());
      const onCreditsUpdated = () => setCredits(getCompanyCredits());
      window.addEventListener("credits_updated", onCreditsUpdated);
      return () => window.removeEventListener("credits_updated", onCreditsUpdated);
    }
  }, [role]);

  // Security: Handle browser back/forward cache (bfcache).
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Security: Client-side unauthenticated redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, pathname]);

  // Authorization check
  const isAuthorized = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    if (user.role === "ADMIN") return true;
    if (role === "RECRUITER") return user.role === "RECRUITER";
    if (role === "CANDIDATE") return user.role === "CANDIDATE";
    return false;
  }, [isAuthenticated, user, role]);

  const adminNav: NavItem[] = [
    { label: "Overview & Analytics", href: "/admin", icon: LayoutDashboard },
    { label: "Manage Users & Directory", href: "/admin/manage", icon: Users },
    { label: "Security & Audit Logs", href: "/admin/reports", icon: FileText },
  ];

  const recruiterNav: NavItem[] = [
    { label: "Pipeline Overview", href: "/recruiter", icon: LayoutDashboard },
    { label: "Assessments & Problems", href: "/recruiter/assessments", icon: Layers },
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

  // 1. Session hydrating state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07080c] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="relative">
            <Logo href="/" size="lg" />
            <div className="absolute -bottom-1 -right-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              Validating Session...
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Securing {roleLabel} workspace
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Barrier
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07080c] flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Authentication Required
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Access to this workspace requires an authorized session. You have been logged out or your session expired.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              className="flex-1"
              variant="glow"
              onClick={() => {
                window.location.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
              }}
            >
              Sign In Now <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                window.location.replace("/");
              }}
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Role Privilege Mismatch Barrier
  if (!isAuthorized) {
    const userAllowedPath =
      user.role === "ADMIN"
        ? "/admin"
        : user.role === "RECRUITER"
        ? "/recruiter"
        : "/candidate";

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07080c] flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-500/30 shadow-2xl max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] font-mono font-semibold">
              ROLE ACCESS RESTRICTION
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your account is logged in as <strong className="text-slate-900 dark:text-slate-200">{user.role}</strong> ({user.displayName}). You do not have permissions to access the <strong className="text-slate-900 dark:text-slate-200">{roleLabel}</strong>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              className="flex-1"
              variant="glow"
              onClick={() => {
                window.location.replace(userAllowedPath);
              }}
            >
              Go to My {user.role} Portal
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={logout}
            >
              Switch Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07080c] dark:text-slate-100 flex flex-col transition-colors duration-150">
      {/* ============================================================
          TOP NAVBAR: FULL-WIDTH HEADER ACROSS DASHBOARD
          Integrates Logo, Role Badge, Credits, ThemeToggle, and Profile
      ============================================================ */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl transition-colors shadow-xs">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile Toggle + Logo + Workspace Badge */}
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle navigation"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Logo href="/" size="md" />

            <div className="hidden sm:flex items-center gap-2 pl-3 ml-2 border-l border-slate-200 dark:border-slate-800">
              <Badge variant={roleBadgeVariant} size="sm" className="font-semibold tracking-wide">
                {roleLabel}
              </Badge>
            </div>
          </div>

          {/* Right Controls: Recruiter Credits, ThemeToggle, User Profile, Logout */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Recruiter Credit Pill (Only for RECRUITER) */}
            {role === "RECRUITER" && (
              <Link
                href="/recruiter/billing"
                title="Manage credits & billing"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-2xs"
              >
                <Coins className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-mono font-bold">{credits}</span>
                <span className="hidden sm:inline text-[11px] font-normal opacity-80">Credits</span>
              </Link>
            )}

            {/* Role Badge for Mobile */}
            <div className="sm:hidden">
              <Badge variant={roleBadgeVariant} size="sm">
                {role}
              </Badge>
            </div>

            {/* Light / Dark Mode Toggle Button */}
            <ThemeToggle size="sm" />

            {/* User Profile Info & Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[130px]">
                  {user?.displayName || "Authorized User"}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[130px]">
                  {user?.email || "user@devassess.local"}
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={logout}
                title="Sign Out"
                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0 ml-1"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          MAIN WRAPPER: SIDEBAR + CONTENT AREA
      ============================================================ */}
      <div className="flex-1 flex min-h-[calc(100vh-4rem)] relative">
        {/* Mobile Backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-xs z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white/95 dark:bg-slate-950/95 border-r border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-200 shadow-sm md:shadow-none ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4 flex flex-col flex-1 overflow-y-auto">
            {/* Navigation Menu */}
            <nav className="space-y-1.5 flex-1">
              <div className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 px-3 mb-2 tracking-wider">
                Workspace Menu
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
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs dark:bg-blue-600/15 dark:text-blue-400 dark:border-blue-500/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Recruiter Credit Upgrade Card in Sidebar */}
            {role === "RECRUITER" && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-500/20 my-4 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Balance
                  </span>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                    {credits} Credits
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  1 credit unlocks 1 candidate assessment session.
                </p>
                <Link href="/recruiter/billing" onClick={() => setIsMobileOpen(false)}>
                  <span className="text-[10px] text-blue-600 dark:text-blue-300 font-bold hover:underline flex items-center gap-1 mt-2">
                    Top up credits <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            )}

            {/* Quick Catalog Link (NO "Home Page" button as requested) */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/60">
              <Link
                href="/problems"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-colors"
              >
                <span>Browse Problem Catalog</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
