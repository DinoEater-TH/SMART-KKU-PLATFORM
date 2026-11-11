// src/app/api/passcodes/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const activityId = url.searchParams.get("activityId");
  let list = db.passcodes;
  if (activityId) list = list.filter((p) => p.activityId === activityId);
  // only active not expired
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN", "STAFF"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const body = await req.json();
  const code = body.code || Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + (body.minutes || 30) * 60000).toISOString();
  const pc = { id: uid(), activityId: body.activityId, code, expiresAt, createdBy: user.id, createdAt: now() };
  db.passcodes.push(pc);
  writeDb(db);
  return NextResponse.json(pc);
}
