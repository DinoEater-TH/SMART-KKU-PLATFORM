// src/app/api/activities/[id]/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const db = await getDb();
  const a = db.activities.find((x) => x.id === id);
  if (!a) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({
    ...a,
    projectName: db.projects.find((p) => p.id === a.projectId)?.name,
  });
}
