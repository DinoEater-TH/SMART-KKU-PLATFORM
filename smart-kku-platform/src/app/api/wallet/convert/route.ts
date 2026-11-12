// src/app/api/wallet/convert/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { recomputeUserLevel } from "@/lib/levels";
import type { User } from "@/lib/types";

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const amountPower = Number(body.power || 0);
  const rate = Number(db.systemSettings.powerToExpRate) || 10;
  if (amountPower <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  const dbUser = db.users.find((u) => u.id === user.id) as User;
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (dbUser.power < amountPower) return NextResponse.json({ error: "Not enough POWER" }, { status: 400 });

  const expGained = Math.floor(amountPower / rate);
  if (expGained <= 0) return NextResponse.json({ error: "Amount too small to convert" }, { status: 400 });

  const powerUsed = expGained * rate;
  dbUser.power -= powerUsed;
  dbUser.exp += expGained;
  const n = recomputeUserLevel(db.levels, dbUser);
  dbUser.levelId = n.levelId;
  dbUser.levelName = n.levelName;

  db.conversions.push({ id: uid(), userId: dbUser.id, powerUsed, expGained, rate, createdAt: now() });
  db.walletTx.push({ id: uid(), userId: dbUser.id, type: "POWER", amount: -powerUsed, balanceAfter: dbUser.power, reason: `Convert POWER to EXP (rate ${rate}:1)`, sourceType: "CONVERT", createdAt: now() });
  db.walletTx.push({ id: uid(), userId: dbUser.id, type: "EXP", amount: expGained, balanceAfter: dbUser.exp, reason: `Convert ${powerUsed} POWER -> ${expGained} EXP`, sourceType: "CONVERT", createdAt: now() });
  writeDb(db);
  return NextResponse.json({ success: true, powerUsed, expGained, rate, remainingPower: dbUser.power });
}
