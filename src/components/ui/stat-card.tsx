import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: "blue" | "indigo" | "emerald" | "amber" | "purple";
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "blue",
}: StatCardProps) {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <Card hoverEffect className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {description && <span>{description}</span>}
          {trend && (
            <span
              className={`font-semibold font-mono ${
                trend.isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
