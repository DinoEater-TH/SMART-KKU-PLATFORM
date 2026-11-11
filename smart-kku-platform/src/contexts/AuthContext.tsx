// src/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api, getUserId, setUserId } from "@/lib/api";

interface AuthCtx {
  user: any;
  loading: boolean;
  users: any[];
  login: (id: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const id = getUserId();
    if (!id) { setUser(null); setLoading(false); return; }
    try {
      const u = await api(`/api/users?id=${id}`);
      setUser(u);
    } catch {
      setUser(null);
      setUserId(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // load user list for switcher
    api("/api/users").then(setUsers).catch(() => {});
    refresh();
  }, []);

  const login = async (id: string) => {
    setUserId(id);
    await refresh();
  };
  const logout = () => {
    setUserId(null);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, users, login, logout, refresh }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
