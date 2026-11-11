// src/app/api/sport-types/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.sportTypes);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await getDb();
  const body = await req.json();
  const st = { id: uid(), code: body.code, name: body.name, factor: body.factor, isActive: true };
  db.sportTypes.push(st as any);
  writeDb(db);
  return NextResponse.json(st);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await getDb();
  const body = await req.json();
  const st = db.sportTypes.find((s: any) => s.id === body.id);
  if (!st) return NextResponse.json({ error: "not found" }, { status: 404 });
  Object.assign(st, body);
  writeDb(db);
  return NextResponse.json(st);
}
