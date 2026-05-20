"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface MockUser {
  nickname: string;
  avatar: string;
  email: string;
}

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  register: (email: string, nickname: string, avatar: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (nickname: string, avatar: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for mock session
    const savedUser = localStorage.getItem("jc_session_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Simple route guard simulator
  useEffect(() => {
    if (loading) return;

    const publicRoutes = ["/login", "/register", "/onboarding"];
    const isOnboardingCompleted = localStorage.getItem("jagocurhat_onboarding_completed") === "true";
    const userSessionExists = !!user;

    // Onboarding redirection takes priority
    if (!isOnboardingCompleted && pathname !== "/onboarding") {
      router.push("/onboarding");
      return;
    }

    // Auth redirection
    if (isOnboardingCompleted) {
      if (!userSessionExists && !publicRoutes.includes(pathname)) {
        router.push("/login");
      } else if (userSessionExists && (pathname === "/login" || pathname === "/register")) {
        router.push("/");
      }
    }
  }, [user, pathname, loading, router]);

  const login = async (email: string): Promise<boolean> => {
    // Mock login - auto-creates nick if none exists
    const mockUser: MockUser = {
      email,
      nickname: email.split("@")[0] || "Teman Curhat",
      avatar: "👻",
    };
    setUser(mockUser);
    localStorage.setItem("jc_session_user", JSON.stringify(mockUser));
    return true;
  };

  const register = async (email: string, nickname: string, avatar: string): Promise<boolean> => {
    const mockUser: MockUser = { email, nickname, avatar };
    setUser(mockUser);
    localStorage.setItem("jc_session_user", JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jc_session_user");
    router.push("/login");
  };

  const updateProfile = (nickname: string, avatar: string) => {
    if (!user) return;
    const updated = { ...user, nickname, avatar };
    setUser(updated);
    localStorage.setItem("jc_session_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
