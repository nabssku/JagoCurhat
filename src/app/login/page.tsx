"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import EmpathyGhost from "@/components/EmpathyGhost";
import { toast } from "sonner";
import { Sparkles, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { cardStyle } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    setLoading(true);
    try {
      // Simulate mock API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      await login(email.trim());
      toast.success("Berhasil masuk! Selamat datang kembali 😊");
    } catch {
      toast.error("Terjadi kesalahan, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
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

      <form onSubmit={handleLogin} className="space-y-4 max-w-sm w-full mx-auto">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5 select-none">
            <Mail size={12} />
            Email
          </label>
          <input
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
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="curhat-input w-full p-3.5 rounded-2xl bg-zinc-950/60 border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer btn-bounce tap-highlight-none transition-all duration-200 mt-2 ${
            cardStyle === "doodle"
              ? "border-2 border-accent bg-accent/15 text-accent shadow-[4px_4px_0px_0px_var(--accent)]"
              : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/25"
          }`}
        >
          {loading ? "Menghubungkan..." : "Masuk"}
        </button>
      </form>

      {/* Alternative Socials Login */}
      <div className="space-y-4 max-w-sm w-full mx-auto pt-2 text-center">
        <div className="relative flex py-1 items-center select-none">
          <div className="flex-grow border-t border-border/60"></div>
          <span className="flex-shrink mx-3 text-[10px] text-text-muted uppercase tracking-wider font-semibold">
            Atau masuk dengan
          </span>
          <div className="flex-grow border-t border-border/60"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              login("google.user@example.com");
              toast.success("Masuk dengan Google (Mock)!");
            }}
            className="p-3 rounded-2xl border border-border bg-zinc-950/40 hover:bg-zinc-900/40 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer tap-highlight-none btn-bounce"
          >
            🌐 Google
          </button>
          <button
            onClick={() => {
              login("apple.user@example.com");
              toast.success("Masuk dengan Apple (Mock)!");
            }}
            className="p-3 rounded-2xl border border-border bg-zinc-950/40 hover:bg-zinc-900/40 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer tap-highlight-none btn-bounce"
          >
            🍎 Apple
          </button>
        </div>

        {/* Register Redirect */}
        <p className="text-xs text-text-muted pt-2 select-none">
          Belum punya akun?{" "}
          <Link href="/register" className="text-accent font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
