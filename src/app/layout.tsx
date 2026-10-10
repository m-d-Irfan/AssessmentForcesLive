import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "DevAssess | Enterprise Developer Assessment & Technical Hiring Platform",
  description:
    "Evaluate engineering talent with precision. Automated coding assessments, multi-role recruitment pipelines, real-time analytics, and seamless hiring evaluation.",
  keywords: [
    "developer assessment",
    "technical interview",
    "coding test",
    "recruitment software",
    "developer hiring platform",
  ],
  authors: [{ name: "DevAssess Team" }],
  openGraph: {
    title: "DevAssess | Enterprise Developer Assessment Platform",
    description: "Benchmark developer capabilities with high-fidelity testing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" theme="dark" closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
