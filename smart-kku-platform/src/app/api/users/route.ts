// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const db = await getDb();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const u = db.users.find((x) => x.id === id);
    if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(u);
  }
  return NextResponse.json(db.users);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const body = await req.json();
  const idx = db.users.findIndex((u) => u.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  db.users[idx] = { ...db.users[idx], ...body };
  writeDb(db);
  return NextResponse.json(db.users[idx]);
}
