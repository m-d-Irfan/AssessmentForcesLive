import React from "react";
import Link from "next/link";

interface LogoMarkProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = {
  xs: { box: 24, text: "text-xs" },
  sm: { box: 30, text: "text-sm" },
  md: { box: 38, text: "text-base sm:text-lg" },
  lg: { box: 46, text: "text-lg sm:text-xl" },
  xl: { box: 58, text: "text-xl sm:text-2xl" },
};

export function LogoMark({ size = "md", className = "" }: LogoMarkProps) {
  const s = SIZES[size] || SIZES.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: s.box, height: s.box }}
      aria-hidden="true"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-blue-500/25 blur-md rounded-xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* High-fidelity Vector Icon using static verified SVG asset */}
      <img
        src="/icon.svg"
        alt="AssessmentForces Logo"
        width={s.box}
        height={s.box}
        className="w-full h-full object-contain drop-shadow-md select-none shrink-0"
        loading="eager"
      />
    </div>
  );
}

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  href,
  className = "",
}: LogoProps) {
  const s = SIZES[size] || SIZES.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span
          className={`font-black tracking-tight text-white transition-colors group-hover:text-slate-100 ${s.text}`}
        >
          Assessment
          <span className="text-blue-500">Forces</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}
