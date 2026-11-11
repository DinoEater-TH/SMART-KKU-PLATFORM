// src/lib/types.ts
export type UUID = string;

export type RoleCode = "USER" | "STAFF" | "DEPARTMENT_ADMIN" | "SUPER_ADMIN" | "MERCHANT";

export interface User {
  id: UUID;
  email: string;
  displayName: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  role: RoleCode;
  personnelCode?: string;
  titleName?: string;
  firstName?: string;
  lastName?: string;
  personnelType?: "ACADEMIC" | "SUPPORT" | "OTHER";
  orgId?: UUID;
  orgName?: string;
  exp: number;
  levelName: string;
  points: number;
  power: number;
  createdAt: string;
}

export interface Organization {
  id: UUID;
  code: string;
  nameTh: string;
  nameEn?: string;
  type: string;
  parentId?: UUID;
  isActive: boolean;
}

export interface Project {
  id: UUID;
  orgId: UUID;
  orgName?: string;
  code: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdBy: UUID;
}

export interface Activity {
  id: UUID;
  projectId: UUID;
  projectName?: string;
  orgName?: string;
  code: string;
  name: string;
  description: string;
  activityType: string;
  registrationStartAt?: string;
  registrationEndAt?: string;
  capacity: number; // 0 = unlimited
  verificationMethod: "DIRECT" | "GEO_FENCE" | "QR_PASSCODE";
  status: "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED";
  pointReward: number;
  expReward: number;
  powerReward?: number;
  qualificationReward?: string;
  hasCertificate: boolean;
  eligiblePersonnelTypes?: string[];
  minExp?: number;
}

export interface ActivitySession {
  id: UUID;
  activityId: UUID;
  name: string;
  startAt: string;
  endAt: string;
  capacity?: number;
  status: "SCHEDULED" | "OPEN" | "CLOSED" | "COMPLETED";
}

export interface Registration {
  id: UUID;
  activityId: UUID;
  userId: UUID;
  status: "REGISTERED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  registeredAt: string;
  cancelledAt?: string;
}

export interface AttendanceRecord {
  id: UUID;
  registrationId: UUID;
  sessionId?: UUID;
  userId: UUID;
  attendanceStatus: "CHECKED_IN" | "CHECKED_OUT" | "ABSENT";
  verificationMethod: string;
  verifiedAt?: string;
  verifiedBy?: UUID;
}

export interface WalletTx {
  id: UUID;
  userId: UUID;
  type: "POINT" | "POWER" | "EXP";
  amount: number;
  balanceAfter: number;
  reason: string;
  sourceType?: string;
  sourceId?: UUID;
  formulaVersion?: string;
  createdAt: string;
}

export interface Qualification {
  id: UUID;
  userId: UUID;
  key: string;
  sourceActivityId?: UUID;
  sourceName?: string;
  grantedAt: string;
  expiresAt?: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  revokedReason?: string;
}

export interface WorkoutLog {
  id: UUID;
  userId: UUID;
  sportType: string;
  calories: number;
  durationSec: number;
  distanceKm?: number;
  paceMinPerKm?: number;
  performedAt: string;
  source: "MANUAL" | "STRAVA" | "GARMIN" | "SMARTWATCH";
  providerActivityId?: string;
  evidenceUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  validationReason?: string;
  sportFactorUsed: number;
  sportFactorOriginal: number;
  score: number; // POWER
  formulaVersion: string;
  createdAt: string;
}

export interface SportType {
  id: UUID;
  code: string;
  name: string;
  factor: number;
  isActive: boolean;
}

export interface ScoringRule {
  id: UUID;
  version: string;
  sportFactorMultiplier: number; // base, overridden per sport
  specialEventMultiplier: number;
  durationMultiplierPercent: number; // as percent e.g. 100
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  createdBy: UUID;
}

export interface FitnessSeason {
  id: UUID;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Reward {
  id: UUID;
  orgId?: UUID;
  orgName?: string;
  name: string;
  description: string;
  imageUrl?: string;
  pointCost: number;
  powerCost: number;
  expCost: number;
  stock: number;
  eligibilityRules: string[];
  validFrom?: string;
  validTo?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface Redemption {
  id: UUID;
  rewardId: UUID;
  rewardName?: string;
  userId: UUID;
  pointsSpent: number;
  powerSpent: number;
  expSpent: number;
  status: "PENDING" | "FULFILLED" | "CANCELLED";
  voucherId?: UUID;
  redeemedAt: string;
}

export interface Voucher {
  id: UUID;
  redemptionId: UUID;
  userId: UUID;
  merchantId?: UUID;
  token: string;
  expiresAt: string;
  status: "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED";
  usedAt?: string;
  usedByMerchantId?: UUID;
}

export interface Merchant {
  id: UUID;
  name: string;
  code: string;
  isActive: boolean;
}

export interface Community {
  id: UUID;
  name: string;
  description: string;
  ownerId: UUID;
  ownerName?: string;
  createdAt: string;
  memberCount: number;
  groupPower: number;
}

export interface CommunityMember {
  id: UUID;
  communityId: UUID;
  userId: UUID;
  userName?: string;
  joinedAt: string;
  status: "ACTIVE" | "LEFT";
  leftAt?: string;
}

export interface CommunityPost {
  id: UUID;
  communityId: UUID;
  userId: UUID;
  userName?: string;
  content: string;
  createdAt: string;
}

export interface Certificate {
  id: UUID;
  userId: UUID;
  userName?: string;
  activityId?: UUID;
  activityName?: string;
  orgName?: string;
  templateVersion: string;
  certificateNo: string;
  issuedAt: string;
  status: "ISSUED" | "REVOKED" | "REPLACED";
  pdfUrl?: string;
  revokedReason?: string;
}

export interface Notification {
  id: UUID;
  userId: UUID;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: UUID;
  actorId: UUID;
  actorName?: string;
  action: string;
  entityType: string;
  entityId?: UUID;
  details?: string;
  createdAt: string;
}

export interface Db {
  users: User[];
  organizations: Organization[];
  projects: Project[];
  activities: Activity[];
  sessions: ActivitySession[];
  registrations: Registration[];
  attendance: AttendanceRecord[];
  walletTx: WalletTx[];
  qualifications: Qualification[];
  workouts: WorkoutLog[];
  sportTypes: SportType[];
  scoringRules: ScoringRule[];
  seasons: FitnessSeason[];
  rewards: Reward[];
  redemptions: Redemption[];
  vouchers: Voucher[];
  merchants: Merchant[];
  communities: Community[];
  communityMembers: CommunityMember[];
  communityPosts: CommunityPost[];
  certificates: Certificate[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  passcodes: { id: UUID; activityId: UUID; code: string; expiresAt: string; createdBy: UUID; createdAt: string }[];
  referralCampaigns: any[];
  referralRecords: any[];
  systemSettings: Record<string, any>;
}
export default {};
