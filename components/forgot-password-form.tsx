"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) throw error;
      
      setMessage("Check your email for the password reset link.");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className={cn("space-y-6", className)} {...props}>
      <div className="space-y-2">
        <label className="text-lg font-semibold text-[#7b1113]">Your Email</label>
        <Input
          id="email"
          type="email"
          placeholder="juandelacruz@up.edu.ph"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 bg-gray-50 text-gray-700 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {error && <p className="text-sm text-[#8e171a]">{error}</p>}
      {message && <p className="text-sm text-[#014421] font-medium">{message}</p>}

      <Button 
        type="submit" 
        className="w-full bg-[#7b1113] text-white py-4 rounded-lg font-bold hover:bg-[#5a0d0f] transition-colors shadow-lg" 
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Email"}
      </Button>

      <div className="text-center mt-6">
        <Link href="/auth/login" className="text-sm text-[#7b1113] hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </form>
  );
}