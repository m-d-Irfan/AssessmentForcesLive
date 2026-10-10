"use client";

import React, { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { Problem } from "@/types";
import { Search, Filter, Code, Terminal, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

const SAMPLE_PROBLEMS: Problem[] = [
  {
    id: "seed_problem_typescript",
    title: "TypeScript Type Safety & Structural Shape Evaluation",
    type: "SINGLE_CHOICE",
    difficulty: "EASY",
    status: "PUBLISHED",
    createdAt: "2026-09-24T12:00:00.000Z",
    currentVersion: {
      id: "v1",
      version: 1,
      prompt: "Which TypeScript feature checks the shape of values during development?",
    },
  },
  {
    id: "prob_async_eventloop",
    title: "Node.js Event Loop Phases & Microtask Queue Priority",
    type: "MULTIPLE_CHOICE",
    difficulty: "MEDIUM",
    status: "PUBLISHED",
    createdAt: "2026-09-25T14:30:00.000Z",
    currentVersion: {
      id: "v2",
      version: 1,
      prompt: "Select all valid characteristics of Node.js process.nextTick vs setImmediate.",
    },
  },
  {
    id: "prob_lru_cache_algorithm",
    title: "Least Recently Used (LRU) Cache Implementation in O(1)",
    type: "CODE",
    difficulty: "HARD",
    status: "PUBLISHED",
    createdAt: "2026-09-26T10:00:00.000Z",
    currentVersion: {
      id: "v3",
      version: 1,
      prompt: "Design and implement a data structure for Least Recently Used (LRU) cache with get and put in O(1) time.",
    },
  },
  {
    id: "prob_postgres_indexing",
    title: "PostgreSQL B-Tree & GIN Index Optimization for JSONB",
    type: "SINGLE_CHOICE",
    difficulty: "MEDIUM",
    status: "PUBLISHED",
    createdAt: "2026-09-27T16:20:00.000Z",
    currentVersion: {
      id: "v4",
      version: 1,
      prompt: "Which index type is best suited for querying key-value containment inside JSONB columns?",
    },
  },
  {
    id: "prob_jwt_refresh_rotation",
    title: "Cryptographic Refresh Token Family Rotation & Replay Defense",
    type: "CODE",
    difficulty: "HARD",
    status: "PUBLISHED",
    createdAt: "2026-09-28T09:15:00.000Z",
    currentVersion: {
      id: "v5",
      version: 1,
      prompt: "Implement token reuse detection logic that invalidates all sessions in the family upon replay.",
    },
  },
];

function ProblemsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const queryParam = searchParams.get("q") || "";
  const difficultyParam = searchParams.get("difficulty") || "ALL";
  const typeParam = searchParams.get("type") || "ALL";

  const [problems, setProblems] = useState<Problem[]>(SAMPLE_PROBLEMS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadProblems() {
      setIsLoading(true);
      try {
        const res = await api.get<any>("/problems", {
          params: { status: "PUBLISHED" },
        });
        if (Array.isArray(res) && res.length > 0) {
          setProblems(res);
        } else if (res?.items && Array.isArray(res.items) && res.items.length > 0) {
          setProblems(res.items);
        }
      } catch (err) {
        // Fallback to sample catalog if backend unauthenticated or empty
      } finally {
        setIsLoading(false);
      }
    }
    loadProblems();
  }, []);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const filteredProblems = problems.filter((item) => {
    const matchesQuery =
      !queryParam ||
      item.title.toLowerCase().includes(queryParam.toLowerCase()) ||
      item.type.toLowerCase().includes(queryParam.toLowerCase());

    const matchesDifficulty =
      difficultyParam === "ALL" || item.difficulty === difficultyParam;

    const matchesType = typeParam === "ALL" || item.type === typeParam;

    return matchesQuery && matchesDifficulty && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by keyword..."
            value={queryParam}
            onChange={(e) => updateFilters("q", e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Difficulty Dropdown */}
          <select
            value={difficultyParam}
            onChange={(e) => updateFilters("difficulty", e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          {/* Type Dropdown */}
          <select
            value={typeParam}
            onChange={(e) => updateFilters("type", e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Question Types</option>
            <option value="CODE">Coding Challenge</option>
            <option value="SINGLE_CHOICE">Single Choice</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          </select>

          {(queryParam || difficultyParam !== "ALL" || typeParam !== "ALL") && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push(pathname)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Problems Catalog View */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : filteredProblems.length === 0 ? (
        <EmptyState
          icon={Terminal}
          title="No Matching Problems Found"
          description="Try broadening your search query or reset your difficulty filters."
          actionLabel="Clear All Filters"
          onAction={() => router.push(pathname)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProblems.map((prob) => {
            const diffColor =
              prob.difficulty === "EASY"
                ? "success"
                : prob.difficulty === "MEDIUM"
                ? "warning"
                : "danger";

            return (
              <Card
                key={prob.id}
                hoverEffect
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-800 bg-slate-900/40"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={diffColor} size="sm">
                      {prob.difficulty}
                    </Badge>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {prob.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ID: {prob.id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                    {prob.title}
                  </h3>
                  {prob.currentVersion?.prompt && (
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {prob.currentVersion.prompt}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <Link href="/candidate">
                    <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                      Practice in Sandbox <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProblemsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="info" className="mb-3">
            Algorithmic & Technical Catalog
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Developer Problem Repository
          </h1>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            Browse through algorithmic challenges, concurrency problems, and architecture questions used in active assessments. URL state synchronized.
          </p>
        </div>

        <Suspense fallback={<TableSkeleton rows={5} cols={4} />}>
          <ProblemsList />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
