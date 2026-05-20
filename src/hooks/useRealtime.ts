import { useEffect } from "react";
import { getPusherClient } from "@/lib/pusher";
import { toast } from "sonner";

export function useRealtime(currentUserId?: string) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe("jago-curhat");

    // Listen for new posts
    channel.bind("new-post", (data: any) => {
      // If it's not my own post, show a toast
      if (data.userId !== currentUserId) {
        toast.info("Ada curhatan baru masuk! ✨", {
          action: {
            label: "Lihat",
            onClick: () => window.location.href = "/"
          }
        });
      }
    });

    // Listen for likes on my posts (simplified, usually we'd need to know post owner)
    channel.bind("new-like", (data: any) => {
        // We could fetch notifications count or show toast if we had more info
        console.log("Realtime Like:", data);
    });

    // Listen for new follow for ME
    channel.bind("new-follow", (data: any) => {
        if (data.userId === currentUserId) {
            toast.success("Yeay! Seseorang baru saja mengikutimu. 🌸", {
                action: {
                    label: "Cek",
                    onClick: () => window.location.href = "/notifications"
                }
            });
        }
    });

    // Listen for new comment
    channel.bind("new-comment", (data: any) => {
       console.log("Realtime Comment:", data);
    });

    return () => {
      pusher.unsubscribe("jago-curhat");
    };
  }, [currentUserId]);
}
