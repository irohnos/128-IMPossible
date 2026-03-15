"use client";

import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[700px]">
        
        <div className="hidden md:flex md:w-1/2 bg-[#faf7f5] items-center justify-center p-12">
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
            <h1 className="text-3xl font-bold uppercase text-[#7b1113] tracking-tight leading-tight mb-2">
              Institution of Management System
            </h1>
            <p className="text-[#3b0708] font-light">
              To sign into your account, enter your email and password
            </p>
          </div>

          <LoginForm />

          <div className="text-center mt-6">
            <Link href="/auth/forgot-password" className="text-sm text-[#7b1113] hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
