"use client";

import { useRef, useState } from "react";
import { uploadCsvAction } from "./import";

export default function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadCsvAction(formData);
      if (result?.error) {
        alert(`Upload failed: ${result.error}`);
      } else {
        alert("Upload successful!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 bg-[#7b1113] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#5a0d0f] transition-all active:scale-95">
        {isUploading ? "Uploading..." : "Upload Excel"}
      </button>
    </div>
  );
}