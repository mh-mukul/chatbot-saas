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
import { useToast } from "@/hooks/use-toast";
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

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<{
    username: string;
    first_name: string;
    last_name: string;
    image_url?: string;
  } | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("access_token");
    if (!isAuthenticated) {
      navigate("/");
    } else {
      // Get user data from localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Get user initials for avatar fallback
  const getUserInitials = (): string => {
    if (!user) return "";
    const firstInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : "";
    const lastInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  // Extract agent ID from URL if we're in an agent view
  const agentId = location.pathname.match(/\/agent\/([^\/]+)/)?.[1];

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
                      <AvatarImage src={user?.image_url} alt={user?.first_name || "User"} />
                      <AvatarFallback className="text-sm font-medium">
                        {getUserInitials() || <UserIcon className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user && (
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{`${user.first_name} ${user.last_name}`}</p>
                      <p className="text-xs text-muted-foreground">{user.username}</p>
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
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