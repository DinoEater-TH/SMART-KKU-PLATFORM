// src/app/api/staff-assignments/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now, audit } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { Db, StaffAssignment, User } from "@/lib/types";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const activityId = url.searchParams.get("activityId");
  const userId = url.searchParams.get("userId");
  let list = db.staffAssignments.slice();
  if (activityId) list = list.filter((s) => s.activityId === activityId);
  if (userId) list = list.filter((s) => s.userId === userId);
  const enriched = list.map((s) => ({
    ...s,
    user: db.users.find((u) => u.id === s.userId),
    activity: db.activities.find((a) => a.id === s.activityId),
  }));
  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const body = await req.json();
  const activity = db.activities.find((a) => a.id === body.activityId);
  const assignee = db.users.find((u) => u.id === body.userId);
  if (!activity) return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  if (!assignee) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = db.staffAssignments.find(
    (s) => s.activityId === activity.id && s.userId === assignee.id && s.isActive
  );
  if (existing) return NextResponse.json({ error: "Already assigned" }, { status: 400 });

  const assignment: StaffAssignment = {
    id: uid(),
    activityId: activity.id,
    userId: assignee.id,
    assignedBy: user.id,
    assignedAt: now(),
    isActive: true,
  };
  db.staffAssignments.push(assignment);
  audit(db, user.id, "ASSIGN_STAFF", "StaffAssignment", assignment.id, `${assignee.displayName} -> ${activity.name}`);
  writeDb(db);
  return NextResponse.json({ ...assignment, user: assignee, activity });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const body = await req.json();
  const assignment = db.staffAssignments.find((s) => s.id === body.id);
  if (!assignment) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (body.action === "revoke") {
    assignment.isActive = false;
    assignment.revokedAt = now();
    assignment.revokedBy = user.id;
    audit(db, user.id, "REVOKE_STAFF", "StaffAssignment", assignment.id);
    writeDb(db);
    return NextResponse.json(assignment);
  }
  if (body.action === "settle") {
    // settle staff pay when activity ends
    const activity = db.activities.find((a) => a.id === assignment.activityId);
    const assignee = db.users.find((u) => u.id === assignment.userId);
    if (!activity || !assignee) return NextResponse.json({ error: "not found" }, { status: 404 });
    if (assignment.settledAt) return NextResponse.json({ error: "Already settled" }, { status: 400 });
    const pointAward = (activity.pointReward || 0) * (activity.staffMultiplier || 1);
    const expAward = (activity.expReward || 0) * (activity.staffMultiplier || 1);
    assignee.points += pointAward;
    assignee.exp += expAward;
    const { recomputeUserLevel } = await import("@/lib/levels");
    const n = recomputeUserLevel(db.levels, assignee);
    assignee.levelId = n.levelId;
    assignee.levelName = n.levelName;
    db.walletTx.push({ id: uid(), userId: assignee.id, type: "POINT", amount: pointAward, balanceAfter: assignee.points, reason: `Staff pay: ${activity.name}`, sourceType: "STAFF_PAY", sourceId: assignment.id, createdAt: now() });
    db.walletTx.push({ id: uid(), userId: assignee.id, type: "EXP", amount: expAward, balanceAfter: assignee.exp, reason: `Staff pay: ${activity.name}`, sourceType: "STAFF_PAY", sourceId: assignment.id, createdAt: now() });
    assignment.settledAt = now();
    assignment.pointAwarded = pointAward;
    assignment.expAwarded = expAward;
    audit(db, user.id, "SETTLE_STAFF", "StaffAssignment", assignment.id, `${pointAward}P ${expAward}EXP`);
    writeDb(db);
    return NextResponse.json(assignment);
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
