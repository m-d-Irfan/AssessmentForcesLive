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
  Terminal,
  Briefcase,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";

const registerSchema = z
  .object({
    displayName: z.string().min(2, "Name must be at least 2 characters").max(120),
    email: z.string().email("Please provide a valid email address"),
    role: z.enum(["CANDIDATE", "RECRUITER"]),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login, getDashboardPath } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CANDIDATE",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post("/auth/register", {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        displayName: data.displayName.trim(),
        role: data.role,
      });

      toast.success("Account registered successfully! Logging you in...");

      // Automatically sign in
      try {
        const loggedUser = await login(data.email, data.password);
        router.push(getDashboardPath(loggedUser.role));
      } catch {
        router.push("/login");
      }
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : "Failed to register account";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="w-full max-w-xl space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Create Your AssessmentForces Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Join the developer assessment network as a Candidate or Technical Recruiter
            </p>
          </div>

          <Card className="p-6 sm:p-8 border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
            {/* Role Switcher */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Your Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("CANDIDATE");
                    setValue("role", "CANDIDATE");
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                    selectedRole === "CANDIDATE"
                      ? "border-emerald-500 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Terminal
                    className={`w-5 h-5 ${
                      selectedRole === "CANDIDATE" ? "text-emerald-400" : "text-slate-500"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Candidate</div>
                    <div className="text-[10px] text-slate-400">Take code tests</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("RECRUITER");
                    setValue("role", "RECRUITER");
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                    selectedRole === "RECRUITER"
                      ? "border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Briefcase
                    className={`w-5 h-5 ${
                      selectedRole === "RECRUITER" ? "text-blue-400" : "text-slate-500"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Recruiter</div>
                    <div className="text-[10px] text-slate-400">Hire engineers</div>
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    {...register("displayName")}
                    placeholder="e.g. Alex Mercer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                {errors.displayName && (
                  <p className="text-rose-400 text-xs mt-1">{errors.displayName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="alex@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password (min 12 chars, upper, lower, number, symbol)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="SecurePass123!"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                {errors.password && (
                  <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="SecurePass123!"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-rose-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full py-3 font-semibold gap-2 shadow-lg shadow-blue-600/20"
              >
                Create {selectedRole === "CANDIDATE" ? "Candidate" : "Recruiter"} Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 font-semibold hover:underline">
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
