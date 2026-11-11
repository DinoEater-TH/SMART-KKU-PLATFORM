// src/app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.systemSettings);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await getDb();
  const body = await req.json();
  db.systemSettings = { ...db.systemSettings, ...body };
  writeDb(db);
  return NextResponse.json(db.systemSettings);
}
