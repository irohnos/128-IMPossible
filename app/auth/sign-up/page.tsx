"use client";

import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[700px]">
        
        <div className="hidden md:flex md:w-1/2 bg-zinc-100 items-center justify-center p-12">
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
              Institution of Management System
            </h1>
            <p className="text-slate-500 font-light">
              Create a new account to get started
            </p>
          </div>

          <SignUpForm />
        </div>
      </div>
    </main>
  );
}
