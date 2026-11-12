// src/app/api/communities/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { recomputeUserLevel } from "@/lib/levels";

export async function GET() {
  const db = await getDb();
  // auto-dissolve communities whose owner dropped below the gate
  const minLevelOrder = Number(db.systemSettings.clubCreationMinLevel) || 5;
  for (const c of db.communities) {
    if (c.status !== "ACTIVE") continue;
    const owner = db.users.find((u) => u.id === c.ownerId);
    if (!owner) continue;
    const ownerLevel = db.levels.find((l) => l.id === owner.levelId);
    if ((ownerLevel?.order ?? 0) < minLevelOrder) {
      c.status = "DISSOLVED";
      c.dissolvedAt = now();
      c.dissolvedReason = "Owner level dropped below the creation threshold";
    }
  }
  writeDb(db);
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

  const minLevelOrder = Number(db.systemSettings.clubCreationMinLevel) || 5;
  const userLevel = db.levels.find((l) => l.id === user.levelId);
  if ((userLevel?.order ?? 0) < minLevelOrder) {
    return NextResponse.json({ error: "Your level is too low to create a community" }, { status: 400 });
  }

  const limit = db.systemSettings.groupLimit || 3;
  const activeGroups = db.communityMembers.filter((m) => m.userId === user.id && m.status === "ACTIVE").length;
  if (activeGroups >= limit) return NextResponse.json({ error: "You have reached the group limit" }, { status: 400 });

  const comm = { id: uid(), name: body.name, description: body.description || "", ownerId: user.id, ownerName: user.displayName, createdAt: now(), memberCount: 1, groupPower: user.exp, status: "ACTIVE" as const };
  db.communities.push(comm as any);
  db.communityMembers.push({ id: uid(), communityId: comm.id, userId: user.id, userName: user.displayName, joinedAt: now(), status: "ACTIVE" });
  writeDb(db);
  return NextResponse.json(comm);
}
