// src/lib/seed.ts
import { Db, uid, now } from "./db";
import type { User, Organization, Project, Activity, ActivitySession, SportType, ScoringRule, FitnessSeason, Reward, Merchant, Community } from "./types";

export function seedDb(db: Db) {
  if (db.users.length > 0) return;

  const uni: Organization = { id: uid(), code: "KKU", nameTh: "Khon Kaen University", nameEn: "Khon Kaen University", type: "UNIVERSITY", isActive: true };
  const hr: Organization = { id: uid(), code: "HR", nameTh: "Human Resources Division", nameEn: "Human Resources Division", type: "DIVISION", parentId: uni.id, isActive: true };
  const med: Organization = { id: uid(), code: "MED", nameTh: "Faculty of Medicine", nameEn: "Faculty of Medicine", type: "FACULTY", parentId: uni.id, isActive: true };
  const arch: Organization = { id: uid(), code: "ARCH", nameTh: "Faculty of Architecture", nameEn: "Faculty of Architecture", type: "FACULTY", parentId: uni.id, isActive: true };
  const culture: Organization = { id: uid(), code: "CULT", nameTh: "Cultural Center", nameEn: "Cultural Center", type: "CENTER", parentId: uni.id, isActive: true };
  db.organizations.push(uni, hr, med, arch, culture);

  const mkUser = (email: string, name: string, role: any, org?: Organization, personnelType?: any, exp = 0): User => ({
    id: uid(),
    email,
    displayName: name,
    status: "ACTIVE",
    role,
    personnelCode: "P" + Math.floor(Math.random() * 9000 + 1000),
    titleName: "Mr./Ms.",
    firstName: name.split(" ")[0],
    lastName: name.split(" ")[1] || "",
    personnelType: personnelType || "SUPPORT",
    orgId: org?.id,
    orgName: org?.nameTh,
    exp,
    levelName: levelName(exp),
    points: 0,
    power: 0,
    createdAt: now(),
  });

  function levelName(exp: number) {
    if (exp >= 10000) return "Legend";
    if (exp >= 7000) return "Master";
    if (exp >= 4000) return "Extra";
    if (exp >= 2000) return "Expert";
    if (exp >= 1000) return "Active";
    if (exp >= 500) return "Explorer";
    return "Beginner";
  }

  const superAdmin = mkUser("admin@kku.ac.th", "Somchai Jaidee", "SUPER_ADMIN", hr, "SUPPORT", 12000);
  const deptAdmin = mkUser("deptadmin@kku.ac.th", "Somying Rakngan", "DEPARTMENT_ADMIN", med, "ACADEMIC", 3500);
  const staff = mkUser("staff@kku.ac.th", "Somsak Chuayngan", "STAFF", hr, "SUPPORT", 1200);
  const user1 = mkUser("user1@kku.ac.th", "Wilai Kyan", "USER", med, "ACADEMIC", 2800);
  const user2 = mkUser("user2@kku.ac.th", "Prayut Sukkhaphap", "USER", arch, "ACADEMIC", 6200);
  const user3 = mkUser("user3@kku.ac.th", "Napha Okkamlung", "USER", culture, "SUPPORT", 450);
  const merchant = mkUser("merchant@kku.ac.th", "KKU Shop", "MERCHANT", hr, "SUPPORT", 0);
  db.users.push(superAdmin, deptAdmin, staff, user1, user2, user3, merchant);

  const p1: Project = { id: uid(), orgId: hr.id, orgName: hr.nameTh, code: "HL8", name: "KKU Healthy Life 8", description: "Health promotion program for personnel, batch 8", startDate: "2026-01-01", endDate: "2026-12-31", status: "ACTIVE", createdBy: superAdmin.id };
  const p2: Project = { id: uid(), orgId: med.id, orgName: med.nameTh, code: "MED-AERO", name: "Aerobic Dance for Personnel", description: "Aerobic activity by Faculty of Medicine", startDate: "2026-02-01", endDate: "2026-06-30", status: "ACTIVE", createdBy: deptAdmin.id };
  const p3: Project = { id: uid(), orgId: arch.id, orgName: arch.nameTh, code: "ARCH-DESIGN", name: "Office Design Workshop", description: "Workspace design activity", startDate: "2026-03-01", endDate: "2026-05-31", status: "ACTIVE", createdBy: deptAdmin.id };
  const p4: Project = { id: uid(), orgId: hr.id, orgName: hr.nameTh, code: "NEW-STAFF", name: "New Personnel Program", description: "Training for new personnel", startDate: "2026-01-01", endDate: "2026-12-31", status: "ACTIVE", createdBy: superAdmin.id };
  const p5: Project = { id: uid(), orgId: culture.id, orgName: culture.nameTh, code: "SONGKRAN", name: "Songkran at Bueng Srithan", description: "Songkran activity", startDate: "2026-04-10", endDate: "2026-04-15", status: "ACTIVE", createdBy: superAdmin.id };
  db.projects.push(p1, p2, p3, p4, p5);

  const a1: Activity = { id: uid(), projectId: p1.id, projectName: p1.name, orgName: hr.nameTh, code: "HL-WALK", name: "Walking for Health", description: "Walking exercise activity", activityType: "HEALTHY_LIFE", registrationStartAt: "2026-01-01T00:00:00Z", registrationEndAt: "2026-12-31T23:59:59Z", capacity: 0, verificationMethod: "DIRECT", status: "OPEN", pointReward: 0, expReward: 0, powerReward: 0, hasCertificate: false };
  const a2: Activity = { id: uid(), projectId: p2.id, projectName: p2.name, orgName: med.nameTh, code: "AERO", name: "Aerobic Dance", description: "Aerobic activity for personnel", activityType: "EVENT", registrationStartAt: "2026-02-01T00:00:00Z", registrationEndAt: "2026-06-30T23:59:59Z", capacity: 0, verificationMethod: "DIRECT", status: "OPEN", pointReward: 100, expReward: 100, hasCertificate: false };
  const a3: Activity = { id: uid(), projectId: p3.id, projectName: p3.name, orgName: arch.nameTh, code: "DESIGN", name: "Office Design Workshop", description: "Workspace design activity", activityType: "EVENT", registrationStartAt: "2026-03-01T00:00:00Z", registrationEndAt: "2026-05-31T23:59:59Z", capacity: 30, verificationMethod: "QR_PASSCODE", status: "OPEN", pointReward: 50, expReward: 30, hasCertificate: true };
  const a4: Activity = { id: uid(), projectId: p4.id, projectName: p4.name, orgName: hr.nameTh, code: "NEW-STAFF-TRAINING", name: "New Personnel Training", description: "Training for new personnel", activityType: "TRAINING", registrationStartAt: "2026-01-01T00:00:00Z", registrationEndAt: "2026-12-31T23:59:59Z", capacity: 30, verificationMethod: "QR_PASSCODE", status: "OPEN", pointReward: 200, expReward: 200, qualificationReward: "NEW_STAFF_TRAINING_COMPLETED", hasCertificate: true, eligiblePersonnelTypes: ["SUPPORT"] };
  const a5: Activity = { id: uid(), projectId: p5.id, projectName: p5.name, orgName: culture.nameTh, code: "SONGKRAN-CHECKIN", name: "Songkran Check-in", description: "Check-in to earn EXP", activityType: "EVENT", registrationStartAt: "2026-04-10T00:00:00Z", registrationEndAt: "2026-04-15T23:59:59Z", capacity: 0, verificationMethod: "GEO_FENCE", status: "OPEN", pointReward: 0, expReward: 150, hasCertificate: false };
  const a6: Activity = { id: uid(), projectId: p4.id, projectName: p4.name, orgName: hr.nameTh, code: "ADVANCED-TRAINING", name: "Advanced Academic Training", description: "Advanced training (requires new personnel training)", activityType: "TRAINING", registrationStartAt: "2026-01-01T00:00:00Z", registrationEndAt: "2026-12-31T23:59:59Z", capacity: 50, verificationMethod: "QR_PASSCODE", status: "OPEN", pointReward: 100, expReward: 100, qualificationReward: "ACADEMIC_ADVANCED_TRAINING", hasCertificate: true, eligiblePersonnelTypes: ["ACADEMIC"] };
  db.activities.push(a1, a2, a3, a4, a5, a6);

  db.sessions.push({ id: uid(), activityId: a3.id, name: "Morning session", startAt: "2026-03-15T02:00:00Z", endAt: "2026-03-15T05:00:00Z", capacity: 15, status: "SCHEDULED" });
  db.sessions.push({ id: uid(), activityId: a3.id, name: "Afternoon session", startAt: "2026-03-15T07:00:00Z", endAt: "2026-03-15T10:00:00Z", capacity: 15, status: "SCHEDULED" });

  const sports: SportType[] = [
    { id: uid(), code: "RUNNING", name: "Running", factor: 1.0, isActive: true },
    { id: uid(), code: "WALKING", name: "Walking", factor: 0.8, isActive: true },
    { id: uid(), code: "CYCLING", name: "Cycling", factor: 0.7, isActive: true },
    { id: uid(), code: "AEROBIC", name: "Aerobic", factor: 0.9, isActive: true },
  ];
  db.sportTypes = sports;

  db.scoringRules.push({ id: uid(), version: "v1.0", sportFactorMultiplier: 1, specialEventMultiplier: 1.0, durationMultiplierPercent: 100, isActive: true, effectiveFrom: "2026-01-01T00:00:00Z", createdBy: superAdmin.id });

  db.seasons.push({ id: uid(), name: "KKU Healthy Life 8", description: "Batch 8", startDate: "2026-01-01", endDate: "2026-12-31", isActive: true });

  const r1: Reward = { id: uid(), orgId: hr.id, orgName: hr.nameTh, name: "KKU Healthy Life T-shirt", description: "Souvenir shirt", pointCost: 500, powerCost: 0, expCost: 0, stock: 100, eligibilityRules: [], status: "ACTIVE" };
  const r2: Reward = { id: uid(), orgId: hr.id, orgName: hr.nameTh, name: "Coffee Coupon", description: "One cup of coffee", pointCost: 200, powerCost: 0, expCost: 0, stock: 50, eligibilityRules: [], status: "ACTIVE" };
  const r3: Reward = { id: uid(), orgId: med.id, orgName: med.nameTh, name: "Sports Reward (Healthy Life required)", description: "Reward for Healthy Life completers", pointCost: 1000, powerCost: 0, expCost: 0, stock: 20, eligibilityRules: ["QUALIFICATION:KKU_HEALTHY_LIFE_COMPLETED"], status: "ACTIVE" };
  const r4: Reward = { id: uid(), orgId: hr.id, orgName: hr.nameTh, name: "POWER Reward", description: "Redeem with POWER", pointCost: 0, powerCost: 300, expCost: 0, stock: 30, eligibilityRules: [], status: "ACTIVE" };
  db.rewards.push(r1, r2, r3, r4);

  db.merchants.push({ id: uid(), name: "KKU Coffee Shop", code: "COFFEE01", isActive: true });

  const c1: Community = { id: uid(), name: "KKU Runners Club", description: "Running lovers group", ownerId: user2.id, ownerName: user2.displayName, createdAt: now(), memberCount: 1, groupPower: user2.exp };
  db.communities.push(c1);
  db.communityMembers.push({ id: uid(), communityId: c1.id, userId: user2.id, userName: user2.displayName, joinedAt: now(), status: "ACTIVE" });
  db.communityPosts.push({ id: uid(), communityId: c1.id, userId: user2.id, userName: user2.displayName, content: "Ran 5km today, keep going!", createdAt: now() });

  db.systemSettings = {
    groupLimit: 3,
    cooldownDays: 36,
    voucherExpiryMinutes: 5,
    clubCreationExp: 10000,
    referralInviterBonus: 100,
    referralInviteeBonus: 50,
    referralLimit: 5,
    powerToExpRate: 10,
  };

  db.users.find((u: any) => u.id === user2.id)!.power = 450;
  db.users.find((u: any) => u.id === user2.id)!.points = 1500;
}
