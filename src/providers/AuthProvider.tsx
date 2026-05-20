"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface MockUser {
  id: string;
  nickname: string;
  avatar: string;
  email: string;
  accentColor: string;
  cardStyle: string;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  friends: string[];
}

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, nickname: string, avatar: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => void;
  logout: () => void;
  updateProfile: (nickname: string, avatar: string, isPrivate?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { registerUser, loginUser } from "@/actions/authActions";
import { updateProfile as dbUpdateProfile } from "@/actions/userActions";
import { useRealtime } from "@/hooks/useRealtime";

/** Baca nilai cookie berdasarkan nama */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Hapus cookie */
function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  useRealtime(user?.id);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Cek apakah ada session Google baru dari cookie (set oleh callback route)
    const googleCookie = getCookie("jc_google_session");
    if (googleCookie) {
      try {
        const parsed: MockUser = JSON.parse(googleCookie);
        setUser(parsed);
        localStorage.setItem("jc_session_user", JSON.stringify(parsed));
        localStorage.setItem("jagocurhat_onboarding_completed", "true");
        deleteCookie("jc_google_session");
        setLoading(false);
        return;
      } catch {
        deleteCookie("jc_google_session");
      }
    }

    // 2. Fallback ke localStorage (credential login)
    const savedUser = localStorage.getItem("jc_session_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("jc_session_user");
      }
    }
    setLoading(false);
  }, []);

  // Route guard
  useEffect(() => {
    if (loading) return;

    const publicRoutes = ["/onboarding", "/login", "/register"];
    const isOnboardingCompleted =
      localStorage.getItem("jagocurhat_onboarding_completed") === "true";
    const userSessionExists = !!user;

    if (!isOnboardingCompleted && !publicRoutes.includes(pathname)) {
      router.push("/onboarding");
      return;
    }

    if (userSessionExists && publicRoutes.includes(pathname)) {
      router.push("/");
      return;
    }

    if (isOnboardingCompleted && !userSessionExists && !publicRoutes.includes(pathname)) {
      router.push("/login");
      return;
    }
  }, [user, pathname, loading, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const dbUser = await loginUser(email, password);
      if (dbUser) {
        const mappedUser: MockUser = {
          id: dbUser.id,
          email: dbUser.email,
          nickname: dbUser.username,
          avatar: dbUser.avatar,
          accentColor: dbUser.accentColor,
          cardStyle: dbUser.cardStyle,
          isPrivate: dbUser.isPrivate,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          friends: [],
        };
        setUser(mappedUser);
        localStorage.setItem("jc_session_user", JSON.stringify(mappedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const register = async (
    email: string,
    nickname: string,
    avatar: string,
    password: string
  ): Promise<boolean> => {
    try {
      const dbUser = await registerUser({ email, nickname, avatar, password });
      if (dbUser) {
        const mappedUser: MockUser = {
          id: dbUser.id,
          email: dbUser.email,
          nickname: dbUser.username,
          avatar: dbUser.avatar,
          accentColor: dbUser.accentColor,
          cardStyle: dbUser.cardStyle,
          isPrivate: dbUser.isPrivate,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          friends: [],
        };
        setUser(mappedUser);
        localStorage.setItem("jc_session_user", JSON.stringify(mappedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Redirect browser ke Google OAuth consent screen.
   * Setelah user setuju, Google redirect ke /api/auth/google/callback
   * yang akan handle token exchange & session.
   */
  const loginWithGoogle = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const redirectUri = `${window.location.origin}/api/auth/google/callback`;
    const scope = "openid email profile";

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope,
      access_type: "offline",
      prompt: "select_account",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jc_session_user");
    router.push("/login");
  };

  const updateProfile = async (
    nickname: string,
    avatar: string,
    isPrivate?: boolean
  ) => {
    if (!user) return;

    try {
      await dbUpdateProfile(user.id, { username: nickname, avatar, isPrivate });
      const updated: MockUser = {
        ...user,
        nickname,
        avatar,
        isPrivate: isPrivate !== undefined ? isPrivate : user.isPrivate,
      };
      setUser(updated);
      localStorage.setItem("jc_session_user", JSON.stringify(updated));
    } catch (error) {
      console.error("Gagal update profil:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
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
