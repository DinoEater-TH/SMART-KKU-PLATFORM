"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WalletRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/profile"); }, [router]);
  return <div className="text-center py-12 text-slate-500">กำลังเปลี่ยนเส้นทางไปหน้าโปรไฟล์...</div>;
}
