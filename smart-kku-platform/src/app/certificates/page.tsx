"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import html2canvas from "html2canvas";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    api("/api/certificates").then(setCerts);
  }, [user]);

  const download = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = `certificate-${selected?.certificateNo || "cert"}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  if (!user) return <div>กรุณาเข้าสู่ระบบ</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ใบประกาศ / เกียรติบัตร</h1>
      {certs.length === 0 && <div className="text-gray-500">ยังไม่มีใบประกาศ</div>}
      <div className="grid gap-3">
        {certs.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded border space-y-1">
            <div className="font-semibold">{c.activityName}</div>
            <div className="text-sm text-gray-600">เลขที่: {c.certificateNo} · หน่วยงาน: {c.orgName}</div>
            <div className="text-xs text-gray-500">ออกเมื่อ {new Date(c.issuedAt).toLocaleString()} · สถานะ {c.status}</div>
            <button onClick={() => setSelected(c)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded mt-2">ดู/ดาวน์โหลด</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div ref={certRef} className="border-4 border-blue-700 p-8 text-center space-y-3 bg-white">
              <div className="text-2xl font-bold text-blue-700">ใบประกาศนียบัตร</div>
              <div className="text-sm text-gray-500">Certificate of Achievement</div>
              <div className="my-4 text-lg">มอบให้แก่</div>
              <div className="text-2xl font-bold">{selected.userName}</div>
              <div className="text-sm text-gray-600">เพื่อรับรองการเข้าร่วม</div>
              <div className="text-xl font-semibold">{selected.activityName}</div>
              <div className="text-sm text-gray-500">{selected.orgName}</div>
              <div className="text-xs text-gray-400 mt-4">เลขที่: {selected.certificateNo} · ออกเมื่อ {new Date(selected.issuedAt).toLocaleDateString()}</div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={download} className="px-4 py-2 bg-green-600 text-white rounded">ดาวน์โหลด JPEG</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-gray-200 rounded">ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
