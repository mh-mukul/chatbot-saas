import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Button } from "@/components/ui/button";
import { CycleTheme } from "@/components/ui/cycle-theme";
import {
  LogOut,
  PanelLeft,
  User as UserIcon
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAuthenticated, handleLogout } = useAuth();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
    image_url?: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/");
    } else if (isAuthenticated === true) {
      // Get user data from localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [isAuthenticated, navigate]);

  // Get user initials for avatar fallback
  const getUserInitials = (): string => {
    if (!user) return "";
    const firstInitial = user.name ? user.name.charAt(0).toUpperCase() : "";
    const lastInitial = user.name ? user.name.split(" ").slice(-1)[0].charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  // Extract agent ID from URL if we're in an agent view
  const agentId = location.pathname.match(/\/agent\/([^\/]+)/)?.[1];

  if (isAuthenticated === null) {
    // You can render a loading spinner here
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        <AppSidebar agentId={agentId} />

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="h-16 border-b border-border/50 bg-gradient-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              {isMobile && (
                <SidebarTrigger>
                  <PanelLeft className="h-5 w-5" />
                </SidebarTrigger>
              )}
            </div>

            <div className="flex items-center gap-2">
              <CycleTheme />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0 relative">
                    <Avatar className="h-9 w-9 border border-border/50 hover:border-border transition-colors">
                      <AvatarImage src={user?.image_url} alt={getUserInitials() || "User"} />
                      <AvatarFallback className="text-sm font-medium">
                        {getUserInitials() || <UserIcon className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user && (
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleLogout()} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;