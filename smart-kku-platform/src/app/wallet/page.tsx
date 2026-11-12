"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function WalletPage() {
  const { user, refresh } = useAuth();
  const [data, setData] = useState<any>(null);
  const [convertAmt, setConvertAmt] = useState(0);
  const [msg, setMsg] = useState("");

  const load = async () => {
    if (!user) return;
    const d = await api("/api/wallet");
    setData(d);
  };
  useEffect(() => { load(); }, [user]);

  const convert = async () => {
    try {
      const r = await api("/api/wallet/convert", { method: "POST", body: JSON.stringify({ power: convertAmt }) });
      setMsg(`แปลงสำเร็จ ใช้ POWER ${r.powerUsed} ได้ EXP ${r.expGained} (rate ${r.rate}:1) · POWER เหลือ ${r.remainingPower}`);
      await load();
      await refresh();
    } catch (e: any) { setMsg(e.message); }
  };

  if (!user) return <div>กรุณาเข้าสู่ระบบ</div>;
  if (!data) return <div>กำลังโหลด...</div>;

  const u = data.user;
  const rate = data ? 10 : 10;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">กระเป๋าคะแนน</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">POINT</div><div className="text-2xl font-bold text-yellow-600">{u.points}</div></div>
        <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">POWER</div><div className="text-2xl font-bold text-green-600">{typeof u.power === "number" ? u.power.toFixed(2) : u.power}</div></div>
        <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">EXP</div><div className="text-2xl font-bold text-purple-600">{u.exp}</div></div>
        <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">Level</div><div className="text-2xl font-bold text-blue-600">{u.levelName}</div></div>
      </div>

      <div className="bg-white p-5 rounded border space-y-3">
        <h2 className="font-semibold">แปลง POWER เป็น EXP</h2>
        <div className="text-sm text-gray-500">อัตรา: {rate} POWER = 1 EXP (Super Admin กำหนด) · EXP ต้องเป็นจำนวนเต็ม · POWER เศษคงเหลือ</div>
        <div className="flex gap-2">
          <input type="number" value={convertAmt} onChange={(e) => setConvertAmt(+e.target.value)} className="border px-3 py-2 rounded" placeholder="จำนวน POWER" />
          <button onClick={convert} className="px-4 py-2 bg-purple-600 text-white rounded">แปลง</button>
        </div>
        {msg && <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">{msg}</div>}
      </div>

      <div className="bg-white p-5 rounded border space-y-2">
        <h2 className="font-semibold">Level</h2>
        <div className="text-sm">Level ปัจจุบัน: <b>{u.levelName}</b> · EXP {u.exp}</div>
      </div>

      <div className="bg-white p-5 rounded border space-y-2">
        <h2 className="font-semibold">ประวัติธุรกรรม</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th>วันที่</th><th>ประเภท</th><th>จำนวน</th><th>ยอดหลัง</th><th>เหตุผล</th></tr></thead>
            <tbody>
              {data.transactions.map((t: any) => (
                <tr key={t.id} className="border-b">
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td>{t.type}</td>
                  <td className={t.amount >= 0 ? "text-green-600" : "text-red-600"}>{t.amount >= 0 ? "+" : ""}{typeof t.amount === "number" ? t.amount.toFixed(2) : t.amount}</td>
                  <td>{typeof t.balanceAfter === "number" ? t.balanceAfter.toFixed(2) : t.balanceAfter}</td>
                  <td>{t.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
