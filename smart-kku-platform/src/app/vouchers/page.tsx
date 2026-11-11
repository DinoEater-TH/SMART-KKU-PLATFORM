// src/app/vouchers/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function VouchersPage() {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    api("/api/vouchers").then(setVouchers);
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Vouchers ของฉัน</h1>
      {vouchers.length === 0 && <div className="text-gray-500">ยังไม่มี Voucher</div>}
      <div className="grid gap-3">
        {vouchers.map((v) => (
          <Link key={v.id} href={`/vouchers/${v.id}`} className="bg-white p-4 rounded border flex justify-between items-center">
            <div>
              <div className="font-mono text-sm">{v.token.slice(0, 12)}...</div>
              <div className="text-xs text-gray-500">หมดอายุ {new Date(v.expiresAt).toLocaleString("th-TH")} · {v.status}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${v.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{v.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
