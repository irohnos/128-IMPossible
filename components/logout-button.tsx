"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

export function LogoutButton({ children, className, ...props }: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <button onClick={logout} className={className} {...props}>
      {children || "Logout"}
    </button>
  );
}
