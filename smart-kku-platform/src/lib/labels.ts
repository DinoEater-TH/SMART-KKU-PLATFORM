// src/lib/labels.ts
export const ROLE_LABEL: Record<string, string> = {
  USER: "ผู้ใช้",
  STAFF: "Staff",
  DEPARTMENT_ADMIN: "แอดมินหน่วยงาน",
  SUPER_ADMIN: "แอดมินระบบ",
  MERCHANT: "ร้านค้า",
};

export const PERSONNEL_TYPE_LABEL: Record<string, string> = {
  ACADEMIC: "สายวิชาการ",
  SUPPORT: "สายสนับสนุน",
  OTHER: "อื่นๆ",
};

export const ACTIVITY_TYPE_LABEL: Record<string, string> = {
  EVENT: "กิจกรรม",
  TRAINING: "อบรม",
  HEALTHY_LIFE: "สุขภาพ",
};

export const VERIFICATION_METHOD_LABEL: Record<string, string> = {
  DIRECT: "เข้าร่วมโดยตรง",
  GEO_FENCE: "เช็กอินด้วยตำแหน่ง",
  QR_PIN: "QR Code + PIN",
  QR_PASSCODE: "QR Code + รหัส",
};

export const ACTIVITY_STATUS_LABEL: Record<string, string> = {
  DRAFT: "ร่าง",
  OPEN: "เปิดรับ",
  CLOSED: "ปิดรับ",
  COMPLETED: "จบแล้ว",
  CANCELLED: "ยกเลิก",
};

export const REWARD_TYPE_LABEL: Record<string, string> = {
  REWARD: "รางวัล",
  COUPON: "คูปอง",
};

export const REDEMPTION_STATUS_LABEL: Record<string, string> = {
  PENDING: "รอรับของ",
  FULFILLED: "รับแล้ว",
  CANCELLED: "ยกเลิก",
};

export const VOUCHER_STATUS_LABEL: Record<string, string> = {
  ACTIVE: "ใช้งานได้",
  USED: "ใช้แล้ว",
  EXPIRED: "หมดอายุ",
  CANCELLED: "ยกเลิก",
};

export const ATTENDANCE_STATUS_LABEL: Record<string, string> = {
  CHECKED_IN: "เช็กอินแล้ว",
  PIN_VERIFIED: "ยืนยัน PIN แล้ว",
  ABSENT: "ไม่มา",
};

export const REGISTRATION_STATUS_LABEL: Record<string, string> = {
  REGISTERED: "ลงทะเบียนแล้ว",
  CANCELLED: "ยกเลิก",
  COMPLETED: "เข้าร่วมสำเร็จ",
  NO_SHOW: "ไม่มา",
};

export const COMMUNITY_STATUS_LABEL: Record<string, string> = {
  ACTIVE: "เปิดใช้งาน",
  DISSOLVED: "ยุบแล้ว",
};

export const QUIZ_MODE_LABEL: Record<string, string> = {
  SINGLE_ATTEMPT: "ตอบได้ครั้งเดียว",
  RETRY_UNTIL_CORRECT: "ตอบซ้ำจนถูก",
};

export const CERTIFICATE_STATUS_LABEL: Record<string, string> = {
  ISSUED: "ออกแล้ว",
  REVOKED: "เพิกถอน",
  REPLACED: "เปลี่ยนใหม่",
};

export const WORKOUT_STATUS_LABEL: Record<string, string> = {
  PENDING: "รอตรวจสอบ",
  APPROVED: "อนุมัติ",
  REJECTED: "ปฏิเสธ",
};

export function label(map: Record<string, string>, value: string | undefined | null): string {
  if (!value) return "-";
  return map[value] || value;
}
