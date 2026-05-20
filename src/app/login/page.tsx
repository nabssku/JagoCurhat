"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import EmpathyGhost from "@/components/EmpathyGhost";
import { toast } from "sonner";
import { Sparkles, Mail, Lock } from "lucide-react";

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_cancelled: "Login dengan Google dibatalkan.",
  google_token: "Gagal verifikasi Google, coba lagi.",
  google_userinfo: "Gagal mengambil data Google.",
  google_unverified: "Email Google belum terverifikasi.",
  google_server: "Terjadi kesalahan server. Coba lagi.",
};

// SVG Google Icon
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { cardStyle } = useTheme();

  // Tampilkan error OAuth dari query param (dikirim oleh callback route)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    if (oauthError && GOOGLE_ERROR_MESSAGES[oauthError]) {
      toast.error(GOOGLE_ERROR_MESSAGES[oauthError]);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    setLoading(true);
    try {
      const ok = await login(email.trim(), password.trim());
      if (ok) {
        toast.success("Berhasil masuk! Selamat datang kembali 😊");
      } else {
        toast.error("Email tidak ditemukan. Sudah daftar belum?");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan, silakan coba lagi.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    loginWithGoogle(); // redirect ke Google — tidak balik ke sini
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-6 space-y-6 bg-background min-h-full">
      <div className="text-center space-y-3 flex flex-col items-center">
        <EmpathyGhost state="idle" width={110} height={110} />
        <div className="space-y-1.5 select-none">
          <h1 className="text-xl font-bold text-foreground flex items-center justify-center gap-1.5">
            Masuk JagoCurhat <Sparkles size={16} className="text-accent" />
          </h1>
          <p className="text-xs text-text-muted">Lanjutkan curhat dan dapatkan dukungan hangat</p>
        </div>
      </div>

      {/* Google OAuth Button */}
      <div className="max-w-sm w-full mx-auto">
        <button
          id="btn-google-login"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full py-3 rounded-2xl border border-border bg-zinc-950/50 hover:bg-zinc-900/60 flex items-center justify-center gap-2.5 text-sm font-semibold cursor-pointer tap-highlight-none btn-bounce transition-all duration-200 disabled:opacity-60"
        >
          {googleLoading ? (
            <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? "Menghubungkan..." : "Lanjutkan dengan Google"}
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex py-1 items-center select-none max-w-sm w-full mx-auto">
        <div className="flex-grow border-t border-border/60" />
        <span className="flex-shrink mx-3 text-[10px] text-text-muted uppercase tracking-wider font-semibold">
          Atau masuk dengan email
        </span>
        <div className="flex-grow border-t border-border/60" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4 max-w-sm w-full mx-auto">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5 select-none">
            <Mail size={12} />
            Email
          </label>
          <input
            id="input-login-email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="curhat-input w-full p-3.5 rounded-2xl bg-zinc-950/60 border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5 select-none">
            <Lock size={12} />
            Password
          </label>
          <input
            id="input-login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="curhat-input w-full p-3.5 rounded-2xl bg-zinc-950/60 border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700"
          />
        </div>

        <button
          id="btn-login-submit"
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer btn-bounce tap-highlight-none transition-all duration-200 mt-2 ${
            cardStyle === "doodle"
              ? "border-2 border-accent bg-accent/15 text-accent shadow-[4px_4px_0px_0px_var(--accent)]"
              : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/25"
          }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Menghubungkan...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Register Redirect */}
      <div className="text-center max-w-sm w-full mx-auto select-none">
        <p className="text-xs text-text-muted">
          Belum punya akun?{" "}
          <Link href="/register" className="text-accent font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
