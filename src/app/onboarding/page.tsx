"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import EmpathyGhost from "@/components/EmpathyGhost";
import AvatarCartoon, { CUTE_AVATARS } from "@/components/AvatarCartoon";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("👻");
  const { register } = useAuth();
  const { cardStyle } = useTheme();
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = async () => {
    if (!nickname.trim()) {
      toast.error("Pilih nama panggilanmu dulu ya!");
      return;
    }

    // Save temporary onboarding data to pre-fill registration
    localStorage.setItem("jc_onboarding_nickname", nickname.trim());
    localStorage.setItem("jc_onboarding_avatar", selectedAvatar);
    
    toast.success(`Hampir selesai! Ayo buat akunmu, ${nickname} ✨`);
    router.push("/register");
  };

  // Carousel Slides Content
  const slides = [
    // Slide 1: Welcome & Mascot
    {
      content: (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 h-full select-none">
          <EmpathyGhost state="wave" width={160} height={160} />
          
          <div className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
              Halo Teman! <span className="animate-pulse">👋</span>
            </h1>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Aku <span className="text-accent font-bold">EmpathyGhost</span>. Aku di sini untuk mendengarkan curhatanmu tanpa menghakimi.
            </p>
          </div>

          <div className="w-full pt-4">
            <button
              onClick={handleNext}
              className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer btn-bounce tap-highlight-none ${
                cardStyle === "doodle"
                  ? "border-2 border-accent bg-accent/15 text-accent shadow-[4px_4px_0px_0px_var(--accent)]"
                  : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/25"
              }`}
            >
              Kenalan Yuk <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ),
    },
    // Slide 2: Rules of Curhat
    {
      content: (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 h-full select-none">
          <EmpathyGhost state="listening" width={140} height={140} />
          
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Ruang Aman Bersama</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              JagoCurhat adalah platform sosial yang sehat. Mohon patuhi aturan sederhana berikut:
            </p>
          </div>

          <div className="w-full space-y-3 text-left">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-900/40 border border-border/50">
              <CheckCircle2 className="text-accent shrink-0 mt-0.5" size={16} />
              <div className="text-xs">
                <p className="font-bold text-foreground">Saling Mendukung</p>
                <p className="text-text-muted mt-0.5">Balas curhatan dengan pesan yang empati, peduli, dan positif.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-900/40 border border-border/50">
              <ShieldAlert className="text-rose-400 shrink-0 mt-0.5" size={16} />
              <div className="text-xs">
                <p className="font-bold text-foreground">Bebas Bullying & Toxic</p>
                <p className="text-text-muted mt-0.5">Komentar kebencian atau pelecehan akan langsung diblokir.</p>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-3 pt-2">
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 rounded-2xl font-bold border border-border text-text-muted hover:text-foreground cursor-pointer btn-bounce tap-highlight-none"
            >
              Kembali
            </button>
            <button
              onClick={handleNext}
              className={`flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer btn-bounce tap-highlight-none ${
                cardStyle === "doodle"
                  ? "border-2 border-accent bg-accent/15 text-accent shadow-[3px_3px_0px_0px_var(--accent)]"
                  : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/25"
              }`}
            >
              Setuju <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ),
    },
    // Slide 3: Avatar & Nickname Setup
    {
      content: (
        <div className="flex flex-col items-center justify-center p-6 space-y-6 h-full">
          <div className="text-center space-y-2 select-none">
            <h2 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
              Atur Profil Baru <Sparkles size={18} className="text-accent" />
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Kamu bisa curhat secara anonim nanti, tapi buat dulu profil awalmu ya!
            </p>
          </div>

          {/* Avatar Selector Preview */}
          <div className="flex flex-col items-center gap-3">
            <AvatarCartoon avatar={selectedAvatar} seedName={nickname || "Teman"} size="xl" />
            <span className="text-[10px] text-text-muted font-medium select-none">Ketuk emoji untuk mengganti avatar</span>
          </div>

          {/* Emoji avatar selection list */}
          <div className="w-full max-w-xs no-scrollbar overflow-x-auto flex gap-2.5 py-1 justify-start">
            {CUTE_AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedAvatar(emoji)}
                className={`w-10 h-10 shrink-0 text-xl flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer tap-highlight-none btn-bounce ${
                  selectedAvatar === emoji ? "border-accent bg-accent/10 scale-110" : "border-border/60 bg-zinc-950/40"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Nickname input */}
          <div className="w-full space-y-2">
            <label className="text-xs font-semibold text-text-muted select-none">Nama Panggilan</label>
            <input
              type="text"
              placeholder="Contoh: Rara, Bobi, TemanBaik"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 15))}
              className="curhat-input w-full p-3.5 rounded-2xl bg-zinc-950/60 border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700"
            />
          </div>

          <div className="w-full flex gap-3 pt-2">
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 rounded-2xl font-bold border border-border text-text-muted hover:text-foreground cursor-pointer btn-bounce tap-highlight-none"
            >
              Kembali
            </button>
            <button
              onClick={handleComplete}
              className={`flex-1 py-3.5 rounded-2xl font-bold cursor-pointer btn-bounce tap-highlight-none ${
                cardStyle === "doodle"
                  ? "border-2 border-accent bg-accent/15 text-accent shadow-[3px_3px_0px_0px_var(--accent)]"
                  : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/25"
              }`}
            >
              Mulai Curhat ✨
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center bg-background min-h-full">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center relative overflow-hidden">
        {/* Slide carousel animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex-1 flex flex-col justify-center"
          >
            {slides[currentSlide].content}
          </motion.div>
        </AnimatePresence>

        {/* Slide bullet progress indicators */}
        <div className="flex justify-center gap-1.5 pb-6 select-none">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: currentSlide === index ? 24 : 8,
                backgroundColor: currentSlide === index ? "var(--accent)" : "rgba(255,255,255,0.15)",
              }}
              className="h-2 rounded-full"
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
