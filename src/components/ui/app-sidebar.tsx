import { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  Activity,
  FileText,
  Settings,
  Zap,
  Play,
  PanelLeft,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Agents", url: "/agents", icon: Bot },
];

const agentItems = [
  { title: "Playground", url: "/agent/:id/playground", icon: Play },
  { title: "Activity", url: "/agent/:id/activity", icon: Activity },
  { title: "Sources", url: "/agent/:id/sources", icon: FileText },
  { title: "Actions", url: "/agent/:id/actions", icon: Zap },
  { title: "Settings", url: "/agent/:id/settings", icon: Settings },
];

export function AppSidebar({ agentId }: { agentId?: string }) {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string, agentId?: string) => {
    if (agentId && path.includes(":id")) {
      return currentPath === path.replace(":id", agentId);
    }
    return currentPath === path;
  };

  const getNavClass = (path: string, agentId?: string) => {
    const active = isActive(path, agentId);
    return active
      ? "bg-primary text-primary-foreground font-medium"
      : "hover:bg-muted/50 transition-smooth";
  };

  const isInAgentView = currentPath.includes("/agent/");

  return (
    <Sidebar
      className={`${!open ? "w-16" : "w-64"} border-r border-border bg-gradient-secondary backdrop-blur-sm`}
      collapsible="icon"
    >
      <SidebarHeader className="relative p-3">
            <div className="flex items-center">
              <span className="text-lg font-bold transition-opacity duration-300 group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:overflow-hidden">
                AgentIQ
              </span>
            </div>
            <SidebarTrigger className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex">
              <PanelLeft className="size-4" />
            </SidebarTrigger>
          </SidebarHeader>
      <SidebarContent className="pt-2">
        {/* Main Navigation */}
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-muted-foreground font-semibold tracking-wide">
            Main
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Agent Navigation (only show when in agent view) */}
        {isInAgentView && agentId && (
          <SidebarGroup className="mt-2">
            <SidebarGroupLabel className="text-muted-foreground font-semibold tracking-wide">
              Agent Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {agentItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url.replace(":id", agentId)}
                        className={getNavClass(item.url, agentId)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}