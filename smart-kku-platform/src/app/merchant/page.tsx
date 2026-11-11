// src/app/merchant/page.tsx
"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function MerchantPage() {
  const { user } = useAuth();
  const [token, setToken] = useState("");
  const [info, setInfo] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const lookup = async () => {
    try {
      const d = await api(`/api/vouchers?token=${token}`);
      setInfo(d);
      setMsg("");
    } catch (e: any) { setMsg(e.message); setInfo(null); }
  };

  const useVoucher = async () => {
    try {
      const r = await api("/api/vouchers", { method: "POST", body: JSON.stringify({ token }) });
      setMsg("ใช้ Voucher สำเร็จ");
      setInfo(null);
      setToken("");
    } catch (e: any) { setMsg(e.message); }
  };

  if (!user || user.role !== "MERCHANT") return <div>สำหรับ Merchant เท่านั้น</div>;

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Merchant Interface</h1>
      <div className="bg-white p-5 rounded border space-y-3">
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="วาง Token Voucher" className="border px-3 py-2 rounded w-full" />
        <div className="flex gap-2">
          <button onClick={lookup} className="px-4 py-2 bg-blue-600 text-white rounded">ตรวจสอบ</button>
          <button onClick={useVoucher} className="px-4 py-2 bg-green-600 text-white rounded">ยืนยันใช้สิทธิ์</button>
        </div>
        {msg && <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">{msg}</div>}
        {info && (
          <div className="text-sm space-y-1">
            <div>รางวัล: {info.reward?.name}</div>
            <div>ผู้แลก: {info.ownerName}</div>
            <div>สถานะ: {info.voucher?.status}</div>
            <div>หมดอายุ: {new Date(info.voucher?.expiresAt).toLocaleString("th-TH")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
