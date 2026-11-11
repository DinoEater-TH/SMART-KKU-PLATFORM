// src/app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "projects" | "activities" | "scoring" | "sports" | "settings" | "users" | "audit";
export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("projects");
  if (!user || !["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role)) return <div>สำหรับผู้ดูแลเท่านั้น</div>;

  const tabs: { id: Tab; label: string }[] = [
    { id: "projects", label: "Projects" },
    { id: "activities", label: "Activities" },
    { id: "scoring", label: "Scoring Rules" },
    { id: "sports", label: "Sport Types" },
    { id: "settings", label: "Settings" },
    { id: "users", label: "Users" },
    { id: "audit", label: "Audit Logs" },
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
      {tab === "scoring" && <ScoringTab />}
      {tab === "sports" && <SportsTab />}
      {tab === "settings" && <SettingsTab />}
      {tab === "users" && <UsersTab />}
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
        <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded w-full" />
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
  const [form, setForm] = useState<any>({ projectId: "", code: "", name: "", description: "", activityType: "EVENT", capacity: 0, verificationMethod: "DIRECT", pointReward: 0, expReward: 0, powerReward: 0, hasCertificate: false, qualificationReward: "" });
  useEffect(() => { api("/api/activities").then(setActivities); api("/api/projects").then(setProjects); }, []);
  const create = async () => {
    await api("/api/activities", { method: "POST", body: JSON.stringify(form) });
    setForm({ projectId: "", code: "", name: "", description: "", activityType: "EVENT", capacity: 0, verificationMethod: "DIRECT", pointReward: 0, expReward: 0, powerReward: 0, hasCertificate: false, qualificationReward: "" });
    api("/api/activities").then(setActivities);
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
          <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="border px-3 py-2 rounded" />
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded w-full" />
        <div className="grid grid-cols-3 gap-2">
          <select value={form.activityType} onChange={(e) => setForm({ ...form, activityType: e.target.value })} className="border px-3 py-2 rounded">
            <option value="EVENT">EVENT</option>
            <option value="TRAINING">TRAINING</option>
            <option value="HEALTHY_LIFE">HEALTHY_LIFE</option>
          </select>
          <select value={form.verificationMethod} onChange={(e) => setForm({ ...form, verificationMethod: e.target.value })} className="border px-3 py-2 rounded">
            <option value="DIRECT">DIRECT</option>
            <option value="GEO_FENCE">GEO_FENCE</option>
            <option value="QR_PASSCODE">QR_PASSCODE</option>
          </select>
          <input type="number" placeholder="Capacity (0=unlim)" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="POINT" value={form.pointReward} onChange={(e) => setForm({ ...form, pointReward: +e.target.value })} className="border px-3 py-2 rounded" />
          <input type="number" placeholder="EXP" value={form.expReward} onChange={(e) => setForm({ ...form, expReward: +e.target.value })} className="border px-3 py-2 rounded" />
          <input placeholder="Qualification" value={form.qualificationReward} onChange={(e) => setForm({ ...form, qualificationReward: e.target.value })} className="border px-3 py-2 rounded" />
        </div>
        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.hasCertificate} onChange={(e) => setForm({ ...form, hasCertificate: e.target.checked })} /> มี Certificate</label>
        <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">สร้าง</button>
      </div>
      <div className="bg-white p-4 rounded border">
        {activities.map((a) => (
          <div key={a.id} className="border-b py-2 text-sm">
            <div className="font-medium">{a.name} ({a.code})</div>
            <div className="text-xs text-gray-500">{a.projectName} · {a.verificationMethod} · cap {a.capacity === 0 ? "∞" : a.capacity} · +{a.pointReward}P +{a.expReward}EXP</div>
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
        <h3 className="font-semibold">สร้าง Scoring Rule (deactivate ของเก่า)</h3>
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
            <div className="text-xs text-gray-500">Special Event: {r.specialEventMultiplier} · Duration Mult: {r.durationMultiplierPercent}% · {r.effectiveFrom}</div>
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
  const updateFactor = async (id: string, factor: number) => {
    await api("/api/sport-types", { method: "PATCH", body: JSON.stringify({ id, factor }) });
    api("/api/sport-types").then(setSports);
  };
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold">เพิ่มประเภทกีฬา</h3>
        <div className="grid grid-cols-3 gap-2">
          <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="border px-3 py-2 rounded" />
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded" />
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
            <input type="number" step="0.1" defaultValue={s.factor} onBlur={(e) => updateFactor(s.id, +e.target.value)} className="border px-2 py-1 rounded w-20 text-sm" />
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
  const fields = ["groupLimit", "cooldownDays", "voucherExpiryMinutes", "clubCreationExp", "referralInviterBonus", "referralInviteeBonus", "referralLimit", "powerToExpRate"];
  return (
    <div className="bg-white p-4 rounded border space-y-2 max-w-md">
      <h3 className="font-semibold">System Settings</h3>
      {fields.map((f) => (
        <div key={f} className="flex items-center gap-2">
          <label className="text-sm w-40">{f}</label>
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
            <div className="text-xs text-gray-500">{u.email} · {u.orgName}</div>
          </div>
          <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} className="border px-2 py-1 rounded text-sm">
            {["USER", "STAFF", "DEPARTMENT_ADMIN", "SUPER_ADMIN", "MERCHANT"].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      ))}
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
          <div className="text-xs text-gray-500">{l.actorId} · {new Date(l.createdAt).toLocaleString("th-TH")} · {l.details}</div>
        </div>
      ))}
    </div>
  );
}
