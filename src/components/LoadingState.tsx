"use client";

import React from "react";
import EmpathyGhost from "./EmpathyGhost";

interface LoadingStateProps {
  message?: string;
  showSkeleton?: boolean;
}

export default function LoadingState({
  message = "Sedang memuat cerita...",
  showSkeleton = true,
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 flex-1 select-none">
      {/* Floating Ghost Mascot */}
      <EmpathyGhost state="listening" width={110} height={110} />

      {/* Empathetic loading message with bouncy dots */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-text-muted">{message}</p>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

      {/* Mock skeleton post layouts */}
      {showSkeleton && (
        <div className="w-full space-y-4 max-w-sm pt-4 opacity-30">
          <div className="border border-border p-4 rounded-3xl space-y-3 animate-pulse bg-card/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-zinc-800" />
              <div className="space-y-1.5 flex-1">
                <div className="w-24 h-3 bg-zinc-800 rounded-md" />
                <div className="w-16 h-2 bg-zinc-900 rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-zinc-800 rounded-md" />
              <div className="w-4/5 h-3 bg-zinc-800 rounded-md" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
