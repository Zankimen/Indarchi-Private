import React, { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import {
  PackageIcon,
  HomeIcon,
  UserRoundIcon,
  SquareUser,
  LogOut,
  Mail,
  UsersRound,
  PackageOpenIcon,
  ChevronDown,
  UserStarIcon,
  UsersIcon,
  BookUserIcon,
  AlbumIcon,
  Sun,
  Moon,
  UserIcon,
  SquareUserIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Toaster } from "@components/ui/sonner";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import { Separator } from "@components/ui/separator";
// import { cn } from "../lib/utils";
// import DynamicBreadcrumbs from "@components/custom/DynamicBreadcrumbs";

const iconMap = {
  PackageIcon: PackageIcon,
  HomeIcon: HomeIcon,
  UserRoundIcon: UserRoundIcon,
  PackageOpenIcon: PackageOpenIcon,
  UserStarIcon: UserStarIcon,
  UsersIcon: UsersIcon,
  BookUserIcon: BookUserIcon,
  AlbumIcon: AlbumIcon,
};

export default function Dashboard({ children }) {
  const { moduleMenus } = usePage().props;

  const { url } = usePage();

  const currentPath = url;

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="border-r border-border/40">
        <SidebarHeader className="border-b border-border/40 p-4">
          <div className="space-y-4 border-primary border-2 shadow rounded-3xl flex justify-center items-center p-2">
            <h1 className="text-2xl font-bold">SISTER</h1>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === "/"}
                  className="h-9 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50"
                >
                  <Link href="/" className="flex items-center gap-3">
                    <HomeIcon className="h-4 w-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {moduleMenus.map((menu, idx) => {
                const Icon = iconMap[menu.icon] || HomeIcon;
                const isParentActive = currentPath.startsWith(menu.route);
                const hasChildren =
                  Array.isArray(menu.children) && menu.children.length > 0;

                if (hasChildren) {
                  return (
                    <Collapsible key={idx} defaultOpen={isParentActive}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={
                              "h-9 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50 cursor-pointer"
                            }
                          >
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{menu.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-1 border-l border-border/40 pl-4 cursor-pointer">
                            {menu.children.map((child, cidx) => {
                              const isActive = currentPath.startsWith(
                                child.route
                              );
                              const SubIcon = iconMap[child.icon] || HomeIcon;
                              return (
                                <SidebarMenuSubItem key={cidx}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive}
                                    className="h-8 px-3 rounded-md transition-all duration-200"
                                  >
                                    <Link href={child.route}>
                                      <SubIcon className="h-4 w-4" />
                                      <span className="text-sm">
                                        {child.title}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                const isActive = currentPath.startsWith(menu.route);
                return (
                  <SidebarMenuItem key={idx}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-9 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50"
                    >
                      <Link
                        href={menu.route}
                        className="flex items-center gap-3"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{menu.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/40 p-2">
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="sm"
                className="h-8 px-3 rounded-lg"
              >
                <Link
                  href="/dashboard/tenant"
                  className="flex items-center gap-3"
                >
                  <SquareUserIcon className="h-4 w-4" />
                  <span className="text-sm">Organization</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <div className="flex flex-col min-h-screen rounded-3xl h-full bg-radial from-secondary to-bg-card">
          <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-3xl">
            <div className="flex h-16 items-center gap-4 px-6">
              <div className="flex items-center gap-2 flex-1">
                <SidebarTrigger className="-ml-1 h-8 w-8 cursor-pointer text-primary" />
                <Separator orientation="vertical" className="h-6" />
                {/* <DynamicBreadcrumbs /> */}
              </div>

              <div className="flex items-center gap-2">
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

          <main className="flex-1 overflow-hidden">
            <div className="h-full p-6">{children}</div>
          </main>
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
