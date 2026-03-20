"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      setMessage("Password updated successfully! Redirecting...");
 
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleForgotPassword} className={cn("space-y-6", className)} {...props}>
      <div className="space-y-2">
        <label className="text-lg font-semibold text-maroon">New Password</label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="•••••••••••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" text-black h-10 bg-red-50 border border-maroon rounded-md text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-yellow/60 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition hover:text-yellow"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-lg font-semibold text-maroon">Confirm New Password</label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="•••••••••••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className=" text-black h-10 bg-red-50 border border-maroon rounded-md text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-yellow/60 transition"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition hover:text-yellow"
          >
            {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red">{error}</p>}
      {message && <p className="text-sm text-green font-medium">{message}</p>}

      <Button 
        type="submit" 
        className="w-full bg-maroon text-red-50 rounded-md text-sm font-semibold hover:bg-maroon-800 transition-colors shadow-sm" 
        disabled={isLoading}
      >
        {isLoading ? "Saving New Password..." : "Save New Password"}
      </Button>
    </form>
  );
}
