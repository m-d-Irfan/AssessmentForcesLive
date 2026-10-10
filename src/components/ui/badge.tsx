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
    default: "bg-slate-800 text-slate-300 border-slate-700/60",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    info: "bg-sky-500/10 text-sky-400 border-sky-500/25",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/25",
    outline: "bg-transparent text-slate-400 border-slate-700",
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
