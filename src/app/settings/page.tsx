"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ThemeSelector from "@/components/ThemeSelector";
import { ArrowLeft, LogOut, Info, Heart, Shield } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar akun!");
  };

  return (
    <div className="flex-1 flex flex-col bg-background pb-12">
      {/* Navigation Header */}
      <div className="p-4 border-b border-border/60 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-30 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-xl border border-border hover:border-accent/40 hover:text-accent btn-bounce tap-highlight-none cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-bold text-foreground">Pengaturan</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* User profile card snapshot */}
        {user && (
          <div className="p-4 rounded-3xl bg-card border border-border/80 flex items-center gap-4 select-none">
            <div className="text-3xl p-3 bg-accent/10 rounded-2xl">{user.avatar}</div>
            <div>
              <p className="text-sm font-bold text-foreground">{user.nickname}</p>
              <p className="text-xs text-text-muted">{user.email}</p>
            </div>
          </div>
        )}

        {/* 1. Theme Configuration */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 select-none">
            Personalisasi Tampilan
          </h2>
          <ThemeSelector />
        </div>

        {/* 2. App Meta Information */}
        <div className="space-y-2 select-none">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">
            Informasi Aplikasi
          </h2>
          <div className="bg-card border border-border p-4 rounded-3xl space-y-3.5 text-xs text-text-muted">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Info size={14} className="text-accent" /> Versi Aplikasi
              </span>
              <span className="font-semibold text-foreground">1.0.0 (MVP UI)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Shield size={14} className="text-accent" /> Kebijakan Privasi
              </span>
              <span className="text-accent font-bold hover:underline cursor-pointer">Lihat</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="flex items-center gap-1">
                Dibuat dengan <Heart size={10} className="fill-rose-500 stroke-rose-500 animate-pulse" /> untukmu
              </span>
            </div>
          </div>
        </div>

        {/* 3. Account controls */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-3xl border border-rose-900/30 hover:border-rose-900/60 bg-rose-950/15 text-rose-400 font-bold flex items-center justify-center gap-2 cursor-pointer btn-bounce tap-highlight-none text-xs transition-colors duration-200"
          >
            <LogOut size={14} /> Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  );
}
