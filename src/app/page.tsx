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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getPosts, toggleLike, getPostById } from "@/actions/postActions";
import { getPusherClient } from "@/lib/pusher";

export default function HomeFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType | "Semua">("Semua");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { accent } = useTheme();

  useEffect(() => {
    // Load posts from database
    const loadPosts = async () => {
      try {
        const dbPosts = await getPosts(user?.id);
        
        // Map DB posts to the Post interface used by components
        const mappedPosts: Post[] = (dbPosts as any[]).map(p => ({
          id: p.id,
          content: p.content,
          mood: p.mood as MoodType,
          imageUrl: p.imageUrl || undefined,
          createdAt: new Date(p.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          isAnonymous: p.isAnonymous,
          author: {
            nickname: p.author?.username || "Anonim",
            avatar: p.author?.avatar || "👻",
          },
          authorIsPrivate: p.author?.isPrivate,
          likes: p.likes,
          commentsCount: p.commentsCount,
          isLiked: p.isLiked,
        }));

        setPosts(mappedPosts);
      } catch (error) {
        toast.error("Gagal memuat curhatan dari semesta... 🌌");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user?.id]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;
    
    const pusher = getPusherClient();
    const channel = pusher.subscribe("jago-curhat");

    channel.bind("new-post", async (data: any) => {
      // Don't add if it's mine (already optimistic or handled)
      if (data.userId === user?.id) return;

      try {
        const newPostData = await getPostById(data.id, user?.id);
        if (newPostData) {
          const mapped: Post = {
            id: newPostData.id,
            content: newPostData.content,
            mood: newPostData.mood as MoodType,
            imageUrl: newPostData.imageUrl || undefined,
            createdAt: "Baru saja",
            isAnonymous: newPostData.isAnonymous,
            author: {
              nickname: newPostData.author?.username || "Anonim",
              avatar: newPostData.author?.avatar || "👻",
            },
            authorIsPrivate: newPostData.author?.isPrivate,
            likes: newPostData.likes,
            commentsCount: newPostData.commentsCount,
            isLiked: newPostData.isLiked,
          };
          setPosts(prev => [mapped, ...prev]);
        }
      } catch (err) {
        console.error("Realtime fetch error:", err);
      }
    });

    // Realtime likes
    channel.bind("new-like", (data: any) => {
      // Update like count in feed
      getPostById(data.postId, user?.id).then(dbPost => {
        if (dbPost) {
           setPosts(prev => prev.map(p => p.id === data.postId ? { ...p, likes: dbPost.likes } : p));
        }
      });
    });

    // Realtime comments
    channel.bind("new-comment", (data: any) => {
      // Update comment count in feed
      getPostById(data.postId, user?.id).then(dbPost => {
        if (dbPost) {
           setPosts(prev => prev.map(p => p.id === data.postId ? { ...p, commentsCount: dbPost.commentsCount } : p));
        }
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("jago-curhat");
    };
  }, [user?.id]);

  const router = useRouter();

  const handleLikePost = async (postId: string) => {
    if (!user) {
      toast.error("Masuk dulu ya buat kasih dukungan! 👻");
      router.push("/login");
      return;
    }

    // Optimistic UI update
    const previousPosts = [...posts];
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

    try {
      await toggleLike(postId, user.id);
    } catch (error) {
      setPosts(previousPosts);
      toast.error("Gagal mengirim dukungan... 🌌");
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

  // Filter posts based on mood AND privacy logic
  const filteredPosts = posts.filter((p) => {
    // 1. Mood filter
    if (selectedMood !== "Semua" && p.mood !== selectedMood) return false;

    // 2. Privacy filter: 
    // If author is private AND not anonymous AND not the current user AND not a friend
    if (p.authorIsPrivate && !p.isAnonymous && user?.nickname !== p.author.nickname) {
      const isFriend = user?.friends?.includes(p.author.nickname);
      if (!isFriend) return false;
    }

    return true;
  });

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
