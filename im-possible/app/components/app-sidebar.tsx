import Link from "next/link";

import { 
  LayoutDashboard, 
  LibraryBig,
  ClipboardCheck, 
  ChartLine,
  Settings, 
  UserCircle 
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";

// Menu for the sidebar
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: <LayoutDashboard size={18} />
    },
    {
        title: "Student Papers",
        url: "/papers",
        icon: <LibraryBig size={18} />
    },
    {
        title: "Student Checklist",
        url: "/checklist",
        icon: <ClipboardCheck size={18} />
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: <ChartLine size={18} />
    },
    {
        title: "Settings",  
        url: "/settings",
        icon: <Settings size={18} />
    },
    {   title: "Profile",
        url: "/profile",
        icon: <UserCircle size={18} />
    }
]

export default function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sm font-bold px-4 py-4 text-primary">
                        INSTITUTE OF MANAGEMENT
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} className="flex items-center px-4 py-2 rounded-md hover:bg-secondary">
                                            {item.icon}
                                            <span className="ml-2">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}