"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ActivityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [activity, setActivity] = useState<any>(null);
  const [reg, setReg] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [passcode, setPasscode] = useState("");
  const [pin, setPin] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [staffAssigns, setStaffAssigns] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const a = await api(`/api/activities/${id}`);
    setActivity(a);
    if (user) {
      const r = await api(`/api/registrations?activityId=${id}`);
      setReg(r[0]);
      const att = await api(`/api/attendance?activityId=${id}`);
      setAttendance(att);
      const sa = await api(`/api/staff-assignments?activityId=${id}`);
      setStaffAssigns(sa);
    }
  };
  useEffect(() => { load(); }, [id, user]);

  const register = async () => {
    try { await api("/api/registrations", { method: "POST", body: JSON.stringify({ activityId: id }) }); await load(); setMsg("ลงทะเบียนสำเร็จ"); }
    catch (e: any) { setMsg(e.message); }
  };

  const invite = async (userId: string) => {
    try { await api("/api/registrations", { method: "PATCH", body: JSON.stringify({ action: "invite", activityId: id, userId }) }); setMsg("ส่งคำเชิญแล้ว"); await load(); }
    catch (e: any) { setMsg(e.message); }
  };

  const respondInvite = async (regId: string, accept: boolean) => {
    try { await api("/api/registrations", { method: "PATCH", body: JSON.stringify({ action: accept ? "accept" : "decline", id: regId }) }); setMsg(accept ? "ตอบรับแล้ว" : "ปฏิเสธแล้ว"); await load(); }
    catch (e: any) { setMsg(e.message); }
  };

  const checkIn = async () => {
    try {
      await api("/api/attendance", { method: "POST", body: JSON.stringify({ step: "CHECK_IN", registrationId: reg?.id, qrToken: qrToken || reg?.id }) });
      setMsg("เช็กอินสำเร็จ (QR)");
      await load();
    } catch (e: any) { setMsg(e.message); }
  };

  const verifyPin = async () => {
    try {
      await api("/api/attendance", { method: "POST", body: JSON.stringify({ step: "PIN", activityId: id, pin }) });
      setMsg("ยืนยัน PIN สำเร็จ · ได้รับคะแนนแล้ว");
      await load();
    } catch (e: any) { setMsg(e.message); }
  };

  const staffCheckIn = async (playerId: string) => {
    try {
      await api("/api/attendance", { method: "POST", body: JSON.stringify({ step: "CHECK_IN", activityId: id, playerId }) });
      setMsg("เช็กอินให้ผู้เล่นสำเร็จ");
      await load();
    } catch (e: any) { setMsg(e.message); }
  };

  const markNoShow = async (regId: string) => {
    try { await api("/api/registrations", { method: "PATCH", body: JSON.stringify({ action: "no_show", id: regId }) }); setMsg("บันทึก No-Show"); await load(); }
    catch (e: any) { setMsg(e.message); }
  };

  if (!activity) return <div>กำลังโหลด...</div>;

  const isStaff = user && (staffAssigns.some((s: any) => s.userId === user.id && s.isActive) ||
    ["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(user.role));
  const myAttendance = attendance.find((a) => a.userId === user?.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{activity.name}</h1>
      <p className="text-gray-600">{activity.description}</p>
      <div className="bg-white p-4 rounded border text-sm space-y-1">
        <div>หน่วยงาน: {activity.orgName}</div>
        <div>โครงการ: {activity.projectName}</div>
        <div>สถานที่: {activity.location}</div>
        <div>ประเภท: {activity.activityType}</div>
        <div>วิธีเช็กอิน: {activity.verificationMethod}</div>
        <div>รับ: {activity.capacity === 0 ? "ไม่จำกัด" : activity.capacity}</div>
        <div>สถานะ: {activity.status}</div>
        <div>รางวัล: POINT +{activity.pointReward} · EXP +{activity.expReward} · ตัวคูณ Staff: {activity.staffMultiplier}x</div>
        {activity.hasCertificate && <div className="text-blue-700">Certificate</div>}
        {activity.allowInvite && <div className="text-green-700">อนุญาตให้เชิญผู้เล่น</div>}
      </div>

      {msg && <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">{msg}</div>}

      {user && !reg && (
        <button onClick={register} className="px-4 py-2 bg-blue-600 text-white rounded">ลงทะเบียน</button>
      )}

      {user && reg && reg.inviteStatus === "PENDING" && reg.userId === user.id && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 space-y-2">
          <div className="text-sm">คุณได้รับคำเชิญเข้าร่วมกิจกรรมนี้</div>
          <div className="flex gap-2">
            <button onClick={() => respondInvite(reg.id, true)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">ตอบรับ</button>
            <button onClick={() => respondInvite(reg.id, false)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">ปฏิเสธ</button>
          </div>
        </div>
      )}

      {user && reg && (reg.status === "REGISTERED" || reg.status === "COMPLETED") && reg.inviteStatus !== "PENDING" && (
        <div className="bg-white p-4 rounded border space-y-3">
          <h3 className="font-semibold">เช็กอิน (QR Code)</h3>
          {!myAttendance?.checkedInAt && (
            <div className="space-y-2">
              <input value={qrToken} onChange={(e) => setQrToken(e.target.value)} placeholder="Token จาก QR ของคุณ (ว่าง = ใช้ registration id)" className="border px-3 py-2 rounded w-full text-sm" />
              <button onClick={checkIn} className="px-4 py-2 bg-green-600 text-white rounded">เช็กอินด้วย QR</button>
            </div>
          )}
          {myAttendance?.checkedInAt && !myAttendance?.pinVerifiedAt && (
            <div className="space-y-2">
              <div className="text-sm text-green-700">✓ เช็กอินแล้ว {new Date(myAttendance.checkedInAt).toLocaleString()}</div>
              <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="กรอก PIN กิจกรรม" className="border px-3 py-2 rounded w-full" />
              <button onClick={verifyPin} className="px-4 py-2 bg-purple-600 text-white rounded">ยืนยัน PIN (รับคะแนน)</button>
            </div>
          )}
          {myAttendance?.pinVerifiedAt && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700">✓ เข้าร่วมกิจกรรมสำเร็จ · ได้รับคะแนนแล้ว</div>
          )}
        </div>
      )}

      {user && reg && reg.status === "COMPLETED" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700">เข้าร่วมกิจกรรมสำเร็จแล้ว</div>
      )}

      {isStaff && (
        <div className="bg-white p-4 rounded border space-y-3">
          <h3 className="font-semibold">Staff Zone</h3>
          {activity.allowInvite && (
            <InviteBox activityId={id} onInvite={invite} />
          )}
          <div className="text-sm">
            <div className="font-medium">ผู้ลงทะเบียน / เช็กอิน ({attendance.length}):</div>
            {attendance.map((a) => (
              <div key={a.id} className="text-xs flex items-center justify-between border-b py-1">
                <span>{a.user?.displayName} · {a.checkedInAt ? "QR ✓" : "ยังไม่เช็กอิน"} {a.pinVerifiedAt ? "· PIN ✓" : ""}</span>
                <span className="flex gap-1">
                  {!a.checkedInAt && <button onClick={() => staffCheckIn(a.userId)} className="px-2 py-0.5 bg-green-600 text-white rounded text-xs">เช็กอินให้</button>}
                  {a.registrationId && <button onClick={() => markNoShow(a.registrationId)} className="px-2 py-0.5 bg-red-600 text-white rounded text-xs">No-Show</button>}
                </span>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            PIN ของกิจกรรม: <span className="font-mono">{activity.pinCode}</span> · โหมด: {activity.pinMode}
          </div>
        </div>
      )}
    </div>
  );
}

function InviteBox({ activityId, onInvite }: { activityId: string; onInvite: (userId: string) => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    (async () => {
      const u = await api("/api/users");
      setUsers(u.filter((x: any) => x.role !== "MERCHANT"));
    })();
  }, []);
  return (
    <div className="flex gap-2">
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border px-2 py-1 rounded text-sm flex-1">
        <option value="">เลือกผู้เล่นที่จะเชิญ</option>
        {users.map((u) => <option key={u.id} value={u.id}>{u.displayName} ({u.email})</option>)}
      </select>
      <button onClick={() => selected && onInvite(selected)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">เชิญ</button>
    </div>
  );
}
