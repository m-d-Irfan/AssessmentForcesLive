"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Terminal,
  Briefcase,
  Lock,
  Mail,
  User,
  Building2,
  BadgeCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/context/auth-context";

// Fast, streamlined validation schema matching user specifications:
// Candidate: name, email, password, confirm password
// Recruiter: name, email, company name, designations, password, confirm password
const candidateSchema = z
  .object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const recruiterSchema = z
  .object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid work email address"),
    companyName: z.string().min(2, "Company name is required"),
    designation: z.string().min(2, "Designation / role is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");

  // Separate forms for crisp validation and fast experience
  const candidateForm = useForm<z.infer<typeof candidateSchema>>({
    resolver: zodResolver(candidateSchema),
  });

  const recruiterForm = useForm<z.infer<typeof recruiterSchema>>({
    resolver: zodResolver(recruiterSchema),
  });

  const onCandidateSubmit = async (data: z.infer<typeof candidateSchema>) => {
    try {
      await registerUser({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        displayName: data.displayName.trim(),
        role: "CANDIDATE",
      });
      window.location.href = "/candidate";
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  const onRecruiterSubmit = async (data: z.infer<typeof recruiterSchema>) => {
    try {
      await registerUser({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        displayName: data.displayName.trim(),
        role: "RECRUITER",
        companyName: data.companyName.trim(),
        designation: data.designation.trim(),
      });
      window.location.href = "/recruiter";
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07080c] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-lg space-y-6 relative z-10">
          <div className="text-center space-y-2 flex flex-col items-center">
            <Logo href="/" size="lg" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create Your Free Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Select your role to get started with instant access
            </p>
          </div>

          <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl">
            {/* Role Switcher Pill Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedRole("CANDIDATE")}
                  className={`py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === "CANDIDATE"
                      ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-500/30 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  Candidate / Developer
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("RECRUITER")}
                  className={`py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === "RECRUITER"
                      ? "bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-500/30 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  Recruiter / Hiring Team
                </button>
              </div>
            </div>

            {/* CANDIDATE REGISTRATION FORM */}
            {selectedRole === "CANDIDATE" && (
              <form
                onSubmit={candidateForm.handleSubmit(onCandidateSubmit)}
                className="space-y-4 animate-fade-in"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      {...candidateForm.register("displayName")}
                      placeholder="e.g. Alex Mercer"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  {candidateForm.formState.errors.displayName && (
                    <p className="text-rose-500 text-xs mt-1">
                      {candidateForm.formState.errors.displayName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      {...candidateForm.register("email")}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  {candidateForm.formState.errors.email && (
                    <p className="text-rose-500 text-xs mt-1">
                      {candidateForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        {...candidateForm.register("password")}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    {candidateForm.formState.errors.password && (
                      <p className="text-rose-500 text-xs mt-1">
                        {candidateForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        {...candidateForm.register("confirmPassword")}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    {candidateForm.formState.errors.confirmPassword && (
                      <p className="text-rose-500 text-xs mt-1">
                        {candidateForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={candidateForm.formState.isSubmitting}
                  className="w-full py-3 font-semibold gap-2 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Create Candidate Account <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            {/* RECRUITER REGISTRATION FORM */}
            {selectedRole === "RECRUITER" && (
              <form
                onSubmit={recruiterForm.handleSubmit(onRecruiterSubmit)}
                className="space-y-4 animate-fade-in"
              >
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Includes <strong>10 Free Starter Credits</strong> for candidate test invitations!</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      {...recruiterForm.register("displayName")}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {recruiterForm.formState.errors.displayName && (
                    <p className="text-rose-500 text-xs mt-1">
                      {recruiterForm.formState.errors.displayName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Work Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      {...recruiterForm.register("email")}
                      placeholder="sarah@techcorp.io"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {recruiterForm.formState.errors.email && (
                    <p className="text-rose-500 text-xs mt-1">
                      {recruiterForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        {...recruiterForm.register("companyName")}
                        placeholder="e.g. Acme Labs"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {recruiterForm.formState.errors.companyName && (
                      <p className="text-rose-500 text-xs mt-1">
                        {recruiterForm.formState.errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Designation / Role *
                    </label>
                    <div className="relative">
                      <BadgeCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        {...recruiterForm.register("designation")}
                        placeholder="e.g. Lead Technical Recruiter"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {recruiterForm.formState.errors.designation && (
                      <p className="text-rose-500 text-xs mt-1">
                        {recruiterForm.formState.errors.designation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        {...recruiterForm.register("password")}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {recruiterForm.formState.errors.password && (
                      <p className="text-rose-500 text-xs mt-1">
                        {recruiterForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        {...recruiterForm.register("confirmPassword")}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {recruiterForm.formState.errors.confirmPassword && (
                      <p className="text-rose-500 text-xs mt-1">
                        {recruiterForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={recruiterForm.formState.isSubmitting}
                  className="w-full py-3 font-semibold gap-2 shadow-lg shadow-blue-500/20"
                >
                  Create Recruiter Account <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
