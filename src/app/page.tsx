"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_POSTS } from "@/constants/dummyData";
import PostCard, { Post } from "@/components/PostCard";
import AvatarCartoon from "@/components/AvatarCartoon";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Sparkles, MessageCircle } from "lucide-react";
import MoodBadge, { MoodType } from "@/components/MoodBadge";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";

export default function HomeFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType | "Semua">("Semua");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { accent } = useTheme();

  useEffect(() => {
    // Load default and custom posts from localStorage
    const loadPosts = () => {
      const savedCustom = localStorage.getItem("jc_custom_posts");
      const customPosts: Post[] = savedCustom ? JSON.parse(savedCustom) : [];
      
      // Combine custom posts (newest first) and mock posts
      setPosts([...customPosts, ...MOCK_POSTS]);
      setLoading(false);
    };

    // Simulate loading for cute transition
    const timer = setTimeout(loadPosts, 650);
    return () => clearTimeout(timer);
  }, []);

  const handleLikePost = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1,
        };
      }
      return p;
    });
    setPosts(updated);

    // Save to custom posts storage if it's a custom post
    const savedCustom = localStorage.getItem("jc_custom_posts");
    if (savedCustom) {
      const customPosts: Post[] = JSON.parse(savedCustom);
      const isCustom = customPosts.some((cp) => cp.id === postId);
      if (isCustom) {
        const updatedCustom = customPosts.map((p) => {
          if (p.id === postId) {
            const nextLiked = !p.isLiked;
            return {
              ...p,
              isLiked: nextLiked,
              likes: nextLiked ? p.likes + 1 : p.likes - 1,
            };
          }
          return p;
        });
        localStorage.setItem("jc_custom_posts", JSON.stringify(updatedCustom));
      }
    }
  };

  const moodsList: (MoodType | "Semua")[] = [
    "Semua",
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

  // Filter posts based on mood
  const filteredPosts = selectedMood === "Semua"
    ? posts
    : posts.filter((p) => p.mood === selectedMood);

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Feed Header */}
      <div className="p-4 border-b border-border/60 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-30 select-none">
        <div className="flex items-center gap-2">
          <span className="text-xl">👻</span>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight flex items-center gap-1">
              JagoCurhat <span className="text-[10px] text-accent font-bold px-1.5 py-0.5 rounded bg-accent/15">Ruang Aman</span>
            </h1>
            <p className="text-[10px] text-text-muted">Ekspresikan perasaanmu dengan bebas</p>
          </div>
        </div>

        {/* User snapshot avatar linking to profile */}
        {user && (
          <Link href="/profile" className="tap-highlight-none">
            <AvatarCartoon avatar={user.avatar} seedName={user.nickname} size="md" className="hover:scale-105 transition-transform" />
          </Link>
        )}
      </div>

      {/* Mood filter horizontal scroll view */}
      <div className="py-3 px-4 overflow-x-auto no-scrollbar flex gap-2.5 sticky top-[57px] bg-background/95 backdrop-blur-sm border-b border-border/30 z-20 select-none">
        {moodsList.map((mood) => {
          const isSelected = selectedMood === mood;
          return (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer tap-highlight-none transition-all duration-200 ${
                isSelected
                  ? "bg-accent text-accent-foreground shadow-md shadow-accent/10"
                  : "bg-card border border-border/70 text-text-muted hover:border-accent/40"
              }`}
            >
              {mood === "Semua" ? "💭 Semua Mood" : mood}
            </button>
          );
        })}
      </div>

      {/* Confessions Timeline content */}
      <div className="p-4 flex-1 flex flex-col justify-start">
        {loading ? (
          <LoadingState />
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLikePost}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`Belum ada curhatan mood ${selectedMood}`}
            description="Jadilah yang pertama menuangkan perasaanmu dan dapatkan balasan hangat dari teman curhat."
            actionText="Tulis Curhat"
            onActionClick={() => (window.location.href = "/create")}
            mascotState="sleepy"
          />
        )}
      </div>
    </div>
  );
}
