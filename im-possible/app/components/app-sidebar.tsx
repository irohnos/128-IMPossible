"use client";

import Link from "next/link";
import Image from "next/image";

import { 
  BookOpen,
  LayoutDashboard, 
  LibraryBig,
  ClipboardCheck, 
  ChartLine,
  Settings, 
  UserCircle,
  Command,
  ChevronsUpDown,
  LogOut,
  BadgeCheck,
  Bell
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menu for the sidebar
const mainItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Student Papers", url: "/papers", icon: LibraryBig },
    { title: "Student Checklist", url: "/checklist", icon: ClipboardCheck },
    { title: "Handbook", url: "/handbook", icon: BookOpen },
    { title: "Analytics", url: "/analytics", icon: ChartLine },
]

const secondaryItems = [
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "Profile", url: "/profile", icon: UserCircle },
    { title: "Logout", url: "/logout", icon: LogOut }
]

export default function AppSidebar() {
    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                            <div className = "flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {/* Replace with actual logo */ }
                                <Image src="/im-logo.png" alt="IM Logo" width={16} height={16} className="h-4 w-4" />
                            </div>
                            <div className = "grid flex-1 text-left text-sm leading-tight">
                                <span className="text-sm font-semibold uppercase">Institute of Management</span>
                                <span className="text-xs text-muted-foreground">University of the Philippines Baguio</span>
                            </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        {mainItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.url}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarGroup>
                    <SidebarMenu>
                        {secondaryItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.url}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarFooter>

        </Sidebar>
    )
}