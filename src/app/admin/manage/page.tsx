"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api-client";
import { User, UserRole } from "@/types";
import {
  Users,
  Search,
  Shield,
  Briefcase,
  Terminal,
  UserCheck,
  UserX,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_USERS: User[] = [
  {
    id: "cmv2fb9c30000uhr8gb2owgrs",
    email: "admin@gmail.com",
    displayName: "Platform Administrator",
    avatarUrl: null,
    role: "ADMIN",
    status: "ACTIVE",
    emailVerifiedAt: "2026-10-10T13:21:53.867Z",
    createdAt: "2026-10-10T13:21:54.389Z",
  },
  {
    id: "seed_recruiter",
    email: "recruiter@devassess.local",
    displayName: "Demo Recruiter",
    avatarUrl: null,
    role: "RECRUITER",
    status: "ACTIVE",
    emailVerifiedAt: "2026-10-10T13:24:00.000Z",
    createdAt: "2026-10-10T13:24:00.000Z",
  },
  {
    id: "seed_candidate",
    email: "candidate@devassess.local",
    displayName: "Demo Candidate",
    avatarUrl: null,
    role: "CANDIDATE",
    status: "ACTIVE",
    emailVerifiedAt: "2026-10-10T13:24:00.000Z",
    createdAt: "2026-10-10T13:24:00.000Z",
  },
  {
    id: "usr_sarah_lead",
    email: "sarah.dev@techcorp.io",
    displayName: "Sarah Chen",
    avatarUrl: null,
    role: "RECRUITER",
    status: "ACTIVE",
    emailVerifiedAt: "2026-10-08T09:12:00.000Z",
    createdAt: "2026-10-08T09:12:00.000Z",
  },
  {
    id: "usr_james_fullstack",
    email: "james.k@gmail.com",
    displayName: "James K.",
    avatarUrl: null,
    role: "CANDIDATE",
    status: "SUSPENDED",
    emailVerifiedAt: null,
    createdAt: "2026-10-07T11:45:00.000Z",
  },
];

function ManageUsersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const roleFilter = searchParams.get("role") || "ALL";
  const statusFilter = searchParams.get("status") || "ALL";

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const res = await api.get<any>("/admin/users").catch(() => null);
        if (Array.isArray(res) && res.length > 0) {
          setUsers(res);
        } else if (res?.items && Array.isArray(res.items)) {
          setUsers(res.items);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: newStatus }).catch(() => null);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      toast.success(
        `User ${user.displayName} is now ${newStatus.toLowerCase()}`
      );
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      !query ||
      u.displayName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.id.toLowerCase().includes(query.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

    return matchesQuery && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={query}
            onChange={(e) => updateFilters("q", e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => updateFilters("role", e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Platform Admin</option>
            <option value="RECRUITER">Technical Recruiter</option>
            <option value="CANDIDATE">Candidate</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => updateFilters("status", e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
          </select>

          {(query || roleFilter !== "ALL" || statusFilter !== "ALL") && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push(pathname)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Users Matched"
          description="Try modifying your keyword search or remove role filters."
          actionLabel="Clear Filters"
          onAction={() => router.push(pathname)}
        />
      ) : (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">User Identity</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Access Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUsers.map((item) => {
                  const roleBadge =
                    item.role === "ADMIN"
                      ? "purple"
                      : item.role === "RECRUITER"
                      ? "info"
                      : "success";

                  return (
                    <tr key={item.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">
                          {item.displayName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.email}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          ID: {item.id}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={roleBadge} size="sm">
                          {item.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {item.role === "ADMIN" ? (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Protected Superuser
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant={item.status === "ACTIVE" ? "danger" : "outline"}
                            onClick={() => handleToggleStatus(item)}
                            className="text-xs"
                          >
                            {item.status === "ACTIVE" ? (
                              <span className="flex items-center gap-1">
                                <UserX className="w-3.5 h-3.5" /> Suspend
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5" /> Activate
                              </span>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminManagePage() {
  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            User & Company Resource Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, filter, and modify candidate and recruiter privileges across the platform.
          </p>
        </div>

        <Suspense fallback={<TableSkeleton rows={5} cols={5} />}>
          <ManageUsersContent />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
