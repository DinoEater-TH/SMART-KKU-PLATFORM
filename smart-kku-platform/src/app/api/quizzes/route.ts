// src/app/api/quizzes/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { Quiz, User } from "@/lib/types";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const db = await getDb();
  const url = new URL(req.url);
  const activeOnly = url.searchParams.get("active") !== "0";
  let list = db.quizzes.slice();
  if (activeOnly) list = list.filter((q) => q.isActive);
  // filter by eligibility
  list = list.filter((q) => {
    if (q.eligiblePersonnelTypes && q.eligiblePersonnelTypes.length > 0) {
      return q.eligiblePersonnelTypes.includes(user.personnelType || "");
    }
    return true;
  });
  // filter by open window
  const nowDate = Date.now();
  list = list.filter((q) => {
    if (q.openAt && nowDate < new Date(q.openAt).getTime()) return false;
    if (q.closeAt && nowDate > new Date(q.closeAt).getTime()) return false;
    return true;
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const body = await req.json();
  const quiz: Quiz = {
    id: uid(),
    title: body.title,
    question: body.question,
    choices: body.choices || [],
    correctIndex: Number(body.correctIndex) || 0,
    pointReward: Number(body.pointReward) || 0,
    expReward: Number(body.expReward) || 0,
    mode: body.mode === "RETRY_UNTIL_CORRECT" ? "RETRY_UNTIL_CORRECT" : "SINGLE_ATTEMPT",
    eligiblePersonnelTypes: body.eligiblePersonnelTypes,
    openAt: body.openAt,
    closeAt: body.closeAt,
    isActive: body.isActive !== false,
    createdAt: now(),
  };
  db.quizzes.push(quiz);
  writeDb(db);
  return NextResponse.json(quiz);
}
