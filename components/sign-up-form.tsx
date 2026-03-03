"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className={cn("space-y-6", className)} {...props}>
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

      <div className="space-y-2">
        <label className="text-lg font-semibold text-slate-800">Confirm Password</label>
        <div className="relative">
          <Input
            id="repeat-password"
            type={showRepeatPassword ? "text" : "password"}
            placeholder="•••••••••••••••••"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full p-4 bg-zinc-100 text-black border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
          >
            {showRepeatPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button 
        type="submit" 
        className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg" 
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>

      <div className="text-center mt-6">
        <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </form>
  );
}
