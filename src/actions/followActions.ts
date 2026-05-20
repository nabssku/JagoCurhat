"use server";

import { db } from "@/db";
import { follows, notifications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher";

export async function followUser(followerId: string, followingId: string) {
  const [newFollow] = await db.insert(follows).values({
    followerId,
    followingId,
    status: "accepted",
  }).returning();
  
  // Create notification
  await db.insert(notifications).values({
    userId: followingId,
    actorId: followerId,
    type: "follow",
  });

  revalidatePath(`/user/${followingId}`); // Note: usually we'd use nickname but schema uses ID for references
  
  // Trigger Realtime
  await pusherServer.trigger("jago-curhat", "new-follow", {
    userId: followingId,
    followerId: followerId,
  });

  return newFollow;
}

export async function requestFollow(followerId: string, followingId: string) {
  const [newRequest] = await db.insert(follows).values({
    followerId,
    followingId,
    status: "pending",
  }).returning();

  // Create notification
  await db.insert(notifications).values({
    userId: followingId,
    actorId: followerId,
    type: "follow", // Or 'follow_request' if you add it to the enum, but 'follow' is fine for now
  });

  revalidatePath(`/user/${followingId}`);

  // Trigger Realtime
  await pusherServer.trigger("jago-curhat", "new-follow", {
    userId: followingId,
    followerId: followerId,
  });

  return newRequest;
}

export async function unfollowUser(followerId: string, followingId: string) {
  await db.delete(follows).where(
    and(
      eq(follows.followerId, followerId),
      eq(follows.followingId, followingId)
    )
  );

  revalidatePath(`/user/${followingId}`);
}

export async function getFollowStatus(followerId: string, followingId: string) {
  const [follow] = await db
    .select()
    .from(follows)
    .where(
      and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      )
    );

  return follow ? follow.status : null;
}

export async function getFollowingList(userId: string) {
  const { users } = await import("@/db/schema");
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      avatar: users.avatar,
    })
    .from(follows)
    .innerJoin(users, eq(follows.followingId, users.id))
    .where(and(eq(follows.followerId, userId), eq(follows.status, "accepted")));

  return result;
}
