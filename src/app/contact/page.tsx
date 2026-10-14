"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone, MapPin, Send, HelpCircle } from "lucide-react";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  category: z.enum(["recruitment", "candidate", "enterprise", "technical"]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(15, "Message must be at least 15 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      category: "recruitment",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate inquiry submission
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Thank you! Your inquiry has been dispatched to our engineering support team.");
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="info" className="mb-3">
            Get in Touch
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Connect with AssessmentForces Support
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg">
            Have questions about custom algorithmic problem authoring, enterprise credit bundles, or recruiter integration? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details */}
          <div className="space-y-6">
            <Card hoverEffect className="space-y-4 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Direct Email Support</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Support: <span className="text-slate-900 dark:text-slate-200 font-medium">support@devassess.local</span>
                <br />
                Security: <span className="text-slate-900 dark:text-slate-200 font-medium">security@devassess.local</span>
              </p>
            </Card>

            <Card hoverEffect className="space-y-4 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Technical HQ</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Level 4, Innovation Tech Tower
                <br />
                Dhaka 1212, Bangladesh
              </p>
            </Card>

            <Card hoverEffect className="space-y-4 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Interactive Help</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Review our comprehensive OpenAPI documentation and developer API explorer available at <span className="text-blue-600 dark:text-blue-400 font-mono font-medium">/api-docs</span>.
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send an Inquiry</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                Fill out the validated form below and our staff will respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("fullName")}
                      placeholder="e.g. Irfan Ahmed"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    {errors.fullName && (
                      <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    {errors.email && (
                      <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      {...register("category")}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="recruitment">Recruiter / Employer Questions</option>
                      <option value="candidate">Candidate Assessment Support</option>
                      <option value="enterprise">Enterprise Custom Volume</option>
                      <option value="technical">Bug Report / API Integrations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      {...register("subject")}
                      placeholder="Assessment question or billing issue"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    {errors.subject && (
                      <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    rows={5}
                    {...register("message")}
                    placeholder="Describe your inquiry or technical question in detail..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  {errors.message && (
                    <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                <Button type="submit" variant="glow" isLoading={isSubmitting} className="w-full sm:w-auto gap-2">
                  <Send className="w-4 h-4" />
                  Dispatch Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
