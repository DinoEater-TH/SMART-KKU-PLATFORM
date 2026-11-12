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
    } catch (e: any) { alert(e.message); }
  };

  const isRegistered = (aid: string) => regs.some((r) => r.activityId === aid && (r.status === "REGISTERED" || r.status === "COMPLETED"));

  const methodBadge = (m: string) => {
    if (m === "QR_PIN") return "bg-violet-100 text-violet-700";
    if (m === "DIRECT") return "bg-emerald-100 text-emerald-700";
    if (m === "GEO_FENCE") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">กิจกรรม</h1>
        <span className="text-sm text-slate-500">{activities.length} รายการ</span>
      </div>
      <div className="space-y-3">
        {activities.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden card-hover">
            <div className="p-4 md:p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-base md:text-lg">{a.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{a.description}</p>
                </div>
                {a.hasCertificate && (
                  <span className="shrink-0 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">📜 Cert</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${methodBadge(a.verificationMethod)}`}>{a.verificationMethod}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{a.activityType}</span>
                {a.allowInvite && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">เชิญได้</span>}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>📍 {a.orgName}</span>
                <span>👥 {a.capacity === 0 ? "ไม่จำกัด" : a.capacity}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                {a.pointReward > 0 && <span className="text-amber-600 font-medium">+{a.pointReward} POINT</span>}
                {a.expReward > 0 && <span className="text-violet-600 font-medium">+{a.expReward} EXP</span>}
                {a.staffMultiplier > 1 && <span className="text-slate-400 text-xs">Staff ×{a.staffMultiplier}</span>}
              </div>

              <div className="flex gap-2 pt-1">
                <Link href={`/activities/${a.id}`} className="flex-1 text-center text-sm px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-medium">
                  รายละเอียด
                </Link>
                {user && !isRegistered(a.id) && (
                  <button onClick={() => register(a.id)} className="flex-1 text-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition btn-press">
                    ลงทะเบียน
                  </button>
                )}
                {isRegistered(a.id) && (
                  <span className="flex-1 text-center text-sm px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-medium">✓ ลงทะเบียนแล้ว</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
