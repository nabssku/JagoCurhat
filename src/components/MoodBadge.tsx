"use client";

import React from "react";
import { motion } from "framer-motion";

export type MoodType =
  | "Sedih"
  | "Senang"
  | "Capek"
  | "Overthinking"
  | "Butuh Teman"
  | "Bangga"
  | "Kecewa"
  | "Takut"
  | "Lega";

interface MoodBadgeProps {
  mood: MoodType;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

export const MOODS_METADATA: Record<
  MoodType,
  { emoji: string; bg: string; border: string; text: string; accentClass: string }
> = {
  Sedih: {
    emoji: "😢",
    bg: "bg-blue-950/40",
    border: "border-blue-900/60",
    text: "text-blue-400",
    accentClass: "shadow-blue-500/10",
  },
  Senang: {
    emoji: "😊",
    bg: "bg-amber-950/40",
    border: "border-amber-900/60",
    text: "text-amber-400",
    accentClass: "shadow-amber-500/10",
  },
  Capek: {
    emoji: "🥱",
    bg: "bg-purple-950/40",
    border: "border-purple-900/60",
    text: "text-purple-400",
    accentClass: "shadow-purple-500/10",
  },
  Overthinking: {
    emoji: "🧠",
    bg: "bg-slate-900/60",
    border: "border-slate-800/60",
    text: "text-slate-300",
    accentClass: "shadow-slate-500/10",
  },
  "Butuh Teman": {
    emoji: "🤝",
    bg: "bg-teal-950/40",
    border: "border-teal-900/60",
    text: "text-teal-400",
    accentClass: "shadow-teal-500/10",
  },
  Bangga: {
    emoji: "😎",
    bg: "bg-orange-950/40",
    border: "border-orange-900/60",
    text: "text-orange-400",
    accentClass: "shadow-orange-500/10",
  },
  Kecewa: {
    emoji: "💔",
    bg: "bg-rose-950/40",
    border: "border-rose-900/60",
    text: "text-rose-400",
    accentClass: "shadow-rose-500/10",
  },
  Takut: {
    emoji: "😰",
    bg: "bg-indigo-950/40",
    border: "border-indigo-900/60",
    text: "text-indigo-400",
    accentClass: "shadow-indigo-500/10",
  },
  Lega: {
    emoji: "😌",
    bg: "bg-emerald-950/40",
    border: "border-emerald-900/60",
    text: "text-emerald-400",
    accentClass: "shadow-emerald-500/10",
  },
};

export default function MoodBadge({
  mood,
  interactive = false,
  selected = false,
  onClick,
  size = "md",
}: MoodBadgeProps) {
  const meta = MOODS_METADATA[mood] || {
    emoji: "💭",
    bg: "bg-zinc-900",
    border: "border-zinc-800",
    text: "text-zinc-400",
    accentClass: "",
  };

  const content = (
    <span className="flex items-center gap-1.5 font-medium leading-none">
      <span className="text-base select-none leading-none">{meta.emoji}</span>
      <span className={size === "sm" ? "text-xs" : "text-sm"}>{mood}</span>
    </span>
  );

  if (interactive) {
    return (
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`px-4 py-2.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 tap-highlight-none ${
          selected
            ? `${meta.bg} ${meta.border} ${meta.text} border-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] font-semibold`
            : "bg-zinc-900/30 border-zinc-800/80 text-text-muted hover:border-zinc-700/80"
        }`}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-full border ${size === "sm" ? "px-2.5 py-1" : ""} ${
        meta.bg
      } ${meta.border} ${meta.text} select-none`}
    >
      {content}
    </div>
  );
}
