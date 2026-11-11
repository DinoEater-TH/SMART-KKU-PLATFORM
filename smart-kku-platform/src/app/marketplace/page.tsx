// src/app/marketplace/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function MarketplacePage() {
  const { user, refresh } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const r = await api("/api/rewards");
    setRewards(r);
    if (user) {
      const rd = await api("/api/redemptions");
      setRedemptions(rd);
    }
  };
  useEffect(() => { load(); }, [user]);

  const redeem = async (id: string) => {
    try {
      const res = await api("/api/redemptions", { method: "POST", body: JSON.stringify({ rewardId: id }) });
      setMsg(`แลกสำเร็จ · Voucher token: ${res.voucher?.token}`);
      await load();
      await refresh();
    } catch (e: any) { setMsg(e.message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ตลาดรางวัล (Central Marketplace)</h1>
      {msg && <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">{msg}</div>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((r) => (
          <div key={r.id} className="bg-white p-5 rounded border space-y-2">
            <h3 className="font-semibold">{r.name}</h3>
            <p className="text-sm text-gray-600">{r.description}</p>
            <div className="text-xs text-gray-500">หน่วยงาน: {r.orgName}</div>
            <div className="text-sm space-x-2">
              {r.pointCost > 0 && <span className="text-yellow-700">POINT {r.pointCost}</span>}
              {r.powerCost > 0 && <span className="text-green-700">POWER {r.powerCost}</span>}
              {r.expCost > 0 && <span className="text-purple-700">EXP {r.expCost}</span>}
            </div>
            <div className="text-xs">คงเหลือ: {r.stock} · {r.status}</div>
            {r.eligibilityRules?.length > 0 && <div className="text-xs text-orange-600">เงื่อนไข: {r.eligibilityRules.join(", ")}</div>}
            {user && r.status === "ACTIVE" && r.stock > 0 && (
              <button onClick={() => redeem(r.id)} className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm">แลกรางวัล</button>
            )}
          </div>
        ))}
      </div>

      {user && redemptions.length > 0 && (
        <div className="bg-white p-5 rounded border space-y-2">
          <h2 className="font-semibold">ประวัติการแลก</h2>
          {redemptions.map((r) => (
            <div key={r.id} className="text-sm border-b py-2 flex justify-between">
              <span>{r.rewardName}</span>
              <span className="text-xs text-gray-500">{new Date(r.redeemedAt).toLocaleString("th-TH")} · {r.pointsSpent}P {r.powerSpent}PW</span>
              {r.voucherId && <Link href={`/vouchers/${r.voucherId}`} className="text-blue-600 text-xs">ดู Voucher</Link>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
