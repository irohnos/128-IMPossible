"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import Link from "next/link";


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
    <form onSubmit={handleLogin} className={cn("space-y-4", className)} {...props}>
      
      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-maroon">Email address</label>
        <Input
          id="email"
          type="email"
          placeholder="juandelacruz@up.edu.ph"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=" text-black h-10 bg-red-50 border border-maroon rounded-md text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-yellow/60 transition"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-maroon">Password</label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="•••••••••••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black h-10 bg-red-50 border border-maroon rounded-md text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-yellow/60 transition"
        />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition hover:text-yellow"
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* Forgot pw */}
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-muted-foreground hover:text-yellow transition"
          >
            Forgot password?
          </Link>
          </div>
        </div>

      <div className="space-y-2">
        {/* Error pop-out */}
        {error && 
          <p className="text-xs border border-red/20 bg-red/5 text-red rounded-md px-3 py-2">
        {error}</p>}

        {/* Submit */}
        <Button 
          type="submit" 
          className="w-full bg-maroon text-red-50 rounded-md text-sm font-semibold hover:bg-maroon-800 transition-colors shadow-sm" 
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </div>

    </form>
  );
}
