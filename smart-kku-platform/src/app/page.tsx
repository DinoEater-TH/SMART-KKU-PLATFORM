// src/app/page.tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8">
        <h1 className="text-3xl font-bold">Smart KKU Platform</h1>
        <p className="mt-2 opacity-90">แพลตฟอร์มกลางบุคลากร มข. · One Platform · Multiple Organizations · Multiple Projects</p>
        {!user && <p className="mt-4 text-sm">กรุณาเข้าสู่ระบบ (ปุ่มมุมขวาบน) เพื่อเริ่มใช้งาน</p>}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/activities", title: "กิจกรรม", desc: "ลงทะเบียนและเช็กอินกิจกรรม" },
          { href: "/healthy-life", title: "KKU Healthy Life", desc: "ส่งผลออกกำลังกาย สะสม POWER" },
          { href: "/wallet", title: "กระเป๋าคะแนน", desc: "POINT / POWER / EXP / Qualification" },
          { href: "/marketplace", title: "ตลาดรางวัล", desc: "แลกรางวัลด้วยคะแนน" },
          { href: "/community", title: "ชุมชน", desc: "กลุ่มและ Mini-Challenge" },
          { href: "/certificates", title: "ใบประกาศ", desc: "ดูและดาวน์โหลดใบประกาศ" },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="bg-white p-5 rounded-lg border hover:shadow transition">
            <h3 className="font-semibold text-blue-700">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
