// src/app/healthy-life/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { WORKOUT_STATUS_LABEL, label } from "@/lib/labels";

export default function HealthyLifePage() {
  const { user, refresh } = useAuth();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [sportTypes, setSportTypes] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState({
    sportTypeCode: "RUNNING",
    calories: 300,
    durationSec: 1800,
    distanceKm: 0,
    source: "MANUAL",
    specialEventMultiplier: 1,
    durationMultiplierPercent: 100,
  });
  const [msg, setMsg] = useState("");
  const [convertAmt, setConvertAmt] = useState(0);
  const [convertMsg, setConvertMsg] = useState("");

  const load = async () => {
    const st = await api("/api/sport-types");
    setSportTypes(st);
    const s = await api("/api/seasons");
    setSeasons(s);
    if (user) {
      const w = await api("/api/workouts");
      setWorkouts(w);
    }
    const u = await api("/api/users");
    setUsers(u);
    // leaderboard by power
    const lb = [...u].sort((a, b) => (b.power || 0) - (a.power || 0)).slice(0, 10);
    setLeaderboard(lb);
  };
  useEffect(() => { load(); }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sport = sportTypes.find((s) => s.code === form.sportTypeCode);
      const res = await api("/api/workouts", {
        method: "POST",
        body: JSON.stringify({
          sportTypeCode: form.sportTypeCode,
          sportTypeId: sport?.id,
          calories: Number(form.calories),
          durationSec: Number(form.durationSec),
          distanceKm: Number(form.distanceKm),
          source: form.source,
          specialEventMultiplier: Number(form.specialEventMultiplier),
          durationMultiplierPercent: Number(form.durationMultiplierPercent),
        }),
      });
      setMsg(`ส่งผลสำเร็จ · POWER ที่ได้: ${res.score} (factor ${res.sportFactorUsed})${res.validationReason ? " · " + res.validationReason : ""}`);
      await load();
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  const convert = async () => {
    try {
      const r = await api("/api/wallet/convert", { method: "POST", body: JSON.stringify({ power: convertAmt }) });
      setConvertMsg(`แปลงสำเร็จ: ใช้ POWER ${r.powerUsed} → ได้ EXP ${r.expGained} (rate ${r.rate}:1) · POWER เหลือ ${r.remainingPower}`);
      await load();
      await refresh();
    } catch (e: any) { setConvertMsg(e.message); }
  };

  const totalCalories = workouts.reduce((s, w) => s + w.calories, 0);
  const totalDuration = workouts.reduce((s, w) => s + w.durationSec, 0);
  const totalDistance = workouts.reduce((s, w) => s + (w.distanceKm || 0), 0);
  const totalPower = workouts.reduce((s, w) => s + (w.score || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">KKU Healthy Life</h1>

      {user && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">Calories รวม</div><div className="text-xl font-bold">{totalCalories}</div></div>
          <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">ระยะเวลา (นาที)</div><div className="text-xl font-bold">{Math.round(totalDuration / 60)}</div></div>
          <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">ระยะทาง (km)</div><div className="text-xl font-bold">{totalDistance.toFixed(1)}</div></div>
          <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">POWER รวม</div><div className="text-xl font-bold text-green-700">{totalPower.toFixed(2)}</div></div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded border space-y-3">
          <h2 className="font-semibold">ส่งผลการออกกำลังกาย</h2>
          {!user && <p className="text-sm text-gray-500">กรุณาเข้าสู่ระบบ</p>}
          {user && (
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="text-sm">ประเภทกีฬา</label>
                <select value={form.sportTypeCode} onChange={(e) => setForm({ ...form, sportTypeCode: e.target.value })} className="border px-3 py-2 rounded w-full">
                  {sportTypes.map((s) => <option key={s.code} value={s.code}>{s.name} (factor {s.factor})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Calories</label>
                  <input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: +e.target.value })} className="border px-3 py-2 rounded w-full" />
                </div>
                <div>
                  <label className="text-sm">ระยะเวลา (วินาที)</label>
                  <input type="number" value={form.durationSec} onChange={(e) => setForm({ ...form, durationSec: +e.target.value })} className="border px-3 py-2 rounded w-full" />
                </div>
              </div>
              <div>
                <label className="text-sm">แหล่งที่มา (กดเพื่อ sync)</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {[
                    { value: "MANUAL", label: "กรอกเอง", icon: "✏️", note: "" },
                    { value: "GOOGLE_FIT", label: "Google Fit", icon: "📱", note: "เชื่อมต่อ Google Fit API" },
                    { value: "APPLE_HEALTH", label: "Apple Health", icon: "🍎", note: "เชื่อมต่อ Apple Health API" },
                    { value: "STRAVA", label: "Strava", icon: "🏃", note: "" },
                    { value: "GARMIN", label: "Garmin", icon: "⌚", note: "" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setForm({ ...form, source: s.value })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition ${form.source === s.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:bg-slate-50"}`}
                    >
                      <span className="text-lg">{s.icon}</span>
                      <span>{s.label}</span>
                      {s.note && <span className="text-[9px] text-slate-400">{s.note}</span>}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">ส่งผล</button>
            </form>
          )}
          {msg && <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">{msg}</div>}
          <div className="text-xs text-gray-500">
            สูตร: Points = (Calories / Duration(sec)) × Sport Factor × Special Event × Duration Multiplier(%) × 100
          </div>
        </div>

        <div className="bg-white p-5 rounded border space-y-3">
          <h2 className="font-semibold">Leaderboard (POWER)</h2>
          <div className="space-y-1">
            {leaderboard.map((u, i) => (
              <div key={u.id} className="flex justify-between text-sm border-b py-1">
                <span>{i + 1}. {u.displayName}</span>
                <span className="font-mono">{(u.power || 0).toFixed(2)} POWER</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {user && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
          <h2 className="font-bold text-slate-800">แปลง POWER เป็น EXP</h2>
          <p className="text-xs text-slate-500">อัตรา: 10 POWER = 1 EXP · EXP ต้องเป็นจำนวนเต็ม · POWER เศษคงเหลือ</p>
          <div className="flex gap-2">
            <input type="number" value={convertAmt} onChange={(e) => setConvertAmt(+e.target.value)} className="flex-1 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="จำนวน POWER" />
            <button onClick={convert} className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition btn-press">
              แปลง
            </button>
          </div>
          {convertMsg && <div className="text-sm p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700">{convertMsg}</div>}
        </div>
      )}

      {user && (
        <div className="bg-white p-5 rounded border space-y-3">
          <h2 className="font-semibold">ประวัติการออกกำลังกาย</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th>วันที่</th><th>กีฬา</th><th>Calories</th><th>ระยะเวลา</th><th>ระยะทาง</th><th>Pace</th><th>Factor</th><th>POWER</th><th>สถานะ</th></tr></thead>
              <tbody>
                {workouts.map((w) => (
                  <tr key={w.id} className="border-b">
                    <td>{new Date(w.performedAt).toLocaleDateString("th-TH")}</td>
                    <td>{w.sportType}</td>
                    <td>{w.calories}</td>
                    <td>{Math.round(w.durationSec / 60)} นาที</td>
                    <td>{w.distanceKm}</td>
                    <td>{w.paceMinPerKm ? w.paceMinPerKm.toFixed(2) : "-"}</td>
                    <td>{w.sportFactorUsed}</td>
                    <td className="text-green-700 font-mono">{w.score}</td>
                    <td>{label(WORKOUT_STATUS_LABEL, w.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white p-5 rounded border space-y-2">
        <h2 className="font-semibold">Seasons</h2>
        {seasons.map((s) => (
          <div key={s.id} className="text-sm border-b py-2">
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-gray-500">{s.description} · {s.startDate} - {s.endDate} · {s.isActive ? "เปิดใช้งาน" : "ปิด"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
