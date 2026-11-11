// src/app/api/vouchers/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (token) {
    const v = db.vouchers.find((x) => x.token === token);
    if (!v) return NextResponse.json({ error: "not found" }, { status: 404 });
    const red = db.redemptions.find((r) => r.id === v.redemptionId);
    const reward = red ? db.rewards.find((rw) => rw.id === red.rewardId) : null;
    const owner = db.users.find((u) => u.id === v.userId);
    return NextResponse.json({ voucher: v, reward, ownerName: owner?.displayName });
  }
  const list = user.role === "MERCHANT" ? db.vouchers : db.vouchers.filter((v) => v.userId === user.id);
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  // verify/use voucher by merchant
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const v = db.vouchers.find((x) => x.token === body.token || x.id === body.id);
  if (!v) return NextResponse.json({ error: "voucher not found" }, { status: 404 });
  if (v.status !== "ACTIVE") return NextResponse.json({ error: "voucher ไม่สามารถใช้ได้" }, { status: 400 });
  if (new Date(v.expiresAt) < new Date()) {
    v.status = "EXPIRED";
    writeDb(db);
    return NextResponse.json({ error: "voucher หมดอายุ" }, { status: 400 });
  }
  v.status = "USED";
  v.usedAt = now();
  v.usedByMerchantId = user.id;
  writeDb(db);
  return NextResponse.json({ success: true, voucher: v });
}
