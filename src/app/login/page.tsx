"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Code2,
  ShieldCheck,
  Briefcase,
  Terminal,
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, DEMO_CREDENTIALS } from "@/context/auth-context";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin, getDashboardPath } = useAuth();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data.email, data.password);
      router.push(getDashboardPath(user.role));
    } catch {
      // Error handled in auth context toast
    }
  };

  const handleQuickFill = (role: "ADMIN" | "RECRUITER" | "CANDIDATE") => {
    const creds = DEMO_CREDENTIALS[role];
    setValue("email", creds.email);
    setValue("password", creds.password);
    toast.info(`Filled credentials for ${creds.name}`);
  };

  const handleInstantDemoLogin = async (role: "ADMIN" | "RECRUITER" | "CANDIDATE") => {
    setActiveDemo(role);
    try {
      await demoLogin(role);
    } finally {
      setActiveDemo(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="w-full max-w-xl space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              Secure Role Authentication
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome Back to AssessmentForces
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Sign in to manage assessments, review candidates, or continue testing
            </p>
          </div>

          <Card className="p-6 sm:p-8 border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
            {/* Standard Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-xs text-blue-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                {errors.password && (
                  <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full py-3 font-semibold gap-2 shadow-lg shadow-blue-600/20"
              >
                Sign In to Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* MANDATORY 1-CLICK DEMO LOGIN SECTION */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="h-px bg-slate-800 flex-1" />
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2">
                  Quick 1-Click Role Logins
                </span>
                <span className="h-px bg-slate-800 flex-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Admin Button */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20 flex flex-col justify-between space-y-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs font-bold text-white leading-none">Admin</p>
                      <p className="text-[10px] text-slate-400">admin@gmail.com</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={activeDemo === "ADMIN"}
                    onClick={() => handleInstantDemoLogin("ADMIN")}
                    className="w-full text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-white"
                  >
                    1-Click Login
                  </Button>
                </div>

                {/* Recruiter Button */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-blue-500/20 flex flex-col justify-between space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-white leading-none">Recruiter</p>
                      <p className="text-[10px] text-slate-400">recruiter@devassess...</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={activeDemo === "RECRUITER"}
                    onClick={() => handleInstantDemoLogin("RECRUITER")}
                    className="w-full text-xs border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-white"
                  >
                    1-Click Login
                  </Button>
                </div>

                {/* Candidate Button */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex flex-col justify-between space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white leading-none">Candidate</p>
                      <p className="text-[10px] text-slate-400">candidate@devassess...</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={activeDemo === "CANDIDATE"}
                    onClick={() => handleInstantDemoLogin("CANDIDATE")}
                    className="w-full text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:text-white"
                  >
                    1-Click Login
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-400">
              Do not have an account yet?{" "}
              <Link href="/register" className="text-blue-400 font-semibold hover:underline">
                Create Account
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
