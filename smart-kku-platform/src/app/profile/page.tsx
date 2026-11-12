"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import FileUpload from "@/components/FileUpload";
import Link from "next/link";
import QRCode from "react-qr-code";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatarUrl || null);
      api("/api/wallet").then(setWallet).catch(() => {});
    }
  }, [user]);

  const save = async () => {
    if (!user) return;
    try {
      await api("/api/users", { method: "PATCH", body: JSON.stringify({ id: user.id, avatarUrl }) });
      await refresh();
      setMsg("บันทึกรูปโปรไฟล์แล้ว");
    } catch (e: any) { setMsg(e.message); }
  };

  if (!user) return <div className="text-center py-12 text-slate-500">กรุณาเข้าสู่ระบบ</div>;

  const u = wallet?.user || user;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">โปรไฟล์</h1>

      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-slate-200" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.displayName?.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-bold text-lg text-slate-800">{user.displayName}</div>
            <div className="text-sm text-slate-500">{user.email}</div>
            <div className="text-xs text-slate-400">{user.orgName} · {user.personnelType === "ACADEMIC" ? "สายวิชาการ" : "สายสนับสนุน"}</div>
            <div className="text-xs text-slate-400 mt-0.5">{user.levelName} · {user.role}</div>
          </div>
        </div>
        <FileUpload label="อัพโหลดรูปโปรไฟล์" onUploaded={setAvatarUrl} accept="image/*" />
        <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">บันทึก</button>
        {msg && <div className="text-sm text-green-700">{msg}</div>}
      </div>

      {/* Score cards */}
      {wallet && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-sm">
              <div className="text-xs opacity-80">POINT</div>
              <div className="text-3xl font-bold mt-1">{u.points}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-4 text-white shadow-sm">
              <div className="text-xs opacity-80">POWER</div>
              <div className="text-3xl font-bold mt-1">{typeof u.power === "number" ? u.power.toFixed(0) : u.power}</div>
            </div>
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 text-white shadow-sm">
              <div className="text-xs opacity-80">EXP</div>
              <div className="text-3xl font-bold mt-1">{u.exp}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-sm">
              <div className="text-xs opacity-80">LEVEL</div>
              <div className="text-2xl font-bold mt-1">{u.levelName}</div>
            </div>
          </div>

          {/* Personal QR */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-center space-y-3">
            <h2 className="font-bold text-slate-800">QR Code ของฉัน</h2>
            <p className="text-xs text-slate-500">ให้ Staff สแกนเพื่อเช็กอินกิจกรรม</p>
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200 inline-block">
                <QRCode value={u.id} size={160} />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono break-all">{u.id}</div>
          </div>

          {/* Transaction history */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
            <h2 className="font-bold text-slate-800">ประวัติธุรกรรม</h2>
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="py-2 pr-3 font-medium">วันที่</th>
                    <th className="py-2 pr-3 font-medium">ประเภท</th>
                    <th className="py-2 pr-3 font-medium">จำนวน</th>
                    <th className="py-2 pr-3 font-medium">ยอดหลัง</th>
                    <th className="py-2 font-medium">เหตุผล</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.transactions.map((t: any) => (
                    <tr key={t.id} className="border-b border-slate-50">
                      <td className="py-2 pr-3 text-xs text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 pr-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          t.type === "POINT" ? "bg-amber-100 text-amber-700" :
                          t.type === "POWER" ? "bg-emerald-100 text-emerald-700" :
                          "bg-violet-100 text-violet-700"
                        }`}>{t.type}</span>
                      </td>
                      <td className={`py-2 pr-3 font-medium ${t.amount >= 0 ? "text-emerald-600" : "text-red-500"}`}>{t.amount >= 0 ? "+" : ""}{typeof t.amount === "number" ? t.amount.toFixed(2) : t.amount}</td>
                      <td className="py-2 pr-3 text-slate-600">{typeof t.balanceAfter === "number" ? t.balanceAfter.toFixed(2) : t.balanceAfter}</td>
                      <td className="py-2 text-xs text-slate-500">{t.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
