"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Users, PenTool } from "lucide-react";
import AvatarCartoon from "@/components/AvatarCartoon";
import PostCard, { Post } from "@/components/PostCard";
import { useAuth } from "@/hooks/useAuth";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

import { getUserProfile } from "@/actions/userActions";
import { getUserPosts, toggleLike } from "@/actions/postActions";
import { followUser, requestFollow, unfollowUser, getFollowStatus } from "@/actions/followActions";

interface UserDetailPageProps {
  params: Promise<{
    nickname: string;
  }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const { nickname } = use(params);
  const { user: currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser?.nickname === decodeURIComponent(nickname)) {
       router.replace("/profile");
    }
  }, [currentUser, nickname, router]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [targetUser, setTargetUser] = useState<{
    id: string;
    nickname: string;
    avatar: string;
    isPrivate: boolean;
    followersCount: number;
    followingCount: number;
    postsCount: number;
  } | null>(null);

  const [followStatus, setFollowStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodedNickname = decodeURIComponent(nickname);
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // 1. Fetch profile first to get the UUID
        const profile = await getUserProfile(decodedNickname);
        
        if (profile) {
          setTargetUser({
            id: profile.id,
            nickname: profile.username,
            avatar: profile.avatar || "👤",
            isPrivate: profile.isPrivate,
            followersCount: profile.followersCount,
            followingCount: profile.followingCount,
            postsCount: profile.postsCount,
          });

          // 2. Fetch posts and status in parallel using profile.id
          const [dbPosts, status] = await Promise.all([
            getUserPosts(profile.id, currentUser?.id),
            currentUser?.id ? getFollowStatus(currentUser.id, profile.id) : Promise.resolve(null)
          ]);

          setFollowStatus(status);

          // 3. Map posts
          const mappedPosts: Post[] = (dbPosts as any[]).map(p => ({
            id: p.id,
            content: p.content,
            mood: p.mood as any,
            imageUrl: p.imageUrl || undefined,
            createdAt: new Date(p.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            isAnonymous: p.isAnonymous,
            author: {
              nickname: p.author?.username || "Anonim",
              avatar: p.author?.avatar || "👤",
            },
            likes: p.likes,
            commentsCount: p.commentsCount,
            isLiked: p.isLiked,
            isBookmarked: p.isBookmarked,
          }));
          setUserPosts(mappedPosts);
        }
      } catch (error) {
        toast.error("Gagal menjemput profil... 🌌");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [nickname, currentUser?.id]);

  const handleLikePost = async (postId: string) => {
    if (!currentUser) {
      toast.error("Login dulu ya! 👻");
      return;
    }
    try {
      await toggleLike(postId, currentUser.id);
      // Refresh local state or just optimistic
      setUserPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return { ...p, isLiked: nextLiked, likes: nextLiked ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      }));
    } catch (err) {
      toast.error("Gagal memberi dukungan.");
    }
  };

  const handleFollowAction = async () => {
    if (!targetUser || !currentUser) return;

    try {
      if (followStatus === "accepted" || followStatus === "pending") {
        await unfollowUser(currentUser.id, targetUser.id);
        setFollowStatus(null);
        toast.info(`Berhenti mengikuti ${targetUser.nickname}`);
      } else {
        if (targetUser.isPrivate) {
          await requestFollow(currentUser.id, targetUser.id);
          setFollowStatus("pending");
          toast.success("Minta Ikuti dikirim! Tunggu persetujuan ya 🌸");
        } else {
          await followUser(currentUser.id, targetUser.id);
          setFollowStatus("accepted");
          toast.success(`Mulai mengikuti ${targetUser.nickname} ✨`);
        }
      }
    } catch (error) {
      toast.error("Gagal memproses pertemanan... 🌌");
      console.error(error);
    }
  };

  if (loading) return <LoadingState message="Mencari profil..." showSkeleton />;
  if (!targetUser) return <EmptyState title="User tidak ditemukan" description="Mungkin alamatnya salah atau user sudah pindah semesta." />;

  const isPrivate = targetUser.isPrivate;
  const isMe = currentUser?.id === targetUser.id;
  const isRequested = followStatus === "pending";
  const isFollowing = followStatus === "accepted";
  const isLocked = isPrivate && !isFollowing && !isMe;

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border/60 flex items-center gap-3 sticky top-0 bg-background/90 backdrop-blur-md z-30 select-none">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-xl border border-border hover:border-accent/40 hover:text-accent btn-bounce tap-highlight-none cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-foreground">Profil {targetUser.nickname}</h1>
      </div>

      {/* User Info Card */}
      <div className="p-5 flex flex-col items-center text-center space-y-4 border-b border-border/40 select-none bg-card/10">
        <AvatarCartoon avatar={targetUser.avatar} seedName={targetUser.nickname} size="xl" />
        
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-base font-bold text-foreground">{targetUser.nickname}</h2>
            {isPrivate && (
              <div className="p-1 rounded-md bg-accent/10 border border-accent/20" title="Akun Privat">
                <Lock size={12} className="text-accent" />
              </div>
            )}
          </div>
        </div>

        {/* Follow Button for Profile action */}
        {!isMe && (
          <button 
            onClick={handleFollowAction}
            className={`px-8 py-2 rounded-full font-bold text-xs transition-all duration-300 btn-bounce tap-highlight-none ${
              isFollowing 
                ? "bg-zinc-800 text-foreground border border-border" 
                : isRequested
                ? "bg-zinc-800 text-zinc-400 border border-border/40"
                : "bg-accent text-white shadow-lg shadow-accent/20"
            }`}
          >
            {isFollowing ? "Mengikuti" : isRequested ? "Diminta" : "Ikuti"}
          </button>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm pt-2">
          <div className="p-3 bg-card border border-border/60 rounded-2xl">
            <p className="text-sm font-bold text-foreground">
              {isLocked ? "-" : targetUser.postsCount}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">Curhatan</p>
          </div>
          <div className="p-3 bg-card border border-border/60 rounded-2xl">
            <p className="text-sm font-bold text-foreground">
              {isLocked ? "-" : targetUser.followersCount}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">Pengikut</p>
          </div>
          <div className="p-3 bg-card border border-border/60 rounded-2xl">
            <p className="text-sm font-bold text-foreground">
              {isLocked ? "-" : targetUser.followingCount}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5 whitespace-nowrap">Mengikuti</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1">
        {isLocked ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent/60 mb-2 border border-accent/20">
              <Lock size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">Akun ini Privat</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Yah akun privat, gabisa liat curhatannya dehh... 😔
              </p>
            </div>
            <button 
              className={`mt-4 px-8 py-3 rounded-full font-bold text-sm btn-bounce tap-highlight-none transition-all duration-300 ${
                isRequested 
                  ? "bg-zinc-800 text-zinc-400 border border-border/40" 
                  : "bg-accent text-white shadow-lg shadow-accent/25"
              }`}
              onClick={handleFollowAction}
            >
              {isRequested ? "Menunggu Persetujuan..." : "Minta Ikuti"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 mb-2 flex items-center gap-2">
              <PenTool size={12} /> Curhatan Terbaru
            </h3>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLikePost} 
                />
              ))
            ) : (
              <EmptyState
                title="Belum ada curhatan"
                description="User ini belum membagikan ceritanya secara publik."
                mascotState="sleepy"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
