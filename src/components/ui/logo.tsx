import React from "react";
import Link from "next/link";

interface LogoMarkProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = {
  xs: { box: 22, radius: 6, stroke: 2.2, center: 11 },
  sm: { box: 28, radius: 8, stroke: 2.5, center: 14 },
  md: { box: 36, radius: 10, stroke: 3, center: 18 },
  lg: { box: 44, radius: 12, stroke: 3.5, center: 22 },
  xl: { box: 56, radius: 16, stroke: 4, center: 28 },
};

export function LogoMark({ size = "md", className = "" }: LogoMarkProps) {
  const s = SIZES[size] || SIZES.md;
  const idPrefix = `af-logo-${size}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: s.box, height: s.box }}
      aria-hidden="true"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-blue-500/25 blur-md rounded-xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

      <svg
        width={s.box}
        height={s.box}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id={`${idPrefix}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#090d16" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-border`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-left`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-right`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-slash`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <filter id={`${idPrefix}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Squircle Container */}
        <rect
          x="2.5"
          y="2.5"
          width="59"
          height="59"
          rx="16"
          fill={`url(#${idPrefix}-bg)`}
          stroke={`url(#${idPrefix}-border)`}
          strokeWidth="2.2"
        />

        {/* Left Chevron < (Code Symbol) */}
        <path
          d="M24 20L13 32L24 44"
          stroke={`url(#${idPrefix}-left)`}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Chevron > (Code Symbol) */}
        <path
          d="M40 20L51 32L40 44"
          stroke={`url(#${idPrefix}-right)`}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic Force Energy Vector / Diagonal Slash */}
        <path
          d="M36 17L28 47"
          stroke={`url(#${idPrefix}-slash)`}
          strokeWidth="3.6"
          strokeLinecap="round"
          filter={`url(#${idPrefix}-glow)`}
        />

        {/* Center Precision Assessment Core */}
        <circle cx="32" cy="32" r="2.8" fill="#ffffff" />
      </svg>
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
  const content = (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span
          className={`font-black tracking-tight text-white transition-colors group-hover:text-slate-100 ${
            size === "xs"
              ? "text-xs"
              : size === "sm"
              ? "text-sm"
              : size === "md"
              ? "text-lg"
              : size === "lg"
              ? "text-xl"
              : "text-2xl"
          }`}
        >
          Assessment
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Forces
          </span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
