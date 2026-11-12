"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Record<string, any>>({});

  const load = async () => {
    try {
      const qs = await api("/api/quizzes");
      setQuizzes(qs);
    } catch {}
  };
  useEffect(() => { load(); }, [user]);

  const answer = async (quizId: string) => {
    try {
      const r = await api(`/api/quizzes/${quizId}/answer`, {
        method: "POST",
        body: JSON.stringify({ selectedIndex: answers[quizId] }),
      });
      setResult((prev) => ({ ...prev, [quizId]: r }));
    } catch (e: any) {
      setResult((prev) => ({ ...prev, [quizId]: { error: e.message } }));
    }
  };

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
          { href: "/wallet", title: "กระเป๋าคะแนน", desc: "POINT / POWER / EXP / Level" },
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

      {quizzes.length > 0 && (
        <div className="bg-white p-6 rounded-lg border space-y-4">
          <h2 className="text-xl font-bold">คำถามและแบบทดสอบ</h2>
          {quizzes.map((q) => {
            const r = result[q.id];
            return (
              <div key={q.id} className="border rounded p-4 space-y-2">
                <div className="font-semibold">{q.title}</div>
                <div className="text-sm text-gray-700">{q.question}</div>
                <div className="space-y-1">
                  {q.choices.map((c: string, i: number) => (
                    <label key={i} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === i}
                        onChange={() => setAnswers({ ...answers, [q.id]: i })}
                      />
                      {c}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => answer(q.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    disabled={answers[q.id] === undefined}
                  >
                    ส่งคำตอบ
                  </button>
                  <span className="text-xs text-gray-500">
                    รางวัล: +{q.pointReward} POINT · +{q.expReward} EXP · โหมด: {q.mode}
                  </span>
                </div>
                {r && (
                  <div className={`text-sm p-2 rounded ${r.error ? "bg-red-50 text-red-700" : r.isCorrect ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
                    {r.error ? r.error : r.isCorrect ? `ถูกต้อง! ${r.awarded ? "ได้รับรางวัลแล้ว" : ""}` : "ไม่ถูกต้อง"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
