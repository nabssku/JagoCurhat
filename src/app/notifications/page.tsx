"use client";

import React, { useState, useEffect } from "react";
import AvatarCartoon from "@/components/AvatarCartoon";
import { Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notificationActions";
import { followUser, requestFollow, getFollowStatus } from "@/actions/followActions";
import { getPusherClient } from "@/lib/pusher";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [followStatuses, setFollowStatuses] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications(user!.id);
      setNotifications(data);
      
      // Fetch follow statuses for actors in parallel
      const actorIds = [...new Set(data.map((n: any) => n.actor?.id).filter(Boolean))];
      const statuses: Record<string, string | null> = {};
      
      await Promise.all(actorIds.map(async (id: any) => {
        const s = await getFollowStatus(user!.id, id as string);
        statuses[id as string] = s;
      }));
      setFollowStatuses(statuses);
    } catch (error) {
      toast.error("Gagal memuat notifikasi... 🔔");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowBack = async (actor: any) => {
    if (!user || !actor) return;
    try {
      if (actor.isPrivate) {
        await requestFollow(user.id, actor.id);
        setFollowStatuses(prev => ({ ...prev, [actor.id]: "pending" }));
        toast.success(`Minta ikuti dikirim ke ${actor.username} 🌸`);
      } else {
        await followUser(user.id, actor.id);
        setFollowStatuses(prev => ({ ...prev, [actor.id]: "accepted" }));
        toast.success(`Berhasil mengikuti balik ${actor.username} ✨`);
      }
    } catch (err) {
      toast.error("Gagal mengikuti balik.");
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Semua notifikasi ditandai telah dibaca!");
    } catch (err) {
      toast.error("Gagal memperbarui notifikasi.");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev: any[]) =>
        prev.map((n: any) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotifContent = (notif: any) => {
    switch (notif.type) {
      case "like": return "menyukai curhatanmu.";
      case "comment": return "membalas curhatanmu.";
      case "follow": return "mulai mengikuti kamu.";
      case "reply": return "membalas komentarmu.";
      default: return "mengirimkan sesuatu padamu.";
    }
  };

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
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id)}
                className={`p-4 rounded-3xl border flex gap-3 transition-all duration-200 cursor-pointer tap-highlight-none ${
                  !notif.isRead
                    ? "bg-accent/5 border-accent/25"
                    : "bg-card border-border hover:border-accent/35"
                }`}
              >
                {/* User cartoon avatar */}
                <AvatarCartoon avatar={notif.actor?.avatar || "👻"} seedName={notif.actor?.username || "Seseorang"} size="sm" />

                {/* Info summary */}
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start select-none">
                    <span className="text-xs font-bold text-foreground">{notif.actor?.username || "Seseorang"}</span>
                    <span className="text-[9px] text-text-muted">
                      {new Date(notif.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {getNotifContent(notif)}
                  </p>
                  
                  {notif.type === "follow" && !followStatuses[notif.actor?.id] && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowBack(notif.actor);
                      }}
                      className="mt-2 px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-bold btn-bounce"
                    >
                      Ikuti Balik
                    </button>
                  )}
                  {notif.type === "follow" && followStatuses[notif.actor?.id] === "pending" && (
                    <span className="mt-2 inline-block px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold border border-border/40">
                      Diminta
                    </span>
                  )}
                  {notif.type === "follow" && followStatuses[notif.actor?.id] === "accepted" && (
                    <span className="mt-2 inline-block px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-500 text-[10px] font-bold border border-border/40">
                      Mengikuti
                    </span>
                  )}
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
