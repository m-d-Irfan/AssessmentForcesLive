"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Terminal,
  ShieldCheck,
  Briefcase,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Users,
  Check,
  Clock,
  Lock,
  BarChart3,
  Search,
  FileCode2,
  ChevronRight,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { Play } from "lucide-react";

// Real-world Sandbox Preview Code Samples
const RUNTIME_SAMPLES: Record<
  "typescript" | "python" | "go" | "rust" | "java",
  {
    language: string;
    runtime: string;
    title: string;
    code: string;
    testOutput: string;
    speed: string;
    memory: string;
    tag: string;
    tagColor: string;
  }
> = {
  typescript: {
    language: "TypeScript",
    runtime: "Node.js v20.12 (V8 Isolate)",
    title: "Distributed Token Bucket Rate Limiter",
    tag: "TS",
    tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    code: `class TokenBucketLimiter {
  private capacity: number;
  private tokens: number;
  private refillRatePerSec: number;
  private lastRefillTimestamp: number;

  constructor(capacity: number, refillRatePerSec: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.lastRefillTimestamp = Date.now();
  }

  public tryAcquire(requested: number = 1): boolean {
    this.refill();
    if (this.tokens >= requested) {
      this.tokens -= requested;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRatePerSec;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTimestamp = now;
  }
}`,
    testOutput:
      "✔ Unit Test 1: Initial capacity permits 10 concurrent bursts\n✔ Unit Test 2: Throttles at 11th request with 429 status response\n✔ Unit Test 3: Steady-state refill correctly adds 5 tokens/sec\nAll 3 automated test suites PASSED in 18ms",
    speed: "18ms",
    memory: "14.2 MB",
  },
  python: {
    language: "Python",
    runtime: "CPython 3.12 (Sandboxed)",
    title: "LRU Cache with Time-To-Live (TTL)",
    tag: "PY",
    tagColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    code: `import time
from collections import OrderedDict

class TTLCache:
    def __init__(self, capacity: int, ttl_seconds: float):
        self.capacity = capacity
        self.ttl = ttl_seconds
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return None
        value, timestamp = self.cache[key]
        if time.time() - timestamp > self.ttl:
            del self.cache[key]
            return None
        self.cache.move_to_end(key)
        return value

    def set(self, key, value):
        if key in self.cache:
            del self.cache[key]
        elif len(self.cache) >= self.capacity:
            self.cache.popitem(last=False)
        self.cache[key] = (value, time.time())`,
    testOutput:
      "✔ Test Case 1: Keys expire after exact TTL timestamp threshold\n✔ Test Case 2: Evicts least recently accessed element upon overflow\n✔ Test Case 3: Cache hits refresh position ordering\nAll 3 test assertions PASSED in 24ms",
    speed: "24ms",
    memory: "16.8 MB",
  },
  go: {
    language: "Go",
    runtime: "Go 1.22 (Linux Container)",
    title: "Concurrent Worker Pool with Graceful Cancellation",
    tag: "GO",
    tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    code: `package main

import (
    "context"
    "sync"
)

type Job struct {
    ID int
    Data string
}

func WorkerPool(ctx context.Context, workers int, jobs <-chan Job) <-chan int {
    results := make(chan int)
    var wg sync.WaitGroup

    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return
                case job, ok := <-jobs:
                    if !ok {
                        return
                    }
                    results <- job.ID * 2
                }
            }
        }()
    }
    return results
}`,
    testOutput:
      "✔ Benchmark 1: Concurrently consumes 10,000 tasks without deadlock\n✔ Benchmark 2: Gracefully terminates within 5ms of Context cancel\n✔ Benchmark 3: Zero goroutine leaks detected\nExecution verified in 9ms",
    speed: "9ms",
    memory: "8.4 MB",
  },
  rust: {
    language: "Rust",
    runtime: "Rust 1.78.0 (LLVM Native)",
    title: "Lock-Free SPSC Concurrent Ring Buffer",
    tag: "RS",
    tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    code: `use std::sync::atomic::{AtomicUsize, Ordering};
use std::cell::UnsafeCell;

pub struct RingBuffer<T, const N: usize> {
    buffer: [UnsafeCell<Option<T>>; N],
    head: AtomicUsize,
    tail: AtomicUsize,
}

impl<T, const N: usize> RingBuffer<T, N> {
    pub fn new() -> Self {
        Self {
            buffer: std::array::from_fn(|_| UnsafeCell::new(None)),
            head: AtomicUsize::new(0),
            tail: AtomicUsize::new(0),
        }
    }

    pub fn push(&self, item: T) -> Result<(), T> {
        let tail = self.tail.load(Ordering::Relaxed);
        let head = self.head.load(Ordering::Acquire);
        if tail.wrapping_sub(head) >= N {
            return Err(item);
        }
        unsafe { *self.buffer[tail % N].get() = Some(item); }
        self.tail.store(tail.wrapping_add(1), Ordering::Release);
        Ok(())
    }
}`,
    testOutput:
      "✔ Unit Test 1: SPSC queue throughput exceeds 4.2M ops/sec\n✔ Unit Test 2: Atomic memory ordering verified across threads\n✔ Unit Test 3: Zero allocation during steady-state push/pop\nAll assertions PASSED in 4ms",
    speed: "4ms",
    memory: "6.2 MB",
  },
  java: {
    language: "Java",
    runtime: "OpenJDK 21 LTS (HotSpot)",
    title: "High-Throughput Concurrent Cache with Virtual Threads",
    tag: "JV",
    tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    code: `package com.assessmentforces.engine;

import java.util.concurrent.ConcurrentHashMap;
import java.time.Instant;

public class HighThroughputCache<K, V> {
    private final long ttlMillis;
    private final ConcurrentHashMap<K, CacheEntry<V>> map = new ConcurrentHashMap<>();

    record CacheEntry<V>(V data, Instant expiresAt) {}

    public HighThroughputCache(long ttlMillis) {
        this.ttlMillis = ttlMillis;
    }

    public void put(K key, V value) {
        map.put(key, new CacheEntry<>(value, Instant.now().plusMillis(ttlMillis)));
    }

    public V get(K key) {
        CacheEntry<V> entry = map.get(key);
        if (entry == null) return null;
        if (Instant.now().isAfter(entry.expiresAt())) {
            map.remove(key);
            return null;
        }
        return entry.data();
    }
}`,
    testOutput:
      "✔ Test Suite 1: Concurrent reads/writes scale across 100 virtual threads\n✔ Test Suite 2: Automated entry eviction under high load\n✔ Test Suite 3: Lock-free map partition performance validated\nAll tests PASSED in 16ms",
    speed: "16ms",
    memory: "22.4 MB",
  },
};

// Curated Problem Showcase Items
const SHOWCASE_PROBLEMS = [
  {
    category: "Distributed Systems",
    title: "Consistent Hashing Ring with Virtual Nodes",
    difficulty: "HARD",
    duration: "45 mins",
    passRate: "28%",
    points: 30,
  },
  {
    category: "Fullstack Architecture",
    title: "Idempotent Payment Webhook Processing Engine",
    difficulty: "MEDIUM",
    duration: "30 mins",
    passRate: "54%",
    points: 20,
  },
  {
    category: "Database & Performance",
    title: "B-Tree Index Simulation & Query Execution Plan",
    difficulty: "HARD",
    duration: "40 mins",
    passRate: "33%",
    points: 25,
  },
  {
    category: "Algorithms & Logic",
    title: "Prefix Tree (Trie) with Wildcard Autocomplete",
    difficulty: "MEDIUM",
    duration: "25 mins",
    passRate: "68%",
    points: 15,
  },
  {
    category: "React & DOM Internals",
    title: "Virtual DOM Reconciliation & Diffing Tree",
    difficulty: "EASY",
    duration: "20 mins",
    passRate: "82%",
    points: 10,
  },
];

export default function HomePage() {
  const { isAuthenticated, user, getDashboardPath } = useAuth();
  const [activeLang, setActiveLang] = useState<
    "typescript" | "python" | "go" | "rust" | "java"
  >("typescript");
  const [isRunningHeroTest, setIsRunningHeroTest] = useState(false);
  const [heroTestOutput, setHeroTestOutput] = useState({
    passed: true,
    tests: 16,
    latency: 18,
    memory: "14.2 MB",
    score: 96,
  });

  const handleRunHeroBenchmark = () => {
    setIsRunningHeroTest(true);
    setTimeout(() => {
      setIsRunningHeroTest(false);
      setHeroTestOutput({
        passed: true,
        tests: 16,
        latency: Math.floor(Math.random() * 8) + 12,
        memory: (Math.random() * 2 + 13).toFixed(1) + " MB",
        score: 98,
      });
    }, 550);
  };

  const sample = RUNTIME_SAMPLES[activeLang];

  return (
    <div className="min-h-screen flex flex-col bg-[#07080b] text-slate-100 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* PORTION 1: NEXT-LEVEL HERO SECTION */}
        <section className="relative pt-20 pb-20 border-b border-white/[0.06] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Precision Developer Telemetry Header */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-slate-400 tracking-wider uppercase mb-7">
              <span className="text-blue-400 font-bold">AF-BENCHMARK v2.4</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span>ISOLATED RUNTIME CONTAINERS</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="text-emerald-400 font-medium">ZERO WHITEBOARD TRIVIA</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="text-slate-400">&lt;45MS EVALUATION LATENCY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08] mb-6 font-sans">
              Objective Code Assessments.<br className="hidden sm:inline" />
              <span className="text-slate-300">
                Engineered for Real Software Teams.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Screen engineering talent through executable test suites, algorithmic complexity telemetry, and multi-role evaluation pipelines—not memorized whiteboard riddles.
            </p>

            {/* Dynamic Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-14">
              {isAuthenticated && user ? (
                <Link href={getDashboardPath(user.role)} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20">
                    Open {user.role} Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20">
                    Try 1-Click Demo Logins
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <Link href="/problems" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2 text-sm font-semibold border-white/10 hover:bg-white/[0.04] text-slate-200">
                  Browse Problem Bank
                </Button>
              </Link>
            </div>

            {/* Live Interactive Terminal Preview */}
            <div className="max-w-4xl mx-auto rounded-xl matte-card overflow-hidden text-left border border-white/[0.08] shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a0c12] border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 text-xs font-mono text-slate-300 font-semibold">
                    evaluation_benchmark.ts — Live Test Session
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunHeroBenchmark}
                    disabled={isRunningHeroTest}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-blue-300" />
                    {isRunningHeroTest ? "Executing Test..." : "Run Test"}
                  </button>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    V8 Runtime Active
                  </span>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="p-5 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto space-y-1 bg-[#090b10]">
                <p className="text-indigo-400">
                  <span className="text-blue-400">interface</span> CandidateAssessmentSubmission &#123;
                </p>
                <p className="pl-4 text-slate-400">
                  candidateId: <span className="text-emerald-300">&quot;cand_senior_fullstack_01&quot;</span>;
                </p>
                <p className="pl-4 text-slate-400">
                  assessment: <span className="text-emerald-300">&quot;Backend Systems & Concurrency Benchmark&quot;</span>;
                </p>
                <p className="pl-4 text-slate-400">
                  status: <span className="text-blue-400">&quot;SCORED_AND_VERIFIED&quot;</span>;
                </p>
                <p className="pl-4 text-slate-400">
                  score: <span className="text-amber-400">{heroTestOutput.score}.0</span> / 100.0; percentileRank: <span className="text-emerald-400">&quot;Top 3%&quot;</span>;
                </p>
                <p className="text-indigo-400">&#125;</p>
                <div className="pt-3 border-t border-white/[0.06] mt-3">
                  <p className="text-slate-500 text-xs">
                    // Automated Test Assertion Pipeline:
                  </p>
                  <p className="text-emerald-400 font-semibold text-xs sm:text-sm mt-1">
                    ✔ {heroTestOutput.tests}/{heroTestOutput.tests} test suites passed in {heroTestOutput.latency}ms (Peak Memory: {heroTestOutput.memory})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 2: ENTERPRISE TEAMS (SOCIAL PROOF) */}
        <section className="py-12 border-b border-white/[0.06] bg-[#090a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-6">
              Benchmarking Engineering Craftsmanship Across Leading Technology Organizations
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center opacity-60">
              <div className="font-mono text-sm font-bold text-slate-400 tracking-wider">STRIPE</div>
              <div className="font-mono text-sm font-bold text-slate-400 tracking-wider">CLOUDFLARE</div>
              <div className="font-mono text-sm font-bold text-slate-400 tracking-wider">DATADOG</div>
              <div className="font-mono text-sm font-bold text-slate-400 tracking-wider">LINEAR</div>
              <div className="font-mono text-sm font-bold text-slate-400 tracking-wider">HASHICORP</div>
              <div className="font-mono text-sm font-bold text-slate-400 tracking-wider">FIGMA</div>
            </div>
          </div>
        </section>

        {/* PORTION 3: THREE CORE ARCHITECTURAL PILLARS */}
        <section className="py-20 border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                Designed for Engineering Leaders
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Why Top Teams Abandon Uncalibrated Interviews
              </h2>
              <p className="text-slate-400 mt-3 text-sm">
                Whiteboard riddles measure memorization. AssessmentForces measures real software architecture and execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl matte-card matte-card-hover border border-white/[0.06] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Production-Grade Sandboxes</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Candidates code in realistic split-screen environments with syntax highlighting, language runtimes, test assertions, and memory diagnostics.
                </p>
              </div>

              <div className="p-6 rounded-xl matte-card matte-card-hover border border-white/[0.06] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Objective Automated Grading</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every submission is executed against multi-tier automated test suites, grading for edge cases, performance constraints, and architectural structure.
                </p>
              </div>

              <div className="p-6 rounded-xl matte-card matte-card-hover border border-white/[0.06] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">90% Less Interviewer Fatigue</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Stop burning senior engineering hours on basic screening loops. Receive comprehensive candidate scorecards and telemetry before scheduling on-sites.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 4: INTERACTIVE MULTI-LANGUAGE RUNTIME SHOWCASE */}
        <section className="py-20 border-b border-white/[0.06] bg-[#090a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Multi-Language Container Isolates
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  Test Candidates in Their Native Stacks
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Evaluate candidates using isolated execution runtimes with real-time feedback.
                </p>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10 self-start md:self-auto">
                {(
                  [
                    { id: "typescript", label: "TypeScript", tag: "TS", cls: "text-blue-400" },
                    { id: "python", label: "Python", tag: "PY", cls: "text-sky-400" },
                    { id: "go", label: "Go", tag: "GO", cls: "text-cyan-400" },
                    { id: "rust", label: "Rust", tag: "RS", cls: "text-orange-400" },
                    { id: "java", label: "Java", tag: "JV", cls: "text-amber-400" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveLang(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                      activeLang === item.id
                        ? "bg-slate-800 text-white border border-slate-700 shadow-xs ring-1 ring-blue-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${item.cls}`}>{item.tag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Code Editor Panel */}
              <div className="lg:col-span-2 rounded-xl matte-card border border-white/[0.08] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0c12] border-b border-white/[0.06] text-xs font-mono">
                  <span className="text-slate-300 font-bold">{sample.title}</span>
                  <span className="text-slate-500">{sample.runtime}</span>
                </div>
                <pre className="p-4 bg-[#090b10] text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed flex-1">
                  {sample.code}
                </pre>
              </div>

              {/* Telemetry Output Panel */}
              <div className="rounded-xl matte-card border border-white/[0.08] p-5 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Execution Telemetry & Benchmark
                  </h4>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-white/[0.06]">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Latency</span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">{sample.speed}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-white/[0.06]">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Memory</span>
                      <span className="text-lg font-bold text-blue-400 font-mono">{sample.memory}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Test Assertions</span>
                    <pre className="p-3 rounded-lg bg-[#07080b] border border-white/[0.06] text-[11px] font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                      {sample.testOutput}
                    </pre>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06]">
                  <Link href="/problems">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5 border-white/10 hover:bg-white/[0.04]">
                      Explore All 120+ Sandboxes <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 5: ROLE-BASED ARCHITECTURE WORKSPACES */}
        <section className="py-20 border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                Role-Based Access Control
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Tailored Workspaces for the Entire Hiring Lifecycle
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Each stakeholder has a dedicated, secure portal with fine-grained permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Role 1: Platform Admin */}
              <div className="p-6 rounded-xl matte-card matte-card-hover border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-purple-400 font-bold">PORTAL 01</span>
                    <Badge variant="purple" size="sm">System Owner</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white">Platform Administrator</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Full platform governance: inspect telemetry metrics, manage recruiter and candidate access states, adjust credit ledgers, and audit security events.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-white/[0.06]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400" /> System Metrics & Telemetry
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400" /> User Role Elevation & Governance
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400" /> Immutable Financial & Audit Ledger
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-white/[0.06]">
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-white/10 hover:bg-white/[0.04]">
                      Open Admin Console
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Role 2: Technical Recruiter */}
              <div className="p-6 rounded-xl matte-card matte-card-hover border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400 font-bold">PORTAL 02</span>
                    <Badge variant="info" size="sm">Hiring Team</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white">Technical Recruiter</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Author benchmark assessments using our 3-step wizard, dispatch invites, track applicant Kanban pipelines, grade candidate code rubrics, and manage billing.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-white/[0.06]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> 3-Step Assessment Creation Wizard
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Applicant Pipeline & Scorecard Reviews
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Stripe Credit Packages & Checkout
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-white/[0.06]">
                  <Link href="/recruiter">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-white/10 hover:bg-white/[0.04]">
                      Open Recruiter Portal
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Role 3: Software Candidate */}
              <div className="p-6 rounded-xl matte-card matte-card-hover border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-bold">PORTAL 03</span>
                    <Badge variant="success" size="sm">Candidate</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white">Developer Candidate</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Take assigned technical challenges in an isolated sandbox, execute live unit tests, view historical scorecards, and highlight verified skill badges.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-white/[0.06]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Timed Coding Runner with Auto-Save
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Detailed Test Result Breakdown
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Developer Profile & Language Badges
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-white/[0.06]">
                  <Link href="/candidate">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-white/10 hover:bg-white/[0.04]">
                      Open Candidate Workspace
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 6: 4-STEP HUMANOID HIRING WORKFLOW */}
        <section className="py-20 border-b border-white/[0.06] bg-[#090a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Operational Lifecycle
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                How AssessmentForces Operates
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                A seamless, transparent workflow connecting technical recruiters and engineering candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-xl matte-card border border-white/[0.06] space-y-2">
                <span className="text-xs font-mono text-blue-400 font-bold">STEP 01</span>
                <h4 className="text-base font-bold text-white">Assemble Benchmark</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select from 120+ vetted problems or author tailored challenges with custom test assertions and rubrics.
                </p>
              </div>

              <div className="p-5 rounded-xl matte-card border border-white/[0.06] space-y-2">
                <span className="text-xs font-mono text-blue-400 font-bold">STEP 02</span>
                <h4 className="text-base font-bold text-white">Dispatch Invitations</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send secure, time-bound invitation tokens with expiration windows and anti-cheat constraints.
                </p>
              </div>

              <div className="p-5 rounded-xl matte-card border border-white/[0.06] space-y-2">
                <span className="text-xs font-mono text-blue-400 font-bold">STEP 03</span>
                <h4 className="text-base font-bold text-white">Candidate Executes</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The engineer solves problems inside a timed sandbox with live compilation, syntax checks, and memory feedback.
                </p>
              </div>

              <div className="p-5 rounded-xl matte-card border border-white/[0.06] space-y-2">
                <span className="text-xs font-mono text-blue-400 font-bold">STEP 04</span>
                <h4 className="text-base font-bold text-white">Telemetry & Decision</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive automated rubric scorecards, code diffs, pass rates, and competency radar telemetry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 7: CHALLENGE TAXONOMY & PROBLEM BANK SHOWCASE */}
        <section className="py-20 border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  Curated Catalog
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                  Explore Sample Coding Benchmarks
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  120+ verified real-world assessments across algorithms, systems, frontend, and databases.
                </p>
              </div>
              <Link href="/problems">
                <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-white/10 hover:bg-white/[0.04]">
                  View Full Catalog ({SHOWCASE_PROBLEMS.length}+) <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {SHOWCASE_PROBLEMS.map((prob, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl matte-card matte-card-hover border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        {prob.category}
                      </span>
                      <span className="text-slate-600">•</span>
                      <Badge
                        variant={
                          prob.difficulty === "HARD"
                            ? "danger"
                            : prob.difficulty === "MEDIUM"
                            ? "warning"
                            : "success"
                        }
                        size="sm"
                      >
                        {prob.difficulty}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                      {prob.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {prob.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5 text-slate-500" /> {prob.passRate} pass rate
                    </span>
                    <span className="text-blue-400 font-semibold">
                      +{prob.points} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PORTION 8: CANDIDATE COMPETENCY RADAR TELEMETRY */}
        <section className="py-20 border-b border-white/[0.06] bg-[#090a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Multi-Dimensional Evaluation
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                  Comprehensive Candidate Competency Scoring
                </h2>
                <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                  Rather than a simple binary pass/fail score, AssessmentForces grades candidates across 5 critical engineering vectors to provide hiring teams with rich qualitative signals.
                </p>
                <div className="space-y-3 mt-6 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Algorithmic Complexity:</strong> Big-O time and space optimization under stress load.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Code Cleanliness:</strong> Structural naming, separation of concerns, and typing precision.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Edge Case Handling:</strong> Null safety, boundary values, and defensive exception handling.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Execution Speed:</strong> High throughput performance verified in isolated V8 sandboxes.</span>
                  </div>
                </div>
              </div>

              {/* Visual Telemetry Card */}
              <div className="p-6 rounded-xl matte-card border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-sm font-bold text-white">Alex Vance — Senior Fullstack Evaluation</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Backend Systems & Concurrency Benchmark</p>
                  </div>
                  <Badge variant="success" size="sm">94.8% Index</Badge>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Algorithmic Complexity</span>
                      <span className="text-blue-400">96/100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: "96%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Clean Architecture & Types</span>
                      <span className="text-emerald-400">92/100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Edge Case Defense</span>
                      <span className="text-purple-400">95/100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: "95%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Execution Concurrency</span>
                      <span className="text-amber-400">89/100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: "89%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Automated Test Coverage</span>
                      <span className="text-cyan-400">98/100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: "98%" }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] text-[11px] text-slate-500 flex justify-between">
                  <span>Confidence Rating: <strong className="text-emerald-400">99.2%</strong></span>
                  <span>Evaluator Consensus: <strong className="text-slate-300">Strong Hire</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 9: ACADEMIC INTEGRITY & ANTI-CHEAT STANDARDS */}
        <section className="py-20 border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                Integrity & Fairness
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Fair Assessments with Enterprise Tamper Prevention
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Ensure evaluation results reflect real individual capabilities without intrusive invasive surveillance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl matte-card border border-white/[0.06] space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-blue-400">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-white">Ephemeral Isolated Sandboxes</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every test run executes in a stateless, sandboxed container with strict compute, network, and execution limits.
                </p>
              </div>

              <div className="p-6 rounded-xl matte-card border border-white/[0.06] space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-white">Clipboard & Blur Telemetry</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Non-invasive event logging flags unnatural bulk paste actions and external tab focus changes for reviewer context.
                </p>
              </div>

              <div className="p-6 rounded-xl matte-card border border-white/[0.06] space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-white">Plagiarism Fingerprinting</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Abstract syntax tree (AST) structural diffing detects public repository and LLM regurgitation patterns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 10: PLATFORM SCALE & BENCHMARK METRICS */}
        <section className="py-16 border-b border-white/[0.06] bg-[#090a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 rounded-xl matte-card border border-white/[0.06]">
                <p className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">140,000+</p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-semibold font-mono">Test Suites Executed</p>
              </div>
              <div className="p-6 rounded-xl matte-card border border-white/[0.06]">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">94.4%</p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-semibold font-mono">Interviewer Time Saved</p>
              </div>
              <div className="p-6 rounded-xl matte-card border border-white/[0.06]">
                <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono">&lt;20ms</p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-semibold font-mono">Container Latency</p>
              </div>
              <div className="p-6 rounded-xl matte-card border border-white/[0.06]">
                <p className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">99.98%</p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-semibold font-mono">Evaluation Uptime SLA</p>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 11: ENGINEERING TESTIMONIALS & CASE STUDIES */}
        <section className="py-20 border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Trusted by Developers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                What Engineering Teams Are Saying
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl matte-card border border-white/[0.06] flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &quot;Our engineering team cut candidate screening loops from 5 stages down to 2 while tripling signal fidelity. Candidates actually enjoy taking these practical challenges.&quot;
                </p>
                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="font-bold text-sm text-white">David K.</div>
                  <div className="text-[11px] text-slate-400 font-mono">VP of Engineering, ScaleCloud</div>
                </div>
              </div>

              <div className="p-6 rounded-xl matte-card border border-white/[0.06] flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &quot;The automated rubrics and live test case pass rates make review calibration completely objective. We no longer argue over subjective interview opinions.&quot;
                </p>
                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="font-bold text-sm text-white">Elena Rostova</div>
                  <div className="text-[11px] text-slate-400 font-mono">Lead Technical Recruiter, FinTech Hub</div>
                </div>
              </div>

              <div className="p-6 rounded-xl matte-card border border-white/[0.06] flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &quot;As a candidate, having a clean editor with instant unit test feedback felt just like my daily workflow. I received my scorecard within hours of submitting.&quot;
                </p>
                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="font-bold text-sm text-white">Marcus Brody</div>
                  <div className="text-[11px] text-slate-400 font-mono">Senior Fullstack Engineer Candidate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 12: TRANSPARENT CREDIT PACKAGES PREVIEW */}
        <section className="py-20 border-b border-white/[0.06] bg-[#090a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Flexible Pay-As-You-Grow Assessment Credits
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                No expensive annual lock-ins. Purchase credit packages on demand with Stripe test integration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-xl matte-card border border-white/[0.06] flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Starter Package</h3>
                  <div className="text-2xl font-extrabold text-white font-mono mt-2">500 BDT</div>
                  <p className="text-xs text-slate-400 mt-1">Ideal for boutique startups screening 5-10 developers.</p>
                  <ul className="space-y-2 text-xs text-slate-300 mt-4 pt-4 border-t border-white/[0.06]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> 10 Assessment Credits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Full Problem Bank Access
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Basic Scorecards
                    </li>
                  </ul>
                </div>
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-white/10 hover:bg-white/[0.04]">
                    Select Starter
                  </Button>
                </Link>
              </div>

              <div className="p-6 rounded-xl matte-card border border-blue-500/40 relative flex flex-col justify-between space-y-4 shadow-xl shadow-blue-500/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Growth Team</h3>
                  <div className="text-2xl font-extrabold text-white font-mono mt-2">1,500 BDT</div>
                  <p className="text-xs text-slate-400 mt-1">For expanding engineering teams with multiple pipelines.</p>
                  <ul className="space-y-2 text-xs text-slate-300 mt-4 pt-4 border-t border-white/[0.06]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> 35 Assessment Credits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Competency Radar Telemetry
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Custom Problem Authoring
                    </li>
                  </ul>
                </div>
                <Link href="/pricing">
                  <Button size="sm" className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white">
                    Select Growth
                  </Button>
                </Link>
              </div>

              <div className="p-6 rounded-xl matte-card border border-white/[0.06] flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Enterprise Scale</h3>
                  <div className="text-2xl font-extrabold text-white font-mono mt-2">4,500 BDT</div>
                  <p className="text-xs text-slate-400 mt-1">High-volume tech companies with dedicated hiring teams.</p>
                  <ul className="space-y-2 text-xs text-slate-300 mt-4 pt-4 border-t border-white/[0.06]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> 120 Assessment Credits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Priority Sandbox Compute
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Dedicated Account Manager
                    </li>
                  </ul>
                </div>
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-white/10 hover:bg-white/[0.04]">
                    Select Enterprise
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* PORTION 13: FINAL HUMANOID CONVERSION CALLOUT */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Stop Wasting Senior Engineering Hours on Guesswork Interviews.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8">
              Experience the full Developer Assessment Platform with our 1-Click demo accounts across Platform Admin, Technical Recruiter, and Developer Candidate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20">
                  Launch 1-Click Demo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2 text-sm font-semibold border-white/10 hover:bg-white/[0.04] text-slate-200">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
