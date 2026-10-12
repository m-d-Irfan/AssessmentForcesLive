"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Lock,
  ShieldAlert,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";

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

  // Security: Handle browser back/forward cache (bfcache).
  // If the user logs out and hits the browser 'Back' button, window.persisted is true.
  // Force a hard reload so the browser executes a fresh server-side request where
  // cookies are verified by Next.js middleware.
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
    if (user.role === "ADMIN") return true; // Administrator has platform-wide audit access
    if (role === "RECRUITER") return user.role === "RECRUITER";
    if (role === "CANDIDATE") return user.role === "CANDIDATE";
    return false;
  }, [isAuthenticated, user, role]);

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

  // 1. Session hydrating state: Do not leak dashboard content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4">
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
            <div className="text-sm font-semibold text-slate-200 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              Validating Authentication...
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Securing {roleLabel} workspace
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Barrier: Protect all children
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              Authentication Required
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access to this dashboard requires an active authorized session. You have been logged out or your session expired.
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

  // 3. Role Privilege Mismatch Barrier: Prevent cross-role leaks
  if (!isAuthorized) {
    const userAllowedPath =
      user.role === "ADMIN"
        ? "/admin"
        : user.role === "RECRUITER"
        ? "/recruiter"
        : "/candidate";

    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-mono font-semibold">
              ROLE ACCESS RESTRICTION
            </div>
            <h2 className="text-xl font-bold text-white">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account is logged in as <strong className="text-slate-200">{user.role}</strong> ({user.displayName}). You do not have permissions to access the <strong className="text-slate-200">{roleLabel}</strong>.
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <Logo href="/" size="sm" />
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

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-200 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 flex flex-col flex-1">
          {/* Brand & Portal title */}
          <div className="flex flex-col pb-5 mb-4 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <Logo href="/" size="md" />
              <Badge variant={roleBadgeVariant} size="sm">
                {role}
              </Badge>
            </div>
            <div className="text-[11px] text-slate-400 font-mono tracking-wider mt-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              {roleLabel}
            </div>
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
