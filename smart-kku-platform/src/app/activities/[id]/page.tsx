// src/app/activities/[id]/page.tsx
"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

import { Suspense } from "react";

export default function ActivityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [activity, setActivity] = useState<any>(null);
  const [reg, setReg] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [passcode, setPasscode] = useState("");
  const [passcodes, setPasscodes] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const a = await api(`/api/activities/${id}`);
    setActivity(a);
    if (user) {
      const r = await api(`/api/registrations?activityId=${id}`);
      setReg(r[0]);
      const att = await api(`/api/attendance?activityId=${id}`);
      setAttendance(att);
      if (["SUPER_ADMIN", "DEPARTMENT_ADMIN", "STAFF"].includes(user.role)) {
        const pcs = await api(`/api/passcodes?activityId=${id}`);
        setPasscodes(pcs);
      }
    }
  };
  useEffect(() => { load(); }, [id, user]);

  const register = async () => {
    try { await api("/api/registrations", { method: "POST", body: JSON.stringify({ activityId: id }) }); await load(); setMsg("ลงทะเบียนสำเร็จ"); }
    catch (e: any) { setMsg(e.message); }
  };

  const checkIn = async (method: string) => {
    try {
      const body: any = { activityId: id, method };
      if (method === "QR_PASSCODE") body.passcode = passcode;
      if (method === "GEO_FENCE") { body.lat = 16.47; body.lng = 102.82; }
      await api("/api/attendance", { method: "POST", body: JSON.stringify(body) });
      setMsg("เช็กอินสำเร็จ");
      await load();
    } catch (e: any) { setMsg(e.message); }
  };

  const createPasscode = async () => {
    try {
      const pc = await api("/api/passcodes", { method: "POST", body: JSON.stringify({ activityId: id, minutes: 30 }) });
      setMsg("สร้างรหัส: " + pc.code);
      await load();
    } catch (e: any) { setMsg(e.message); }
  };

  if (!activity) return <div>กำลังโหลด...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{activity.name}</h1>
      <p className="text-gray-600">{activity.description}</p>
      <div className="bg-white p-4 rounded border text-sm space-y-1">
        <div>หน่วยงาน: {activity.orgName}</div>
        <div>โครงการ: {activity.projectName}</div>
        <div>ประเภท: {activity.activityType}</div>
        <div>วิธีเช็กอิน: {activity.verificationMethod}</div>
        <div>รับ: {activity.capacity === 0 ? "ไม่จำกัด" : activity.capacity}</div>
        <div>สถานะ: {activity.status}</div>
        <div>รางวัล: POINT +{activity.pointReward} · EXP +{activity.expReward} {activity.qualificationReward && `· Qualification: ${activity.qualificationReward}`} {activity.hasCertificate && "· Certificate"}</div>
      </div>

      {msg && <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">{msg}</div>}

      {user && !reg && (
        <button onClick={register} className="px-4 py-2 bg-blue-600 text-white rounded">ลงทะเบียน</button>
      )}

      {user && reg && reg.status === "REGISTERED" && (
        <div className="bg-white p-4 rounded border space-y-3">
          <h3 className="font-semibold">เช็กอิน</h3>
          {activity.verificationMethod === "DIRECT" && (
            <button onClick={() => checkIn("DIRECT")} className="px-4 py-2 bg-green-600 text-white rounded">ยืนยันเข้าร่วม</button>
          )}
          {activity.verificationMethod === "QR_PASSCODE" && (
            <div className="space-y-2">
              <input value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="กรอกรหัส Passcode" className="border px-3 py-2 rounded w-full" />
              <button onClick={() => checkIn("QR_PASSCODE")} className="px-4 py-2 bg-green-600 text-white rounded">ยืนยัน</button>
            </div>
          )}
          {activity.verificationMethod === "GEO_FENCE" && (
            <button onClick={() => checkIn("GEO_FENCE")} className="px-4 py-2 bg-green-600 text-white rounded">เช็กอินด้วยตำแหน่ง (จำลอง)</button>
          )}
        </div>
      )}

      {user && reg && reg.status === "COMPLETED" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700">เข้าร่วมกิจกรรมสำเร็จแล้ว</div>
      )}

      {["SUPER_ADMIN", "DEPARTMENT_ADMIN", "STAFF"].includes(user?.role) && (
        <div className="bg-white p-4 rounded border space-y-2">
          <h3 className="font-semibold">Staff Zone</h3>
          <button onClick={createPasscode} className="px-3 py-1 bg-purple-600 text-white rounded text-sm">สร้าง Passcode 30 นาที</button>
          {passcodes.length > 0 && (
            <div className="text-sm">
              <div className="font-medium">รหัสที่ใช้งาน:</div>
              {passcodes.map((p) => (
                <div key={p.id} className="flex gap-2 items-center">
                  <span className="font-mono text-lg">{p.code}</span>
                  <span className="text-xs text-gray-500">หมดอายุ {new Date(p.expiresAt).toLocaleString("th-TH")}</span>
                </div>
              ))}
            </div>
          )}
          <div className="text-sm">
            <div className="font-medium">ผู้เช็กอิน ({attendance.length}):</div>
            {attendance.map((a) => (
              <div key={a.id} className="text-xs">{a.user?.displayName} · {a.verificationMethod} · {new Date(a.verifiedAt).toLocaleString("th-TH")}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
