"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global boundary caught runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090d16] text-slate-100">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="danger" size="sm" className="font-mono">
            RUNTIME EXCEPTION CAUGHT
          </Badge>
          <h2 className="text-2xl font-extrabold text-white">Something went wrong</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {error.message || "An unexpected application state occurred. The request has been safely intercepted."}
          </p>
          {error.digest && (
            <p className="text-[10px] text-slate-500 font-mono">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            className="gap-2 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Request
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
