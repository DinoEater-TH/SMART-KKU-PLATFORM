// src/app/api/quizzes/[id]/answer/route.ts
import { NextResponse } from "next/server";
import { getDb, writeDb, uid, now } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { recomputeUserLevel } from "@/lib/levels";
import type { Quiz, QuizAnswer } from "@/lib/types";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const { id } = await ctx.params;
  const db = await getDb();
  const quiz = db.quizzes.find((q) => q.id === id);
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  if (!quiz.isActive) return NextResponse.json({ error: "Quiz is inactive" }, { status: 400 });

  const body = await req.json();
  const selectedIndex = Number(body.selectedIndex);
  const isCorrect = selectedIndex === quiz.correctIndex;

  const answer: QuizAnswer = {
    id: uid(),
    quizId: quiz.id,
    userId: user.id,
    selectedIndex,
    isCorrect,
    answeredAt: now(),
  };
  db.quizAnswers.push(answer);

  // SINGLE_ATTEMPT: only the first answer counts; ignore subsequent.
  const prior = db.quizAnswers.filter((a) => a.quizId === quiz.id && a.userId === user.id);
  const firstTime = prior.length === 1;

  let awarded = false;
  if (isCorrect && firstTime) {
    const u = db.users.find((x) => x.id === user.id)!;
    if (quiz.pointReward > 0) {
      u.points += quiz.pointReward;
      db.walletTx.push({ id: uid(), userId: user.id, type: "POINT", amount: quiz.pointReward, balanceAfter: u.points, reason: `Quiz: ${quiz.title}`, sourceType: "QUIZ", sourceId: quiz.id, createdAt: now() });
    }
    if (quiz.expReward > 0) {
      u.exp += quiz.expReward;
      db.walletTx.push({ id: uid(), userId: user.id, type: "EXP", amount: quiz.expReward, balanceAfter: u.exp, reason: `Quiz: ${quiz.title}`, sourceType: "QUIZ", sourceId: quiz.id, createdAt: now() });
      const n = recomputeUserLevel(db.levels, u);
      u.levelId = n.levelId;
      u.levelName = n.levelName;
    }
    awarded = true;
  }

  // RETRY_UNTIL_CORRECT: only award on the first correct answer.
  if (isCorrect && quiz.mode === "RETRY_UNTIL_CORRECT") {
    const alreadyCorrect = db.quizAnswers.some((a) => a.quizId === quiz.id && a.userId === user.id && a.isCorrect && a.id !== answer.id);
    if (alreadyCorrect) awarded = false;
    // if awarded already handled by firstTime check above; ensure no double
  }

  writeDb(db);
  return NextResponse.json({ answer, isCorrect, awarded, quiz: { title: quiz.title, correctIndex: quiz.mode === "SINGLE_ATTEMPT" ? quiz.correctIndex : undefined } });
}
