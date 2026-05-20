"use server";

import { db } from "@/db";
import { posts, users, comments, likes } from "@/db/schema";
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { likes as likesTable, notifications, bookmarks } from "@/db/schema";
import { pusherServer } from "@/lib/pusher";

export async function getUserPosts(userId: string, currentUserId?: string) {
  const result = await db
    .select({
      id: posts.id,
      content: posts.content,
      mood: posts.mood,
      imageUrl: posts.imageUrl,
      isAnonymous: posts.isAnonymous,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        isPrivate: users.isPrivate,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));

  const postsWithCounts = await Promise.all(result.map(async (post) => {
    const [counts] = await db
      .select({
        comments: sql<number>`count(distinct ${comments.id})`,
        likes: sql<number>`count(distinct ${likesTable.userId})`,
      })
      .from(posts)
      .leftJoin(comments, eq(comments.postId, posts.id))
      .leftJoin(likesTable, eq(likesTable.postId, posts.id))
      .where(eq(posts.id, post.id))
      .groupBy(posts.id);

    let isLiked = false;
    let isBookmarked = false;
    if (currentUserId) {
      const [like] = await db
        .select()
        .from(likesTable)
        .where(and(eq(likesTable.postId, post.id), eq(likesTable.userId, currentUserId)));
      isLiked = !!like;

      const [bookmark] = await db
        .select()
        .from(bookmarks)
        .where(and(eq(bookmarks.postId, post.id), eq(bookmarks.userId, currentUserId)));
      isBookmarked = !!bookmark;
    }

    return {
      ...post,
      commentsCount: Number(counts?.comments || 0),
      likes: Number(counts?.likes || 0),
      isLiked,
      isBookmarked,
    };
  }));

  return postsWithCounts;
}

export async function getBookmarkedPosts(userId: string) {
  const result = await db
    .select({
      id: posts.id,
      content: posts.content,
      mood: posts.mood,
      imageUrl: posts.imageUrl,
      isAnonymous: posts.isAnonymous,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatar: users.avatar,
      },
    })
    .from(bookmarks)
    .innerJoin(posts, eq(bookmarks.postId, posts.id))
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(posts.createdAt));

  const postsWithCounts = await Promise.all(result.map(async (post) => {
    const [counts] = await db
      .select({
        comments: sql<number>`count(distinct ${comments.id})`,
        likes: sql<number>`count(distinct ${likesTable.userId})`,
      })
      .from(posts)
      .leftJoin(comments, eq(comments.postId, posts.id))
      .leftJoin(likesTable, eq(likesTable.postId, posts.id))
      .where(eq(posts.id, post.id))
      .groupBy(posts.id);

    let isLiked = false;
    if (userId) {
      const [like] = await db
        .select()
        .from(likesTable)
        .where(and(eq(likesTable.postId, post.id), eq(likesTable.userId, userId)));
      isLiked = !!like;
    }

    return {
      ...post,
      commentsCount: Number(counts?.comments || 0),
      likes: Number(counts?.likes || 0),
      isLiked,
      isBookmarked: true,
    };
  }));

  return postsWithCounts;
}

export async function toggleBookmark(postId: string, userId: string) {
  const [existing] = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)));

  if (existing) {
    await db.delete(bookmarks).where(and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)));
  } else {
    await db.insert(bookmarks).values({ postId, userId });
  }

  revalidatePath("/profile");
}

export async function toggleLike(postId: string, userId: string) {
  try {
    // Check if like exists
    const [existing] = await db
      .select()
      .from(likesTable)
      .where(and(eq(likesTable.postId, postId), eq(likesTable.userId, userId)));

    if (existing) {
      // Unlike
      await db
        .delete(likesTable)
        .where(and(eq(likesTable.postId, postId), eq(likesTable.userId, userId)));
    } else {
      // Like
      await db.insert(likesTable).values({
        postId,
        userId,
      });

      // Create notification for post owner
      const [post] = await db.select().from(posts).where(eq(posts.id, postId));
      if (post && post.userId !== userId) {
        await db.insert(notifications).values({
          userId: post.userId,
          actorId: userId,
          type: "like",
          postId: postId,
        });
      }
    }

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);

    // Trigger Realtime
    await pusherServer.trigger("jago-curhat", "new-like", {
      postId,
      userId,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
}

export async function searchPosts(query: string, currentUserId?: string) {
  const result = await db
    .select({
      id: posts.id,
      content: posts.content,
      mood: posts.mood,
      imageUrl: posts.imageUrl,
      isAnonymous: posts.isAnonymous,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        isPrivate: users.isPrivate,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(
      or(
        ilike(posts.content, `%${query}%`),
        ilike(posts.mood, `%${query}%`)
      )
    )
    .orderBy(desc(posts.createdAt));

  const postsWithCounts = await Promise.all(result.map(async (post) => {
    const [counts] = await db
      .select({
        comments: sql<number>`count(distinct ${comments.id})`,
        likes: sql<number>`count(distinct ${likes.userId})`,
      })
      .from(posts)
      .leftJoin(comments, eq(comments.postId, posts.id))
      .leftJoin(likes, eq(likes.postId, posts.id))
      .where(eq(posts.id, post.id))
      .groupBy(posts.id);

    let isLiked = false;
    if (currentUserId) {
      const [like] = await db
        .select()
        .from(likes)
        .where(and(eq(likes.postId, post.id), eq(likes.userId, currentUserId)));
      isLiked = !!like;
    }

    return {
      ...post,
      commentsCount: Number(counts?.comments || 0),
      likes: Number(counts?.likes || 0),
      isLiked,
    };
  }));

  return postsWithCounts;
}

export async function createPost(data: {
  userId: string;
  content: string;
  mood: string;
  imageUrl?: string;
  isAnonymous: boolean;
}) {
  const [newPost] = await db.insert(posts).values({
    userId: data.userId,
    content: data.content,
    mood: data.mood,
    imageUrl: data.imageUrl,
    isAnonymous: data.isAnonymous,
  }).returning();

  revalidatePath("/");

  // Trigger Realtime
  await pusherServer.trigger("jago-curhat", "new-post", {
    id: newPost.id,
    content: newPost.content,
    userId: newPost.userId,
  });

  return newPost;
}

export async function getPosts(currentUserId?: string) {
  const result = await db
    .select({
      id: posts.id,
      content: posts.content,
      mood: posts.mood,
      imageUrl: posts.imageUrl,
      isAnonymous: posts.isAnonymous,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        isPrivate: users.isPrivate,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt));

  const postsWithCounts = await Promise.all(result.map(async (post) => {
    const [counts] = await db
      .select({
        comments: sql<number>`count(distinct ${comments.id})`,
        likes: sql<number>`count(distinct ${likes.userId})`,
      })
      .from(posts)
      .leftJoin(comments, eq(comments.postId, posts.id))
      .leftJoin(likes, eq(likes.postId, posts.id))
      .where(eq(posts.id, post.id))
      .groupBy(posts.id);

    let isLiked = false;
    if (currentUserId) {
      const [like] = await db
        .select()
        .from(likes)
        .where(and(eq(likes.postId, post.id), eq(likes.userId, currentUserId)));
      isLiked = !!like;
    }

    return {
      ...post,
      commentsCount: Number(counts?.comments || 0),
      likes: Number(counts?.likes || 0),
      isLiked,
    };
  }));

  return postsWithCounts;
}

export async function getPostById(postId: string, currentUserId?: string) {
  const [post] = await db
    .select({
      id: posts.id,
      content: posts.content,
      mood: posts.mood,
      imageUrl: posts.imageUrl,
      isAnonymous: posts.isAnonymous,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        isPrivate: users.isPrivate,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, postId));

  if (!post) return null;

  const [counts] = await db
    .select({
      comments: sql<number>`count(distinct ${comments.id})`,
      likes: sql<number>`count(distinct ${likes.userId})`,
    })
    .from(posts)
    .leftJoin(comments, eq(comments.postId, posts.id))
    .leftJoin(likes, eq(likes.postId, posts.id))
    .where(eq(posts.id, postId))
    .groupBy(posts.id);

  let isLiked = false;
  if (currentUserId) {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, currentUserId)));
    isLiked = !!like;
  }

  return {
    ...post,
    commentsCount: Number(counts?.comments || 0),
    likes: Number(counts?.likes || 0),
    isLiked,
  };
}

export async function deletePost(postId: string, userId: string) {
  try {
    // Delete the post ensuring it belongs to the user
    await db.delete(posts).where(and(eq(posts.id, postId), eq(posts.userId, userId)));
    
    revalidatePath("/");
    revalidatePath("/profile");

    // Trigger Realtime
    await pusherServer.trigger("jago-curhat", "post-deleted", {
      id: postId
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
