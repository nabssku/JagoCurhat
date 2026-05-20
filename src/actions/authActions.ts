"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// ─── Password Helpers ───────────────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  const hashBuffer = Buffer.from(hash, "hex");
  const derivedHash = (await scryptAsync(password, salt, 64)) as Buffer;
  return timingSafeEqual(hashBuffer, derivedHash);
}

// ─── Auth Actions ────────────────────────────────────────────────────────────

export async function registerUser(data: {
  email: string;
  nickname: string;
  avatar: string;
  password: string;
}) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (existingUser) {
    throw new Error("Email ini sudah terdaftar sepertinya... 😔");
  }

  const passwordHash = await hashPassword(data.password);

  const [newUser] = await db.insert(users).values({
    email: data.email,
    username: data.nickname,
    avatar: data.avatar,
    passwordHash,
    accentColor: "purple",
    cardStyle: "minimal",
  }).returning();

  return newUser;
}

export async function loginUser(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    // Pesan generik — jangan bocorkan apakah email terdaftar atau tidak
    throw new Error("Email atau password salah.");
  }

  // User Google OAuth tidak punya password
  if (!user.passwordHash) {
    throw new Error("Akun ini dibuat dengan Google. Silakan login dengan Google.");
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Email atau password salah.");
  }

  return user;
}

/**
 * Upsert user dari data Google OAuth.
 * Jika email sudah ada → return user (login).
 * Jika belum ada → buat user baru (register otomatis, tanpa password).
 */
export async function loginOrRegisterWithGoogle(data: {
  email: string;
  name: string;
  picture: string;
}) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (existing) {
    return existing;
  }

  // Buat username unik dari nama Google
  const baseUsername = data.name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);

  let username = baseUsername;
  let counter = 1;
  while (true) {
    const taken = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (!taken) break;
    username = `${baseUsername}${counter++}`;
  }

  const [newUser] = await db.insert(users).values({
    email: data.email,
    username,
    fullName: data.name,
    avatar: data.picture || "idle",
    passwordHash: null, // Google OAuth — tidak pakai password
    accentColor: "purple",
    cardStyle: "minimal",
  }).returning();

  return newUser;
}
