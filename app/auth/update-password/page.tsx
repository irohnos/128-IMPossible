"use client";

import Image from "next/image";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[700px]">
        <div className="hidden md:flex md:w-1/2 bg-red-50 items-center justify-center p-12">
          <div className="relative w-full h-full max-w-[400px] max-h-[400px]">
            <Image
              src="/IM-TRANSPARENT.png"
              alt="IM Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold uppercase text-maroon tracking-tight leading-tight mb-2">
              Institution of Management System
            </h1>
            <p className="text-maroon-900 font-light">
              Please enter and confirm your new password below.
            </p>
          </div>
          <UpdatePasswordForm />
        </div>
      </div>
    </main>
  );
}
