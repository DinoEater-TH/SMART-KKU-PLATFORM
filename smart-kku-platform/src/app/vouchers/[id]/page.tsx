// src/app/vouchers/[id]/page.tsx
"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import QRCode from "react-qr-code";

export default function VoucherDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    api(`/api/vouchers?token=${id}`).catch(() => api(`/api/vouchers`)).then(() => {});
    // fetch by id via list? We'll fetch all and find
    api("/api/vouchers").then((list) => {
      const v = (list as any[]).find((x) => x.id === id);
      if (v) setData({ voucher: v });
    });
  }, [id]);

  // Actually fetch voucher details by token param not id; use direct lookup
  useEffect(() => {
    (async () => {
      const list = await api("/api/vouchers");
      const v = (list as any[]).find((x) => x.id === id);
      if (v) {
        // fetch reward info via verify endpoint? use token
        const detail = await api(`/api/vouchers?token=${v.token}`);
        setData(detail);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!data?.voucher) return;
    const tick = () => {
      const ms = new Date(data.voucher.expiresAt).getTime() - Date.now();
      setRemaining(Math.max(0, Math.floor(ms / 1000)));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [data]);

  if (!data) return <div>กำลังโหลด...</div>;
  const v = data.voucher;
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Dynamic QR Voucher</h1>
      <div className="bg-white p-6 rounded border text-center space-y-3">
        <QRCode value={v.token} size={200} />
        <div className="font-mono text-xs break-all">{v.token}</div>
        <div className="text-lg font-bold">เหลือเวลา: {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, "0")}</div>
        <div className="text-sm">สถานะ: {v.status}</div>
        {data.reward && <div className="text-sm text-gray-600">รางวัล: {data.reward.name}</div>}
        {data.ownerName && <div className="text-sm text-gray-600">ผู้แลก: {data.ownerName}</div>}
      </div>
      <div className="text-xs text-gray-500 text-center">QR อายุ 5 นาที · Backend ตรวจสอบทุกครั้ง</div>
    </div>
  );
}
