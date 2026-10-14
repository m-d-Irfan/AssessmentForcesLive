import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hoverEffect?: boolean;
}

export function Card({
  className,
  children,
  glow = false,
  hoverEffect = false,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md p-6 text-slate-800 dark:text-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200",
          glow && "shadow-xl shadow-blue-500/10 border-blue-500/30 dark:shadow-blue-500/5 dark:border-blue-500/20",
          hoverEffect && "hover:border-blue-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx("flex flex-col space-y-1.5 mb-4", className))} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge(clsx("text-lg font-bold tracking-tight text-slate-900 dark:text-white", className))}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={twMerge(clsx("text-sm text-slate-600 dark:text-slate-400 leading-relaxed", className))}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge(clsx("", className))} {...props}>{children}</div>;
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx("flex items-center pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4", className))}
      {...props}
    >
      {children}
    </div>
  );
}
