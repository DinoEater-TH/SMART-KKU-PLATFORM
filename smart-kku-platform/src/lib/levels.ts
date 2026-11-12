// src/lib/levels.ts
import type { Level, User } from "./types";

export function resolveLevel(levels: Level[], exp: number): Level | null {
  const sorted = [...levels].sort((a, b) => a.minExp - b.minExp);
  let found: Level | null = null;
  for (const l of sorted) {
    if (exp >= l.minExp && (l.maxExp === null || l.maxExp === undefined || exp <= l.maxExp)) {
      found = l;
    }
  }
  return found || sorted[0] || null;
}

export function levelNameFor(levels: Level[], exp: number): string {
  return resolveLevel(levels, exp)?.name || "-";
}

export function recomputeUserLevel(levels: Level[], user: User): User {
  const lv = resolveLevel(levels, user.exp);
  return { ...user, levelId: lv?.id, levelName: lv?.name || "-" };
}
