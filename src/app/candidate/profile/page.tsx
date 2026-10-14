"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Code2, Briefcase, Globe, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().max(120).optional().or(z.literal("")),
  yearsExperience: z.coerce.number().min(0).max(50).optional(),
  skills: z.string().optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  bio: z.string().max(500, "Bio max 500 characters").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CandidateProfilePage() {
  const { user, updateUser } = useAuth();
  const [skillTags, setSkillTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      headline: "",
      yearsExperience: 0,
      skills: "",
      githubUrl: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    setValue("displayName", user.displayName || "");

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`devassess_profile_${user.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setValue("displayName", parsed.displayName || user.displayName);
          setValue("headline", parsed.headline || "");
          setValue("yearsExperience", parsed.yearsExperience || 0);
          setValue("skills", parsed.skills || "");
          setValue("githubUrl", parsed.githubUrl || "");
          setValue("bio", parsed.bio || "");
          if (parsed.skills) {
            setSkillTags(parsed.skills.split(",").map((s: string) => s.trim()).filter(Boolean));
          }
        } catch {}
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    await new Promise((r) => setTimeout(r, 400));

    if (user) {
      updateUser({
        ...user,
        displayName: data.displayName,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(`devassess_profile_${user.id}`, JSON.stringify(data));
      }
    }

    if (data.skills) {
      const tags = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
      setSkillTags(tags);
    } else {
      setSkillTags([]);
    }

    toast.success("Developer profile and technical skills saved!");
  };

  return (
    <DashboardLayout role="CANDIDATE">
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Developer Profile & Skill Tags
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep your technical skills and portfolio links current for recruiter review.
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Display Name *
                </label>
                <input
                  type="text"
                  {...register("displayName")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.displayName && (
                  <p className="text-rose-500 text-xs mt-1">{errors.displayName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Professional Headline
                </label>
                <input
                  type="text"
                  {...register("headline")}
                  placeholder="e.g. Full-Stack Developer | TypeScript & Python"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="number"
                  {...register("yearsExperience")}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  {...register("githubUrl")}
                  placeholder="https://github.com/your-username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.githubUrl && (
                  <p className="text-rose-500 text-xs mt-1">{errors.githubUrl.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                {...register("skills")}
                placeholder="TypeScript, Python, Docker, PostgreSQL, React"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />

              {/* Skills preview tags */}
              {skillTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {skillTags.map((tag, i) => (
                    <Badge key={i} variant="info" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Professional Bio & Summary
              </label>
              <textarea
                rows={3}
                {...register("bio")}
                placeholder="Briefly describe your engineering background, favorite tech stack, or career aspirations..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              variant="glow"
              isLoading={isSubmitting}
              className="gap-2 text-xs font-semibold"
            >
              <Save className="w-4 h-4" /> Save Developer Profile
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
