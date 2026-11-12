"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;
    const data = await api("/api/notifications");
    setList(data);
  };
  useEffect(() => { load(); }, [user]);

  const markRead = async (id: string) => {
    await api("/api/notifications", { method: "POST", body: JSON.stringify({ action: "read", id }) });
    await load();
  };
  const markAll = async () => {
    await api("/api/notifications", { method: "POST", body: JSON.stringify({ action: "readAll" }) });
    await load();
  };

  if (!user) return <div>กรุณาเข้าสู่ระบบ</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">การแจ้งเตือน</h1>
        <button onClick={markAll} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">อ่านทั้งหมด</button>
      </div>
      {list.length === 0 && <div className="text-gray-500">ไม่มีการแจ้งเตือน</div>}
      <div className="space-y-2">
        {list.map((n) => (
          <div key={n.id} className={`bg-white p-4 rounded border ${n.isRead ? "opacity-60" : "border-blue-300"}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-gray-600">{n.body}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()} · {n.type}</div>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n.id)} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">อ่าน</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
