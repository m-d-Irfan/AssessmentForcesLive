import React from "react";
import { Skeleton, CardGridSkeleton } from "@/components/ui/skeleton";

export default function CandidateLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      <CardGridSkeleton count={2} />
    </div>
  );
}
