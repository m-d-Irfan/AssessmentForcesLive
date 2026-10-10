"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuditLog } from "@/types";
import {
  FileText,
  ShieldAlert,
  Coins,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_LOGS: AuditLog[] = [
  {
    id: "log_1",
    actorId: "cmv2fb9c30000uhr8gb2owgrs",
    action: "USER_AUTHENTICATION_SUCCESS",
    entityType: "AUTH_SESSION",
    entityId: "cmv2fb9c30000uhr8gb2owgrs",
    ipAddress: "127.0.0.1",
    createdAt: "2026-10-10T13:21:54.000Z",
    actor: {
      displayName: "Platform Administrator",
      email: "admin@gmail.com",
      role: "ADMIN",
    },
  },
  {
    id: "log_2",
    actorId: "seed_recruiter",
    action: "CREDIT_PACKAGE_PURCHASE_INTENT",
    entityType: "PAYMENT",
    entityId: "pay_starter_01",
    ipAddress: "192.168.0.104",
    createdAt: "2026-10-10T12:45:10.000Z",
    actor: {
      displayName: "Demo Recruiter",
      email: "recruiter@devassess.local",
      role: "RECRUITER",
    },
  },
  {
    id: "log_3",
    actorId: "seed_candidate",
    action: "ASSESSMENT_ATTEMPT_SUBMITTED",
    entityType: "ATTEMPT",
    entityId: "att_ts_benchmark",
    ipAddress: "192.168.0.188",
    createdAt: "2026-10-10T11:30:25.000Z",
    actor: {
      displayName: "Demo Candidate",
      email: "candidate@devassess.local",
      role: "CANDIDATE",
    },
  },
  {
    id: "log_4",
    actorId: "cmv2fb9c30000uhr8gb2owgrs",
    action: "SYSTEM_SEEDED_DATA",
    entityType: "PRISMA_DATABASE",
    entityId: "seed_demo_technologies",
    ipAddress: "localhost",
    createdAt: "2026-10-10T09:15:00.000Z",
    actor: {
      displayName: "Platform Administrator",
      email: "admin@gmail.com",
      role: "ADMIN",
    },
  },
];

export default function AdminReportsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [companyId, setCompanyId] = useState("seed_company");
  const [credits, setCredits] = useState("10");
  const [reason, setReason] = useState("Grant promotional invitation credits");
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleAdjustCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdjusting(true);
    try {
      // Simulate credit adjustment ledger update
      await new Promise((r) => setTimeout(r, 600));

      const newLog: AuditLog = {
        id: `log_${Date.now()}`,
        actorId: "cmv2fb9c30000uhr8gb2owgrs",
        action: "ADMIN_CREDIT_ADJUSTMENT",
        entityType: "CREDIT_LEDGER",
        entityId: companyId,
        ipAddress: "127.0.0.1",
        createdAt: new Date().toISOString(),
        actor: {
          displayName: "Platform Administrator",
          email: "admin@gmail.com",
          role: "ADMIN",
        },
      };

      setLogs([newLog, ...logs]);
      toast.success(
        `Successfully adjusted ${credits} credits for company ${companyId}`
      );
      setCredits("10");
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Security Audit Trail & Credit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tamper-evident logs of authentication, assessment events, and manual recruiter credit balance adjustments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credit Ledger Adjustment Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-slate-800 bg-slate-900/60 sticky top-24">
              <div className="flex items-center gap-2 text-indigo-400 mb-4">
                <Coins className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Adjust Credits</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Manually grant or deduct recruiter candidate invitation credits. Recorded to `credit_ledger` with administrator audit ID.
              </p>

              <form onSubmit={handleAdjustCredits} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Company
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="seed_company">Demo Technologies (seed_company)</option>
                    <option value="comp_techcorp">TechCorp Engineering (comp_techcorp)</option>
                    <option value="comp_fintech">Fintech Labs Global (comp_fintech)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Credits to Add / Deduct
                  </label>
                  <input
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Adjustment Justification
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isAdjusting}
                  className="w-full text-xs font-semibold"
                >
                  Post Ledger Adjustment
                </Button>
              </form>
            </Card>
          </div>

          {/* Audit Logs List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                Recent System Audit Events ({logs.length})
              </h2>
              <Badge variant="purple" size="sm">
                Tamper Logged
              </Badge>
            </div>

            <div className="space-y-3">
              {logs.map((log) => (
                <Card
                  key={log.id}
                  hoverEffect
                  className="p-4 border-slate-800/80 bg-slate-900/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">
                          {log.action}
                        </span>
                        <Badge variant="outline" size="sm">
                          {log.entityType}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300">
                        Actor:{" "}
                        <span className="font-semibold text-white">
                          {log.actor?.displayName}
                        </span>{" "}
                        ({log.actor?.email})
                      </p>
                    </div>

                    <div className="text-right text-[10px] text-slate-500 font-mono shrink-0">
                      <div>{new Date(log.createdAt).toLocaleTimeString()}</div>
                      <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Target ID: {log.entityId}</span>
                    <span>IP: {log.ipAddress || "internal"}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
