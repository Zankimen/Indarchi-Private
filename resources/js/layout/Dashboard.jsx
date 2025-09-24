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

export default function Dashboard({ children, title }) {
  const { moduleMenus } = usePage().props;

  const { url } = usePage();

  const currentPath = url;

  console.log(currentPath);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  }

  return (
    <SidebarProvider className="max-w-[1440px]">
      <Sidebar className="border-border/40">
        <SidebarHeader className="p-4 bg-primary">
          <div className="space-y-4 border-primary border-2 shadow rounded-3xl flex justify-center items-center p-2">
            <h1 className="text-2xl font-bold">Indarchi</h1>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-6 bg-primary">
          <SidebarGroup>
            {/* <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                Navigation
              </SidebarGroupLabel> */}
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === "/"}
                  className="h-9 px-4 rounded-sm transition-all duration-200 hover:bg-secondary"
                >
                  <Link href="/" className="flex items-center gap-4">
                    <HomeIcon className="h-4 w-4 text-primary-foreground" />
                    <span className="text-primary-foreground font-bold">
                      Dashboard
                    </span>
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
                              "h-9 px-4 rounded-sm transition-all duration-200 cursor-pointer"
                            }
                          >
                            <div className="flex justify-center items-center gap-4">
                              <Icon className="h-4 w-4 text-primary-foreground" />
                              <span className="font-bold text-primary-foreground">
                                {menu.title}
                              </span>
                            </div>
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
                                    className="h-8 px-2 rounded-sm transition-all duration-200"
                                  >
                                    <Link href={child.route} className="gap-4">
                                      <SubIcon className="h-4 w-4" />
                                      <span className="text-sm text-primary-foreground font-bold">
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
                      className="h-9 px-4 rounded-sm transition-all duration-200 hover:bg-accent/50"
                    >
                      <Link
                        href={menu.route}
                        className="flex items-center gap-4"
                      >
                        <Icon className="h-4 w-4 text-primary-foreground" />
                        <span className="text-primary-foreground font-bold">
                          {menu.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-8 py-4">
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="sm"
                className="h-8 p-4 rounded-sm"
              >
                <Link
                  href="/dashboard/tenant"
                  className="flex items-center gap-4"
                >
                  <SquareUserIcon className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <div className="flex flex-col min-h-screen rounded-3xl h-full">
          {/* backdrop-blur supports-[backdrop-filter]:bg-background/60 */}
          <header className="sticky top-0 z-40 bg-primary-foreground">
            <div className="flex h-24 items-center gap-4 px-10">
              <div className="flex items-center gap-2 flex-1 font-bold text-3xl">
                {title}
                {/* <SidebarTrigger className="-ml-1 h-8 w-8 cursor-pointer text-primary" /> */}
              </div>

              <div className="flex items-center gap-4 h-full">
                <div className="font-medium text-2xl">Joko</div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {/* <Button
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
                  </Button> */}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-hidden">
            <div className="h-full p-6 bg-primary-foreground">{children}</div>
          </main>
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
