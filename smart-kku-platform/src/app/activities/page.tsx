// src/app/activities/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [regs, setRegs] = useState<any[]>([]);

  const load = async () => {
    const a = await api("/api/activities");
    setActivities(a);
    if (user) {
      const r = await api("/api/registrations");
      setRegs(r);
    }
  };
  useEffect(() => { load(); }, [user]);

  const register = async (id: string) => {
    try {
      await api("/api/registrations", { method: "POST", body: JSON.stringify({ activityId: id }) });
      await load();
      alert("ลงทะเบียนสำเร็จ");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const isRegistered = (aid: string) => regs.some((r) => r.activityId === aid && r.status === "REGISTERED");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">กิจกรรม</h1>
      <div className="grid gap-4">
        {activities.map((a) => (
          <div key={a.id} className="bg-white p-5 rounded-lg border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{a.name}</h3>
                <p className="text-sm text-gray-600">{a.description}</p>
                <div className="text-xs text-gray-500 mt-2 space-x-3">
                  <span>หน่วยงาน: {a.orgName}</span>
                  <span>โครงการ: {a.projectName}</span>
                  <span>ประเภท: {a.activityType}</span>
                  <span>วิธีเช็กอิน: {a.verificationMethod}</span>
                  <span>รับ: {a.capacity === 0 ? "ไม่จำกัด" : a.capacity + " คน"}</span>
                </div>
                <div className="text-xs mt-1 space-x-3">
                  {a.pointReward > 0 && <span className="text-yellow-700">POINT +{a.pointReward}</span>}
                  {a.expReward > 0 && <span className="text-purple-700">EXP +{a.expReward}</span>}
                  {a.qualificationReward && <span className="text-green-700">Qualification: {a.qualificationReward}</span>}
                  {a.hasCertificate && <span className="text-blue-700">Certificate</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/activities/${a.id}`} className="text-sm px-3 py-1 border rounded text-center">รายละเอียด</Link>
                {user && !isRegistered(a.id) && (
                  <button onClick={() => register(a.id)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">ลงทะเบียน</button>
                )}
                {isRegistered(a.id) && <span className="text-sm text-green-600">ลงทะเบียนแล้ว</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
