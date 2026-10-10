import React from "react";
import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function RecruiterLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-60 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      <TableSkeleton rows={4} cols={5} />
    </div>
  );
}
