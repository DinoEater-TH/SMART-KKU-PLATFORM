// src/app/api/registrations/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const activityId = url.searchParams.get("activityId");
  const userId = url.searchParams.get("userId") || user.id;
  let list = db.registrations.filter((r) => r.userId === userId);
  if (activityId) list = list.filter((r) => r.activityId === activityId);
  // enrich
  const enriched = list.map((r) => ({
    ...r,
    activity: db.activities.find((a) => a.id === r.activityId),
  }));
  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const activity = db.activities.find((a) => a.id === body.activityId);
  if (!activity) return NextResponse.json({ error: "activity not found" }, { status: 404 });
  if (activity.status !== "OPEN") return NextResponse.json({ error: "not open" }, { status: 400 });

  // eligibility
  if (activity.eligiblePersonnelTypes && activity.eligiblePersonnelTypes.length > 0) {
    if (!activity.eligiblePersonnelTypes.includes(user.personnelType || "")) {
      return NextResponse.json({ error: "Eligibility failed: personnel type mismatch" }, { status: 400 });
    }
  }
  if (activity.minExp && user.exp < activity.minExp) {
    return NextResponse.json({ error: "EXP ไม่เพียงพอ" }, { status: 400 });
  }
  // qualification prerequisite for advanced training
  if (activity.code === "ADVANCED-TRAINING") {
    const has = db.qualifications.some((q) => q.userId === user.id && q.key === "NEW_STAFF_TRAINING_COMPLETED" && q.status === "ACTIVE");
    if (!has) return NextResponse.json({ error: "ต้องผ่านการอบรมบุคลากรใหม่ก่อน" }, { status: 400 });
  }

  // duplicate
  const dup = db.registrations.find((r) => r.activityId === activity.id && r.userId === user.id && r.status === "REGISTERED");
  if (dup) return NextResponse.json({ error: "ลงทะเบียนแล้ว" }, { status: 400 });

  // capacity
  if (activity.capacity && activity.capacity > 0) {
    const count = db.registrations.filter((r) => r.activityId === activity.id && r.status === "REGISTERED").length;
    if (count >= activity.capacity) {
      return NextResponse.json({ error: "กิจกรรมเต็มแล้ว" }, { status: 400 });
    }
  }

  const reg = { id: uid(), activityId: activity.id, userId: user.id, status: "REGISTERED" as const, registeredAt: now() };
  db.registrations.push(reg);
  writeDb(db);
  return NextResponse.json(reg);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const reg = db.registrations.find((r) => r.id === body.id && r.userId === user.id);
  if (!reg) return NextResponse.json({ error: "not found" }, { status: 404 });
  reg.status = "CANCELLED";
  reg.cancelledAt = now();
  writeDb(db);
  return NextResponse.json(reg);
}
