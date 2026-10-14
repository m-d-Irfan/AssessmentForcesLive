"use client";

import React from "react";

interface CompetencySkill {
  name: string;
  score: number; // 0 - 100
  color: string;
}

interface CandidateRadarProps {
  candidateName?: string;
  skills?: CompetencySkill[];
}

const DEFAULT_SKILLS: CompetencySkill[] = [
  { name: "Algorithmic Complexity", score: 92, color: "bg-blue-500" },
  { name: "Code Architecture & Cleanliness", score: 88, color: "bg-emerald-500" },
  { name: "Edge Case Handling", score: 95, color: "bg-purple-500" },
  { name: "Execution Speed & Concurrency", score: 84, color: "bg-amber-500" },
  { name: "Automated Unit Test Coverage", score: 90, color: "bg-cyan-500" },
];

export function CandidateRadar({
  candidateName = "Candidate Profile",
  skills = DEFAULT_SKILLS,
}: CandidateRadarProps) {
  const averageScore = Math.round(
    skills.reduce((acc, curr) => acc + curr.score, 0) / skills.length
  );

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Competency Breakdown</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Technical index assessment for {candidateName}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{averageScore}%</span>
          <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">Overall Rating</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{skill.name}</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold">{skill.score}/100</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-200/60 dark:border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${skill.color}`}
                style={{ width: `${skill.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Evaluation Confidence: <strong className="text-emerald-600 dark:text-emerald-400">99.4%</strong></span>
        <span>Standard Deviation: <strong className="text-slate-700 dark:text-slate-300">±2.1%</strong></span>
      </div>
    </div>
  );
}
