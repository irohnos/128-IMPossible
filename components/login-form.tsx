"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className={cn("space-y-6", className)} {...props}>
      <div className="space-y-2">
        <label className="text-lg font-semibold text-slate-800">Your Email</label>
        <Input
          id="email"
          type="email"
          placeholder="juandelacruz@up.edu.ph"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 bg-zinc-100 text-black border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-lg font-semibold text-slate-800">Password</label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="•••••••••••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button 
        type="submit" 
        className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg" 
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>

      <div className="text-center mt-6">
        <Link href="/auth/sign-up" className="text-sm text-blue-600 hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </form>
  );
}
