import React from "react";
import { Skeleton, CardGridSkeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#090d16] p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>
      <CardGridSkeleton count={3} />
    </div>
  );
}
