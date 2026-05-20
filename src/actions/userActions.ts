"use server";

import { db } from "@/db";
import { users, posts, follows } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getUserProfile(nickname: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, nickname),
  });

  if (!user) return null;

  const [stats] = await db
    .select({
      posts: sql<number>`count(distinct ${posts.id})`,
      followers: sql<number>`count(distinct case when ${follows.status} = 'accepted' then ${follows.followerId} end)`,
      following: sql<number>`count(distinct case when ${follows.status} = 'accepted' then ${follows.followingId} end)`,
    })
    .from(users)
    .leftJoin(posts, eq(posts.userId, users.id))
    .leftJoin(follows, sql`${follows.followingId} = ${users.id} or ${follows.followerId} = ${users.id}`)
    .where(eq(users.id, user.id))
    .groupBy(users.id);

  return {
    ...user,
    postsCount: Number(stats?.posts || 0),
    followersCount: Number(stats?.followers || 0),
    followingCount: Number(stats?.following || 0),
  };
}

export async function updateProfile(userId: string, data: { username?: string; avatar?: string; isPrivate?: boolean }) {
  await db.update(users).set(data).where(eq(users.id, userId));
}
