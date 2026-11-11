// src/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, users, login, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "หน้าหลัก" },
    { href: "/activities", label: "กิจกรรม" },
    { href: "/healthy-life", label: "Healthy Life" },
    { href: "/wallet", label: "กระเป๋า" },
    { href: "/marketplace", label: "ตลาดรางวัล" },
    { href: "/community", label: "ชุมชน" },
    { href: "/certificates", label: "ใบประกาศ" },
  ];
  if (user && ["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) {
    links.push({ href: "/admin", label: "ผู้ดูแล" });
  }
  if (user && user.role === "MERCHANT") {
    links.push({ href: "/merchant", label: "Merchant" });
  }

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-blue-700">Smart KKU Platform</Link>
        <nav className="hidden md:flex gap-4 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-blue-600">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm hidden sm:block">{user.displayName} · {user.role}</span>
              <button onClick={logout} className="text-sm px-3 py-1 border rounded">ออก</button>
            </>
          ) : (
            <button onClick={() => setOpen(true)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">เข้าสู่ระบบ</button>
          )}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
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
    </header>
  );
}
