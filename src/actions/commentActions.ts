"use server";

import { db } from "@/db";
import { users, comments, notifications, posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher";

export async function addComment(data: {
  postId: string;
  userId: string;
  content: string;
  imageUrl?: string;
  isAnonymous: boolean;
}) {
  const [newComment] = await db.insert(comments).values({
    postId: data.postId,
    userId: data.userId,
    content: data.content,
    imageUrl: data.imageUrl,
    isAnonymous: data.isAnonymous,
  }).returning();

  // Create notification for post owner
  const [post] = await db.select().from(posts).where(eq(posts.id, data.postId));
  if (post && post.userId !== data.userId) {
    await db.insert(notifications).values({
      userId: post.userId,
      actorId: data.userId,
      type: "comment",
      postId: data.postId,
      commentId: newComment.id,
    });
  }

  revalidatePath(`/post/${data.postId}`);
  revalidatePath("/");

  // Trigger Realtime
  await pusherServer.trigger("jago-curhat", "new-comment", {
    postId: data.postId,
    id: newComment.id,
    content: newComment.content,
  });

  return newComment;
}

export async function getCommentsByPostId(postId: string) {
  const result = await db
    .select({
      id: comments.id,
      postId: comments.postId,
      userId: comments.userId,
      content: comments.content,
      imageUrl: comments.imageUrl,
      isAnonymous: comments.isAnonymous,
      createdAt: comments.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatar: users.avatar,
      },
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));

  return result;
}
