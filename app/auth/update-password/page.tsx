"use client";

import Image from "next/image";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function Page() {
  const circles = [
    { cx: "12%", cy: "8%", r: 28 },
    { cx: "78%", cy: "5%", r: 18 },
    { cx: "88%", cy: "22%", r: 40 },
    { cx: "5%", cy: "35%", r: 15 },
    { cx: "60%", cy: "15%", r: 22 },
    { cx: "92%", cy: "50%", r: 12 },
    { cx: "20%", cy: "62%", r: 35 },
    { cx: "70%", cy: "70%", r: 20 },
    { cx: "40%", cy: "85%", r: 30 },
    { cx: "85%", cy: "88%", r: 24 },
    { cx: "10%", cy: "90%", r: 16 },
    { cx: "50%", cy: "50%", r: 45 },
  ];

  return (
    <main className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card border-2 border-maroon rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Left panel */}
        <div
          className="hidden md:flex md:w-5/12 border-r-2 border-maroon flex-col items-center justify-center gap-5 relative"
          style={{
            backgroundColor: "#faf7f5",
            backgroundImage: `linear-gradient(rgba(123, 17, 19) 1px, transparent 1px),
              linear-gradient(90deg, rgba(123, 17, 19) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            style={{ pointerEvents: "none" }}
          >
            {circles.map((c, i) => (
              <circle
                key={i}
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill="#7b1113"
                stroke="#7b1113"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          <div
            className="relative z-10 flex flex-col items-center justify-center gap-3 p-5"
            style={{
              width: 230,
              height: 230,
              borderRadius: "50%",
              background: "#faf7f5",
              border: "2px solid #7b1113",
            }}
          >
            <div className="relative w-44 h-44">
              <Image
                src="/IM-TRANSPARENT.png"
                alt="Institute of Management logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-red-50 flex-1 flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-14">

          <div className="mb-7">
            <div className="space-y-[-5px]">
              <h1 className="text-3xl font-extrabold text-maroon">
                Institute of Management
              </h1>
              <p className="text-[14px] text-red">
                University of the Philippines Baguio
              </p>
            </div>
            <p className="text-gray-800 font-light text-sm mt-[15px] mb-[-10px]">
              Please enter and confirm your new password below.
            </p>
          </div>

          <UpdatePasswordForm />
        </div>
      </div>
    </main>
  );
}