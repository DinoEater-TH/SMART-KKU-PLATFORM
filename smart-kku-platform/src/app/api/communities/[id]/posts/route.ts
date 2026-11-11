// src/app/api/communities/[id]/posts/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const db = await getDb();
  const posts = db.communityPosts.filter((p) => p.communityId === id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json(posts);
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const { id } = await ctx.params;
  const db = await getDb();
  const body = await req.json();
  const post = { id: uid(), communityId: id, userId: user.id, userName: user.displayName, content: body.content, createdAt: now() };
  db.communityPosts.push(post as any);
  writeDb(db);
  return NextResponse.json(post);
}
