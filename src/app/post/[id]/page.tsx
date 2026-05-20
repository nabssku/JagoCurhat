"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PostCard, { Post } from "@/components/PostCard";
import CommentItem, { Comment } from "@/components/CommentItem";
import AvatarCartoon from "@/components/AvatarCartoon";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { ArrowLeft, Send, Sparkles, Camera, X } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";

import { getPostById, toggleLike } from "@/actions/postActions";
import { addComment, getCommentsByPostId } from "@/actions/commentActions";
import { getFollowingList } from "@/actions/followActions";
import { getPusherClient } from "@/lib/pusher";
import RichEditor from "@/components/RichEditor";

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const { user } = useAuth();
  const { accent, cardStyle } = useTheme();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(true);
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      getFollowingList(user.id).then(setFollowing);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;
    
    const pusher = getPusherClient();
    const channel = pusher.subscribe("jago-curhat");

    // Realtime likes
    channel.bind("new-like", (data: any) => {
      if (data.postId === postId) {
        // We could fetch actual count or just increment/decrement if we knew if it was a like/unlike
        // For simplicity, let's fetch fresh post data for counts
        getPostById(postId, user?.id).then(dbPost => {
          if (dbPost) {
            setPost(prev => prev ? { ...prev, likes: dbPost.likes } : null);
          }
        });
      }
    });

    // Realtime comments
    channel.bind("new-comment", async (data: any) => {
      if (data.postId === postId) {
         // Optionally skip if I'm the sender (already handled optimistically in form submit)
         // But logic below fetches ALL fresh comments to be safe
         const dbComments = await getCommentsByPostId(postId);
         const mappedComments: Comment[] = (dbComments as any[]).map(c => ({
           id: c.id,
           content: c.content,
           imageUrl: c.imageUrl || undefined,
           isAnonymous: c.isAnonymous,
           createdAt: new Date(c.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
           author: {
             nickname: (c.author as any)?.username || "Anonim",
             avatar: (c.author as any)?.avatar || "👤",
           },
           likes: 0,
         }));
         setComments(mappedComments);
         
         // Update post comment count
         setPost(prev => prev ? { ...prev, commentsCount: mappedComments.length } : null);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("jago-curhat");
    };
  }, [postId, user?.id]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [dbPost, dbComments] = await Promise.all([
          getPostById(postId, user?.id),
          getCommentsByPostId(postId),
        ]);

        if (dbPost) {
          setPost({
            id: dbPost.id,
            content: dbPost.content,
            mood: dbPost.mood as any,
            imageUrl: dbPost.imageUrl || undefined,
            createdAt: new Date(dbPost.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            isAnonymous: dbPost.isAnonymous,
            author: {
              nickname: (dbPost.author as any)?.username || "Anonim",
              avatar: (dbPost.author as any)?.avatar || "👤",
            },
            authorIsPrivate: (dbPost.author as any)?.isPrivate,
            likes: dbPost.likes,
            commentsCount: dbPost.commentsCount,
            isLiked: dbPost.isLiked,
          });
        }

        const mappedComments: Comment[] = (dbComments as any[]).map(c => ({
          id: c.id,
          content: c.content,
          imageUrl: c.imageUrl || undefined,
          isAnonymous: c.isAnonymous,
          createdAt: new Date(c.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          author: {
            nickname: (c.author as any)?.username || "Anonim",
            avatar: (c.author as any)?.avatar || "👤",
          },
          likes: 0,
        }));

        setComments(mappedComments);
      } catch (error) {
        toast.error("Gagal menjemput isi hati... 🌌");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId, user?.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 1MB ya!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImage(reader.result as string);
        toast.success("Gambar ditambahkan ke balasan! 📸");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() && !commentImage) {
      toast.error("Tulis kata-kata penyemangat atau kirim gambar dulu ya!");
      return;
    }

    if (!user) {
      toast.error("Kamu harus login dulu ya!");
      return;
    }

    try {
      await addComment({
        postId,
        userId: user.id,
        content: newComment.trim(),
        imageUrl: commentImage || undefined,
        isAnonymous,
      });

      // Clear state
      setNewComment("");
      setCommentImage(null);
      toast.success("Dukungan balasan terkirim! 🌸");

      // Reload comments
      const dbComments = await getCommentsByPostId(postId);
      const mappedComments: Comment[] = (dbComments as any[]).map(c => ({
        id: c.id,
        content: c.content,
        imageUrl: c.imageUrl || undefined,
        isAnonymous: c.isAnonymous,
        createdAt: new Date(c.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        author: {
          nickname: c.author?.username || "Anonim",
          avatar: c.author?.avatar || "👤",
        },
        likes: 0,
      }));
      setComments(mappedComments);

      // Increment local count
      if (post) {
        setPost({ ...post, commentsCount: post.commentsCount + 1 });
      }
      
    } catch (error) {
      toast.error("Yah, gagal mengirim balasan. Coba lagi ya!");
      console.error(error);
    }
  };

  const handleLikePost = async () => {
    if (!user || !post) {
      toast.error("Masuk dulu ya buat kasih dukungan! 👻");
      return;
    }

    // Optimistic UI update
    const previousPost = { ...post };
    const nextLiked = !post.isLiked;
    setPost({
      ...post,
      isLiked: nextLiked,
      likes: nextLiked ? post.likes + 1 : post.likes - 1,
    });

    try {
      await toggleLike(postId, user.id);
    } catch (error) {
      setPost(previousPost);
      toast.error("Gagal mengirim dukungan... 🌌");
    }
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

      {/* Reply input drawer - Absolute to stay within the mobile container frame */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe-bottom border-t border-border/60 bg-card/95 backdrop-blur-lg z-50 max-w-md mx-auto">
        <form onSubmit={handleSendComment} className="flex flex-col gap-3">
          {/* Image Preview (if any) */}
          {commentImage && (
            <div className="flex items-center gap-3 px-2 mb-1 animate-in fade-in slide-in-from-left-2">
              <div className="relative">
                <img src={commentImage} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-accent/30 shadow-sm" />
                <button
                  type="button"
                  onClick={() => setCommentImage(null)}
                  className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-rose-500 text-white shadow-md hover:scale-110 transition-transform"
                >
                  <X size={10} />
                </button>
              </div>
              <p className="text-[10px] text-text-muted italic">Gambar siap dikirim... ✨</p>
            </div>
          )}

          <RichEditor 
            content={newComment}
            onChange={setNewComment}
            placeholder="Berikan dukungan..."
            mentions={following.map(f => f.username)}
            barMode={true}
            leftActions={
              <label className="p-1.5 rounded-full hover:bg-white/5 cursor-pointer transition-all btn-bounce text-zinc-400 hover:text-accent">
                <Camera size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            }
            actions={
              <button
                type="submit"
                className={`w-9 h-9 rounded-full font-bold flex items-center justify-center cursor-pointer btn-bounce tap-highlight-none transition-all duration-200 shrink-0 ${
                  cardStyle === "doodle"
                    ? "border border-accent bg-accent/15 text-accent shadow-[2px_2px_0px_0px_var(--accent)]"
                    : "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg shadow-accent/20"
                }`}
              >
                <Send size={14} className="ml-0.5" />
              </button>
            }
          />

          {/* Anonymous toggle settings */}
          <div className="flex justify-between items-center text-[10px] text-text-muted px-1 select-none">
            <span className="flex items-center gap-1.5">
              <span>Balas sebagai Anonim</span>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-8 h-4.5 rounded-full relative p-0.5 transition-colors duration-200 cursor-pointer ${
                  isAnonymous ? "bg-accent" : "bg-zinc-800"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ${
                    isAnonymous ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </span>
            <span>{isAnonymous ? "Identitas disembunyikan 👻" : `Tampil sebagai ${user?.nickname}`}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
