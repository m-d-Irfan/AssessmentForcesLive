import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AssessmentForces | Enterprise Developer Assessment & Technical Hiring Platform",
  description:
    "Evaluate engineering talent with precision. Automated coding assessments, multi-role recruitment pipelines, real-time analytics, and seamless hiring evaluation.",
  keywords: [
    "developer assessment",
    "technical interview",
    "coding test",
    "recruitment software",
    "developer hiring platform",
  ],
  authors: [{ name: "AssessmentForces Team" }],
  openGraph: {
    title: "AssessmentForces | Enterprise Developer Assessment Platform",
    description: "Benchmark developer capabilities with high-fidelity testing.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "192x192" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark h-full ${sansFont.variable} ${monoFont.variable}`}>
      <body className="min-h-full flex flex-col bg-[#07080c] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" theme="dark" closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
