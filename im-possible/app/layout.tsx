"use client"

import type { Metadata } from "next";
import "./globals.css";import { use } from "react";
import { Inter } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 p-6 bg-slate-50/50">
              <SidebarTrigger className="mb-4" />
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}