"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import AvatarCartoon from "@/components/AvatarCartoon";
import PostCard, { Post } from "@/components/PostCard";
import { Settings, PenTool, Bookmark, MessageSquareHeart } from "lucide-react";
import { MOCK_POSTS } from "@/constants/dummyData";
import EmptyState from "@/components/EmptyState";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"curhat" | "bookmark">("curhat");
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Load custom posts created by the user
    const savedCustom = localStorage.getItem("jc_custom_posts");
    const customPosts: Post[] = savedCustom ? JSON.parse(savedCustom) : [];
    
    // Filter posts created by the current user
    const userPosts = customPosts.filter((p) => p.author.nickname === user?.nickname && !p.isAnonymous);
    setMyPosts(userPosts);

    // Bookmarks list (simulation: filters posts that are marked as bookmarked)
    const allPosts = [...customPosts, ...MOCK_POSTS];
    const bookmarks = allPosts.filter((p) => p.isBookmarked);
    setBookmarkedPosts(bookmarks);
  }, [user]);

  const handleLikePost = (postId: string) => {
    // Basic like simulation inside profile view
    const updateLikes = (list: Post[]) =>
      list.map((p) => {
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

    setMyPosts((prev) => updateLikes(prev));
    setBookmarkedPosts((prev) => updateLikes(prev));
  };

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border/60 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-30 select-none">
        <h1 className="text-base font-bold text-foreground">Profil Saya</h1>
        <Link
          href="/settings"
          className="p-1.5 rounded-xl border border-border hover:border-accent/40 hover:text-accent btn-bounce tap-highlight-none"
        >
          <Settings size={18} />
        </Link>
      </div>

      {/* User Info Card */}
      {user && (
        <div className="p-5 flex flex-col items-center text-center space-y-4 border-b border-border/40 select-none bg-card/10">
          <AvatarCartoon avatar={user.avatar} seedName={user.nickname} size="xl" />
          
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground">{user.nickname}</h2>
            <p className="text-xs text-text-muted">{user.email}</p>
          </div>

          {/* Core Stats Row */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs pt-2">
            <div className="p-3 bg-card border border-border/60 rounded-2xl">
              <p className="text-sm font-bold text-foreground">{myPosts.length}</p>
              <p className="text-[10px] text-text-muted mt-0.5">Confessions</p>
            </div>
            <div className="p-3 bg-card border border-border/60 rounded-2xl">
              <p className="text-sm font-bold text-foreground">
                {myPosts.reduce((acc, p) => acc + p.likes, 0) + 12}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">Dukungan</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs list (My Posts vs Saved Bookmarks) */}
      <div className="flex border-b border-border/40 select-none">
        <button
          onClick={() => setActiveTab("curhat")}
          className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer tap-highlight-none transition-all duration-200 ${
            activeTab === "curhat"
              ? "border-accent text-accent"
              : "border-transparent text-text-muted hover:text-foreground"
          }`}
        >
          <PenTool size={14} /> Curhatku
        </button>
        <button
          onClick={() => setActiveTab("bookmark")}
          className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer tap-highlight-none transition-all duration-200 ${
            activeTab === "bookmark"
              ? "border-accent text-accent"
              : "border-transparent text-text-muted hover:text-foreground"
          }`}
        >
          <Bookmark size={14} /> Disimpan
        </button>
      </div>

      {/* Profile list items content */}
      <div className="p-4 flex-1">
        {activeTab === "curhat" ? (
          myPosts.length > 0 ? (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <PostCard key={post.id} post={post} onLike={handleLikePost} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Belum ada postingan publik"
              description="Postingan non-anonim buatanmu akan terdaftar di sini. Ayo mulailah bagikan ceritamu!"
              actionText="Tulis Cerita"
              onActionClick={() => (window.location.href = "/create")}
              mascotState="wave"
            />
          )
        ) : bookmarkedPosts.length > 0 ? (
          <div className="space-y-4">
            {bookmarkedPosts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLikePost} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada curhat disimpan"
            description="Simpan curhatan dari orang lain dengan mengetuk ikon bookmark pada kartu cerita mereka."
            mascotState="sleepy"
          />
        )}
      </div>
    </div>
  );
}
