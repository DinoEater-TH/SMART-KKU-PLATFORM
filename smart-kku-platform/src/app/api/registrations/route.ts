// src/app/api/registrations/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now, audit } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { Activity, Db, User } from "@/lib/types";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const activityId = url.searchParams.get("activityId");
  const userId = url.searchParams.get("userId") || user.id;
  let list = db.registrations.filter((r) => r.userId === userId);
  if (activityId) list = list.filter((r) => r.activityId === activityId);
  const enriched = list.map((r) => ({
    ...r,
    activity: db.activities.find((a) => a.id === r.activityId),
    attendance: db.attendance.find((a) => a.registrationId === r.id),
  }));
  return NextResponse.json(enriched);
}

function eligibilityError(db: Db, user: User, activity: Activity): string | null {
  if (activity.eligiblePersonnelTypes && activity.eligiblePersonnelTypes.length > 0) {
    if (!activity.eligiblePersonnelTypes.includes(user.personnelType || "")) {
      return "Eligibility failed: your personnel type is not allowed";
    }
  }
  if (activity.prerequisiteActivityId) {
    const prior = db.registrations.find(
      (r) => r.activityId === activity.prerequisiteActivityId && r.userId === user.id && r.status === "COMPLETED"
    );
    if (!prior) return "Eligibility failed: prerequisite activity not completed";
  }
  return null;
}

/** Direct self-registration by the current user. */
export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const activity = db.activities.find((a) => a.id === body.activityId);
  if (!activity) return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  return createRegistration(db, user, activity, { invitedBy: body.invitedBy });
}

function createRegistration(db: Db, user: User, activity: Activity, opts: { invitedBy?: string; accepted?: boolean } = {}) {
  if (activity.status !== "OPEN") return NextResponse.json({ error: "Activity is not open" }, { status: 400 });

  const elig = eligibilityError(db, user, activity);
  if (elig) return NextResponse.json({ error: elig }, { status: 400 });

  const dup = db.registrations.find(
    (r) => r.activityId === activity.id && r.userId === user.id && (r.status === "REGISTERED" || r.status === "COMPLETED")
  );
  if (dup) return NextResponse.json({ error: "Already registered" }, { status: 400 });

  if (activity.capacity && activity.capacity > 0) {
    const count = db.registrations.filter(
      (r) => r.activityId === activity.id && (r.status === "REGISTERED" || r.status === "COMPLETED")
    ).length;
    if (count >= activity.capacity) return NextResponse.json({ error: "Activity is full" }, { status: 400 });
  }

  const invited = !!opts.invitedBy;
  const reg = {
    id: uid(),
    activityId: activity.id,
    userId: user.id,
    status: (invited && !opts.accepted ? "REGISTERED" : "REGISTERED") as "REGISTERED",
    registeredAt: now(),
    invitedBy: opts.invitedBy,
    inviteStatus: invited ? ((opts.accepted ? "ACCEPTED" : "PENDING") as "PENDING" | "ACCEPTED") : undefined,
  };
  db.registrations.push(reg as any);
  writeDb(db);
  return NextResponse.json(reg);
}

/**
 * PATCH actions:
 *   { action: "invite", activityId, userId }  -> staff/admin invites a player
 *   { action: "accept", id }                  -> invited player accepts
 *   { action: "decline", id }                 -> invited player declines
 *   { action: "cancel", id }                  -> player cancels own registration
 *   { action: "no_show", id }                 -> staff marks no-show
 */
export async function PATCH(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const action = body.action;

  if (action === "invite") {
    const activity = db.activities.find((a) => a.id === body.activityId);
    if (!activity) return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    if (!activity.allowInvite) return NextResponse.json({ error: "This activity does not allow invitations" }, { status: 400 });
    const isStaff = db.staffAssignments.some((s) => s.activityId === activity.id && s.userId === user.id && s.isActive);
    if (!isStaff && !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const invitee = db.users.find((u) => u.id === body.userId);
    if (!invitee) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return createRegistration(db, invitee, activity, { invitedBy: user.id });
  }

  const reg = db.registrations.find((r) => r.id === body.id);
  if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

  if (action === "accept" || action === "decline") {
    if (reg.userId !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    if (reg.inviteStatus !== "PENDING") return NextResponse.json({ error: "No pending invitation" }, { status: 400 });
    if (action === "accept") {
      reg.inviteStatus = "ACCEPTED";
    } else {
      reg.inviteStatus = "DECLINED";
      reg.status = "CANCELLED";
      reg.cancelledAt = now();
    }
    writeDb(db);
    return NextResponse.json(reg);
  }

  if (action === "cancel") {
    if (reg.userId !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    if (reg.status === "COMPLETED") return NextResponse.json({ error: "Completed registration cannot be cancelled" }, { status: 400 });
    reg.status = "CANCELLED";
    reg.cancelledAt = now();
    audit(db, user.id, "CANCEL_REGISTRATION", "Registration", reg.id);
    writeDb(db);
    return NextResponse.json(reg);
  }

  if (action === "no_show") {
    const isStaff = db.staffAssignments.some((s) => s.activityId === reg.activityId && s.userId === user.id && s.isActive);
    if (!isStaff && !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    reg.status = "NO_SHOW";
    writeDb(db);
    return NextResponse.json(reg);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
