"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getPosts, searchPosts } from "@/actions/postActions";
import { toast } from "sonner";
import PostCard, { Post } from "@/components/PostCard";
import { Search, Flame, TrendingUp } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let dbPosts;
        if (searchQuery.trim()) {
          dbPosts = await searchPosts(searchQuery.trim(), user?.id);
        } else {
          // Fetch trending/top posts or just recent ones for now
          dbPosts = await getPosts(user?.id);
        }
        
        const mappedPosts: Post[] = (dbPosts as any[]).map(p => ({
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
        }));
        setPosts(mappedPosts);
      } catch (error) {
        console.error(error);
        toast.error("Gagal menjajaki semesta curhat... 🌌");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPosts, searchQuery ? 500 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery, user?.id]);

  const filteredPosts = posts; // Already filtered by server

  const trendingHashtags = [
    "#SkripsiMentok",
    "#CapekKuliah",
    "#OverthinkingMalam",
    "#ButuhTemanCerita",
    "#LegaLulus",
    "#ToxicCircle",
  ];

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border/60 sticky top-0 bg-background/90 backdrop-blur-md z-30 select-none">
        <h1 className="text-base font-bold text-foreground">Jelajah</h1>
        <p className="text-[10px] text-text-muted">Temukan cerita yang senasib dengan perasaanmu</p>
      </div>

      <div className="p-4 space-y-5">
        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Cari kata kunci atau mood (misal: 'capek')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="curhat-input w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zinc-950/60 border border-border text-sm text-foreground focus:outline-none placeholder-zinc-700 font-medium"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
             <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
             <p className="text-[10px] text-text-muted animate-pulse font-medium">Mencari cerita senasib...</p>
          </div>
        ) : searchQuery ? (
          /* Search results */
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 select-none">
              Hasil Pencarian ({filteredPosts.length})
            </h2>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <EmptyState
                title="Cerita tidak ditemukan"
                description="Coba cari dengan kata kunci lain seperti 'kuliah', 'teman', atau 'lega'."
                mascotState="idle"
              />
            )}
          </div>
        ) : (
          /* Standard explore screen */
          <>
            {/* Trending tags */}
            <div className="space-y-3 select-none">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Flame size={14} className="text-orange-500" />
                Topik Populer
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {trendingHashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag.replace("#", ""))}
                    className="p-3 rounded-2xl border border-border bg-card/60 hover:border-accent/40 text-left text-xs font-semibold hover:text-accent cursor-pointer tap-highlight-none btn-bounce"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular confession snippet list */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 flex items-center gap-1.5 select-none">
                <TrendingUp size={14} className="text-accent" />
                Curhatan Teratas
              </h2>
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
