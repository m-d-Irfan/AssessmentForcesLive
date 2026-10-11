"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Terminal,
  ShieldCheck,
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { useAuth, DEMO_CREDENTIALS } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, demoLogin, getDashboardPath } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "/services" },
    { label: "Problems", href: "/problems" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Logo href="/" size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth / Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href={getDashboardPath(user.role)}>
                <Button size="sm" variant="glow" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200 leading-none">
                    {user.displayName}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {user.role}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={logout}
                  title="Sign Out"
                  className="text-slate-400 hover:text-rose-400 ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 relative">
              {/* Demo Login Quick Menu */}
              <div className="relative">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                  className="gap-1.5 border-indigo-500/40 text-indigo-300 hover:text-white hover:border-indigo-400"
                >
                  Demo Logins
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Button>

                {isDemoDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-semibold text-slate-200">1-Click Instant Logins</p>
                      <p className="text-[11px] text-slate-400">Select any role to test dashboards</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsDemoDropdownOpen(false);
                        demoLogin("ADMIN");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-left transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-semibold">Platform Admin</div>
                        <div className="text-[10px] text-slate-400">Governance & Metrics</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setIsDemoDropdownOpen(false);
                        demoLogin("RECRUITER");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-left transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-semibold">Recruiter / Employer</div>
                        <div className="text-[10px] text-slate-400">Assessments & Billing</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setIsDemoDropdownOpen(false);
                        demoLogin("CANDIDATE");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-left transition-colors"
                    >
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold">Candidate / Developer</div>
                        <div className="text-[10px] text-slate-400">Tests, Profile & Scorecards</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <Link href="/login">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="primary">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={getDashboardPath(user.role)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full" variant="glow">
                    Open {user.role} Dashboard
                  </Button>
                </Link>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-1.5 pb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      demoLogin("ADMIN");
                    }}
                    className="text-xs"
                  >
                    Admin
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      demoLogin("RECRUITER");
                    }}
                    className="text-xs"
                  >
                    Recruiter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      demoLogin("CANDIDATE");
                    }}
                    className="text-xs"
                  >
                    Candidate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
