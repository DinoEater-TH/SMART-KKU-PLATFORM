// src/app/api/rewards/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.rewards);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const body = await req.json();
  const reward = { id: uid(), orgId: body.orgId, orgName: db.organizations.find((o) => o.id === body.orgId)?.nameTh, name: body.name, description: body.description || "", pointCost: body.pointCost ?? 0, powerCost: body.powerCost ?? 0, expCost: body.expCost ?? 0, stock: body.stock ?? 0, eligibilityRules: body.eligibilityRules || [], status: body.status || "ACTIVE" };
  db.rewards.push(reward as any);
  writeDb(db);
  return NextResponse.json(reward);
}
