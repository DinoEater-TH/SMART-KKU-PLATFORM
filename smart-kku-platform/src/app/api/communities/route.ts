// src/app/api/communities/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const db = await getDb();
  const list = db.communities.map((c) => ({
    ...c,
    members: db.communityMembers.filter((m) => m.communityId === c.id && m.status === "ACTIVE"),
    posts: db.communityPosts.filter((p) => p.communityId === c.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  }));
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const body = await req.json();
  // eligibility: 10000 EXP
  const minExp = db.systemSettings.clubCreationExp || 10000;
  if (user.exp < minExp) return NextResponse.json({ error: `ต้องมี ${minExp} EXP จึงจะสร้างกลุ่มได้` }, { status: 400 });
  // group limit
  const limit = db.systemSettings.groupLimit || 3;
  const activeGroups = db.communityMembers.filter((m) => m.userId === user.id && m.status === "ACTIVE").length;
  if (activeGroups >= limit) return NextResponse.json({ error: "เข้ากลุ่มครบจำนวนแล้ว" }, { status: 400 });

  const comm = { id: uid(), name: body.name, description: body.description || "", ownerId: user.id, ownerName: user.displayName, createdAt: now(), memberCount: 1, groupPower: user.exp };
  db.communities.push(comm as any);
  db.communityMembers.push({ id: uid(), communityId: comm.id, userId: user.id, userName: user.displayName, joinedAt: now(), status: "ACTIVE" });
  writeDb(db);
  return NextResponse.json(comm);
}
