"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function FileUpload({ label, onUploaded, accept = "image/*" }: { label: string; onUploaded: (url: string) => void; accept?: string }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      try {
        const res = await api("/api/upload", { method: "POST", body: JSON.stringify({ filename: file.name, dataUrl }) });
        onUploaded(res.url);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input type="file" accept={accept} onChange={onChange} className="block w-full text-sm" />
      {loading && <div className="text-xs text-gray-500">กำลังอัพโหลด...</div>}
      {preview && <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded border" />}
    </div>
  );
}
