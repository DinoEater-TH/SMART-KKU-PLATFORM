// src/app/api/projects/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const db = await getDb();
  const projects = db.projects.map((p) => ({
    ...p,
    orgName: db.organizations.find((o) => o.id === p.orgId)?.nameTh,
  }));
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const body = await req.json();
  const project = {
    id: uid(),
    orgId: body.orgId,
    orgName: db.organizations.find((o) => o.id === body.orgId)?.nameTh,
    code: body.code,
    name: body.name,
    description: body.description || "",
    startDate: body.startDate,
    endDate: body.endDate,
    status: body.status || "ACTIVE",
    createdBy: user.id,
  };
  db.projects.push(project as any);
  writeDb(db);
  return NextResponse.json(project);
}
