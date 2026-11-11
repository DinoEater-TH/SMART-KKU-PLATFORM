// src/lib/scoring.ts
import { SportType, ScoringRule } from "./types";

export interface ScoreInput {
  calories: number;
  durationSec: number;
  sportType: SportType;
  specialEventMultiplier?: number;
  durationMultiplierPercent?: number; // percent e.g. 100
  rule?: ScoringRule;
  paceMinPerKm?: number;
}

export function computePower(input: ScoreInput): { score: number; sportFactorUsed: number; sportFactorOriginal: number; adjusted: boolean; reason?: string } {
  const { calories, durationSec, sportType } = input;
  const rule = input.rule;
  const specialEvent = input.specialEventMultiplier ?? rule?.specialEventMultiplier ?? 1.0;
  const durationMultPercent = input.durationMultiplierPercent ?? rule?.durationMultiplierPercent ?? 100;
  const durationMult = durationMultPercent / 100;

  let sportFactorOriginal = sportType.factor;
  let sportFactorUsed = sportType.factor;
  let adjusted = false;
  let reason: string | undefined;

  // Anti-cheat: Running with pace > 12 min/km -> treat as Walking (0.8)
  if (sportType.code === "RUNNING" && input.paceMinPerKm !== undefined && input.paceMinPerKm > 12) {
    sportFactorUsed = 0.8;
    adjusted = true;
    reason = "Pace > 12 min/km, adjusted to Walking factor 0.8";
  }

  if (durationSec <= 0) {
    return { score: 0, sportFactorUsed, sportFactorOriginal, adjusted, reason: "Invalid duration" };
  }

  const raw = (calories / durationSec) * sportFactorUsed * specialEvent * durationMult * 100;
  const score = Math.round(raw * 100) / 100; // 2 decimals
  return { score, sportFactorUsed, sportFactorOriginal, adjusted, reason };
}
