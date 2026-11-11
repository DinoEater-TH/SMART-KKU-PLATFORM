// src/app/api/scoring-rules/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.scoringRules);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await getDb();
  // deactivate previous
  db.scoringRules.forEach((r: any) => (r.isActive = false));
  const body = await req.json();
  const rule = { id: uid(), version: body.version || "v" + (db.scoringRules.length + 1), specialEventMultiplier: body.specialEventMultiplier ?? 1.0, durationMultiplierPercent: body.durationMultiplierPercent ?? 100, isActive: true, effectiveFrom: now(), createdBy: user.id };
  db.scoringRules.push(rule as any);
  writeDb(db);
  return NextResponse.json(rule);
}
