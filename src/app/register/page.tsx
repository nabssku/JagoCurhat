"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import EmpathyGhost from "@/components/EmpathyGhost";
import AvatarCartoon, { CUTE_AVATARS } from "@/components/AvatarCartoon";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, User } from "lucide-react";

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

export default function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("👻");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const { cardStyle } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Pre-fill dari onboarding jika sudah pernah diisi
    const savedNickname = localStorage.getItem("jc_onboarding_nickname");
    const savedAvatar = localStorage.getItem("jc_onboarding_avatar");
    if (savedNickname) setNickname(savedNickname);
    if (savedAvatar) setSelectedAvatar(savedAvatar);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      toast.error("Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const success = await register(email.trim(), nickname.trim(), selectedAvatar, password.trim());

      if (success) {
        localStorage.removeItem("jc_onboarding_nickname");
        localStorage.removeItem("jc_onboarding_avatar");
        localStorage.setItem("jagocurhat_onboarding_completed", "true");
        toast.success(`Selamat bergabung, ${nickname}! 🎉`);
        router.push("/");
      } else {
        toast.error("Gagal mendaftar, silakan coba lagi.");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Gagal mendaftar, silakan coba lagi.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setGoogleLoading(true);
    loginWithGoogle(); // redirect ke Google — tidak balik ke sini
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-6 space-y-5 bg-background min-h-full">
      <div className="text-center space-y-2 flex flex-col items-center select-none">
        <EmpathyGhost state="happy" width={90} height={90} />
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground flex items-center justify-center gap-1.5">
            Daftar Akun Baru <Sparkles size={16} className="text-accent" />
          </h1>
          <p className="text-xs text-text-muted">Buat akun untuk menulis curhat &amp; berinteraksi</p>
        </div>
      </div>

      {/* Google Register Button */}
      <div className="max-w-sm w-full mx-auto">
        <button
          id="btn-google-register"
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="w-full py-3 rounded-2xl border border-border bg-zinc-950/50 hover:bg-zinc-900/60 flex items-center justify-center gap-2.5 text-sm font-semibold cursor-pointer tap-highlight-none btn-bounce transition-all duration-200 disabled:opacity-60"
        >
          {googleLoading ? (
            <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? "Menghubungkan..." : "Daftar dengan Google"}
        </button>
        <p className="text-center text-[10px] text-text-muted mt-2 select-none">
          Daftar Google = langsung masuk tanpa password 🚀
        </p>
      </div>

      {/* Divider */}
      <div className="relative flex py-1 items-center select-none max-w-sm w-full mx-auto">
        <div className="flex-grow border-t border-border/60" />
        <span className="flex-shrink mx-3 text-[10px] text-text-muted uppercase tracking-wider font-semibold">
          Atau daftar manual
        </span>
        <div className="flex-grow border-t border-border/60" />
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5 max-w-sm w-full mx-auto">
        {/* Avatar Setup */}
        <div className="flex flex-col items-center gap-2 select-none">
          <AvatarCartoon avatar={selectedAvatar} seedName={nickname || "Teman"} size="lg" />
          <div className="w-full flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-xs justify-start">
            {CUTE_AVATARS.slice(0, 8).map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => setSelectedAvatar(emoji)}
                className={`w-8 h-8 shrink-0 text-base flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer tap-highlight-none btn-bounce ${
                  selectedAvatar === emoji
                    ? "border-accent bg-accent/10 scale-105"
                    : "border-border/60 bg-zinc-950/40"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Nickname Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5 select-none">
            <User size={12} />
            Nama Panggilan
          </label>
          <input
            id="input-register-nickname"
            type="text"
            placeholder="Siapa namamu?"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 15))}
            className="curhat-input w-full p-3 rounded-2xl bg-zinc-950/60 border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700"
          />
        </div>

        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5 select-none">
            <Mail size={12} />
            Email
          </label>
          <input
            id="input-register-email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="curhat-input w-full p-3 rounded-2xl bg-zinc-950/60 border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5 select-none">
            <Lock size={12} />
            Password
          </label>
          <input
            id="input-register-password"
            type="password"
            placeholder="Buat password aman"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="curhat-input w-full p-3 rounded-2xl bg-zinc-950/60 border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700"
          />
        </div>

        <button
          id="btn-register-submit"
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer btn-bounce tap-highlight-none transition-all duration-200 mt-2 ${
            cardStyle === "doodle"
              ? "border-2 border-accent bg-accent/15 text-accent shadow-[3px_3px_0px_0px_var(--accent)]"
              : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/25"
          }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </button>
      </form>

      {/* Back to login */}
      <div className="text-center max-w-sm w-full mx-auto select-none pt-1">
        <p className="text-xs text-text-muted">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-accent font-bold hover:underline">
            Masuk Di Sini
          </Link>
        </p>
      </div>
    </div>
  );
}
