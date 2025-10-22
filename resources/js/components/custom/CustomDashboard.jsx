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
import useDarkMode from "../hooks/useDarkMode";

const DashboardContext = createContext(null);

function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("Dashboard compound components must be inside <Dashboard>");
  }
  return ctx;
}

function Dashboard({ children, currentPath }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  function handleLogout() {
    router.post("/logout");
  }

  return (
    <DashboardContext.Provider
      value={{ currentPath, isDarkMode, toggleDarkMode, handleLogout }}
    >
      {/* className="max-w-[1920px]" */}
      <SidebarProvider>
        {children}
        <Toaster />
      </SidebarProvider>
    </DashboardContext.Provider>
  );
}

Dashboard.Sidebar = function DashboardSidebar({ children }) {
  return <Sidebar className="border-r-background">{children}</Sidebar>;
};

Dashboard.SidebarHeader = function DashboardSidebarHeader({ children }) {
  return (
    <SidebarHeader className="py-8 bg-sidebar-background">{children}</SidebarHeader>
  );
};

Dashboard.SidebarContent = function DashboardSidebarContent({ children }) {
  return (
    <SidebarContent className="px-6 bg-sidebar-background">
      {children}
    </SidebarContent>
  );
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

Dashboard.MenuItem = function DashboardMenuItem({
  href,
  icon: Icon,
  children,
  exact = false,
}) {
  const { currentPath } = useDashboard();
  const isActive = exact
    ? currentPath === href
    : currentPath === href || (href !== "/" && currentPath.startsWith(href + "/"));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={href} className="flex items-center gap-4 font-bold">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

Dashboard.SubMenu = function DashboardSubMenu({ title, icon: Icon, children, defaultOpen = false, active = false }) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="h-9 px-2 group gap-4 cursor-pointer" isActive={active}>
            {Icon && <Icon className="h-4 w-4" />}
            <span className="text-sidebar-foreground font-bold">{title}</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-4 mt-1 border-l border-border/40 pl-4 font-bold">
            {children}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

Dashboard.SubMenuItem = function DashboardSubMenuItem({
  href,
  icon: Icon,
  children,
}) {
  const { currentPath } = useDashboard();
  const isActive = currentPath === href || (href !== "/" && currentPath.startsWith(href + "/"));

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link href={href} className="flex items-center gap-4">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{children}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};

Dashboard.Header = function DashboardHeader({ children }) {
  const { isDarkMode, toggleDarkMode } = useDashboard();

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="flex h-24 items-center gap-4">
        <div className="flex items-center gap-2 flex-1 text-foreground font-bold text-3xl">
          {children}
        </div>

        <div className="flex items-center gap-4 h-full">
          <div className="font-medium text-2xl text-foreground">Joko</div>
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            onClick={toggleDarkMode}
            className="h-10 w-10 cursor-pointer border-border rounded-4xl shadow hover:bg-background hover:border-accent"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
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
    <SidebarInset className="min-h-screen h-full">
      <main className="flex-1 overflow-hidden">
        <div className="h-full px-6 flex-col w-full min-h-screen bg-background">{children}</div>
      </main>
    </SidebarInset>
  );
};

Dashboard.LogoutButton = function DashboardLogoutButton() {
  const { handleLogout } = useDashboard();
  return (
    <Button
      onClick={handleLogout}
      className="flex items-center bg-background gap-4 px-2 cursor-pointer w-full text-left text-sm text-foreground hover:bg-primary hover:text-background rounded-sm transition-all duration-200"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};

export default Dashboard;
