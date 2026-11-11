// src/app/api/activities/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const db = await getDb();
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const orgId = url.searchParams.get("orgId");
  let list = db.activities.map((a) => ({
    ...a,
    projectName: db.projects.find((p) => p.id === a.projectId)?.name,
    orgName: a.orgName || db.organizations.find((o) => o.id === db.projects.find((p) => p.id === a.projectId)?.orgId)?.nameTh,
  }));
  if (projectId) list = list.filter((a) => a.projectId === projectId);
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const body = await req.json();
  const activity = {
    id: uid(),
    projectId: body.projectId,
    projectName: db.projects.find((p) => p.id === body.projectId)?.name,
    orgName: db.organizations.find((o) => o.id === db.projects.find((p) => p.id === body.projectId)?.orgId)?.nameTh,
    code: body.code,
    name: body.name,
    description: body.description || "",
    activityType: body.activityType || "EVENT",
    registrationStartAt: body.registrationStartAt,
    registrationEndAt: body.registrationEndAt,
    capacity: body.capacity ?? 0,
    verificationMethod: body.verificationMethod || "DIRECT",
    status: body.status || "OPEN",
    pointReward: body.pointReward ?? 0,
    expReward: body.expReward ?? 0,
    powerReward: body.powerReward ?? 0,
    qualificationReward: body.qualificationReward,
    hasCertificate: !!body.hasCertificate,
    eligiblePersonnelTypes: body.eligiblePersonnelTypes,
    minExp: body.minExp,
  };
  db.activities.push(activity as any);
  writeDb(db);
  return NextResponse.json(activity);
}
