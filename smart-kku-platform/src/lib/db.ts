// src/lib/db.ts
import fs from "fs";
import path from "path";
import { Db, UUID } from "./types";
export type { Db } from "./types";
export type { UUID } from "./types";
import { v4 as uuidv4 } from "uuid";

const DATA_FILE = path.join(process.cwd(), "data", "db.json");

function emptyDb(): Db {
  return {
    users: [],
    levels: [],
    organizations: [],
    projects: [],
    activities: [],
    sessions: [],
    staffAssignments: [],
    registrations: [],
    attendance: [],
    walletTx: [],
    conversions: [],
    workouts: [],
    sportTypes: [],
    scoringRules: [],
    seasons: [],
    rewards: [],
    redemptions: [],
    vouchers: [],
    merchants: [],
    communities: [],
    communityMembers: [],
    communityPosts: [],
    certificates: [],
    quizzes: [],
    quizAnswers: [],
    notifications: [],
    auditLogs: [],
    systemSettings: {},
  };
}export function readDb(): Db {
  try {
    if (!fs.existsSync(DATA_FILE)) return emptyDb();
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    // merge defaults
    const base = emptyDb();
    return { ...base, ...parsed };
  } catch {
    return emptyDb();
  }
}

export function writeDb(db: Db) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
}

export async function getDb(): Promise<Db> {
  const db = readDb();
  if (db.users.length === 0) {
    const { seedDb } = await import("./seed");
    seedDb(db);
    writeDb(db);
  }
  return db;
}

export function uid(): UUID {
  return uuidv4();
}

export function now(): string {
  return new Date().toISOString();
}

export function audit(db: Db, actorId: UUID, action: string, entityType: string, entityId?: UUID, details?: string) {
  db.auditLogs.unshift({
    id: uid(),
    actorId,
    action,
    entityType,
    entityId,
    details,
    createdAt: now(),
  });
}
