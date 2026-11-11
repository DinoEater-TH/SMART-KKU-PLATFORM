// src/app/api/qualifications/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || user.id;
  const list = db.qualifications.filter((q) => q.userId === userId);
  return NextResponse.json(list);
}
