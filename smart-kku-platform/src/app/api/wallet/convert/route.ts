// src/app/api/wallet/convert/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const amountPower = Number(body.power || 0);
  const rate = db.systemSettings.powerToExpRate || 10;
  if (amountPower <= 0) return NextResponse.json({ error: "จำนวนไม่ถูกต้อง" }, { status: 400 });
  const dbUser = db.users.find((u) => u.id === user.id)!;
  if (dbUser.power < amountPower) return NextResponse.json({ error: "POWER ไม่เพียงพอ" }, { status: 400 });
  const expGained = amountPower / rate;
  dbUser.power -= amountPower;
  dbUser.exp += expGained;
  dbUser.levelName = levelName(dbUser.exp);
  db.walletTx.push({ id: uid(), userId: user.id, type: "POWER", amount: -amountPower, balanceAfter: dbUser.power, reason: `Convert POWER to EXP (rate ${rate}:1)`, sourceType: "CONVERT", createdAt: now() });
  db.walletTx.push({ id: uid(), userId: user.id, type: "EXP", amount: expGained, balanceAfter: dbUser.exp, reason: `Convert ${amountPower} POWER`, sourceType: "CONVERT", createdAt: now() });
  writeDb(db);
  return NextResponse.json({ success: true, expGained, rate });
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
