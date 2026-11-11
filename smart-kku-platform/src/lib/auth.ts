// src/lib/auth.ts
import { getDb } from "./db";
import type { User } from "./types";

export async function getCurrentUser(req: Request): Promise<User | null> {
  const userId = req.headers.get("x-user-id");
  if (!userId) return null;
  const db = await getDb();
  return db.users.find((u) => u.id === userId) || null;
}

export function userPublic(u: User) {
  const { ...rest } = u;
  return rest;
}
