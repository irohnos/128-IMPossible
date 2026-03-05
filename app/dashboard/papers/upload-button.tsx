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
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
      >
        {isUploading ? "Uploading..." : "Upload Excel"}
      </button>
    </div>
  );
}