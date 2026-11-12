// src/lib/seed.ts
import { Db, uid, now } from "./db";
import type {
  User, Organization, Project, Activity, SportType, ScoringRule, FitnessSeason,
  Reward, Merchant, Community, Level, Quiz,
} from "./types";

const LEVELS = [
  { name: "Beginner", minExp: 0, maxExp: 499 },
  { name: "Explorer", minExp: 500, maxExp: 999 },
  { name: "Active", minExp: 1000, maxExp: 1999 },
  { name: "Expert", minExp: 2000, maxExp: 3999 },
  { name: "Extra", minExp: 4000, maxExp: 6999 },
  { name: "Master", minExp: 7000, maxExp: 9999 },
  { name: "Legend", minExp: 10000, maxExp: null },
];

function pickLevel(levels: Level[], exp: number) {
  const sorted = [...levels].sort((a, b) => a.minExp - b.minExp);
  let found = sorted[0];
  for (const l of sorted) {
    if (exp >= l.minExp && (l.maxExp === null || exp <= (l.maxExp as number))) found = l;
  }
  return found;
}

export function seedDb(db: Db) {
  if (db.users.length > 0) return;

  const levels: Level[] = LEVELS.map((l, i) => ({
    id: uid(), name: l.name, minExp: l.minExp, maxExp: l.maxExp, order: i + 1,
    description: l.name + " level",
  }));
  db.levels = levels;

  const uni: Organization = { id: uid(), code: "KKU", nameTh: "Khon Kaen University", nameEn: "Khon Kaen University", type: "UNIVERSITY", isActive: true };
  const hr: Organization = { id: uid(), code: "HR", nameTh: "Human Resources Division", nameEn: "Human Resources Division", type: "DIVISION", parentId: uni.id, isActive: true };
  const med: Organization = { id: uid(), code: "MED", nameTh: "Faculty of Medicine", nameEn: "Faculty of Medicine", type: "FACULTY", parentId: uni.id, isActive: true };
  const arch: Organization = { id: uid(), code: "ARCH", nameTh: "Faculty of Architecture", nameEn: "Faculty of Architecture", type: "FACULTY", parentId: uni.id, isActive: true };
  const culture: Organization = { id: uid(), code: "CULT", nameTh: "Cultural Center", nameEn: "Cultural Center", type: "CENTER", parentId: uni.id, isActive: true };
  db.organizations.push(uni, hr, med, arch, culture);

  const mkUser = (email: string, name: string, role: any, org: Organization | undefined, personnelType: any, exp = 0): User => ({
    id: uid(),
    email,
    displayName: name,
    status: "ACTIVE",
    role,
    personnelCode: "P" + Math.floor(Math.random() * 9000 + 1000),
    titleName: "Mr./Ms.",
    firstName: name.split(" ")[0],
    lastName: name.split(" ")[1] || "",
    personnelType,
    orgId: org?.id,
    orgName: org?.nameTh,
    exp,
    levelId: pickLevel(levels, exp).id,
    levelName: pickLevel(levels, exp).name,
    points: 0,
    power: 0,
    createdAt: now(),
  });

  const superAdmin = mkUser("admin@kku.ac.th", "Somchai Jaidee", "SUPER_ADMIN", hr, "SUPPORT", 12000);
  const staff2 = mkUser("staff2@kku.ac.th", "Suda Meesuk", "USER", med, "ACADEMIC", 3500);
  const user1 = mkUser("user1@kku.ac.th", "Wilai Kyan", "USER", med, "ACADEMIC", 2800);
  const user2 = mkUser("user2@kku.ac.th", "Prayut Sukkhaphap", "USER", arch, "ACADEMIC", 6200);
  const user3 = mkUser("user3@kku.ac.th", "Napha Okkamlung", "USER", culture, "SUPPORT", 450);
  const user4 = mkUser("user4@kku.ac.th", "Krit Chaiyo", "USER", hr, "SUPPORT", 10500);
  const merchantUser = mkUser("merchant@kku.ac.th", "KKU Coffee Shop", "MERCHANT", undefined, undefined, 0);
  const extraUsers = [
    mkUser("user5@kku.ac.th", "Anong Sookjai", "USER", hr, "SUPPORT", 1500),
    mkUser("user6@kku.ac.th", "Chaiyo Mankong", "USER", med, "ACADEMIC", 5200),
    mkUser("user7@kku.ac.th", "Duangdee Rakdee", "USER", arch, "SUPPORT", 900),
    mkUser("user8@kku.ac.th", "Ekkachai Suksan", "USER", culture, "ACADEMIC", 7800),
  ];
  db.users.push(superAdmin, staff2, user1, user2, user3, user4, merchantUser, ...extraUsers);

  const p1: Project = { id: uid(), orgId: hr.id, orgName: hr.nameTh, code: "HL8", name: "KKU Healthy Life 8", description: "Health promotion program for personnel", startDate: "2026-01-01", endDate: "2026-12-31", status: "ACTIVE", createdBy: superAdmin.id };
  const p2: Project = { id: uid(), orgId: med.id, orgName: med.nameTh, code: "MED-AERO", name: "Aerobic Dance", description: "Aerobic activity by Faculty of Medicine", startDate: "2026-02-01", endDate: "2026-06-30", status: "ACTIVE", createdBy: superAdmin.id };
  const p3: Project = { id: uid(), orgId: arch.id, orgName: arch.nameTh, code: "ARCH-DESIGN", name: "Office Design Workshop", description: "Workspace design activity", startDate: "2026-03-01", endDate: "2026-05-31", status: "ACTIVE", createdBy: superAdmin.id };
  const p4: Project = { id: uid(), orgId: hr.id, orgName: hr.nameTh, code: "NEW-STAFF", name: "New Personnel Program", description: "Training for new personnel", startDate: "2026-01-01", endDate: "2026-12-31", status: "ACTIVE", createdBy: superAdmin.id };
  db.projects.push(p1, p2, p3, p4);

  const a1: Activity = { id: uid(), projectId: p1.id, projectName: p1.name, orgName: hr.nameTh, code: "HL-WALK", name: "Walking for Health", description: "Walking exercise activity", location: "KKU Main Stadium", activityType: "HEALTHY_LIFE", capacity: 0, verificationMethod: "DIRECT", status: "OPEN", pointReward: 0, expReward: 0, staffMultiplier: 2, allowInvite: false, hasCertificate: false };
  const a2: Activity = { id: uid(), projectId: p2.id, projectName: p2.name, orgName: med.nameTh, code: "AERO", name: "Aerobic Dance", description: "Aerobic activity for personnel", location: "Golden Jubilee Hall", activityType: "EVENT", capacity: 0, verificationMethod: "QR_PIN", status: "OPEN", pointReward: 100, expReward: 100, staffMultiplier: 2, pinCode: "2468", pinMode: "SHARED", allowInvite: true, hasCertificate: false };
  const a3: Activity = { id: uid(), projectId: p3.id, projectName: p3.name, orgName: arch.nameTh, code: "DESIGN", name: "Office Design Workshop", description: "Workspace design activity", location: "Architecture Building", activityType: "EVENT", capacity: 30, verificationMethod: "QR_PIN", status: "OPEN", pointReward: 50, expReward: 30, staffMultiplier: 1.5, pinCode: "1357", pinMode: "SHARED", allowInvite: true, hasCertificate: true };
  const a4: Activity = { id: uid(), projectId: p4.id, projectName: p4.name, orgName: hr.nameTh, code: "NEW-STAFF-TRAINING", name: "New Personnel Training", description: "Training for new personnel (support line only)", location: "HR Training Room", activityType: "TRAINING", capacity: 30, verificationMethod: "QR_PIN", status: "OPEN", pointReward: 200, expReward: 200, staffMultiplier: 2, pinCode: "9876", pinMode: "SHARED", allowInvite: false, hasCertificate: true, eligiblePersonnelTypes: ["SUPPORT"] };
  const a5: Activity = { id: uid(), projectId: p4.id, projectName: p4.name, orgName: hr.nameTh, code: "ADVANCED-TRAINING", name: "Advanced Academic Training", description: "Advanced training (requires New Personnel Training)", location: "HR Training Room 2", activityType: "TRAINING", capacity: 50, verificationMethod: "QR_PIN", status: "OPEN", pointReward: 100, expReward: 100, staffMultiplier: 2, pinCode: "5678", pinMode: "SHARED", allowInvite: false, hasCertificate: true, eligiblePersonnelTypes: ["ACADEMIC"], prerequisiteActivityId: a4.id };
  const a6: Activity = { id: uid(), projectId: p1.id, projectName: p1.name, orgName: hr.nameTh, code: "YOGA", name: "Yoga for Health", description: "Yoga session for personnel", location: "KKU Gym", activityType: "EVENT", capacity: 40, verificationMethod: "QR_PIN", status: "OPEN", pointReward: 80, expReward: 60, staffMultiplier: 1.5, pinCode: "2222", pinMode: "SHARED", allowInvite: true, hasCertificate: false };
  const a7: Activity = { id: uid(), projectId: p2.id, projectName: p2.name, orgName: med.nameTh, code: "BLOOD-DONATE", name: "Blood Donation Drive", description: "Annual blood donation activity", location: "Golden Jubilee Hall", activityType: "EVENT", capacity: 0, verificationMethod: "DIRECT", status: "OPEN", pointReward: 150, expReward: 100, staffMultiplier: 2, allowInvite: false, hasCertificate: true };
  db.activities.push(a1, a2, a3, a4, a5, a6, a7);

  const sports: SportType[] = [
    { id: uid(), code: "RUNNING", name: "Running", factor: 1.0, isActive: true },
    { id: uid(), code: "WALKING", name: "Walking", factor: 0.8, isActive: true },
    { id: uid(), code: "CYCLING", name: "Cycling", factor: 0.7, isActive: true },
    { id: uid(), code: "AEROBIC", name: "Aerobic", factor: 0.9, isActive: true },
  ];
  db.sportTypes = sports;

  const rule: ScoringRule = { id: uid(), version: "v1.0", specialEventMultiplier: 1.0, durationMultiplierPercent: 100, isActive: true, effectiveFrom: "2026-01-01T00:00:00Z", createdBy: superAdmin.id };
  db.scoringRules.push(rule);

  db.seasons.push({ id: uid(), name: "KKU Healthy Life 8", description: "Batch 8", startDate: "2026-01-01", endDate: "2026-12-31", isActive: true });

  const merchant: Merchant = { id: uid(), name: "KKU Coffee Shop", code: "COFFEE01", email: "coffee@shop.com", phone: "0812345678", isActive: true };
  db.merchants.push(merchant);

  const r1: Reward = { id: uid(), orgId: hr.id, orgName: hr.nameTh, name: "Water Bottle", description: "KKU branded bottle", rewardType: "REWARD", pointCost: 200, powerCost: 0, stock: 100, stockTotal: 100, status: "ACTIVE" };
  const r2: Reward = { id: uid(), orgId: hr.id, orgName: hr.nameTh, name: "Sports Shirt", description: "KKU sports shirt", rewardType: "REWARD", pointCost: 0, powerCost: 300, stock: 50, stockTotal: 50, status: "ACTIVE" };
  const r3: Reward = { id: uid(), orgId: hr.id, orgName: hr.nameTh, name: "Tote Bag", description: "Fabric tote bag", rewardType: "REWARD", pointCost: 150, powerCost: 0, stock: 80, stockTotal: 80, status: "ACTIVE" };
  const r4: Reward = { id: uid(), orgId: hr.id, orgName: hr.nameTh, name: "Fitness Band", description: "Wrist fitness band", rewardType: "REWARD", pointCost: 0, powerCost: 400, stock: 25, stockTotal: 25, status: "ACTIVE" };
  const r5: Reward = { id: uid(), orgId: hr.id, orgName: hr.nameTh, name: "KKU Mug", description: "Ceramic mug", rewardType: "REWARD", pointCost: 300, powerCost: 0, stock: 60, stockTotal: 60, status: "ACTIVE" };
  const c1: Reward = { id: uid(), name: "10% Off All Items", description: "10% discount on everything", rewardType: "COUPON", pointCost: 100, powerCost: 0, stock: 200, stockTotal: 200, merchantId: merchant.id, discountType: "PERCENT_ALL", terms: "One-time use.", status: "ACTIVE" };
  const c2: Reward = { id: uid(), name: "Iced Coffee -5 THB", description: "5 baht off iced coffee", rewardType: "COUPON", pointCost: 50, powerCost: 0, stock: 300, stockTotal: 300, merchantId: merchant.id, discountType: "FIXED_ITEM", terms: "Valid for iced coffee only.", status: "ACTIVE" };
  db.rewards.push(r1, r2, r3, r4, r5, c1, c2);

  const comm: Community = { id: uid(), name: "KKU Runners Club", description: "Running lovers group", ownerId: user2.id, ownerName: user2.displayName, createdAt: now(), memberCount: 1, groupPower: user2.exp, status: "ACTIVE" };
  db.communities.push(comm);
  db.communityMembers.push({ id: uid(), communityId: comm.id, userId: user2.id, userName: user2.displayName, joinedAt: now(), status: "ACTIVE" });
  db.communityPosts.push({ id: uid(), communityId: comm.id, userId: user2.id, userName: user2.displayName, content: "Ran 5km today, keep going!", createdAt: now() });

  const q1: Quiz = { id: uid(), title: "KKU Health Knowledge", question: "How many minutes of moderate exercise per week does WHO recommend?", choices: ["60 minutes", "150 minutes", "300 minutes", "500 minutes"], correctIndex: 1, pointReward: 20, expReward: 10, mode: "SINGLE_ATTEMPT", isActive: true, createdAt: now() };
  const q2: Quiz = { id: uid(), title: "KKU History", question: "In which year was Khon Kaen University established?", choices: ["1962", "1964", "1966", "1968"], correctIndex: 1, pointReward: 30, expReward: 15, mode: "RETRY_UNTIL_CORRECT", isActive: true, createdAt: now() };
  const q3: Quiz = { id: uid(), title: "Nutrition Knowledge", question: "How many glasses of water should you drink per day?", choices: ["4 glasses", "6 glasses", "8 glasses", "10 glasses"], correctIndex: 2, pointReward: 15, expReward: 8, mode: "SINGLE_ATTEMPT", isActive: true, createdAt: now() };
  db.quizzes.push(q1, q2, q3);

  db.notifications.push(
    { id: uid(), userId: user1.id, title: "Welcome", body: "Welcome to Smart KKU Platform", type: "INFO", isRead: false, createdAt: now() },
    { id: uid(), userId: user2.id, title: "Level Up!", body: "You have reached Extra Level", type: "LEVEL", isRead: false, createdAt: now() },
  );

  const u2 = db.users.find((x) => x.id === user2.id)!;
  u2.power = 450;
  u2.points = 1500;
  const u1 = db.users.find((x) => x.id === user1.id)!;
  u1.power = 213;
  u1.points = 800;
}
