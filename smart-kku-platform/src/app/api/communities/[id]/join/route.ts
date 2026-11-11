// src/app/api/communities/[id]/join/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const { id } = await ctx.params;
  const db = await getDb();
  const comm = db.communities.find((c) => c.id === id);
  if (!comm) return NextResponse.json({ error: "not found" }, { status: 404 });

  // cooldown check
  const cooldownDays = db.systemSettings.cooldownDays || 36;
  const lastLeft = db.communityMembers
    .filter((m) => m.userId === user.id && m.status === "LEFT" && m.leftAt)
    .sort((a, b) => (a.leftAt! < b.leftAt! ? 1 : -1))[0];
  if (lastLeft && lastLeft.leftAt) {
    const leftDate = new Date(lastLeft.leftAt);
    const cooldownEnd = new Date(leftDate.getTime() + cooldownDays * 24 * 60 * 60 * 1000);
    if (new Date() < cooldownEnd) {
      return NextResponse.json({ error: `อยู่ในช่วง Cooldown จนถึง ${cooldownEnd.toLocaleDateString("th-TH")}` }, { status: 400 });
    }
  }

  const limit = db.systemSettings.groupLimit || 3;
  const activeGroups = db.communityMembers.filter((m) => m.userId === user.id && m.status === "ACTIVE").length;
  if (activeGroups >= limit) return NextResponse.json({ error: "เข้ากลุ่มครบจำนวนแล้ว" }, { status: 400 });

  const existing = db.communityMembers.find((m) => m.communityId === id && m.userId === user.id && m.status === "ACTIVE");
  if (existing) return NextResponse.json({ error: "เป็นสมาชิกแล้ว" }, { status: 400 });

  db.communityMembers.push({ id: uid(), communityId: id, userId: user.id, userName: user.displayName, joinedAt: now(), status: "ACTIVE" });
  comm.memberCount = db.communityMembers.filter((m) => m.communityId === id && m.status === "ACTIVE").length;
  // group power = sum exp of active members
  comm.groupPower = db.communityMembers.filter((m) => m.communityId === id && m.status === "ACTIVE").reduce((s, m) => {
    const u = db.users.find((x) => x.id === m.userId);
    return s + (u?.exp || 0);
  }, 0);
  writeDb(db);
  return NextResponse.json({ success: true });
}
