"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";

interface AvatarCartoonProps {
  avatar?: string;
  seedName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const CUTE_AVATARS = ["👻", "🦊", "🐱", "🐼", "🐨", "🐰", "🐙", "🐸", "🐹", "🦁", "🐤", "🦄"];

export default function AvatarCartoon({
  avatar = "👻",
  seedName = "",
  size = "md",
  className = "",
}: AvatarCartoonProps) {
  const { accent } = useTheme();

  // Size mapping
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-2xl",
    xl: "w-20 h-20 text-4xl",
  };

  // Generate background color based on character seed or avatar hash
  const getGradient = (char: string, name: string) => {
    const seed = (char.codePointAt(0) || 0) + name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const hues = [270, 327, 217, 142, 25]; // Matching our theme accent hues
    const baseHue = hues[seed % hues.length];
    
    return {
      background: `linear-gradient(135deg, hsl(${baseHue} 85% 75%) 0%, hsl(${baseHue} 70% 55%) 100%)`,
    };
  };

  const style = getGradient(avatar, seedName);

  return (
    <div
      style={style}
      className={`rounded-2xl flex items-center justify-center font-bold text-black shadow-inner select-none shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] animate-[wiggle_1.5s_ease-in-out_infinite] hover:scale-115 transition-transform duration-200">
        {avatar}
      </span>
    </div>
  );
}
