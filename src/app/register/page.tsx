"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import EmpathyGhost from "@/components/EmpathyGhost";
import AvatarCartoon, { CUTE_AVATARS } from "@/components/AvatarCartoon";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("👻");
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { cardStyle } = useTheme();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      toast.error("Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await register(email.trim(), nickname.trim(), selectedAvatar);
      toast.success("Akun berhasil dibuat! Selamat bergabung 🎉");
    } catch {
      toast.error("Gagal mendaftar, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-6 space-y-5 bg-background min-h-full">
      <div className="text-center space-y-2 flex flex-col items-center select-none">
        <EmpathyGhost state="happy" width={90} height={90} />
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground flex items-center justify-center gap-1.5">
            Daftar Akun Baru <Sparkles size={16} className="text-accent" />
          </h1>
          <p className="text-xs text-text-muted">Buat akun untuk menulis curhat & berinteraksi</p>
        </div>
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
                  selectedAvatar === emoji ? "border-accent bg-accent/10 scale-105" : "border-border/60 bg-zinc-950/40"
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
            type="password"
            placeholder="Buat password aman"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="curhat-input w-full p-3 rounded-2xl bg-zinc-950/60 border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer btn-bounce tap-highlight-none transition-all duration-200 mt-2 ${
            cardStyle === "doodle"
              ? "border-2 border-accent bg-accent/15 text-accent shadow-[3px_3px_0px_0px_var(--accent)]"
              : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/25"
          }`}
        >
          {loading ? "Mendaftar..." : "Daftar"}
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
