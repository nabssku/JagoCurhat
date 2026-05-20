"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import MoodBadge, { MoodType, MOODS_METADATA } from "@/components/MoodBadge";
import EmpathyGhost from "@/components/EmpathyGhost";
import { ArrowLeft, Send, HelpCircle, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { Post } from "@/components/PostCard";
import RichEditor from "@/components/RichEditor";
import { getFollowingList } from "@/actions/followActions";

import { createPost } from "@/actions/postActions";

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [following, setFollowing] = useState<any[]>([]);

  const { user } = useAuth();
  const { cardStyle } = useTheme();
  const router = useRouter();

  React.useEffect(() => {
    if (user?.id) {
      getFollowingList(user.id).then(setFollowing);
    }
  }, [user?.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 2MB ya!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast.success("Gambar berhasil ditambahkan! 📸");
      };
      reader.readAsDataURL(file);
    }
  };

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

    if (!user) {
      toast.error("Kamu harus login dulu ya!");
      return;
    }

    setLoading(true);

    try {
      await createPost({
        userId: user.id,
        content: content.trim(),
        mood: selectedMood,
        imageUrl: image || undefined,
        isAnonymous,
      });

      toast.success("Curhatan berhasil dibagikan ke semesta! ❤️");
      router.push("/");
    } catch (error) {
      toast.error("Yah, gagal mengirim curhatan. Coba lagi ya!");
      console.error(error);
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
        
        {/* Confession editor - Rich Text */}
        <div className="space-y-2">
          <div className="relative">
            <RichEditor 
              content={content} 
              onChange={setContent}
              placeholder="Tulis apa yang sedang kamu rasakan... (tenang, kamu bisa kirim secara anonim)"
              mentions={following.map(f => f.username)}
            />
            {/* Image Upload Button overlay or below? I'll put it in a clean row below but the user had it absolute. In RichEditor I have a footer area I could use, but for now I'll just keep it accessible here. */}
            <div className="mt-2 flex items-center gap-2">
              <label className="p-2.5 rounded-xl bg-card border border-border hover:border-accent/40 hover:text-accent cursor-pointer transition-all btn-bounce flex items-center gap-2 text-[10px] font-bold">
                <Camera size={16} /> Tambah Foto
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {image && (
                <div className="relative group">
                  <img src={image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-accent/30 shadow-sm shadow-accent/10" />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 p-0.5 rounded-full bg-rose-500 text-white shadow-md hover:scale-110 transition-transform"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-text-muted px-1 select-none">
            <span>Hindari menyinggung SARA & bullying</span>
            <span>{content.replace(/<[^>]*>/g, '').length}/350 Karakter</span>
          </div>
        </div>

        {/* Mood badges selector - Carousel style */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 select-none">
            Pilih Mood Saat Ini <span className="text-rose-400">*</span>
          </label>
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 px-1">
            {moodsList.map((mood) => (
              <div key={mood} className="shrink-0 min-w-[100px]">
                <MoodBadge
                  mood={mood}
                  interactive
                  selected={selectedMood === mood}
                  onClick={() => setSelectedMood(mood)}
                />
              </div>
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
