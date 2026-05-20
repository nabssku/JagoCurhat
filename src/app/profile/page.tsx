"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import AvatarCartoon from "@/components/AvatarCartoon";
import PostCard, { Post } from "@/components/PostCard";
import { Settings, PenTool, Bookmark, Lock } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { getUserPosts, getBookmarkedPosts, toggleLike, toggleBookmark, deletePost } from "@/actions/postActions";
import { getUserProfile } from "@/actions/userActions";
import { getPusherClient } from "@/lib/pusher";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"curhat" | "bookmark">("curhat");
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;
    
    const pusher = getPusherClient();
    const channel = pusher.subscribe("jago-curhat");

    // Realtime follow/post stats
    channel.bind("new-follow", (data: any) => {
      if (data.userId === authUser?.id || data.followerId === authUser?.id) {
        loadData();
      }
    });

    channel.bind("new-post", (data: any) => {
      if (data.userId === authUser?.id) {
        loadData();
      }
    });

    return () => {
      pusher.unsubscribe("jago-curhat");
    };
  }, [authUser?.id, activeTab]);

  useEffect(() => {
    if (authUser?.id) {
      loadData();
    }
  }, [authUser?.id, activeTab]);

  const loadData = async () => {
    if (!authUser) return;
    setLoading(true);
    try {
      // Fetch profile and posts in parallel for fresh stats
      const [profile, posts] = await Promise.all([
        getUserProfile(authUser.nickname),
        activeTab === "curhat" 
          ? getUserPosts(authUser.id, authUser.id)
          : getBookmarkedPosts(authUser.id)
      ]);

      if (profile) setUserProfile(profile);
      
      if (activeTab === "curhat") {
        setMyPosts(mapPosts(posts));
      } else {
        setBookmarkedPosts(mapPosts(posts));
      }
    } catch (error) {
      toast.error("Gagal memuat memory curhatmu... 🌌");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const mapPosts = (dbPosts: any[]): Post[] => {
    return dbPosts.map(p => ({
      id: p.id,
      content: p.content,
      mood: p.mood as any,
      imageUrl: p.imageUrl || undefined,
      createdAt: new Date(p.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isAnonymous: p.isAnonymous,
      author: {
        nickname: p.author?.username || "Anonim",
        avatar: p.author?.avatar || "👻",
      },
      likes: p.likes,
      commentsCount: p.commentsCount,
      isLiked: p.isLiked,
      isBookmarked: p.isBookmarked,
    }));
  };

  const handleDeletePost = async (postId: string) => {
    if (!authUser) return;
    
    // Optimistic update
    const previousPosts = [...myPosts];
    setMyPosts(prev => prev.filter(p => p.id !== postId));
    
    try {
      await deletePost(postId, authUser.id);
      toast.success("Curhatan berhasil dihapus. 🌸");
      // Optionally refresh stats
      loadData();
    } catch (err) {
      setMyPosts(previousPosts);
      toast.error("Gagal menghapus curhatan.");
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!authUser) return;
    try {
      await toggleLike(postId, authUser.id);
      loadData(); // Reload to get updated counts
    } catch (err) {
      toast.error("Gagal menyukai.");
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    if (!authUser) return;
    try {
      await toggleBookmark(postId, authUser.id);
      loadData();
    } catch (err) {
      toast.error("Gagal menyimpan.");
    }
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
      {authUser && (
        <div className="p-5 flex flex-col items-center text-center space-y-4 border-b border-border/40 select-none bg-card/10">
          <AvatarCartoon avatar={userProfile?.avatar || authUser.avatar} seedName={userProfile?.username || authUser.nickname} size="xl" />
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="text-base font-bold text-foreground">{userProfile?.username || authUser.nickname}</h2>
              {(userProfile?.isPrivate || authUser.isPrivate) && (
                <div className="p-1 rounded-md bg-accent/10 border border-accent/20" title="Akun Privat">
                  <Lock size={12} className="text-accent" />
                </div>
              )}
            </div>
            <p className="text-xs text-text-muted">{authUser.email}</p>
          </div>

          {/* Core Stats Row */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm pt-2">
            <div className="p-3 bg-card border border-border/60 rounded-2xl">
              <p className="text-sm font-bold text-foreground">{userProfile?.postsCount || 0}</p>
              <p className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">Curhatan</p>
            </div>
            <div className="p-3 bg-card border border-border/60 rounded-2xl">
              <p className="text-sm font-bold text-foreground">{userProfile?.followersCount || 0}</p>
              <p className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">Pengikut</p>
            </div>
            <div className="p-3 bg-card border border-border/60 rounded-2xl">
              <p className="text-sm font-bold text-foreground">{userProfile?.followingCount || 0}</p>
              <p className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">Mengikuti</p>
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
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === "curhat" ? (
          myPosts.length > 0 ? (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLikePost} 
                  onBookmark={handleBookmarkPost}
                  onDelete={handleDeletePost}
                />
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
              <PostCard key={post.id} post={post} onLike={handleLikePost} onBookmark={handleBookmarkPost} />
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
