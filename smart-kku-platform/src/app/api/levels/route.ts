// src/app/api/levels/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { Level } from "@/lib/types";

export async function GET() {
  const db = await getDb();
  return NextResponse.json([...db.levels].sort((a, b) => a.order - b.order));
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await getDb();
  const body = await req.json();
  const level: Level = {
    id: uid(),
    name: body.name,
    minExp: Number(body.minExp) || 0,
    maxExp: body.maxExp === null || body.maxExp === "" ? null : Number(body.maxExp),
    description: body.description,
    order: body.order ?? db.levels.length + 1,
  };
  db.levels.push(level);
  writeDb(db);
  return NextResponse.json(level);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await getDb();
  const body = await req.json();
  const level = db.levels.find((l) => l.id === body.id);
  if (!level) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (body.name !== undefined) level.name = body.name;
  if (body.minExp !== undefined) level.minExp = Number(body.minExp);
  if (body.maxExp !== undefined) level.maxExp = body.maxExp === null || body.maxExp === "" ? null : Number(body.maxExp);
  if (body.description !== undefined) level.description = body.description;
  if (body.order !== undefined) level.order = Number(body.order);
  // recompute all users
  const { recomputeUserLevel } = await import("@/lib/levels");
  db.users.forEach((u) => { const n = recomputeUserLevel(db.levels, u); u.levelId = n.levelId; u.levelName = n.levelName; });
  writeDb(db);
  return NextResponse.json(level);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await getDb();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  db.levels = db.levels.filter((l) => l.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
