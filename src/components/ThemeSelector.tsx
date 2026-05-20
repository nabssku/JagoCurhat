"use client";

import React from "react";
import { useTheme, AccentColor, CardStyle, MascotStyle } from "@/hooks/useTheme";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeSelector() {
  const {
    accent,
    cardStyle,
    mascotStyle,
    setAccent,
    setCardStyle,
    setMascotStyle,
  } = useTheme();

  const accentOptions: { name: string; value: AccentColor; color: string }[] = [
    { name: "Ungu", value: "purple", color: "bg-[#a855f7]" },
    { name: "Pink", value: "pink", color: "bg-[#ec4899]" },
    { name: "Biru", value: "blue", color: "bg-[#3b82f6]" },
    { name: "Hijau", value: "green", color: "bg-[#10b981]" },
    { name: "Jingga", value: "orange", color: "bg-[#f97316]" },
  ];

  const styleOptions: { name: string; value: CardStyle; desc: string }[] = [
    { name: "Minimalis", value: "minimal", desc: "Desain bersih & rapi" },
    { name: "Coretan", value: "doodle", desc: "Gaya doodle coret-coret" },
  ];

  const mascotOptions: { name: string; value: MascotStyle; icon: string }[] = [
    { name: "Santai", value: "idle", icon: "👻" },
    { name: "Halo", value: "wave", icon: "👋" },
    { name: "Dengar", value: "listening", icon: "👂" },
    { name: "Ceria", value: "happy", icon: "✨" },
    { name: "Ngantuk", value: "sleepy", icon: "💤" },
  ];

  return (
    <div className="space-y-6 bg-card border border-border p-5 rounded-3xl">
      {/* 1. Accent Color */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Sparkles size={16} className="text-accent" />
          Warna Tema Utama
        </label>
        <div className="flex gap-3 flex-wrap">
          {accentOptions.map((opt) => {
            const isSelected = accent === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setAccent(opt.value)}
                className={`w-10 h-10 rounded-full ${opt.color} flex items-center justify-center relative cursor-pointer btn-bounce tap-highlight-none`}
                title={opt.name}
              >
                {isSelected && (
                  <motion.div
                    layoutId="theme-accent-check"
                    className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-white"
                  >
                    <Check size={12} className="stroke-[3]" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Card Border Style */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          Gaya Kartu & Tombol
        </label>
        <div className="grid grid-cols-2 gap-3">
          {styleOptions.map((opt) => {
            const isSelected = cardStyle === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setCardStyle(opt.value)}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all duration-200 tap-highlight-none ${
                  isSelected
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50 bg-background/50"
                }`}
              >
                <div className="font-semibold text-sm flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full border ${
                      isSelected ? "bg-accent border-accent" : "border-text-muted"
                    }`}
                  />
                  {opt.name}
                </div>
                <div className="text-xs text-text-muted mt-1">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Mascot Animations */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          Ekspresi EmpathyGhost
        </label>
        <div className="grid grid-cols-5 gap-2">
          {mascotOptions.map((opt) => {
            const isSelected = mascotStyle === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setMascotStyle(opt.value)}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 tap-highlight-none ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/40 bg-background/50"
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span className="text-[10px] text-text-muted font-medium truncate max-w-full">
                  {opt.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
