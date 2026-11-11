// src/app/api/communities/[id]/leave/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const { id } = await ctx.params;
  const db = await getDb();
  const m = db.communityMembers.find((x) => x.communityId === id && x.userId === user.id && x.status === "ACTIVE");
  if (!m) return NextResponse.json({ error: "ไม่ได้เป็นสมาชิก" }, { status: 400 });
  m.status = "LEFT";
  m.leftAt = now();
  const comm = db.communities.find((c) => c.id === id);
  if (comm) {
    comm.memberCount = db.communityMembers.filter((x) => x.communityId === id && x.status === "ACTIVE").length;
    comm.groupPower = db.communityMembers.filter((x) => x.communityId === id && x.status === "ACTIVE").reduce((s, mm) => {
      const u = db.users.find((x) => x.id === mm.userId);
      return s + (u?.exp || 0);
    }, 0);
  }
  writeDb(db);
  return NextResponse.json({ success: true });
}
