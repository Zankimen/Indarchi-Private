import { usePage } from "@inertiajs/react";

import Dashboard from "@/components/custom/CustomDashboard";
import * as Icons from "lucide-react";

const iconMap = {
  HomeIcon: Icons.HomeIcon,
  UsersIcon: Icons.UsersIcon,
  PackageIcon: Icons.PackageIcon,
  ShieldIcon: Icons.ShieldIcon,
  FolderKanbanIcon: Icons.FolderKanban
};

export default function DashboardPage({ title, children }) {
  const {
    url: currentPath,
    props: { moduleMenus },
  } = usePage();

  const pathNoQuery = currentPath.split("?")[0];

  return (
    <Dashboard currentPath={pathNoQuery}>
      <Dashboard.Sidebar>
        <Dashboard.SidebarHeader>
          <div className="flex items-center justify-center gap-4">
            <img
              src="/storage/logo.png"
              alt="Indarchi Logo"
              className="h-10"
            />
            <h1 className="text-2xl font-bold">
              Indarchi
            </h1>
          </div>
        </Dashboard.SidebarHeader>
        <Dashboard.SidebarContent>
          <Dashboard.MenuGroup>
            <Dashboard.MenuItem href="/dashboard" icon={Icons.HomeIcon} exact>
              Dashboard
            </Dashboard.MenuItem>

            {moduleMenus.dashboard.map((menu, idx) => {
              const Icon = iconMap[menu.icon] || Icons.PackageIcon;

              const isChildActive = Array.isArray(menu.children) && menu.children.some((child) => {
                const childRoute = child.route || "";
                return pathNoQuery === childRoute || (childRoute !== "/" && pathNoQuery.startsWith(childRoute + "/"));
              });
              const isParentActive = !!menu.route && (pathNoQuery === menu.route || pathNoQuery.startsWith(menu.route + "/"));
              const shouldOpen = isChildActive || isParentActive;

              return menu.children?.length ? (
                <Dashboard.SubMenu key={idx} title={menu.title} icon={Icon} defaultOpen={shouldOpen} active={shouldOpen}>
                  {menu.children.map((child, cidx) => {
                    const ChildIcon = iconMap[child.icon] || Icons.PackageIcon;
                    return (
                      <Dashboard.SubMenuItem
                        key={cidx}
                        href={child.route}
                        icon={ChildIcon}
                      >
                        {child.title}
                      </Dashboard.SubMenuItem>
                    );
                  })}
                </Dashboard.SubMenu>
              ) : (
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
        <Dashboard.Header>
          <Dashboard.Title>{title}</Dashboard.Title>
        </Dashboard.Header>
        <div className="my-4">{children}</div>
      </Dashboard.Content>
    </Dashboard>
  );
}
