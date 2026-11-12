// src/components/Navbar.tsx
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
    { href: "/healthy-life", label: "Healthy", icon: "💪" },
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
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [user]);

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-blue-700">Smart KKU</Link>
          <nav className="hidden md:flex gap-4 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-blue-600">{l.label}</Link>
            ))}
            <Link href="/community" className="hover:text-blue-600">ชุมชน</Link>
            <Link href="/certificates" className="hover:text-blue-600">ใบประกาศ</Link>
            {user && ["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role) && (
              <Link href="/admin" className="hover:text-blue-600">ผู้ดูแล</Link>
            )}
            {user && user.role === "MERCHANT" && (
              <Link href="/merchant" className="hover:text-blue-600">Merchant</Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {user && (
              <Link href="/notifications" className="relative text-xl">
                🔔
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">{notifCount}</span>
                )}
              </Link>
            )}
            {user ? (
              <>
                <Link href="/profile" className="text-sm hidden sm:block hover:text-blue-600">{user.displayName}</Link>
                <button onClick={logout} className="text-sm px-3 py-1 border rounded">ออก</button>
              </>
            ) : (
              <button onClick={() => setOpen(true)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">เข้าสู่ระบบ</button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-30 flex justify-around py-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="flex flex-col items-center text-xs text-gray-600">
            <span className="text-lg">{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
        <Link href="/community" className="flex flex-col items-center text-xs text-gray-600">
          <span className="text-lg">👥</span>
          <span>ชุมชน</span>
        </Link>
      </nav>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold mb-4">เลือกผู้ใช้ (Mock SSO)</h2>
            <div className="space-y-2 max-h-80 overflow-auto">
              {users.map((u) => (
                <button key={u.id} onClick={() => { login(u.id); setOpen(false); }} className="w-full text-left p-3 border rounded hover:bg-blue-50">
                  <div className="font-medium">{u.displayName}</div>
                  <div className="text-xs text-gray-500">{u.email} · {u.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
