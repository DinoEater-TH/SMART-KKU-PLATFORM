// src/app/api/vouchers/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, now, audit } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (token) {
    const v = db.vouchers.find((x) => x.token === token);
    if (!v) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    const reward = db.rewards.find((rw) => rw.id === v.rewardId);
    const owner = db.users.find((u) => u.id === v.userId);
    return NextResponse.json({
      voucher: v,
      reward,
      merchant: db.merchants.find((m) => m.id === v.merchantId),
      ownerName: owner?.displayName,
      ownerAvatar: owner?.avatarUrl,
    });
  }
  const list =
    user.role === "MERCHANT"
      ? db.vouchers.filter((v) => {
          const m = db.merchants.find((x) => x.email === user.email || x.phone === user.phone);
          return m ? v.merchantId === m.id : true;
        })
      : db.vouchers.filter((v) => v.userId === user.id);
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  // merchant verifies and uses a coupon
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const v = db.vouchers.find((x) => x.token === body.token || x.id === body.id);
  if (!v) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
  if (v.status !== "ACTIVE") return NextResponse.json({ error: "Voucher cannot be used" }, { status: 400 });
  if (new Date(v.expiresAt) < new Date()) {
    v.status = "EXPIRED";
    writeDb(db);
    return NextResponse.json({ error: "Voucher expired" }, { status: 400 });
  }
  const merchant = db.merchants.find((m) => m.email === user.email || m.phone === user.phone);
  if (user.role === "MERCHANT" && merchant && v.merchantId && v.merchantId !== merchant.id) {
    return NextResponse.json({ error: "This voucher belongs to another merchant" }, { status: 403 });
  }
  v.status = "USED";
  v.usedAt = now();
  v.verifiedByMerchantId = merchant?.id || user.id;
  const red = db.redemptions.find((r) => r.id === v.redemptionId);
  if (red) red.status = "FULFILLED";
  audit(db, user.id, "USE_COUPON", "Voucher", v.id);
  writeDb(db);
  return NextResponse.json({ success: true, voucher: v });
}
