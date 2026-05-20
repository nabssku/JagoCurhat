"use client";

import React from "react";
import EmpathyGhost from "./EmpathyGhost";
import { useTheme } from "@/hooks/useTheme";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
  mascotState?: "idle" | "wave" | "listening" | "happy" | "sleepy";
}

export default function EmptyState({
  title,
  description,
  actionText,
  onActionClick,
  mascotState = "idle",
}: EmptyStateProps) {
  const { cardStyle } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 select-none">
      {/* Cartoon Ghost Mascot */}
      <EmpathyGhost state={mascotState} width={130} height={130} />

      {/* Info labels */}
      <div className="space-y-1.5 max-w-xs">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="text-xs text-text-muted leading-relaxed">{description}</p>
      </div>

      {/* Action button if needed */}
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className={`px-5 py-2.5 rounded-2xl text-xs font-semibold btn-bounce tap-highlight-none transition-all duration-200 cursor-pointer ${
            cardStyle === "doodle"
              ? "border-2 border-accent bg-accent/10 text-accent shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--accent)]"
              : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/20"
          }`}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
