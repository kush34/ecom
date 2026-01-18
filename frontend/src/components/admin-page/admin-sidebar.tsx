import { Home, Layers, Package, Search, Settings, UserRoundCog } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom";
import { Card, CardTitle } from "../ui/card";
import { useContext } from "react";
import { UserContext } from "@/store/UserContext";

const items = [
    {
        title: "Home",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Orders",
        url: "/admin/orders",
        icon: Package,
    },
    {
        title: "Inventory",
        url: "/admin/inventory",
        icon: Layers,
    },
    {
        title: "Search",
        url: "/admin/search",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const userCtx = useContext(UserContext)
    const user = userCtx?.user
    const userLoading = userCtx?.loading;
    const location = useLocation();
    console.log(location)
    if(userLoading){
        <div>
            loading...
        </div>
    }
    return (
        <Sidebar className="border-none shadow">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-2xl p-5 my-5">BeliBeli</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="px-3 py-2 text-2xl">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url} className={`${location.pathname == item.url && "bg-[#9810fa] text-white"}`}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuSkeleton />
                <Card className="border-none shadow border border-gray-200">
                    <CardTitle className="px-3 py-2">
                        <span className="flex items-center justify-center gap-2 font-light text-md">
                            <UserRoundCog width={15} /> {user?.email}
                        </span>
                    </CardTitle>
                </Card>
            </SidebarFooter>
        </Sidebar>
    )
}