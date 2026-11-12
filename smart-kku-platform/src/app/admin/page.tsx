"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_LABEL, PERSONNEL_TYPE_LABEL, ACTIVITY_TYPE_LABEL, VERIFICATION_METHOD_LABEL, label } from "@/lib/labels";
import FileUpload from "@/components/FileUpload";

type Tab =
  | "projects" | "activities" | "staff" | "levels" | "quizzes"
  | "scoring" | "sports" | "settings" | "users" | "players"
  | "analytics" | "audit";

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("projects");
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) return <div>สำหรับผู้ดูแลเท่านั้น</div>;

  const tabs: { id: Tab; label: string }[] = [
    { id: "projects", label: "โครงการ" },
    { id: "activities", label: "กิจกรรม" },
    { id: "staff", label: "มอบหมาย Staff" },
    { id: "levels", label: "ระดับ Level" },
    { id: "quizzes", label: "แบบทดสอบ" },
    { id: "scoring", label: "กฎการให้คะแนน" },
    { id: "sports", label: "ประเภทกีฬา" },
    { id: "settings", label: "ตั้งค่าระบบ" },
    { id: "users", label: "ผู้ใช้" },
    { id: "players", label: "จัดการผู้เล่น" },
    { id: "analytics", label: "วิเคราะห์ข้อมูล" },
    { id: "audit", label: "ประวัติการใช้งาน" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ผู้ดูแลระบบ</h1>
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1 rounded text-sm ${tab === t.id ? "bg-blue-600 text-white" : "bg-white border"}`}>{t.label}</button>
        ))}
      </div>
      {tab === "projects" && <ProjectsTab />}
      {tab === "activities" && <ActivitiesTab />}
      {tab === "staff" && <StaffTab />}
      {tab === "levels" && <LevelsTab />}
      {tab === "quizzes" && <QuizzesTab />}
      {tab === "scoring" && <ScoringTab />}
      {tab === "sports" && <SportsTab />}
      {tab === "settings" && <SettingsTab />}
      {tab === "users" && <UsersTab />}
      {tab === "players" && <PlayersTab />}
      {tab === "analytics" && <AnalyticsTab />}
      {tab === "audit" && <AuditTab />}
    </div>
  );
}

function ProjectsTab() {
  const [projects, setProjects] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [form, setForm] = useState({ orgId: "", code: "", name: "", description: "", startDate: "", endDate: "" });
  useEffect(() => { api("/api/projects").then(setProjects); api("/api/organizations").then(setOrgs); }, []);
  const create = async () => {
    await api("/api/projects", { method: "POST", body: JSON.stringify(form) });
    setForm({ orgId: "", code: "", name: "", description: "", startDate: "", endDate: "" });
    api("/api/projects").then(setProjects);
  };
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold">สร้าง Project</h3>
        <select value={form.orgId} onChange={(e) => setForm({ ...form, orgId: e.target.value })} className="border px-3 py-2 rounded w-full">
          <option value="">เลือกหน่วยงาน</option>
          {orgs.map((o) => <option key={o.id} value={o.id}>{o.nameTh}</option>)}
        </select>
        <input placeholder="รหัสโครงการ (ไม่บังคับ)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <input placeholder="ชื่อโครงการ" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="border px-3 py-2 rounded" />
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">สร้าง</button>
      </div>
      <div className="bg-white p-4 rounded border">
        {projects.map((p) => (
          <div key={p.id} className="border-b py-2 text-sm">
            <div className="font-medium">{p.name} ({p.code})</div>
            <div className="text-xs text-gray-500">{p.orgName} · {p.startDate} - {p.endDate} · {p.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivitiesTab() {
  const [activities, setActivities] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ projectId: "", code: "", name: "", description: "", location: "", bannerUrl: "", activityType: "EVENT", capacity: 0, verificationMethod: "QR_PIN", pointReward: 0, expReward: 0, staffMultiplier: 1, pinCode: "1234", pinMode: "SHARED", allowInvite: false, hasCertificate: false });
  useEffect(() => { api("/api/activities").then(setActivities); api("/api/projects").then(setProjects); }, []);
  const create = async () => {
    await api("/api/activities", { method: "POST", body: JSON.stringify(form) });
    setForm({ projectId: "", code: "", name: "", description: "", location: "", bannerUrl: "", activityType: "EVENT", capacity: 0, verificationMethod: "QR_PIN", pointReward: 0, expReward: 0, staffMultiplier: 1, pinCode: "1234", pinMode: "SHARED", allowInvite: false, hasCertificate: false });
    api("/api/activities").then(setActivities);
  };
  const settleAll = async (activityId: string) => {
    const assigns = await api(`/api/staff-assignments?activityId=${activityId}`);
    for (const a of assigns.filter((x: any) => x.isActive && !x.settledAt)) {
      await api("/api/staff-assignments", { method: "PATCH", body: JSON.stringify({ id: a.id, action: "settle" }) });
    }
    alert("Settle staff pay done");
  };
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold">สร้าง Activity</h3>
        <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className="border px-3 py-2 rounded w-full">
          <option value="">เลือกโครงการ</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="รหัสกิจกรรม (ไม่บังคับ)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="border px-3 py-2 rounded" />
          <input placeholder="ชื่อกิจกรรม" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <input placeholder="สถานที่" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <FileUpload label="รูป Banner กิจกรรม" onUploaded={(url) => setForm({ ...form, bannerUrl: url })} accept="image/*" />
        <div className="grid grid-cols-3 gap-2">
          <select value={form.activityType} onChange={(e) => setForm({ ...form, activityType: e.target.value })} className="border px-3 py-2 rounded">
            <option value="EVENT">EVENT</option>
            <option value="TRAINING">TRAINING</option>
            <option value="HEALTHY_LIFE">HEALTHY_LIFE</option>
          </select>
          <select value={form.verificationMethod} onChange={(e) => setForm({ ...form, verificationMethod: e.target.value })} className="border px-3 py-2 rounded">
            <option value="QR_PIN">QR + PIN</option>
            <option value="DIRECT">DIRECT</option>
            <option value="GEO_FENCE">GEO_FENCE</option>
          </select>
          <input type="number" placeholder="Capacity (0=unlim)" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="POINT" value={form.pointReward} onChange={(e) => setForm({ ...form, pointReward: +e.target.value })} className="border px-3 py-2 rounded" />
          <input type="number" placeholder="EXP" value={form.expReward} onChange={(e) => setForm({ ...form, expReward: +e.target.value })} className="border px-3 py-2 rounded" />
          <input type="number" step="0.5" placeholder="Staff Multiplier" value={form.staffMultiplier} onChange={(e) => setForm({ ...form, staffMultiplier: +e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="PIN Code" value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value })} className="border px-3 py-2 rounded" />
          <select value={form.pinMode} onChange={(e) => setForm({ ...form, pinMode: e.target.value })} className="border px-3 py-2 rounded">
            <option value="SHARED">SHARED</option>
            <option value="PER_USER">PER_USER</option>
          </select>
        </div>
        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.hasCertificate} onChange={(e) => setForm({ ...form, hasCertificate: e.target.checked })} /> มี Certificate</label>
        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.allowInvite} onChange={(e) => setForm({ ...form, allowInvite: e.target.checked })} /> อนุญาตให้เชิญ</label>
        <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">สร้าง</button>
      </div>
      <div className="bg-white p-4 rounded border">
        {activities.map((a) => (
          <div key={a.id} className="border-b py-2 text-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{a.name} ({a.code})</div>
              <div className="text-xs text-gray-500">{a.projectName} · {label(VERIFICATION_METHOD_LABEL, a.verificationMethod)} · cap {a.capacity === 0 ? "∞" : a.capacity} · +{a.pointReward}P +{a.expReward}EXP · staff×{a.staffMultiplier}</div>
            </div>
            <button onClick={() => settleAll(a.id)} className="text-xs px-2 py-1 bg-purple-600 text-white rounded">Settle Staff</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffTab() {
  const [activities, setActivities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selAct, setSelAct] = useState("");
  const [selUser, setSelUser] = useState("");
  useEffect(() => { api("/api/activities").then(setActivities); api("/api/users").then(setUsers); }, []);
  const loadAssigns = async (aid: string) => { if (aid) setAssignments(await api(`/api/staff-assignments?activityId=${aid}`)); };
  useEffect(() => { loadAssigns(selAct); }, [selAct]);
  const assign = async () => {
    if (!selAct || !selUser) return;
    await api("/api/staff-assignments", { method: "POST", body: JSON.stringify({ activityId: selAct, userId: selUser }) });
    await loadAssigns(selAct);
  };
  const revoke = async (id: string) => {
    await api("/api/staff-assignments", { method: "PATCH", body: JSON.stringify({ id, action: "revoke" }) });
    await loadAssigns(selAct);
  };
  const settle = async (id: string) => {
    await api("/api/staff-assignments", { method: "PATCH", body: JSON.stringify({ id, action: "settle" }) });
    await loadAssigns(selAct);
  };
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold">มอบหมาย Staff ให้กิจกรรม</h3>
        <select value={selAct} onChange={(e) => setSelAct(e.target.value)} className="border px-3 py-2 rounded w-full">
          <option value="">เลือกกิจกรรม</option>
          {activities.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select value={selUser} onChange={(e) => setSelUser(e.target.value)} className="border px-3 py-2 rounded w-full">
          <option value="">เลือกผู้ใช้</option>
          {users.filter((u) => u.role !== "MERCHANT").map((u) => <option key={u.id} value={u.id}>{u.displayName} ({u.role})</option>)}
        </select>
        <button onClick={assign} className="px-4 py-2 bg-blue-600 text-white rounded">มอบหมาย</button>
      </div>
      <div className="bg-white p-4 rounded border">
        {assignments.map((a) => (
          <div key={a.id} className="border-b py-2 text-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{a.user?.displayName}</div>
              <div className="text-xs text-gray-500">
                {a.isActive ? "ACTIVE" : "REVOKED"} · assigned {new Date(a.assignedAt).toLocaleDateString()}
                {a.settledAt && ` · settled ${a.pointAwarded}P/${a.expAwarded}EXP`}
              </div>
            </div>
            <div className="flex gap-1">
              {a.isActive && !a.settledAt && <button onClick={() => settle(a.id)} className="text-xs px-2 py-1 bg-green-600 text-white rounded">Settle</button>}
              {a.isActive && <button onClick={() => revoke(a.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">Revoke</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LevelsTab() {
  const [levels, setLevels] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [form, setForm] = useState({ name: "", minExp: 0, maxExp: "", description: "", order: 0 });
  useEffect(() => { api("/api/levels").then(setLevels); }, []);
  const create = async () => {
    await api("/api/levels", { method: "POST", body: JSON.stringify(form) });
    setForm({ name: "", minExp: 0, maxExp: "", description: "", order: 0 });
    api("/api/levels").then(setLevels);
  };
  const update = async (id: string, patch: any) => {
    await api("/api/levels", { method: "PATCH", body: JSON.stringify({ id, ...patch }) });
    api("/api/levels").then(setLevels);
  };
  const del = async (id: string) => {
    await api(`/api/levels?id=${id}`, { method: "DELETE" });
    api("/api/levels").then(setLevels);
  };
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold">เพิ่ม Level</h3>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="Min EXP" value={form.minExp} onChange={(e) => setForm({ ...form, minExp: +e.target.value })} className="border px-3 py-2 rounded" />
          <input placeholder="Max EXP (blank=∞)" value={form.maxExp} onChange={(e) => setForm({ ...form, maxExp: e.target.value })} className="border px-3 py-2 rounded" />
          <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">เพิ่ม</button>
      </div>
      <div className="bg-white p-4 rounded border">
        {levels.map((l) => (
          editingId === l.id ? (
            <div key={l.id} className="border-b py-3 text-sm space-y-2">
              <input value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} className="border px-3 py-2 rounded w-full" placeholder="ชื่อ" />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={editValues.minExp} onChange={(e) => setEditValues({ ...editValues, minExp: +e.target.value })} className="border px-3 py-2 rounded" placeholder="Min EXP" />
                <input value={editValues.maxExp} onChange={(e) => setEditValues({ ...editValues, maxExp: e.target.value })} className="border px-3 py-2 rounded" placeholder="Max EXP" />
                <input type="number" value={editValues.order} onChange={(e) => setEditValues({ ...editValues, order: +e.target.value })} className="border px-3 py-2 rounded" placeholder="Order" />
              </div>
              <input value={editValues.description} onChange={(e) => setEditValues({ ...editValues, description: e.target.value })} className="border px-3 py-2 rounded w-full" placeholder="คำอธิบาย" />
              <div className="flex gap-2">
                <button onClick={async () => { await update(l.id, editValues); setEditingId(null); }} className="px-3 py-1 bg-green-600 text-white rounded text-xs">บันทึก</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-200 rounded text-xs">ยกเลิก</button>
              </div>
            </div>
          ) : (
          <div key={l.id} className="border-b py-2 text-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{l.name} (ลำดับ {l.order})</div>
              <div className="text-xs text-gray-500">EXP {l.minExp} - {l.maxExp ?? "∞"}</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => update(l.id, { minExp: l.minExp - 100 })} className="text-xs px-2 py-1 bg-gray-200 rounded">-100</button>
              <button onClick={() => update(l.id, { minExp: l.minExp + 100 })} className="text-xs px-2 py-1 bg-gray-200 rounded">+100</button>
              <button onClick={() => { setEditingId(l.id); setEditValues({ name: l.name, minExp: l.minExp, maxExp: l.maxExp ?? "", description: l.description || "", order: l.order }); }} className="text-xs px-2 py-1 bg-blue-600 text-white rounded">แก้ไข</button>
              <button onClick={() => del(l.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">ลบ</button>
            </div>
          </div>
          )
        ))}
      </div>
    </div>
  );
}

function QuizzesTab() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", question: "", choices: "", correctIndex: 0, pointReward: 0, expReward: 0, mode: "SINGLE_ATTEMPT" });
  useEffect(() => { api("/api/quizzes?active=0").then(setQuizzes); }, []);
  const create = async () => {
    await api("/api/quizzes", { method: "POST", body: JSON.stringify({ ...form, choices: form.choices.split("\n").map((s) => s.trim()).filter(Boolean) }) });
    setForm({ title: "", question: "", choices: "", correctIndex: 0, pointReward: 0, expReward: 0, mode: "SINGLE_ATTEMPT" });
    api("/api/quizzes?active=0").then(setQuizzes);
  };
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold">สร้าง Quiz</h3>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <input placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <textarea placeholder="Choices (one per line)" value={form.choices} onChange={(e) => setForm({ ...form, choices: e.target.value })} className="border px-3 py-2 rounded w-full" rows={4} />
        <div className="grid grid-cols-4 gap-2">
          <input type="number" placeholder="Correct index" value={form.correctIndex} onChange={(e) => setForm({ ...form, correctIndex: +e.target.value })} className="border px-3 py-2 rounded" />
          <input type="number" placeholder="POINT" value={form.pointReward} onChange={(e) => setForm({ ...form, pointReward: +e.target.value })} className="border px-3 py-2 rounded" />
          <input type="number" placeholder="EXP" value={form.expReward} onChange={(e) => setForm({ ...form, expReward: +e.target.value })} className="border px-3 py-2 rounded" />
          <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="border px-3 py-2 rounded">
            <option value="SINGLE_ATTEMPT">SINGLE_ATTEMPT</option>
            <option value="RETRY_UNTIL_CORRECT">RETRY_UNTIL_CORRECT</option>
          </select>
        </div>
        <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">สร้าง</button>
      </div>
      <div className="bg-white p-4 rounded border">
        {quizzes.map((q) => (
          <div key={q.id} className="border-b py-2 text-sm">
            <div className="font-medium">{q.title}</div>
            <div className="text-xs text-gray-500">{q.question} · +{q.pointReward}P +{q.expReward}EXP · {q.mode} · {q.isActive ? "active" : "inactive"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoringTab() {
  const [rules, setRules] = useState<any[]>([]);
  const [form, setForm] = useState({ version: "", specialEventMultiplier: 1.0, durationMultiplierPercent: 100 });
  useEffect(() => { api("/api/scoring-rules").then(setRules); }, []);
  const create = async () => {
    await api("/api/scoring-rules", { method: "POST", body: JSON.stringify(form) });
    setForm({ version: "", specialEventMultiplier: 1.0, durationMultiplierPercent: 100 });
    api("/api/scoring-rules").then(setRules);
  };
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold">สร้าง Scoring Rule</h3>
        <input placeholder="Version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" step="0.1" placeholder="Special Event Multiplier" value={form.specialEventMultiplier} onChange={(e) => setForm({ ...form, specialEventMultiplier: +e.target.value })} className="border px-3 py-2 rounded" />
          <input type="number" placeholder="Duration Multiplier (%)" value={form.durationMultiplierPercent} onChange={(e) => setForm({ ...form, durationMultiplierPercent: +e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">สร้าง</button>
      </div>
      <div className="bg-white p-4 rounded border">
        {rules.map((r) => (
          <div key={r.id} className="border-b py-2 text-sm">
            <div className="font-medium">{r.version} {r.isActive && <span className="text-green-600">(active)</span>}</div>
            <div className="text-xs text-gray-500">Special Event: {r.specialEventMultiplier} · Duration Mult: {r.durationMultiplierPercent}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SportsTab() {
  const [sports, setSports] = useState<any[]>([]);
  const [form, setForm] = useState({ code: "", name: "", factor: 1.0 });
  useEffect(() => { api("/api/sport-types").then(setSports); }, []);
  const create = async () => {
    await api("/api/sport-types", { method: "POST", body: JSON.stringify(form) });
    setForm({ code: "", name: "", factor: 1.0 });
    api("/api/sport-types").then(setSports);
  };
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold">เพิ่มประเภทกีฬา</h3>
        <div className="grid grid-cols-3 gap-2">
          <input placeholder="รหัสกีฬา (ไม่บังคับ)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="border px-3 py-2 rounded" />
          <input placeholder="ชื่อกีฬา" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded" />
          <input type="number" step="0.1" placeholder="Factor" value={form.factor} onChange={(e) => setForm({ ...form, factor: +e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">เพิ่ม</button>
      </div>
      <div className="bg-white p-4 rounded border">
        {sports.map((s) => (
          <div key={s.id} className="border-b py-2 text-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{s.name} ({s.code})</div>
              <div className="text-xs text-gray-500">Factor: {s.factor}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<any>({});
  useEffect(() => { api("/api/settings").then(setSettings); }, []);
  const save = async () => {
    await api("/api/settings", { method: "PATCH", body: JSON.stringify(settings) });
    alert("บันทึกแล้ว");
  };
  const fields = ["groupLimit", "cooldownDays", "voucherExpiryMinutes", "clubCreationMinLevel", "powerToExpRate"];
  return (
    <div className="bg-white p-4 rounded border space-y-2 max-w-md">
      <h3 className="font-semibold">System Settings</h3>
      {fields.map((f) => (
        <div key={f} className="flex items-center gap-2">
          <label className="text-sm w-44">{f}</label>
          <input type="number" value={settings[f] ?? ""} onChange={(e) => setSettings({ ...settings, [f]: +e.target.value })} className="border px-3 py-2 rounded flex-1" />
        </div>
      ))}
      <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">บันทึก</button>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { api("/api/users").then(setUsers); }, []);
  const changeRole = async (id: string, role: string) => {
    await api("/api/users", { method: "PATCH", body: JSON.stringify({ id, role }) });
    api("/api/users").then(setUsers);
  };
  return (
    <div className="bg-white p-4 rounded border">
      {users.map((u) => (
        <div key={u.id} className="border-b py-2 text-sm flex justify-between items-center">
          <div>
            <div className="font-medium">{u.displayName}</div>
            <div className="text-xs text-gray-500">{u.email} · {u.orgName} · {u.levelName}</div>
          </div>
          <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} className="border px-2 py-1 rounded text-sm">
            {["USER", "STAFF", "DEPARTMENT_ADMIN", "SUPER_ADMIN", "MERCHANT"].map((r) => <option key={r} value={r}>{label(ROLE_LABEL, r)}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

function PlayersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  useEffect(() => { api("/api/users").then(setUsers); }, []);
  const loadDetail = async (u: any) => {
    setSelected(u);
    const regs = await api(`/api/registrations?userId=${u.id}`);
    const wallet = await api(`/api/wallet`).catch(() => null);
    // fetch wallet for that user via admin? use public wallet endpoint with x-user-id not available; show regs only
    setDetail({ regs });
  };
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded border max-h-96 overflow-auto">
        {users.map((u) => (
          <button key={u.id} onClick={() => loadDetail(u)} className="w-full text-left border-b py-2 text-sm hover:bg-gray-50">
            <div className="font-medium">{u.displayName}</div>
            <div className="text-xs text-gray-500">{u.email} · {label(PERSONNEL_TYPE_LABEL, u.personnelType)} · {u.levelName} · {u.points}P/{u.power}PW/{u.exp}EXP</div>
          </button>
        ))}
      </div>
      <div className="bg-white p-4 rounded border">
        {!selected && <div className="text-gray-500 text-sm">เลือกผู้เล่นเพื่อดูรายละเอียด</div>}
        {selected && (
          <div className="space-y-2 text-sm">
            <div className="font-semibold text-lg">{selected.displayName}</div>
            <div className="text-xs text-gray-500">{selected.email} · {selected.orgName} · {selected.personnelType}</div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-yellow-50 p-2 rounded text-center"><div className="text-xs">POINT</div><div className="font-bold">{selected.points}</div></div>
              <div className="bg-green-50 p-2 rounded text-center"><div className="text-xs">POWER</div><div className="font-bold">{selected.power}</div></div>
              <div className="bg-purple-50 p-2 rounded text-center"><div className="text-xs">EXP</div><div className="font-bold">{selected.exp}</div></div>
            </div>
            <div className="mt-2">Level: <b>{selected.levelName}</b></div>
            {detail && (
              <div className="mt-3">
                <div className="font-medium">ประวัติการลงทะเบียน ({detail.regs.length})</div>
                <div className="max-h-60 overflow-auto">
                  {detail.regs.map((r: any) => (
                    <div key={r.id} className="text-xs border-b py-1">
                      {r.activity?.name} · {r.status} · {new Date(r.registeredAt).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api("/api/analytics").then(setData); }, []);
  if (!data) return <div>กำลังโหลด...</div>;
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">ผู้เล่นทั้งหมด</div><div className="text-2xl font-bold">{data.users.total}</div></div>
        <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">กิจกรรม</div><div className="text-2xl font-bold">{data.activities.total}</div></div>
        <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">Redemptions</div><div className="text-2xl font-bold">{data.rewards.redemptions}</div></div>
        <div className="bg-white p-4 rounded border"><div className="text-xs text-gray-500">Communities</div><div className="text-2xl font-bold">{data.communities.total}</div></div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">ผู้เล่นตาม Level</h3>
          {data.users.byLevel.map((l: any) => (
            <div key={l.level} className="flex justify-between text-sm border-b py-1">
              <span>{l.level}</span><span>{l.count}</span>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">ผู้เล่นตามหน่วยงาน</h3>
          {data.users.byOrg.map((o: any) => (
            <div key={o.org} className="flex justify-between text-sm border-b py-1">
              <span>{o.org}</span><span>{o.count}</span>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">คะแนนที่แจก</h3>
          <div className="text-sm space-y-1">
            <div>POINT: {data.points.pointDistributed}</div>
            <div>POWER: {data.points.powerDistributed}</div>
            <div>EXP: {data.points.expDistributed}</div>
            <div>Conversions: {data.points.conversions} ({data.points.conversionPowerUsed} POWER → {data.points.conversionExpGained} EXP)</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">กิจกรรม</h3>
          <div className="text-sm space-y-1">
            <div>ทั้งหมด: {data.activities.total} · เปิด: {data.activities.open} · จบ: {data.activities.completed}</div>
            <div>ลงทะเบียน: {data.activities.registrations} · เข้าร่วม: {data.activities.completedRegs}</div>
            <div>อัตราเข้าร่วม: {data.activities.attendanceRate}%</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">Rewards ยอดนิยม</h3>
          {data.rewards.topRewards.map((r: any) => (
            <div key={r.name} className="flex justify-between text-sm border-b py-1">
              <span>{r.name}</span><span>{r.count} (stock {r.stock})</span>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">Quiz</h3>
          <div className="text-sm space-y-1">
            <div>คำถาม: {data.quizzes.total}</div>
            <div>คำตอบ: {data.quizzes.answers} · ถูก: {data.quizzes.correct} · ผิด: {data.quizzes.wrong}</div>
            <div>อัตราถูก: {data.quizzes.accuracy}%</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">Merchant / Coupon</h3>
          <div className="text-sm space-y-1">
            <div>ร้าน: {data.merchants.total} · คูปองออก: {data.merchants.vouchersIssued} · ใช้แล้ว: {data.merchants.vouchersUsed}</div>
            {data.merchants.byMerchant.map((m: any) => (
              <div key={m.name} className="text-xs">{m.name}: {m.used}/{m.issued}</div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">Community</h3>
          <div className="text-sm space-y-1">
            <div>ทั้งหมด: {data.communities.total} · active: {data.communities.active} · dissolved: {data.communities.dissolved}</div>
            <div>สมาชิก active: {data.communities.members}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => { api("/api/audit").then(setLogs); }, []);
  return (
    <div className="bg-white p-4 rounded border">
      {logs.map((l) => (
        <div key={l.id} className="border-b py-2 text-sm">
          <div className="font-medium">{l.action} · {l.entityType}</div>
          <div className="text-xs text-gray-500">{l.actorId} · {new Date(l.createdAt).toLocaleString()} · {l.details}</div>
        </div>
      ))}
    </div>
  );
}
