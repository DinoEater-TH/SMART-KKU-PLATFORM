// src/lib/types.ts
export type UUID = string;

export type RoleCode = "USER" | "STAFF" | "DEPARTMENT_ADMIN" | "SUPER_ADMIN" | "MERCHANT";

export interface User {
  id: UUID;
  email: string;
  phone?: string;
  displayName: string;
  avatarUrl?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  role: RoleCode;
  personnelCode?: string;
  titleName?: string;
  firstName?: string;
  lastName?: string;
  personnelType?: "ACADEMIC" | "SUPPORT";
  orgId?: UUID;
  orgName?: string;
  exp: number;
  levelId?: UUID;
  levelName: string;
  points: number;
  power: number;
  createdAt: string;
}

export interface Level {
  id: UUID;
  name: string;
  minExp: number;
  maxExp: number | null;
  description?: string;
  order: number;
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
  location?: string;
  bannerUrl?: string;
  activityType: string;
  startAt?: string;
  endAt?: string;
  registrationStartAt?: string;
  registrationEndAt?: string;
  capacity: number; // 0 = unlimited
  verificationMethod: "QR_PIN" | "DIRECT" | "GEO_FENCE";
  status: "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED" | "CANCELLED";
  pointReward: number;
  expReward: number;
  staffMultiplier: number;
  pinCode?: string;
  pinMode?: "SHARED" | "PER_USER";
  pinActive?: boolean;
  allowInvite: boolean;
  prerequisiteActivityId?: UUID;
  hasCertificate: boolean;
  certificateTemplate?: string;
  eligiblePersonnelTypes?: string[];
}

export interface StaffAssignment {
  id: UUID;
  activityId: UUID;
  userId: UUID;
  assignedBy: UUID;
  assignedAt: string;
  revokedAt?: string;
  revokedBy?: UUID;
  isActive: boolean;
  // settlement
  settledAt?: string;
  pointAwarded?: number;
  expAwarded?: number;
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
  invitedBy?: UUID;
  inviteStatus?: "PENDING" | "ACCEPTED" | "DECLINED";
}

export type AttendanceStatus = "CHECKED_IN" | "PIN_VERIFIED" | "ABSENT";

export interface AttendanceRecord {
  id: UUID;
  registrationId: UUID;
  sessionId?: UUID;
  userId: UUID;
  activityId: UUID;
  attendanceStatus: AttendanceStatus;
  verificationMethod: string;
  checkedInAt?: string;
  checkedInBy?: UUID;
  pinVerifiedAt?: string;
  createdAt: string;
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
  power: number;
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
  specialEventMultiplier: number;
  durationMultiplierPercent: number;
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
  rewardType: "REWARD" | "COUPON";
  pointCost: number;
  powerCost: number;
  stock: number;
  stockTotal: number;
  minLevelId?: UUID;
  requiredActivityId?: UUID;
  merchantId?: UUID;
  discountType?: string;
  terms?: string;
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
  status: "PENDING" | "FULFILLED" | "CANCELLED";
  voucherId?: UUID;
  redeemedAt: string;
}

export interface Voucher {
  id: UUID;
  redemptionId: UUID;
  rewardId: UUID;
  userId: UUID;
  merchantId?: UUID;
  token: string;
  expiresAt: string;
  status: "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED";
  usedAt?: string;
  verifiedByMerchantId?: UUID;
}

export interface Merchant {
  id: UUID;
  name: string;
  code: string;
  email?: string;
  phone?: string;
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
  status: "ACTIVE" | "DISSOLVED";
  dissolvedAt?: string;
  dissolvedReason?: string;
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

export interface Quiz {
  id: UUID;
  title: string;
  question: string;
  choices: string[];
  correctIndex: number;
  pointReward: number;
  expReward: number;
  mode: "SINGLE_ATTEMPT" | "RETRY_UNTIL_CORRECT";
  eligiblePersonnelTypes?: string[];
  openAt?: string;
  closeAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface QuizAnswer {
  id: UUID;
  quizId: UUID;
  userId: UUID;
  selectedIndex: number;
  isCorrect: boolean;
  answeredAt: string;
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
  levels: Level[];
  organizations: Organization[];
  projects: Project[];
  activities: Activity[];
  sessions: ActivitySession[];
  staffAssignments: StaffAssignment[];
  registrations: Registration[];
  attendance: AttendanceRecord[];
  walletTx: WalletTx[];
  conversions: { id: UUID; userId: UUID; powerUsed: number; expGained: number; rate: number; createdAt: string }[];
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
  quizzes: Quiz[];
  quizAnswers: QuizAnswer[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  systemSettings: Record<string, any>;
}
export default {};
