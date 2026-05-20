"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import MoodBadge, { MoodType, MOODS_METADATA } from "@/components/MoodBadge";
import EmpathyGhost from "@/components/EmpathyGhost";
import { ArrowLeft, Send, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Post } from "@/components/PostCard";

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { cardStyle } = useTheme();
  const router = useRouter();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Tuliskan isi curhatanmu dulu ya!");
      return;
    }

    if (!selectedMood) {
      toast.error("Silakan pilih Mood yang mewakili perasaanmu!");
      return;
    }

    setLoading(true);

    try {
      // Simulate posting delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newPost: Post = {
        id: `custom-post-${Date.now()}`,
        content: content.trim(),
        mood: selectedMood,
        createdAt: "Baru saja",
        isAnonymous,
        author: {
          nickname: user?.nickname || "Teman Curhat",
          avatar: user?.avatar || "👻",
        },
        likes: 0,
        commentsCount: 0,
        isLiked: false,
        isBookmarked: false,
      };

      // Load existing custom posts
      const savedCustom = localStorage.getItem("jc_custom_posts");
      const currentCustom: Post[] = savedCustom ? JSON.parse(savedCustom) : [];
      
      // Save updated custom posts (prepend)
      localStorage.setItem("jc_custom_posts", JSON.stringify([newPost, ...currentCustom]));

      toast.success("Curhatan berhasil dibagikan! ❤️");
      router.push("/");
    } catch {
      toast.error("Gagal mengirim curhatan.");
    } finally {
      setLoading(false);
    }
  };

  const moodsList: MoodType[] = [
    "Sedih",
    "Senang",
    "Capek",
    "Overthinking",
    "Butuh Teman",
    "Bangga",
    "Kecewa",
    "Takut",
    "Lega",
  ];

  return (
    <div className="flex-1 flex flex-col bg-background pb-12">
      {/* Header */}
      <div className="p-4 border-b border-border/60 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-30 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-xl border border-border hover:border-accent/40 hover:text-accent btn-bounce tap-highlight-none cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-bold text-foreground">Curhat Baru</h1>
        </div>
      </div>

      <form onSubmit={handlePost} className="p-4 flex-1 flex flex-col space-y-6">
        
        {/* Confession editor textarea */}
        <div className="space-y-2">
          <textarea
            placeholder="Tulis apa yang sedang kamu rasakan... (tenang, kamu bisa kirim secara anonim)"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 350))}
            className="curhat-input w-full min-h-[160px] p-4 rounded-3xl bg-card border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700 resize-none font-medium"
          />
          <div className="flex justify-between items-center text-[10px] text-text-muted px-1 select-none">
            <span>Hindari menyinggung SARA & bullying</span>
            <span>{content.length}/350 Karakter</span>
          </div>
        </div>

        {/* Mood badges selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 select-none">
            Pilih Mood Saat Ini <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {moodsList.map((mood) => (
              <MoodBadge
                key={mood}
                mood={mood}
                interactive
                selected={selectedMood === mood}
                onClick={() => setSelectedMood(mood)}
              />
            ))}
          </div>
        </div>

        {/* Anonymous toggle settings */}
        <div className="p-4 bg-card border border-border/60 rounded-3xl space-y-3 select-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">Kirim secara Anonim</p>
              <p className="text-[10px] text-text-muted mt-0.5">Sembunyikan foto profil dan nama panggilanmu.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-11 h-6 rounded-full relative p-0.5 transition-colors duration-200 cursor-pointer ${
                isAnonymous ? "bg-accent" : "bg-zinc-800"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-md ${
                  isAnonymous ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          
          {isAnonymous && (
            <div className="p-3 bg-accent/5 rounded-2xl flex items-center gap-3 border border-accent/15">
              <span className="text-2xl">👻</span>
              <span className="text-[10px] text-text-muted leading-relaxed">
                Kamu akan memposting sebagai <strong className="text-accent">Anonim</strong>. Identitas aslimu aman terenkripsi.
              </span>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-3xl font-bold flex items-center justify-center gap-2 cursor-pointer btn-bounce tap-highlight-none text-xs transition-all duration-200 ${
              cardStyle === "doodle"
                ? "border-2 border-accent bg-accent/15 text-accent shadow-[4px_4px_0px_0px_var(--accent)]"
                : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/25"
            }`}
          >
            <Send size={14} /> {loading ? "Membagikan..." : "Bagikan Cerita Anda"}
          </button>
        </div>
      </form>
    </div>
  );
}
