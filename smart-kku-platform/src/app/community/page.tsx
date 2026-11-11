// src/app/community/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function CommunityPage() {
  const { user, refresh } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [postText, setPostText] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  const load = async () => {
    const c = await api("/api/communities");
    setCommunities(c);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await api("/api/communities", { method: "POST", body: JSON.stringify({ name: newName, description: newDesc }) });
      setNewName(""); setNewDesc("");
      await load(); await refresh();
      setMsg("สร้างกลุ่มสำเร็จ");
    } catch (e: any) { setMsg(e.message); }
  };

  const join = async (id: string) => {
    try { await api(`/api/communities/${id}/join`, { method: "POST" }); await load(); await refresh(); setMsg("เข้าร่วมสำเร็จ"); }
    catch (e: any) { setMsg(e.message); }
  };
  const leave = async (id: string) => {
    try { await api(`/api/communities/${id}/leave`, { method: "POST" }); await load(); await refresh(); setMsg("ออกจากกลุ่มสำเร็จ"); }
    catch (e: any) { setMsg(e.message); }
  };
  const post = async (id: string) => {
    try { await api(`/api/communities/${id}/posts`, { method: "POST", body: JSON.stringify({ content: postText[id] }) }); setPostText({ ...postText, [id]: "" }); await load(); }
    catch (e: any) { setMsg(e.message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ชุมชน / Clubs</h1>
      {msg && <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">{msg}</div>}

      {user && (
        <div className="bg-white p-5 rounded border space-y-2">
          <h2 className="font-semibold">สร้างกลุ่มใหม่ (ต้องมี 10,000 EXP)</h2>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="ชื่อกลุ่ม" className="border px-3 py-2 rounded w-full" />
          <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="คำอธิบาย" className="border px-3 py-2 rounded w-full" />
          <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">สร้างกลุ่ม</button>
        </div>
      )}

      <div className="grid gap-4">
        {communities.map((c) => {
          const isMember = c.members?.some((m: any) => m.userId === user?.id && m.status === "ACTIVE");
          return (
            <div key={c.id} className="bg-white p-5 rounded border space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{c.name}</h3>
                  <p className="text-sm text-gray-600">{c.description}</p>
                  <div className="text-xs text-gray-500 mt-1">เจ้าของ: {c.ownerName} · สมาชิก: {c.memberCount} · Group Power: {c.groupPower}</div>
                </div>
                {user && (
                  <div>
                    {!isMember && <button onClick={() => join(c.id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">เข้าร่วม</button>}
                    {isMember && <button onClick={() => leave(c.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">ออกจากกลุ่ม</button>}
                  </div>
                )}
              </div>
              <div className="border-t pt-2 space-y-1">
                <div className="text-xs font-medium">โพสต์ล่าสุด</div>
                {c.posts?.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="text-sm border-b py-1">
                    <span className="font-medium">{p.userName}:</span> {p.content}
                    <span className="text-xs text-gray-400 ml-2">{new Date(p.createdAt).toLocaleString("th-TH")}</span>
                  </div>
                ))}
                {user && isMember && (
                  <div className="flex gap-2 mt-2">
                    <input value={postText[c.id] || ""} onChange={(e) => setPostText({ ...postText, [c.id]: e.target.value })} placeholder="เขียนโพสต์..." className="border px-3 py-1 rounded flex-1 text-sm" />
                    <button onClick={() => post(c.id)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">โพสต์</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
