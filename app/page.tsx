"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[700px]">
        
        <div className="hidden md:flex md:w-1/2 bg-zinc-100 items-center justify-center p-12">
          <div className="relative w-full h-full max-w-[400px] max-h-[400px]">
            <Image
              src="/IMLogo.jpg"
              alt="IM Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
              Institution of Management System
            </h1>
            <p className="text-slate-500 font-light">
              To sign into your account, enter your email and password
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-slate-800">Your Email</label>
              <input 
                type="email" 
                placeholder="juandelacruz@up.edu.ph"
                className="w-full p-4 bg-zinc-100 text-black border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-slate-800">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="•••••••••••••••••"
                  className="w-full p-4 bg-zinc-100 text-black border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg mt-4">
              Sign In
            </button>

            <div className="text-center mt-6">
              <Link href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}