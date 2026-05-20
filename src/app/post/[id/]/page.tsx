"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MOCK_POSTS, MOCK_COMMENTS } from "@/constants/dummyData";
import PostCard, { Post } from "@/components/PostCard";
import CommentItem, { Comment } from "@/components/CommentItem";
import AvatarCartoon from "@/components/AvatarCartoon";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const { user } = useAuth();
  const { cardStyle } = useTheme();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const fetchPostAndComments = () => {
      // Find post
      const savedCustom = localStorage.getItem("jc_custom_posts");
      const customPosts: Post[] = savedCustom ? JSON.parse(savedCustom) : [];
      const allPosts = [...customPosts, ...MOCK_POSTS];
      
      const foundPost = allPosts.find((p) => p.id === postId);

      if (foundPost) {
        setPost(foundPost);

        // Find comments
        const defaultComments = MOCK_COMMENTS[postId] || [];
        const savedComments = localStorage.getItem(`jc_comments_${postId}`);
        const customComments: Comment[] = savedComments ? JSON.parse(savedComments) : [];
        
        // Merge and order comments
        setComments([...customComments, ...defaultComments]);
      }
      setLoading(false);
    };

    const timer = setTimeout(fetchPostAndComments, 500);
    return () => clearTimeout(timer);
  }, [postId]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Tulis kata-kata penyemangat dulu ya!");
      return;
    }

    if (!post) return;

    const newReply: Comment = {
      id: `comment-${Date.now()}`,
      content: newComment.trim(),
      createdAt: "Baru saja",
      isAnonymous,
      author: {
        nickname: user?.nickname || "Teman Curhat",
        avatar: user?.avatar || "👻",
      },
      likes: 0,
      isLiked: false,
    };

    // Save custom comment
    const savedComments = localStorage.getItem(`jc_comments_${postId}`);
    const customComments: Comment[] = savedComments ? JSON.parse(savedComments) : [];
    const updatedCustom = [newReply, ...customComments];
    localStorage.setItem(`jc_comments_${postId}`, JSON.stringify(updatedCustom));

    // Update locally
    setComments((prev) => [newReply, ...prev]);
    setNewComment("");
    
    // Update comments count in post
    const updatedPost = { ...post, commentsCount: post.commentsCount + 1 };
    setPost(updatedPost);

    // Sync comment count back to posts storage
    const savedCustom = localStorage.getItem("jc_custom_posts");
    if (savedCustom) {
      const customPosts: Post[] = JSON.parse(savedCustom);
      const isCustom = customPosts.some((cp) => cp.id === postId);
      if (isCustom) {
        const updatedCustomPosts = customPosts.map((p) =>
          p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
        );
        localStorage.setItem("jc_custom_posts", JSON.stringify(updatedCustomPosts));
      }
    }

    toast.success("Dukungan balasan terkirim! 🌸");
  };

  const handleLikePost = () => {
    if (!post) return;
    const nextLiked = !post.isLiked;
    const updatedPost = {
      ...post,
      isLiked: nextLiked,
      likes: nextLiked ? post.likes + 1 : post.likes - 1,
    };
    setPost(updatedPost);
  };

  if (loading) {
    return <LoadingState message="Memuat balasan hangat..." showSkeleton />;
  }

  if (!post) {
    return (
      <div className="flex-1 flex flex-col justify-center">
        <EmptyState
          title="Cerita tidak ditemukan"
          description="Mungkin cerita ini telah dihapus oleh penulisnya atau tautannya salah."
          actionText="Kembali ke Beranda"
          onActionClick={() => router.push("/")}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background pb-32">
      {/* Navigation Header */}
      <div className="p-4 border-b border-border/60 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-30 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-xl border border-border hover:border-accent/40 hover:text-accent btn-bounce tap-highlight-none cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-bold text-foreground">Curhatan</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Core Post Confession */}
        <PostCard post={post} onLike={handleLikePost} isDetailView />

        {/* Comment list */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 select-none flex items-center gap-1.5">
            <Sparkles size={13} className="text-accent" />
            Balasan Hangat ({comments.length})
          </h3>

          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="py-4">
              <EmptyState
                title="Belum ada tanggapan"
                description="Berikan dukungan emosional pertamamu untuk menunjukkan bahwa ia tidak sendirian."
                mascotState="wave"
              />
            </div>
          )}
        </div>
      </div>

      {/* Reply input drawer panel */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border/60 bg-card/95 backdrop-blur-lg z-40 max-w-md mx-auto">
        <form onSubmit={handleSendComment} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Kirim kata-kata penyemangat..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="curhat-input flex-1 p-3 rounded-2xl bg-zinc-950/60 border border-border text-xs text-foreground focus:outline-none placeholder-zinc-700 font-medium"
            />
            <button
              type="submit"
              className={`p-3 rounded-2xl font-bold flex items-center justify-center cursor-pointer btn-bounce tap-highlight-none transition-all duration-200 shrink-0 ${
                cardStyle === "doodle"
                  ? "border border-accent bg-accent/15 text-accent shadow-[2px_2px_0px_0px_var(--accent)]"
                  : "bg-accent text-accent-foreground hover:bg-accent-hover"
              }`}
            >
              <Send size={14} />
            </button>
          </div>

          {/* Anonymity settings for comment */}
          <div className="flex justify-between items-center text-[10px] text-text-muted px-1 select-none">
            <span className="flex items-center gap-1.5">
              <span>Balas sebagai Anonim</span>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-7 h-4 rounded-full relative p-0.5 transition-colors duration-200 cursor-pointer ${
                  isAnonymous ? "bg-accent" : "bg-zinc-800"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
                    isAnonymous ? "translate-x-3" : "translate-x-0"
                  }`}
                />
              </button>
            </span>
            <span>{isAnonymous ? "Identitas disembunyikan 👻" : `Posting sebagai ${user?.nickname}`}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
