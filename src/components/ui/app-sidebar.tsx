import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Bot,
  BotMessageSquare,
  Activity,
  FileText,
  Settings,
  Zap,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  // Load sidebar state from localStorage on initial render only (once)
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setOpen(savedState === 'true');
    }
  }, []); // Empty dependency array - runs only once

  // Save sidebar state to localStorage whenever it changes
  // Using ref to track previous value to avoid unnecessary updates
  useEffect(() => {
    // Skip the first render to avoid conflicts with initial state load
    const handler = setTimeout(() => {
      localStorage.setItem('sidebarOpen', String(open));
    }, 0);

    return () => clearTimeout(handler);
  }, [open]);

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
      className={`h-full ${!open ? "w-16" : "w-64"} border-r border-border bg-gradient-secondary backdrop-blur-sm`}
      collapsible="icon"
    >
      <SidebarHeader className="relative p-3">
        <div className="flex items-center justify-center group-data-[state=collapsed]:justify-center">
          <BotMessageSquare className="h-8 w-8 min-w-8 flex-shrink-0 transition-all duration-300 group-data-[state=expanded]:mr-2" />
          <span className="text-lg font-bold transition-opacity duration-300 group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:overflow-hidden">
            AgentIQ
          </span>
        </div>
      </SidebarHeader>
      <SidebarTrigger className="absolute top-1/2 -right-3 hidden md:inline-flex p-1 rounded-md bg-background border border-border shadow-md hover:bg-muted h-6 w-6">
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </SidebarTrigger>
      <SidebarContent className="pt-2">
        {/* Main Navigation */}
        <SidebarGroup>
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
          <>
            <hr className="mx-4 my-2 border-border" />
            <SidebarGroup className="mt-2">
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
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}