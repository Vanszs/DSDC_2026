"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export interface UserSession {
  id: string;
  name: string;
  nip: string;
  email: string;
  role: string;
  roleId: "dinkes" | "bappeda" | "puskesmas" | "dsdc_auditor";
  department: string;
  clearanceLevel: "Level 1" | "Level 2" | "Level 3" | "Auditor";
  tokenExpiresAt: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (roleId: "dinkes" | "bappeda" | "puskesmas" | "dsdc_auditor", customName?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "sentry_auth_session";

export const PRESET_OFFICIALS: Record<UserSession["roleId"], UserSession> = {
  dinkes: {
    id: "USR-DKS-001",
    name: "Dr. Hendro Prasetyo, M.Epid",
    nip: "19780415 200312 1 002",
    email: "hendro.prasetyo@dinkes.semarangkota.go.id",
    role: "Kepala Bidang P2P (Pengendalian Penyakit)",
    roleId: "dinkes",
    department: "Dinas Kesehatan Kota Semarang",
    clearanceLevel: "Level 3",
    tokenExpiresAt: "2026-12-31T23:59:59Z",
  },
  bappeda: {
    id: "USR-BPD-014",
    name: "Ir. Siti Rahmawati, M.URP",
    nip: "19820921 200604 2 005",
    email: "siti.rahmawati@bappeda.semarangkota.go.id",
    role: "Analis Perencanaan Tata Ruang & Iklim",
    roleId: "bappeda",
    department: "Bappeda Kota Semarang",
    clearanceLevel: "Level 2",
    tokenExpiresAt: "2026-12-31T23:59:59Z",
  },
  puskesmas: {
    id: "USR-PKM-108",
    name: "Ahmad Fauzi, S.Tr.Kes",
    nip: "19910310 201503 1 001",
    email: "surveilans.pandanaran@dinkes.semarangkota.go.id",
    role: "Petugas Surveilans Puskesmas Pandanaran",
    roleId: "puskesmas",
    department: "Puskesmas Pandanaran (Kec. Semarang Selatan)",
    clearanceLevel: "Level 1",
    tokenExpiresAt: "2026-12-31T23:59:59Z",
  },
  dsdc_auditor: {
    id: "USR-DSDC-2026",
    name: "Tim Penilai Ilmiah DSDC 2026",
    nip: "DSDC-JURY-2026-09",
    email: "jury@dsdc.undip.ac.id",
    role: "Auditor Independen Dewan Juri Data Science",
    roleId: "dsdc_auditor",
    department: "Data Science & Climatology Committee",
    clearanceLevel: "Auditor",
    tokenExpiresAt: "2026-12-31T23:59:59Z",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setUser(parsed);
        }
      }
    } catch {
      // Ignore read errors
    }
  }, []);

  const login = (roleId: UserSession["roleId"], customName?: string) => {
    const template = PRESET_OFFICIALS[roleId] || PRESET_OFFICIALS.dinkes;
    const session: UserSession = {
      ...template,
      name: customName || template.name,
    };
    setUser(session);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage write failure
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage remove failure
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      login: () => {},
      logout: () => {},
    };
  }
  return context;
};
