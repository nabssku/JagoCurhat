"use server";

import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
  try {
    const result = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
        actor: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
          isPrivate: users.isPrivate,
        },
        postId: notifications.postId,
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.actorId, users.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    return result;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

export async function markNotificationAsRead(notifId: string) {
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notifId));
  revalidatePath("/notifications");
}

export async function markAllNotificationsAsRead(userId: string) {
  await db.update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  revalidatePath("/notifications");
}
