// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const list = db.notifications.filter((n) => n.userId === user.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  if (body.action === "read") {
    const n = db.notifications.find((x) => x.id === body.id && x.userId === user.id);
    if (n) n.isRead = true;
    writeDb(db);
    return NextResponse.json({ success: true });
  }
  if (body.action === "readAll") {
    db.notifications.filter((x) => x.userId === user.id).forEach((n) => (n.isRead = true));
    writeDb(db);
    return NextResponse.json({ success: true });
  }
  // create (admin/system)
  const notif = { id: uid(), userId: body.userId || user.id, title: body.title, body: body.body, type: body.type || "INFO", isRead: false, createdAt: now() };
  db.notifications.push(notif as any);
  writeDb(db);
  return NextResponse.json(notif);
}
