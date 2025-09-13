import { useState } from "react";
import { 
  LayoutDashboard, 
  Bot, 
  Activity, 
  FileText, 
  Settings, 
  Zap 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
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
  { title: "Playground", url: "/agent/:id/playground", icon: Zap },
  { title: "Activity", url: "/agent/:id/activity", icon: Activity },
  { title: "Sources", url: "/agent/:id/sources", icon: FileText },
  { title: "Actions", url: "/agent/:id/actions", icon: Settings },
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
      ? "bg-gradient-primary text-primary-foreground font-medium shadow-glow" 
      : "hover:bg-muted/50 transition-smooth";
  };

  const isInAgentView = currentPath.includes("/agent/");

  return (
    <Sidebar
      className={`${!open ? "w-16" : "w-64"} border-r border-border bg-gradient-secondary backdrop-blur-sm`}
      collapsible="icon"
    >
      <SidebarContent className="pt-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold tracking-wide">
            Main
          </SidebarGroupLabel>
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
          <SidebarGroup className="mt-8">
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