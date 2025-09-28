import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, router } from "@inertiajs/react";
import { ChevronDown, Sun, Moon, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Toaster } from "@components/ui/sonner";
import { Button } from "@components/ui/button";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";

const DashboardContext = createContext(null);

function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("Dashboard compound components must be inside <Dashboard>");
  }
  return ctx;
}

function Dashboard({ children, currentPath }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  }

  function handleLogout() {
    router.post("/logout");
  }

  return (
    <DashboardContext.Provider
      value={{ currentPath, isDarkMode, toggleDarkMode, handleLogout }}
    >
      <SidebarProvider className="max-w-[1440px]">
        {children}
        <Toaster />
      </SidebarProvider>
    </DashboardContext.Provider>
  );
}

Dashboard.Sidebar = function DashboardSidebar({ children }) {
  return <Sidebar className="border-border/40">{children}</Sidebar>;
};

Dashboard.SidebarHeader = function DashboardSidebarHeader({ children }) {
  return <SidebarHeader className="p-4 bg-primary">{children}</SidebarHeader>;
};

Dashboard.SidebarContent = function DashboardSidebarContent({ children }) {
  return <SidebarContent className="px-6 bg-primary">{children}</SidebarContent>;
};

Dashboard.SidebarFooter = function DashboardSidebarFooter({ children }) {
  return <SidebarFooter className="px-8 py-4">{children}</SidebarFooter>;
};

Dashboard.MenuGroup = function DashboardMenuGroup({ children }) {
  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1">{children}</SidebarMenu>
    </SidebarGroup>
  );
};

Dashboard.MenuItem = function DashboardMenuItem({ href, icon: Icon, children }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={href} className="flex items-center gap-4">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};


Dashboard.SubMenu = function DashboardSubMenu({ title, icon: Icon, children }) {
  return (
    <Collapsible>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="h-9 px-2 group gap-4 cursor-pointer">
            {Icon && <Icon className="h-4 w-4" />}
            <span className="text-primary-foreground">{title}</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-4 mt-1 border-l border-border/40 pl-4">
            {children}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

Dashboard.SubMenuItem = function DashboardSubMenuItem({ href, icon: Icon, children }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={href} className="flex items-center gap-4">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

Dashboard.Header = function DashboardHeader({ children }) {
  const { isDarkMode, toggleDarkMode } = useDashboard();

  return (
    <header className="sticky top-0 z-40 bg-primary-foreground">
      <div className="flex h-24 items-center gap-4 px-10">
        <div className="flex items-center gap-2 flex-1 font-bold text-3xl">
          {children}
        </div>

        <div className="flex items-center gap-4 h-full">
          <div className="font-medium text-2xl">Joko</div>
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-primary" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

Dashboard.Title = function DashboardTitle({ children }) {
  return <>{children}</>;
};

Dashboard.Content = function DashboardContent({ children }) {
  return (
    <SidebarInset className="flex flex-col">
      <div className="flex flex-col min-h-screen rounded-3xl h-full">
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6 bg-primary-foreground">{children}</div>
        </main>
      </div>
    </SidebarInset>
  );
};

Dashboard.LogoutButton = function DashboardLogoutButton() {
  const { handleLogout } = useDashboard();
  return (
    <Button
      onClick={handleLogout}
      className="flex items-center gap-4 h-9 px-4 w-full text-left text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-sm transition-all duration-200"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};

export default Dashboard;
