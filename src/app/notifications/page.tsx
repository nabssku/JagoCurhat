"use client";

import React, { useState } from "react";
import { MOCK_NOTIFICATIONS } from "@/constants/dummyData";
import AvatarCartoon from "@/components/AvatarCartoon";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("Semua notifikasi ditandai telah dibaca!");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border/60 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-30 select-none">
        <div>
          <h1 className="text-base font-bold text-foreground">Notifikasi</h1>
          <p className="text-[10px] text-text-muted">Pantau interaksi hangat di postinganmu</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] text-accent font-bold hover:underline cursor-pointer tap-highlight-none btn-bounce"
          >
            Tandai Dibaca Semua
          </button>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-start">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  // Mark as read
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
                  );
                  toast.success("Notifikasi dibuka!");
                }}
                className={`p-4 rounded-3xl border flex gap-3 transition-all duration-200 cursor-pointer tap-highlight-none ${
                  notif.unread
                    ? "bg-accent/5 border-accent/25"
                    : "bg-card border-border hover:border-accent/35"
                }`}
              >
                {/* User cartoon avatar */}
                <AvatarCartoon avatar={notif.author.avatar} seedName={notif.author.nickname} size="sm" />

                {/* Info summary */}
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start select-none">
                    <span className="text-xs font-bold text-foreground">{notif.author.nickname}</span>
                    <span className="text-[9px] text-text-muted">{notif.createdAt}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {notif.content}
                  </p>
                </div>

                {/* Reaction icon indicator */}
                <div className="flex items-center justify-center pl-1">
                  {notif.type === "like" ? (
                    <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <Heart size={12} className="fill-current" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent">
                      <MessageCircle size={12} className="fill-current" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada notifikasi"
            description="Saat ada teman yang menyukai atau membalas curhatanmu, notifikasinya bakal muncul di sini."
            mascotState="wave"
          />
        )}
      </div>
    </div>
  );
}
