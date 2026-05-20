"use client";

import React, { useState } from "react";
import AvatarCartoon from "./AvatarCartoon";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

import Link from "next/link";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  isAnonymous: boolean;
  author: {
    nickname: string;
    avatar: string;
  };
  imageUrl?: string;
  likes: number;
  isLiked?: boolean;
}

interface CommentItemProps {
  comment: Comment;
  onLike?: (id: string) => void;
}

export default function CommentItem({ comment, onLike }: CommentItemProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  const handleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    if (nextLiked) {
      toast.success("Dukungan balasan dikirim! 🌸");
    }

    if (onLike) onLike(comment.id);
  };

  const displayName = comment.isAnonymous ? "Anonim" : comment.author.nickname;
  const displayAvatar = comment.isAnonymous ? "👻" : comment.author.avatar;
  const isMe = user?.nickname === comment.author.nickname;
  const profileHref = isMe ? "/profile" : `/user/${comment.author.nickname}`;

  return (
    <div className="flex gap-3 p-4 rounded-2xl bg-card/40 border border-border/40 select-none">
      {comment.isAnonymous ? (
        <AvatarCartoon
          avatar={displayAvatar}
          seedName={displayName}
          size="sm"
        />
      ) : (
        <Link href={profileHref} className="tap-highlight-none">
          <AvatarCartoon
            avatar={displayAvatar}
            seedName={displayName}
            size="sm"
          />
        </Link>
      )}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {comment.isAnonymous ? (
              <>
                <span className="text-xs font-bold text-foreground">{displayName}</span>
                <span className="text-[9px] bg-accent/15 text-accent px-1 rounded-sm font-semibold">
                  Anonim
                </span>
              </>
            ) : (
              <Link href={profileHref} className="hover:text-accent transition-colors duration-200">
                <span className="text-xs font-bold text-foreground">{displayName}</span>
              </Link>
            )}
          </div>
          <span className="text-[10px] text-text-muted">{comment.createdAt}</span>
        </div>
        <div 
          className="text-sm text-zinc-300 leading-relaxed rich-content"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />
        
        {/* Comment Image (if any) - Cute styling */}
        {comment.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-border/30 shadow-sm mt-2 max-w-[200px]">
            <img src={comment.imageUrl} alt="Lampiran Balasan" className="w-full object-cover max-h-40" />
          </div>
        )}
      </div>

      {/* Heart rate indicator */}
      <div className="flex flex-col items-center justify-center pl-1">
        <button
          onClick={handleLike}
          className={`p-1.5 rounded-lg btn-bounce tap-highlight-none transition-colors duration-200 cursor-pointer flex flex-col items-center gap-0.5 ${
            liked ? "text-rose-500" : "text-text-muted hover:text-rose-400"
          }`}
        >
          <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.2 }}>
            <Heart size={14} className={liked ? "fill-rose-500 stroke-rose-500" : "stroke-current"} />
          </motion.div>
          <span className="text-[9px] font-medium leading-none">{likesCount}</span>
        </button>
      </div>
    </div>
  );
}
