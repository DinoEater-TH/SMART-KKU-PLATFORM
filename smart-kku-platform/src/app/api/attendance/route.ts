// src/app/api/attendance/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now, audit } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { recomputeUserLevel } from "@/lib/levels";
import type { Activity, Db, User } from "@/lib/types";

/**
 * QR check-in (staff scans a player's personal QR ticket) + separate PIN verification.
 *
 * step = "CHECK_IN"  -> identify the player and record arrival
 *        "PIN"       -> player enters the activity PIN to receive POINT/EXP/Certificate
 */
export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const activityId = url.searchParams.get("activityId");
  const userId = url.searchParams.get("userId");

  let list = db.attendance.slice();
  if (activityId) list = list.filter((a) => a.activityId === activityId);
  if (userId) list = list.filter((a) => a.userId === userId);

  const enriched = list.map((a) => ({
    ...a,
    user: db.users.find((u) => u.id === a.userId),
    activity: db.activities.find((x) => x.id === a.activityId),
  }));
  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const step = body.step || "CHECK_IN";

  if (step === "CHECK_IN") return checkIn(req, db, user, body);
  return verifyPin(db, user, body);
}

/** Staff (or admin) scans a registration ticket -> record CHECKED_IN. */
function checkIn(_req: Request, db: Db, actor: User, body: any) {
  const { registrationId, qrToken, activityId } = body;

  let reg = registrationId
    ? db.registrations.find((r) => r.id === registrationId)
    : undefined;

  // A personal QR ticket encodes the registration id.
  if (!reg && qrToken) {
    reg = db.registrations.find((r) => r.id === qrToken);
  }
  if (!reg && activityId && actor.role !== "MERCHANT") {
    reg = db.registrations.find(
      (r) => r.activityId === activityId && r.userId === body.playerId && r.status !== "CANCELLED"
    );
  }
  if (!reg) return NextResponse.json({ error: "Registration not found for this ticket" }, { status: 404 });
  if (reg.status === "CANCELLED") return NextResponse.json({ error: "Registration was cancelled" }, { status: 400 });

  const activity = db.activities.find((a) => a.id === reg!.activityId);
  if (!activity) return NextResponse.json({ error: "Activity not found" }, { status: 404 });

  const existing = db.attendance.find((a) => a.registrationId === reg!.id);
  if (existing?.checkedInAt) {
    return NextResponse.json({ error: "Already checked in", duplicate: true, record: existing }, { status: 409 });
  }

  const rec: any = existing || {
    id: uid(),
    registrationId: reg.id,
    sessionId: body.sessionId,
    userId: reg.userId,
    activityId: reg.activityId,
    attendanceStatus: "CHECKED_IN" as const,
    verificationMethod: "QR",
    createdAt: now(),
  };
  rec.attendanceStatus = "CHECKED_IN";
  rec.checkedInAt = now();
  rec.checkedInBy = actor.id;
  if (!existing) db.attendance.push(rec);

  const player = db.users.find((u) => u.id === reg!.userId);
  audit(db, actor.id, "CHECK_IN", "Attendance", rec.id, `${player?.displayName} -> ${activity.name}`);
  writeDb(db);
  return NextResponse.json({ success: true, record: rec, player, activity });
}

/** Player enters the activity PIN to unlock rewards. Staff may verify on a player's behalf. */
function verifyPin(db: Db, actor: User, body: any) {
  const { activityId, pin, userId } = body;
  const targetUserId = userId || actor.id;
  const activity = db.activities.find((a) => a.id === activityId);
  if (!activity) return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  if (!activity.pinCode) return NextResponse.json({ error: "This activity has no PIN configured" }, { status: 400 });
  if (activity.status !== "OPEN") return NextResponse.json({ error: "Activity is not open" }, { status: 400 });
  if (String(pin) !== String(activity.pinCode)) return NextResponse.json({ error: "Incorrect PIN" }, { status: 400 });

  const reg = db.registrations.find(
    (r) => r.activityId === activityId && r.userId === targetUserId && r.status !== "CANCELLED"
  );
  if (!reg) return NextResponse.json({ error: "You are not registered for this activity" }, { status: 400 });

  const rec = db.attendance.find((a) => a.registrationId === reg.id);
  if (!rec?.checkedInAt) return NextResponse.json({ error: "Please check in with your QR code first" }, { status: 400 });
  if (rec.pinVerifiedAt) return NextResponse.json({ error: "PIN already verified", duplicate: true }, { status: 409 });

  rec.attendanceStatus = "PIN_VERIFIED";
  rec.pinVerifiedAt = now();

  const player = db.users.find((u) => u.id === targetUserId);
  if (!player) return NextResponse.json({ error: "User not found" }, { status: 404 });

  grantPlayerRewards(db, player, activity, reg.id);
  writeDb(db);
  return NextResponse.json({ success: true, record: rec, player, activity });
}

function grantPlayerRewards(db: Db, player: User, activity: Activity, sourceId: string) {
  let changed = false;
  if (activity.pointReward > 0) {
    player.points += activity.pointReward;
    db.walletTx.push({ id: uid(), userId: player.id, type: "POINT", amount: activity.pointReward, balanceAfter: player.points, reason: `Activity: ${activity.name}`, sourceType: "ACTIVITY", sourceId, createdAt: now() });
    changed = true;
  }
  if (activity.expReward > 0) {
    player.exp += activity.expReward;
    db.walletTx.push({ id: uid(), userId: player.id, type: "EXP", amount: activity.expReward, balanceAfter: player.exp, reason: `Activity: ${activity.name}`, sourceType: "ACTIVITY", sourceId, createdAt: now() });
    changed = true;
  }
  if (changed) {
    const lv = recomputeUserLevel(db.levels, player);
    player.levelId = lv.levelId;
    player.levelName = lv.levelName;
  }
  if (activity.hasCertificate) {
    db.certificates.push({
      id: uid(),
      userId: player.id,
      userName: player.displayName,
      activityId: activity.id,
      activityName: activity.name,
      orgName: activity.orgName,
      templateVersion: activity.certificateTemplate || "v1",
      certificateNo: "CERT-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000),
      issuedAt: now(),
      status: "ISSUED",
    });
  }
  const reg = db.registrations.find((r) => r.id === sourceId);
  if (reg) reg.status = "COMPLETED";
}
