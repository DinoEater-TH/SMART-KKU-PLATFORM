// src/app/api/workouts/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { computePower } from "@/lib/scoring";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || user.id;
  const list = db.workouts.filter((w) => w.userId === userId);
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  const sport = db.sportTypes.find((s: any) => s.id === body.sportTypeId || s.code === body.sportTypeCode);
  if (!sport) return NextResponse.json({ error: "sport not found" }, { status: 400 });

  const rule = db.scoringRules.find((r: any) => r.isActive);
  const pace = body.distanceKm && body.distanceKm > 0 ? body.durationSec / 60 / body.distanceKm : undefined;

  const { score, sportFactorUsed, sportFactorOriginal, adjusted, reason } = computePower({
    calories: body.calories,
    durationSec: body.durationSec,
    sportType: sport,
    specialEventMultiplier: body.specialEventMultiplier,
    durationMultiplierPercent: body.durationMultiplierPercent,
    rule,
    paceMinPerKm: pace,
  });

  // duplicate provider activity check
  if (body.providerActivityId) {
    const dup = db.workouts.find((w) => w.userId === user.id && w.providerActivityId === body.providerActivityId && w.source === body.source);
    if (dup) return NextResponse.json({ error: "Activity ซ้ำ" }, { status: 400 });
  }

  const log = {
    id: uid(),
    userId: user.id,
    sportType: sport.code,
    calories: body.calories,
    durationSec: body.durationSec,
    distanceKm: body.distanceKm,
    paceMinPerKm: pace,
    performedAt: body.performedAt || now(),
    source: body.source || "MANUAL",
    providerActivityId: body.providerActivityId,
    evidenceUrl: body.evidenceUrl,
    status: "APPROVED" as const,
    validationReason: adjusted ? reason : undefined,
    sportFactorUsed,
    sportFactorOriginal,
    score,
    formulaVersion: rule?.version || "v1.0",
    createdAt: now(),
  };
  db.workouts.push(log as any);

  // credit POWER to user
  const dbUser = db.users.find((u: any) => u.id === user.id);
  if (dbUser) {
    dbUser.power = (dbUser.power || 0) + score;
    db.walletTx.push({ id: uid(), userId: user.id, type: "POWER", amount: score, balanceAfter: dbUser.power, reason: `Workout: ${sport.name}`, sourceType: "WORKOUT", sourceId: log.id, formulaVersion: rule?.version, createdAt: now() });
  }

  writeDb(db);
  return NextResponse.json(log);
}
