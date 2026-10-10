"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, UserRole, AuthResponse } from "@/types";
import { api, ApiError } from "@/lib/api-client";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
} from "@/lib/auth-storage";

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  getDashboardPath: (role: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string; name: string }> = {
  ADMIN: {
    email: "admin@gmail.com",
    password: "admin1234",
    name: "Platform Administrator",
  },
  RECRUITER: {
    email: "recruiter@devassess.local",
    password: "DemoUser123!",
    name: "Tech Recruiter Lead",
  },
  CANDIDATE: {
    email: "candidate@devassess.local",
    password: "DemoUser123!",
    name: "Full-Stack Candidate",
  },
};

export function getRoleDashboard(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "RECRUITER":
      return "/recruiter";
    case "CANDIDATE":
      return "/candidate";
    default:
      return "/dashboard";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Hydrate state from client storage on mount
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const { user: loggedInUser, accessToken } = response;
      setStoredAuth(accessToken, loggedInUser);
      setUser(loggedInUser);
      setToken(accessToken);

      toast.success(`Welcome back, ${loggedInUser.displayName}!`);
      return loggedInUser;
    } catch (err: any) {
      const message = err instanceof ApiError ? err.message : "Failed to login";
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (targetRole: UserRole) => {
    const creds = DEMO_CREDENTIALS[targetRole];
    toast.loading(`Authenticating as demo ${targetRole.toLowerCase()}...`, {
      id: "demo-login",
    });

    try {
      const loggedUser = await login(creds.email, creds.password);
      toast.dismiss("demo-login");
      const targetDashboard = getRoleDashboard(loggedUser.role);
      router.push(targetDashboard);
    } catch (err) {
      toast.dismiss("demo-login");
      toast.error(`Demo login failed for ${targetRole}. Please check backend service.`);
    }
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
    setToken(null);
    toast.info("Logged out successfully");
    router.push("/login");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (token) {
      setStoredAuth(token, updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role ?? null,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        demoLogin,
        logout,
        updateUser,
        getDashboardPath: getRoleDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
