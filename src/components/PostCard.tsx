"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AvatarCartoon from "./AvatarCartoon";
import MoodBadge, { MoodType } from "./MoodBadge";
import { toast } from "sonner";

export interface Post {
  id: string;
  content: string;
  mood: MoodType;
  createdAt: string;
  isAnonymous: boolean;
  author: {
    nickname: string;
    avatar: string;
  };
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  isDetailView?: boolean;
}

export default function PostCard({
  post,
  onLike,
  onBookmark,
  isDetailView = false,
}: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    if (nextLiked) {
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
      toast.success("Dukungan dikirim! ❤️");
    }

    if (onLike) onLike(post.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    
    if (nextBookmarked) {
      toast.success("Curhatan disimpan ke Bookmark! 🔖");
    }

    if (onBookmark) onBookmark(post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Copy mockup link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast.success("Link disalin! Bagikan ke temanmu 🔗");
  };

  const displayName = post.isAnonymous ? "Anonim" : post.author.nickname;
  const displayAvatar = post.isAnonymous ? "👻" : post.author.avatar;

  const cardContent = (
    <div className="curhat-card p-5 rounded-3xl transition-all duration-200 select-none flex flex-col gap-4 relative overflow-hidden bg-card border border-border">
      {/* Pop animation effect */}
      <AnimatePresence>
        {showHeartPop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 2.2, 0], opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 text-rose-500 text-6xl"
          >
            ❤️
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header (Author info + Date) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AvatarCartoon
            avatar={displayAvatar}
            seedName={displayName}
            size="md"
          />
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              {displayName}
              {post.isAnonymous && (
                <span className="text-[10px] bg-accent/15 text-accent px-1.5 py-0.5 rounded-md font-semibold">
                  Anonim
                </span>
              )}
            </h4>
            <span className="text-xs text-text-muted">{post.createdAt}</span>
          </div>
        </div>

        {/* Mood Badge */}
        <MoodBadge mood={post.mood} size="sm" />
      </div>

      {/* Confession body text */}
      <p className="text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Bottom Actions Row */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-text-muted text-xs">
        {/* Support Like Heart Button */}
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/5 transition-all duration-200 tap-highlight-none btn-bounce cursor-pointer font-medium"
        >
          <motion.div
            animate={liked ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={liked ? "text-rose-500" : ""}
          >
            <Heart
              size={18}
              className={liked ? "fill-rose-500 stroke-rose-500" : "stroke-current"}
            />
          </motion.div>
          <span>{likesCount} Dukungan</span>
        </button>

        {/* Comment Trigger Button */}
        {isDetailView ? (
          <div className="flex items-center gap-1.5 p-1.5">
            <MessageCircle size={18} className="stroke-current" />
            <span>{post.commentsCount} Komentar</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 hover:text-accent p-1.5 rounded-lg hover:bg-accent/5 transition-all duration-200 tap-highlight-none">
            <MessageCircle size={18} className="stroke-current" />
            <span>{post.commentsCount} Balasan</span>
          </div>
        )}

        {/* Bookmark and Share */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg btn-bounce cursor-pointer tap-highlight-none transition-colors duration-200 ${
              bookmarked ? "text-accent hover:bg-accent/5" : "hover:text-accent hover:bg-accent/5"
            }`}
            title="Simpan"
          >
            <Bookmark
              size={17}
              className={bookmarked ? "fill-accent stroke-accent" : "stroke-current"}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:text-accent hover:bg-accent/5 btn-bounce cursor-pointer tap-highlight-none"
            title="Bagikan"
          >
            <Share2 size={17} className="stroke-current" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isDetailView) {
    return cardContent;
  }

  return (
    <Link href={`/post/${post.id}`} className="block tap-highlight-none">
      {cardContent}
    </Link>
  );
}
