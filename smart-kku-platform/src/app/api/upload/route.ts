// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const body = await req.json();
  const { filename, dataUrl } = body;
  if (!dataUrl || !dataUrl.startsWith("data:")) {
    return NextResponse.json({ error: "Invalid file data" }, { status: 400 });
  }
  // For prototype: store as data URL directly (in production, save to filesystem/S3)
  return NextResponse.json({ url: dataUrl, filename: filename || "file" });
}
