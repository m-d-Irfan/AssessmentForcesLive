import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-md space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 mx-auto">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" size="sm" className="font-mono">
              HTTP 404 — PAGE NOT FOUND
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Route Does Not Exist
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The page, assessment token, or dashboard resource you requested could not be located in our routing table.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/">
              <Button variant="primary" size="sm" className="gap-2 text-xs">
                <Home className="w-4 h-4" /> Return to Homepage
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs">
                Open Demo Portal
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
