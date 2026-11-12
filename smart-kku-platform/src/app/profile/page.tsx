"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import FileUpload from "@/components/FileUpload";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) setAvatarUrl(user.avatarUrl || null);
  }, [user]);

  const save = async () => {
    if (!user) return;
    try {
      await api("/api/users", { method: "PATCH", body: JSON.stringify({ id: user.id, avatarUrl }) });
      await refresh();
      setMsg("บันทึกรูปโปรไฟล์แล้ว");
    } catch (e: any) { setMsg(e.message); }
  };

  if (!user) return <div>กรุณาเข้าสู่ระบบ</div>;

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">โปรไฟล์</h1>
      <div className="bg-white p-5 rounded border space-y-3">
        <div className="flex items-center gap-3">
          {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover border" /> : <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl">👤</div>}
          <div>
            <div className="font-semibold">{user.displayName}</div>
            <div className="text-xs text-gray-500">{user.email} · {user.role}</div>
            <div className="text-xs text-gray-500">{user.orgName} · {user.personnelType}</div>
          </div>
        </div>
        <FileUpload label="อัพโหลดรูปโปรไฟล์" onUploaded={setAvatarUrl} accept="image/*" />
        <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">บันทึก</button>
        {msg && <div className="text-sm text-green-700">{msg}</div>}
      </div>
    </div>
  );
}
