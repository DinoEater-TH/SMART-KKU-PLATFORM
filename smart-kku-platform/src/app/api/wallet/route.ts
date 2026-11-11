// src/app/api/wallet/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const dbUser = db.users.find((u) => u.id === user.id)!;
  const txs = db.walletTx.filter((t) => t.userId === user.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json({ user: dbUser, transactions: txs });
}
