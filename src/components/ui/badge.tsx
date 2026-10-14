import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Badge({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60",
    success: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25",
    warning: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25",
    danger: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/25",
    info: "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/25",
    purple: "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/25",
    outline: "bg-transparent text-slate-600 border-slate-300 dark:text-slate-400 dark:border-slate-700",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-full border transition-colors",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  let variant: BadgeProps["variant"] = "default";

  if (["ACTIVE", "PUBLISHED", "PASSED", "COMPLETED", "SCORED", "RESULT_RELEASED"].includes(normalized)) {
    variant = "success";
  } else if (["PENDING", "IN_PROGRESS", "EVALUATING", "STARTED"].includes(normalized)) {
    variant = "warning";
  } else if (["FAILED", "REJECTED", "REVOKED", "EXPIRED", "SUSPENDED"].includes(normalized)) {
    variant = "danger";
  } else if (["DRAFT"].includes(normalized)) {
    variant = "outline";
  } else {
    variant = "info";
  }

  const label = normalized.replace(/_/g, " ");

  return <Badge variant={variant}>{label}</Badge>;
}
