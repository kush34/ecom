import { Home, Package, Search, Settings, Warehouse } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom";

const items = [
    {
        title: "Home",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Orders",
        url: "/orders",
        icon: Package,
    },
    {
        title: "Inventory",
        url: "/inventory",
        icon: Warehouse,
    },
    {
        title: "Search",
        url: "/search",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const location = useLocation();
    console.log(location)
    return (
        <Sidebar className="border-none shadow">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>BeliBeli</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="px-3 py-2 text-2xl">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} className={`${location.pathname == item.url && "bg-[#9810fa] text-white"}`}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
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