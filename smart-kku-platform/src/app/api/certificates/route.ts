// src/app/api/certificates/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const c = db.certificates.find((x) => x.id === id);
    if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(c);
  }
  const userId = url.searchParams.get("userId") || user.id;
  const list = user.role === "SUPER_ADMIN" || user.role === "DEPARTMENT_ADMIN" ? db.certificates : db.certificates.filter((c) => c.userId === userId);
  return NextResponse.json(list);
}
