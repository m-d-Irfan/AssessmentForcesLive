"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Code2, Briefcase, Globe, Github, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  yearsExperience: z.coerce.number().min(0, "Experience cannot be negative"),
  skills: z.string().min(2, "Provide at least one skill tag"),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  bio: z.string().max(500, "Bio max 500 characters").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CandidateProfilePage() {
  const { user, updateUser } = useAuth();
  const [skillTags, setSkillTags] = useState(["TypeScript", "Node.js", "PostgreSQL", "Next.js", "Redis"]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "Demo Candidate",
      headline: "Full-Stack Software Engineer & Backend Specialist",
      yearsExperience: 3,
      skills: "TypeScript, Node.js, PostgreSQL, Next.js, Redis",
      githubUrl: "https://github.com/developer",
      bio: "Passionate engineer specialized in scalable distributed systems and high-accuracy developer assessment platforms.",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await new Promise((r) => setTimeout(r, 600));

    if (user) {
      updateUser({
        ...user,
        displayName: data.displayName,
      });
    }

    const tags = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
    setSkillTags(tags);

    toast.success("Developer profile and skill tags updated successfully!");
  };

  return (
    <DashboardLayout role="CANDIDATE">
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Developer Profile & Skill Tags
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Keep your technical skills and portfolio links current for recruiter review.
          </p>
        </div>

        <Card className="p-8 border-slate-800 bg-slate-900/60 shadow-xl space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  {...register("displayName")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                {errors.displayName && (
                  <p className="text-rose-400 text-xs mt-1">{errors.displayName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Professional Headline
                </label>
                <input
                  type="text"
                  {...register("headline")}
                  placeholder="e.g. Senior Backend Architect"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                {errors.headline && (
                  <p className="text-rose-400 text-xs mt-1">{errors.headline.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Years of Professional Experience
                </label>
                <input
                  type="number"
                  {...register("yearsExperience")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                {errors.yearsExperience && (
                  <p className="text-rose-400 text-xs mt-1">{errors.yearsExperience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  {...register("githubUrl")}
                  placeholder="https://github.com/your-username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                {errors.githubUrl && (
                  <p className="text-rose-400 text-xs mt-1">{errors.githubUrl.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                {...register("skills")}
                placeholder="TypeScript, Python, Docker, PostgreSQL, GraphQL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
              {errors.skills && (
                <p className="text-rose-400 text-xs mt-1">{errors.skills.message}</p>
              )}

              {/* Skills preview tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {skillTags.map((tag, i) => (
                  <Badge key={i} variant="info" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Professional Bio & Summary
              </label>
              <textarea
                rows={3}
                {...register("bio")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
              {errors.bio && (
                <p className="text-rose-400 text-xs mt-1">{errors.bio.message}</p>
              )}
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
