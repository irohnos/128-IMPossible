"use client"

import type { Metadata } from "next";
import "./globals.css";import { use } from "react";
import { Inter } from "next/font/google";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import App from "next/app";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4
        transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger size="sm" variant="ghost" className="data-[state=open]:bg-transparent" />
              <Separator orientation="vertical" className="mx-0 h-4" />
              <h1 className="text-sm font-medium">Dashboard</h1>
          </div>
        </header>

        {/*main content sidebar*/ }
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
    </body>
    </html>
  );
}