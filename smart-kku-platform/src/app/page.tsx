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
    try { setQuizzes(await api("/api/quizzes")); } catch {}
  };
  useEffect(() => { load(); }, [user]);

  const answer = async (quizId: string) => {
    try {
      const r = await api(`/api/quizzes/${quizId}/answer`, { method: "POST", body: JSON.stringify({ selectedIndex: answers[quizId] }) });
      setResult((prev) => ({ ...prev, [quizId]: r }));
    } catch (e: any) {
      setResult((prev) => ({ ...prev, [quizId]: { error: e.message } }));
    }
  };

  const cards = [
    { href: "/activities", title: "กิจกรรม", desc: "ลงทะเบียนและเช็กอิน", icon: "📅", gradient: "from-blue-500 to-cyan-500" },
    { href: "/healthy-life", title: "KKU Healthy Life", desc: "ออกกำลังกาย สะสม POWER", icon: "💪", gradient: "from-emerald-500 to-teal-500" },
    { href: "/wallet", title: "กระเป๋าคะแนน", desc: "POINT / POWER / EXP", icon: "💰", gradient: "from-amber-500 to-orange-500" },
    { href: "/marketplace", title: "ตลาดรางวัล", desc: "แลกรางวัลด้วยคะแนน", icon: "🎁", gradient: "from-pink-500 to-rose-500" },
    { href: "/community", title: "ชุมชน", desc: "กลุ่มและ Mini-Challenge", icon: "👥", gradient: "from-violet-500 to-purple-500" },
    { href: "/certificates", title: "ใบประกาศ", desc: "ดูและดาวน์โหลด", icon: "📜", gradient: "from-indigo-500 to-blue-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 text-white p-6 md:p-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <h1 className="text-2xl md:text-4xl font-bold">Smart KKU Platform</h1>
          <p className="mt-2 text-sm md:text-base opacity-90 max-w-xl">
            แพลตฟอร์มกลางบุคลากร มหาวิทยาลัยขอนแก่น — กิจกรรม, สุขภาพ, คะแนน, รางวัล, ชุมชน ในที่เดียว
          </p>
          {!user && (
            <p className="mt-4 text-sm bg-white/20 inline-block px-4 py-2 rounded-full">
              👋 กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน
            </p>
          )}
          {user && (
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {user.displayName?.charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{user.displayName}</div>
                <div className="text-xs opacity-80">{user.levelName} · {user.points}P · {user.power}PW · {user.exp}EXP</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-slate-100 card-hover">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-xl mb-2 shadow-sm`}>
              {c.icon}
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">{c.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
          </Link>
        ))}
      </div>

      {/* Quiz section */}
      {quizzes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <h2 className="text-lg font-bold text-slate-800">คำถามและแบบทดสอบ</h2>
          </div>
          {quizzes.map((q) => {
            const r = result[q.id];
            return (
              <div key={q.id} className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                <div className="font-semibold text-slate-800">{q.title}</div>
                <div className="text-sm text-slate-700">{q.question}</div>
                <div className="space-y-1.5">
                  {q.choices.map((c: string, i: number) => (
                    <label key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition ${answers[q.id] === i ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-white"}`}>
                      <input type="radio" name={q.id} checked={answers[q.id] === i} onChange={() => setAnswers({ ...answers, [q.id]: i })} className="accent-blue-600" />
                      <span className="text-sm">{c}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => answer(q.id)} disabled={answers[q.id] === undefined} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition disabled:opacity-50 btn-press">
                    ส่งคำตอบ
                  </button>
                  <span className="text-xs text-slate-500">+{q.pointReward} POINT · +{q.expReward} EXP</span>
                </div>
                {r && (
                  <div className={`text-sm p-3 rounded-lg ${r.error ? "bg-red-50 text-red-700 border border-red-200" : r.isCorrect ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                    {r.error ? r.error : r.isCorrect ? `✅ ถูกต้อง! ${r.awarded ? "ได้รับรางวัลแล้ว" : ""}` : "❌ ไม่ถูกต้อง"}
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
