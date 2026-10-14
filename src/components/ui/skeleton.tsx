import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx("animate-pulse rounded-md bg-slate-200 dark:bg-slate-800/80", className)
      )}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center py-2">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={c}
                className={clsx(
                  "h-5",
                  c === 0 ? "w-1/3" : "flex-1"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm dark:shadow-none"
        >
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-14 w-full" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
