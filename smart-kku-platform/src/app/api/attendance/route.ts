// src/app/api/attendance/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const activityId = url.searchParams.get("activityId");
  let list = db.attendance;
  if (activityId) {
    const regs = db.registrations.filter((r) => r.activityId === activityId).map((r) => r.id);
    list = list.filter((a) => regs.includes(a.registrationId));
  }
  const enriched = list.map((a) => ({
    ...a,
    user: db.users.find((u) => u.id === a.userId),
  }));
  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const { activityId, method, passcode, sessionId, lat, lng } = body;

  const reg = db.registrations.find((r) => r.activityId === activityId && r.userId === user.id && r.status === "REGISTERED");
  if (!reg) return NextResponse.json({ error: "ยังไม่ได้ลงทะเบียน" }, { status: 400 });

  const activity = db.activities.find((a) => a.id === activityId);
  if (!activity) return NextResponse.json({ error: "activity not found" }, { status: 404 });

  // duplicate check-in
  const existing = db.attendance.find((a) => a.registrationId === reg.id && a.attendanceStatus === "CHECKED_IN");
  if (existing) return NextResponse.json({ error: "เช็กอินแล้ว" }, { status: 400 });

  let verified = false;
  let verifiedBy: string | undefined;

  if (method === "DIRECT") {
    verified = true;
  } else if (method === "QR_PASSCODE") {
    if (!passcode) return NextResponse.json({ error: "กรุณากรอกรหัส" }, { status: 400 });
    const pc = db.passcodes.find((p) => p.activityId === activityId && p.code === passcode);
    if (!pc) return NextResponse.json({ error: "รหัสไม่ถูกต้อง" }, { status: 400 });
    if (new Date(pc.expiresAt) < new Date()) return NextResponse.json({ error: "รหัสหมดอายุ" }, { status: 400 });
    verified = true;
    verifiedBy = pc.createdBy;
  } else if (method === "GEO_FENCE") {
    // mock: accept if lat/lng provided
    if (lat === undefined || lng === undefined) return NextResponse.json({ error: "ไม่สามารถระบุตำแหน่ง" }, { status: 400 });
    verified = true;
  }

  if (!verified) return NextResponse.json({ error: "ตรวจสอบไม่ผ่าน" }, { status: 400 });

  const rec = {
    id: uid(),
    registrationId: reg.id,
    sessionId: sessionId || undefined,
    userId: user.id,
    attendanceStatus: "CHECKED_IN" as const,
    verificationMethod: method,
    verifiedAt: now(),
    verifiedBy: verifiedBy || user.id,
    createdAt: now(),
  };
  db.attendance.push(rec as any);

  // Grant rewards if activity has rewards and attendance checked in
  // For DIRECT / check-in completion, grant point/exp/qualification
  grantRewards(db, user.id, activity);

  writeDb(db);
  return NextResponse.json({ success: true, record: rec });
}

function grantRewards(db: any, userId: string, activity: any) {
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return;
  if (activity.pointReward && activity.pointReward > 0) {
    user.points += activity.pointReward;
    db.walletTx.push({ id: uid(), userId, type: "POINT", amount: activity.pointReward, balanceAfter: user.points, reason: `Activity: ${activity.name}`, sourceType: "ACTIVITY", sourceId: activity.id, createdAt: now() });
  }
  if (activity.expReward && activity.expReward > 0) {
    user.exp += activity.expReward;
    user.levelName = levelName(user.exp);
    db.walletTx.push({ id: uid(), userId, type: "EXP", amount: activity.expReward, balanceAfter: user.exp, reason: `Activity: ${activity.name}`, sourceType: "ACTIVITY", sourceId: activity.id, createdAt: now() });
  }
  if (activity.qualificationReward) {
    db.qualifications.push({ id: uid(), userId, key: activity.qualificationReward, sourceActivityId: activity.id, sourceName: activity.name, grantedAt: now(), status: "ACTIVE" });
  }
  if (activity.hasCertificate) {
    db.certificates.push({
      id: uid(),
      userId,
      userName: user.displayName,
      activityId: activity.id,
      activityName: activity.name,
      orgName: activity.orgName,
      templateVersion: "v1",
      certificateNo: "CERT-" + Math.floor(Math.random() * 100000),
      issuedAt: now(),
      status: "ISSUED",
    });
  }
  // mark registration completed
  const reg = db.registrations.find((r: any) => r.activityId === activity.id && r.userId === userId && r.status === "REGISTERED");
  if (reg) reg.status = "COMPLETED";
}

function levelName(exp: number) {
  if (exp >= 10000) return "Legend";
  if (exp >= 7000) return "Master";
  if (exp >= 4000) return "Extra";
  if (exp >= 2000) return "Expert";
  if (exp >= 1000) return "Active";
  if (exp >= 500) return "Explorer";
  return "Beginner";
}
