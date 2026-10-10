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
    <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-lg font-semibold text-white">Competency Breakdown</h3>
          <p className="text-xs text-slate-400">Technical index assessment for {candidateName}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-blue-400">{averageScore}%</span>
          <span className="text-[10px] tracking-wider uppercase text-slate-400">Overall Rating</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">{skill.name}</span>
              <span className="text-white font-mono">{skill.score}/100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${skill.color}`}
                style={{ width: `${skill.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span>Evaluation Confidence: <strong className="text-emerald-400">99.4%</strong></span>
        <span>Standard Deviation: <strong className="text-slate-300">±2.1%</strong></span>
      </div>
    </div>
  );
}
