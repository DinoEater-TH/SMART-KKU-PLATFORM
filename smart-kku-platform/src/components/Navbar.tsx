"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, users, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  const links = [
    { href: "/", label: "หน้าหลัก", icon: "🏠" },
    { href: "/activities", label: "กิจกรรม", icon: "📅" },
    { href: "/healthy-life", label: "สุขภาพ", icon: "💪" },
    { href: "/wallet", label: "กระเป๋า", icon: "💰" },
    { href: "/marketplace", label: "รางวัล", icon: "🎁" },
  ];

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const r = await fetch("/api/notifications", { headers: { "x-user-id": user.id } });
        if (r.ok) {
          const data = await r.json();
          setNotifCount(data.filter((n: any) => !n.isRead).length);
        }
      } catch {}
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [user]);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-bold text-lg text-slate-800 hidden sm:block">Smart KKU</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[...links, { href: "/community", label: "ชุมชน", icon: "👥" }, { href: "/certificates", label: "ใบประกาศ", icon: "📜" }].map((l) => (
              <Link key={l.href} href={l.href} className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition">
                {l.label}
              </Link>
            ))}
            {user && ["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role) && (
              <Link href="/admin" className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition">ผู้ดูแล</Link>
            )}
            {user && user.role === "MERCHANT" && (
              <Link href="/merchant" className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition">Merchant</Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user && (
              <Link href="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition">
                <span className="text-lg">🔔</span>
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-slate-100 transition">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm text-slate-700 hidden sm:block">{user.displayName}</span>
                </Link>
                <button onClick={logout} className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition">ออก</button>
              </div>
            ) : (
              <button onClick={() => setOpen(true)} className="text-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition btn-press">
                เข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-30 flex justify-around py-1.5 safe-bottom">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="flex flex-col items-center gap-0.5 px-2 py-1 text-slate-500 hover:text-blue-600 transition min-w-[56px]">
            <span className="text-xl">{l.icon}</span>
            <span className="text-[10px] font-medium">{l.label}</span>
          </Link>
        ))}
        <Link href="/community" className="flex flex-col items-center gap-0.5 px-2 py-1 text-slate-500 hover:text-blue-600 transition min-w-[56px]">
          <span className="text-xl">👥</span>
          <span className="text-[10px] font-medium">ชุมชน</span>
        </Link>
      </nav>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-1">เข้าสู่ระบบ</h2>
            <p className="text-sm text-slate-500 mb-4">เลือกผู้ใช้ (Mock SSO)</p>
            <div className="space-y-2 max-h-80 overflow-auto">
              {users.map((u) => (
                <button key={u.id} onClick={() => { login(u.id); setOpen(false); }} className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition">
                  <div className="font-medium text-slate-800">{u.displayName}</div>
                  <div className="text-xs text-slate-500">{u.email} · {u.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
