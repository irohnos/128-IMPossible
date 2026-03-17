"use client";

import { useRef, useState } from "react";
import { uploadCsvAction } from "./import";

export default function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File type checker
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert("Invalid file type. Please upload a .csv file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Limit file size to 5MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Please keep it under 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

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
        className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-maroon-800 transition-all active:scale-95">
        {isUploading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}