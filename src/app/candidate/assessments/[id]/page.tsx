"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Save,
  Send,
  Terminal,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { LogoMark } from "@/components/ui/logo";

interface TestProblem {
  id: string;
  order: number;
  type: "SINGLE_CHOICE" | "CODE";
  title: string;
  prompt: string;
  options?: { label: string; text: string }[];
  initialCode?: string;
  points: number;
}

const TEST_QUESTIONS: TestProblem[] = [
  {
    id: "prob_1",
    order: 1,
    type: "SINGLE_CHOICE",
    title: "TypeScript Type Safety & Structural Shape Evaluation",
    prompt:
      "Which TypeScript compiler capability guarantees that object property assignments adhere strictly to interface shapes during development before code execution?",
    options: [
      { label: "A", text: "Static type checking & compile-time verification" },
      { label: "B", text: "V8 Just-In-Time (JIT) bytecode optimization" },
      { label: "C", text: "Runtime garbage collection mark-and-sweep" },
      { label: "D", text: "HTTP Reverse Proxy Caching headers" },
    ],
    points: 10,
  },
  {
    id: "prob_2",
    order: 2,
    type: "CODE",
    title: "Asynchronous Concurrency & In-Memory Cache Helper",
    prompt:
      "Write a TypeScript/JavaScript function `createCache(ttlMs)` that returns an object with `set(key, val)` and `get(key)`. If the key is older than `ttlMs`, `get(key)` must return `null`.",
    initialCode: `// Write your solution below
function createCache(ttlMs) {
  const store = new Map();
  
  return {
    set(key, val) {
      store.set(key, { val, expiry: Date.now() + ttlMs });
    },
    get(key) {
      const item = store.get(key);
      if (!item) return null;
      if (Date.now() > item.expiry) {
        store.delete(key);
        return null;
      }
      return item.val;
    }
  };
}`,
    points: 15,
  },
];

export default function AssessmentRunnerPage() {
  const router = useRouter();
  const params = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("A");
  const [codeAnswer, setCodeAnswer] = useState(TEST_QUESTIONS[1].initialCode || "");
  const [timeLeft, setTimeLeft] = useState(1795); // ~29 mins 55 secs
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSavedTime, setAutoSavedTime] = useState("Just now");
  const [selectedLanguage, setSelectedLanguage] = useState<"TypeScript" | "JavaScript" | "Python">("TypeScript");

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleRunTests = () => {
    toast.loading("Compiling & running sandbox test cases...", { id: "run-test" });
    setTimeout(() => {
      toast.dismiss("run-test");
      const latencyMs = Math.floor(Math.random() * 25) + 18;
      const memMb = (Math.random() * 3 + 12).toFixed(1);
      setTestOutput(
        `[Environment: ${selectedLanguage} v5 Runtime]\n✔ Test Case 1 Passed: set('item', 42) -> get('item') === 42\n✔ Test Case 2 Passed: TTL Expiry verification simulated in 12ms\n✔ Test Case 3 Passed: Non-existent key lookup returns null\n\nExecution Time: ${latencyMs}ms | Peak Memory: ${memMb}MB\nAll 3 automated test assertions PASSED (100% Score).`
      );
      toast.success("All test cases passed successfully!");
    }, 800);
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    toast.loading("Submitting assessment answers to evaluation pipeline...", {
      id: "submit-test",
    });

    try {
      await new Promise((r) => setTimeout(r, 1200));
      toast.dismiss("submit-test");
      toast.success("Assessment submitted successfully! Scorecard generated.");
      router.push("/candidate/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProb = TEST_QUESTIONS[currentIndex];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col">
      {/* Test Runner Sticky Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3 bg-slate-950/90 border-b border-slate-800 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/candidate/assessments" className="flex items-center gap-2 group">
            <LogoMark size="sm" />
            <span className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
              Assessment<span className="text-blue-500">Forces</span>
            </span>
          </Link>
          <span className="text-slate-600">•</span>
          <div>
            <h1 className="text-xs sm:text-sm font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
              Backend Developer Fundamentals
            </h1>
            <span className="text-[10px] text-slate-400 font-mono">
              Live Test Attempt • ID: {params.id || "seed_backend"}
            </span>
          </div>
        </div>

        {/* Live Countdown Timer & Submit */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 font-mono text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span
              className={`font-bold ${
                timeLeft < 300 ? "text-rose-400" : "text-amber-300"
              }`}
            >
              {formatTimer(timeLeft)}
            </span>
          </div>

          <Button
            size="sm"
            variant="glow"
            isLoading={isSubmitting}
            onClick={handleSubmitTest}
            className="text-xs gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit Assessment
          </Button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left Side: Question Details & Navigation */}
        <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-slate-800/80 overflow-y-auto space-y-6">
          {/* Question Index Pills */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {TEST_QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                    currentIndex === idx
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {q.order}
                </button>
              ))}
            </div>

            <Badge variant="info" size="sm">
              Question {currentIndex + 1} of {TEST_QUESTIONS.length} ({currentProb.points} pts)
            </Badge>
          </div>

          {/* Question Header & Prompt */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {currentProb.title}
            </h2>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-sm text-slate-300 leading-relaxed font-sans">
              {currentProb.prompt}
            </div>
          </div>

          {/* Option Selector for Multiple/Single Choice */}
          {currentProb.type === "SINGLE_CHOICE" && currentProb.options && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Select Your Answer:
              </span>
              {currentProb.options.map((opt) => {
                const isSelected = selectedOption === opt.label;
                return (
                  <div
                    key={opt.label}
                    onClick={() => setSelectedOption(opt.label)}
                    className={`p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-600/10 text-white shadow-lg shadow-blue-500/10"
                        : "border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-slate-700 bg-slate-950 text-slate-400"
                      }`}
                    >
                      {opt.label}
                    </div>
                    <span className="text-xs sm:text-sm">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Auto-Save Status */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Responses automatically synced
            </span>
            <span>Saved: {autoSavedTime}</span>
          </div>
        </div>

        {/* Right Side: Code Editor or Execution Workspace */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#0b101b] min-h-[400px]">
          {currentProb.type === "CODE" ? (
            <div className="flex-1 flex flex-col">
              {/* Editor Toolbar */}
              <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-0.5 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    <option value="TypeScript">TypeScript (Node v20)</option>
                    <option value="JavaScript">JavaScript (ES2024)</option>
                    <option value="Python">Python (v3.12)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRunTests}
                    className="h-7 text-xs gap-1 border-slate-700"
                  >
                    <Play className="w-3 h-3 text-emerald-400" /> Run Tests
                  </Button>
                </div>
              </div>

              {/* Code Textarea Area */}
              <textarea
                value={codeAnswer}
                onChange={(e) => setCodeAnswer(e.target.value)}
                className="flex-1 w-full p-4 bg-transparent font-mono text-xs sm:text-sm text-slate-200 resize-none focus:outline-none leading-relaxed border-none selection:bg-blue-600/40"
                spellCheck={false}
              />

              {/* Test Runner Output Terminal Console */}
              {testOutput && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 font-mono text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Execution Output Console:
                  </div>
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {testOutput}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Multiple Choice Response</h3>
              <p className="text-xs max-w-sm">
                Your selected answer <strong className="text-blue-400">({selectedOption})</strong> is securely saved. Proceed to the next problem when ready.
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCurrentIndex(1)}
                className="gap-1.5 text-xs mt-2"
              >
                Proceed to Coding Challenge <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
