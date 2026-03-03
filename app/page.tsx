import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-[1280px] h-[720px] relative bg-white overflow-hidden">
        <div className="w-[618px] h-[694px] left-[11px] top-[13px] absolute bg-zinc-300 rounded-[10px]" />
        <div className="w-24 h-14 left-[276px] top-[360px] absolute justify-start text-black text-xs font-normal font-['Inter']">IM PIC (maybe)</div>
        <div className="w-96 h-16 left-[732px] top-[239px] absolute text-justify justify-start text-black text-xs font-light font-['Inter'] leading-4">To sign into your account, enter your email and password</div>
        <div className="w-96 h-12 left-[731px] top-[163px] absolute justify-start text-black text-3xl font-bold font-['Inter'] leading-8">Institution of Management System</div>
        <div className="w-96 h-12 left-[731px] top-[347px] absolute bg-zinc-300 rounded" />
        <div className="w-96 h-12 left-[731px] top-[462px] absolute bg-zinc-300 rounded" />
        <div className="left-[731px] top-[313px] absolute text-justify justify-start text-black text-xl font-semibold font-['Inter'] leading-4">Your Email</div>
        <div className="left-[760px] top-[363px] absolute text-justify justify-start text-neutral-400 text-sm font-medium font-['Inter'] leading-4">juandelacruz@ up.edu.ph</div>
        <div className="left-[760px] top-[481px] absolute text-justify justify-start text-neutral-400 text-sm font-medium font-['Inter'] leading-3">●●●●●●●●●●●●●●●●●</div>
        <div className="left-[731px] top-[428px] absolute text-justify justify-start text-black text-xl font-semibold font-['Inter'] leading-4">Password</div>
        <div className="w-5 h-5 left-[1097px] top-[476px] absolute overflow-hidden">
          <div className="w-4 h-3.5 left-[2.32px] top-[3.50px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-400" />
        </div>
      </div>
    </main>
  );
}
