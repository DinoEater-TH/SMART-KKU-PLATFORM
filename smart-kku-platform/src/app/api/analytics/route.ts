// src/app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "overview";

  const byLevel = db.levels.map((l) => ({
    level: l.name,
    order: l.order,
    count: db.users.filter((u) => u.levelId === l.id).length,
  }));

  const byOrg = db.organizations.map((o) => ({
    org: o.nameTh || o.nameEn,
    count: db.users.filter((u) => u.orgId === o.id).length,
  }));

  const byPersonnelType = {
    ACADEMIC: db.users.filter((u) => u.personnelType === "ACADEMIC").length,
    SUPPORT: db.users.filter((u) => u.personnelType === "SUPPORT").length,
  };

  const activities = {
    total: db.activities.length,
    open: db.activities.filter((a) => a.status === "OPEN").length,
    completed: db.activities.filter((a) => a.status === "COMPLETED").length,
    registrations: db.registrations.length,
    completedRegs: db.registrations.filter((r) => r.status === "COMPLETED").length,
    attendanceRate:
      db.registrations.length > 0
        ? Math.round((db.attendance.filter((a) => a.attendanceStatus === "PIN_VERIFIED" || a.attendanceStatus === "CHECKED_IN").length / db.registrations.length) * 100)
        : 0,
  };

  const points = {
    pointDistributed: db.walletTx.filter((t) => t.type === "POINT").reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0),
    powerDistributed: db.walletTx.filter((t) => t.type === "POWER").reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0),
    expDistributed: db.walletTx.filter((t) => t.type === "EXP").reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0),
    conversions: db.conversions.length,
    conversionPowerUsed: db.conversions.reduce((s, c) => s + c.powerUsed, 0),
    conversionExpGained: db.conversions.reduce((s, c) => s + c.expGained, 0),
  };

  const rewards = {
    total: db.rewards.length,
    redemptions: db.redemptions.length,
    topRewards: db.rewards
      .map((r) => ({ name: r.name, count: db.redemptions.filter((rd) => rd.rewardId === r.id).length, stock: r.stock }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };

  const merchants = {
    total: db.merchants.length,
    vouchersIssued: db.vouchers.length,
    vouchersUsed: db.vouchers.filter((v) => v.status === "USED").length,
    byMerchant: db.merchants.map((m) => ({
      name: m.name,
      issued: db.vouchers.filter((v) => v.merchantId === m.id).length,
      used: db.vouchers.filter((v) => v.merchantId === m.id && v.status === "USED").length,
    })),
  };

  const communities = {
    total: db.communities.length,
    active: db.communities.filter((c) => c.status === "ACTIVE").length,
    dissolved: db.communities.filter((c) => c.status === "DISSOLVED").length,
    members: db.communityMembers.filter((m) => m.status === "ACTIVE").length,
  };

  const quizzes = {
    total: db.quizzes.length,
    answers: db.quizAnswers.length,
    correct: db.quizAnswers.filter((a) => a.isCorrect).length,
    wrong: db.quizAnswers.filter((a) => !a.isCorrect).length,
    accuracy: db.quizAnswers.length > 0 ? Math.round((db.quizAnswers.filter((a) => a.isCorrect).length / db.quizAnswers.length) * 100) : 0,
  };

  return NextResponse.json({
    type,
    users: { total: db.users.length, byLevel, byOrg, byPersonnelType },
    activities,
    points,
    rewards,
    merchants,
    communities,
    quizzes,
  });
}
