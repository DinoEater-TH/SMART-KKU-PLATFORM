// src/app/certificates/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    api("/api/certificates").then(setCerts);
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ใบประกาศ / เกียรติบัตร</h1>
      {certs.length === 0 && <div className="text-gray-500">ยังไม่มีใบประกาศ</div>}
      <div className="grid gap-3">
        {certs.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded border space-y-1">
            <div className="font-semibold">{c.activityName}</div>
            <div className="text-sm text-gray-600">เลขที่: {c.certificateNo} · หน่วยงาน: {c.orgName}</div>
            <div className="text-xs text-gray-500">ออกเมื่อ {new Date(c.issuedAt).toLocaleString("th-TH")} · สถานะ {c.status} · Template {c.templateVersion}</div>
            <div className="text-xs font-mono text-gray-400">QR Verify: /api/certificates?id={c.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
