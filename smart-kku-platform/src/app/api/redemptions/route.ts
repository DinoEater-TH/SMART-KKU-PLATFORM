// src/app/api/redemptions/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1" && ["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role);
  const list = all ? db.redemptions : db.redemptions.filter((r) => r.userId === user.id);
  const enriched = list.map((r) => ({ ...r, rewardName: db.rewards.find((rw) => rw.id === r.rewardId)?.name }));
  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const reward = db.rewards.find((r) => r.id === body.rewardId);
  if (!reward) return NextResponse.json({ error: "reward not found" }, { status: 404 });
  if (reward.status !== "ACTIVE") return NextResponse.json({ error: "reward inactive" }, { status: 400 });
  if (reward.stock <= 0) return NextResponse.json({ error: "สินค้าหมด" }, { status: 400 });

  // eligibility: qualifications
  for (const rule of reward.eligibilityRules || []) {
    if (rule.startsWith("QUALIFICATION:")) {
      const key = rule.replace("QUALIFICATION:", "");
      const has = db.qualifications.some((q) => q.userId === user.id && q.key === key && q.status === "ACTIVE");
      if (!has) return NextResponse.json({ error: "ไม่ผ่านคุณสมบัติ: ต้องมี " + key }, { status: 400 });
    }
    if (rule.startsWith("MIN_EXP:")) {
      const min = parseInt(rule.replace("MIN_EXP:", ""));
      if (user.exp < min) return NextResponse.json({ error: "EXP ไม่เพียงพอ" }, { status: 400 });
    }
  }

  const dbUser = db.users.find((u) => u.id === user.id)!;
  if (dbUser.points < reward.pointCost) return NextResponse.json({ error: "POINT ไม่เพียงพอ" }, { status: 400 });
  if (dbUser.power < reward.powerCost) return NextResponse.json({ error: "POWER ไม่เพียงพอ" }, { status: 400 });
  if (dbUser.exp < reward.expCost) return NextResponse.json({ error: "EXP ไม่เพียงพอ" }, { status: 400 });

  // deduct
  dbUser.points -= reward.pointCost;
  dbUser.power -= reward.powerCost;
  reward.stock -= 1;

  const redemption = {
    id: uid(),
    rewardId: reward.id,
    rewardName: reward.name,
    userId: user.id,
    pointsSpent: reward.pointCost,
    powerSpent: reward.powerCost,
    expSpent: reward.expCost,
    status: "FULFILLED" as const,
    redeemedAt: now(),
  };
  db.redemptions.push(redemption as any);

  if (reward.pointCost > 0) db.walletTx.push({ id: uid(), userId: user.id, type: "POINT", amount: -reward.pointCost, balanceAfter: dbUser.points, reason: `Redeem: ${reward.name}`, sourceType: "REDEMPTION", sourceId: redemption.id, createdAt: now() });
  if (reward.powerCost > 0) db.walletTx.push({ id: uid(), userId: user.id, type: "POWER", amount: -reward.powerCost, balanceAfter: dbUser.power, reason: `Redeem: ${reward.name}`, sourceType: "REDEMPTION", sourceId: redemption.id, createdAt: now() });

  // create voucher if merchant reward? Create voucher for all redemptions? Create voucher token
  const voucher = {
    id: uid(),
    redemptionId: redemption.id,
    userId: user.id,
    token: uid(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    status: "ACTIVE" as const,
  };
  db.vouchers.push(voucher as any);
  (redemption as any).voucherId = voucher.id;

  writeDb(db);
  return NextResponse.json({ redemption, voucher });
}
