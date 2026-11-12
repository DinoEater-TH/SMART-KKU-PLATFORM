// src/app/api/redemptions/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now, audit } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { Db, Reward, User } from "@/lib/types";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1" && ["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role);
  const list = all ? db.redemptions : db.redemptions.filter((r) => r.userId === user.id);
  const enriched = list.map((r) => ({
    ...r,
    reward: db.rewards.find((rw) => rw.id === r.rewardId),
    user: db.users.find((u) => u.id === r.userId),
    voucher: db.vouchers.find((v) => v.id === r.voucherId),
  }));
  return NextResponse.json(enriched);
}

function levelOrder(db: Db, levelId?: string): number {
  const lv = db.levels.find((l) => l.id === levelId);
  return lv?.order ?? 0;
}

function eligibilityError(db: Db, user: User, reward: Reward): string | null {
  if (reward.minLevelId) {
    if (levelOrder(db, user.levelId) < levelOrder(db, reward.minLevelId)) {
      return "Your level is too low for this reward";
    }
  }
  if (reward.requiredActivityId) {
    const done = db.registrations.some(
      (r) => r.activityId === reward.requiredActivityId && r.userId === user.id && r.status === "COMPLETED"
    );
    if (!done) return "You must complete the required activity first";
  }
  return null;
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const reward = db.rewards.find((r) => r.id === body.rewardId);
  if (!reward) return NextResponse.json({ error: "Reward not found" }, { status: 404 });
  if (reward.status !== "ACTIVE") return NextResponse.json({ error: "Reward is inactive" }, { status: 400 });
  if (reward.stock <= 0) return NextResponse.json({ error: "Out of stock" }, { status: 400 });

  const gate = eligibilityError(db, user, reward);
  if (gate) return NextResponse.json({ error: gate }, { status: 400 });

  const dbUser = db.users.find((u) => u.id === user.id)!;
  if (reward.pointCost > 0 && dbUser.points < reward.pointCost) {
    return NextResponse.json({ error: "Not enough POINT" }, { status: 400 });
  }
  if (reward.powerCost > 0 && dbUser.power < reward.powerCost) {
    return NextResponse.json({ error: "Not enough POWER" }, { status: 400 });
  }

  if (reward.pointCost > 0) {
    dbUser.points -= reward.pointCost;
    db.walletTx.push({ id: uid(), userId: user.id, type: "POINT", amount: -reward.pointCost, balanceAfter: dbUser.points, reason: `Redeem: ${reward.name}`, sourceType: "REDEMPTION", sourceId: reward.id, createdAt: now() });
  }
  if (reward.powerCost > 0) {
    dbUser.power -= reward.powerCost;
    db.walletTx.push({ id: uid(), userId: user.id, type: "POWER", amount: -reward.powerCost, balanceAfter: dbUser.power, reason: `Redeem: ${reward.name}`, sourceType: "REDEMPTION", sourceId: reward.id, createdAt: now() });
  }
  reward.stock -= 1;

  const redemption = {
    id: uid(),
    rewardId: reward.id,
    rewardName: reward.name,
    userId: user.id,
    pointsSpent: reward.pointCost,
    powerSpent: reward.powerCost,
    status: (reward.rewardType === "COUPON" ? "FULFILLED" : "PENDING") as "PENDING" | "FULFILLED",
    redeemedAt: now(),
  };

  let voucher: any = undefined;
  if (reward.rewardType === "COUPON") {
    const minutes = db.systemSettings.voucherExpiryMinutes || 5;
    voucher = {
      id: uid(),
      redemptionId: redemption.id,
      rewardId: reward.id,
      userId: user.id,
      merchantId: reward.merchantId,
      token: uid(),
      expiresAt: new Date(Date.now() + minutes * 60000).toISOString(),
      status: "ACTIVE" as const,
    };
    db.vouchers.push(voucher);
    (redemption as any).voucherId = voucher.id;
  }

  db.redemptions.push(redemption as any);
  db.notifications.push({ id: uid(), userId: user.id, title: "แลกรางวัลสำเร็จ", body: `คุณแลก ${reward.name} สำเร็จ`, type: "REDEMPTION", isRead: false, createdAt: now() } as any);
  audit(db, user.id, "REDEEM", "Reward", reward.id, reward.name);
  writeDb(db);
  return NextResponse.json({ redemption, voucher });
}
