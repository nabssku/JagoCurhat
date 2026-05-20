"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AccentColor = "purple" | "pink" | "blue" | "green" | "orange";
export type CardStyle = "minimal" | "doodle";
export type MascotStyle = "wave" | "listening" | "happy" | "sleepy" | "idle";

interface ThemeContextType {
  accent: AccentColor;
  cardStyle: CardStyle;
  mascotStyle: MascotStyle;
  setAccent: (accent: AccentColor) => void;
  setCardStyle: (style: CardStyle) => void;
  setMascotStyle: (style: MascotStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentColor>("purple");
  const [cardStyle, setCardStyleState] = useState<CardStyle>("minimal");
  const [mascotStyle, setMascotStyleState] = useState<MascotStyle>("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedAccent = localStorage.getItem("jc_theme_accent") as AccentColor;
    const savedCardStyle = localStorage.getItem("jc_theme_card_style") as CardStyle;
    const savedMascotStyle = localStorage.getItem("jc_theme_mascot_style") as MascotStyle;

    if (savedAccent) setAccentState(savedAccent);
    if (savedCardStyle) setCardStyleState(savedCardStyle);
    if (savedMascotStyle) setMascotStyleState(savedMascotStyle);
    
    setMounted(true);
  }, []);

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem("jc_theme_accent", newAccent);
  };

  const setCardStyle = (newStyle: CardStyle) => {
    setCardStyleState(newStyle);
    localStorage.setItem("jc_theme_card_style", newStyle);
  };

  const setMascotStyle = (newStyle: MascotStyle) => {
    setMascotStyleState(newStyle);
    localStorage.setItem("jc_theme_mascot_style", newStyle);
  };

  return (
    <ThemeContext.Provider
      value={{
        accent,
        cardStyle,
        mascotStyle,
        setAccent,
        setCardStyle,
        setMascotStyle,
      }}
    >
      <div
        data-accent={accent}
        data-card-style={cardStyle}
        className="contents"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
