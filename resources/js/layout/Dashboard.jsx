import { usePage } from "@inertiajs/react";
import Dashboard from "@/components/custom/CustomDashboard";
import * as Icons from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { toast } from "sonner";

const iconMap = {
  HomeIcon: Icons.Home,
  UsersIcon: Icons.Users,
  PackageIcon: Icons.Package,
  ShieldIcon: Icons.Shield,
  FolderKanbanIcon: Icons.FolderKanban,
};

export default function DashboardPage({ title, children }) {
  const {
    url: currentPath,
    props: { moduleMenus = {}, auth, flash },
  } = usePage();

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  const pathNoQuery = currentPath.split("?")[0];
  const dashboardMenus = moduleMenus.dashboard ?? [];

  const isActivePath = (route) =>
    route && (pathNoQuery === route || pathNoQuery.startsWith(route + "/"));

  return (
    <Dashboard currentPath={pathNoQuery}>
      <Dashboard.Sidebar>
        <Dashboard.SidebarHeader>
          <div className="flex items-center justify-center gap-4">
            <img src="/storage/logo.png" alt="Indarchi Logo" className="h-10" />
            <h1 className="text-2xl font-bold">Indarchi</h1>
          </div>
        </Dashboard.SidebarHeader>

        <Dashboard.SidebarContent>
          <Dashboard.MenuGroup>
            <Dashboard.MenuItem href="/dashboard" icon={Icons.Home} exact>
              Dashboard
            </Dashboard.MenuItem>

            {dashboardMenus.length === 0 && (
              <div className="p-3 text-accent text-sm">No menus available.</div>
            )}

            {dashboardMenus.map((menu, idx) => {
              const Icon = iconMap[menu.icon] || Icons.Package;
              const isParentActive = isActivePath(menu.route);
              const isChildActive = menu.children?.some((child) => isActivePath(child.route));
              const shouldOpen = isParentActive || isChildActive;

              if (menu.children?.length) {
                return (
                  <Dashboard.SubMenu
                    key={idx}
                    title={menu.title}
                    icon={Icon}
                    defaultOpen={shouldOpen}
                    active={shouldOpen}
                  >
                    {menu.children.map((child, cidx) => {
                      const ChildIcon = iconMap[child.icon] || Icons.Package;
                      return (
                        <Dashboard.SubMenuItem key={cidx} href={child.route} icon={ChildIcon}>
                          {child.title}
                        </Dashboard.SubMenuItem>
                      );
                    })}
                  </Dashboard.SubMenu>
                );
              }

              return (
                <Dashboard.MenuItem key={idx} href={menu.route} icon={Icon}>
                  {menu.title}
                </Dashboard.MenuItem>
              );
            })}
          </Dashboard.MenuGroup>
        </Dashboard.SidebarContent>

        <Dashboard.SidebarFooter>
          <Dashboard.LogoutButton />
        </Dashboard.SidebarFooter>
      </Dashboard.Sidebar>

      <Dashboard.Content>
        <Dashboard.Header user={auth.user}>
          <Dashboard.Title>{title}</Dashboard.Title>
        </Dashboard.Header>
        <div className="my-4">{children}</div>
      </Dashboard.Content>

      <Toaster />
    </Dashboard>
  );
}
