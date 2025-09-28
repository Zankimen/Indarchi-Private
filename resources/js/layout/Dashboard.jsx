import { usePage } from "@inertiajs/react";

import Dashboard from "@/components/custom/CustomDashboard";
import * as Icons from "lucide-react";

const iconMap = {
  HomeIcon: Icons.HomeIcon,
  UsersIcon: Icons.UsersIcon,
  UserStarIcon: Icons.UserStarIcon,
  BookUserIcon: Icons.BookUserIcon,
  AlbumIcon: Icons.AlbumIcon,
  PackageIcon: Icons.PackageIcon,
};

export default function DashboardPage({children}) {
  const {
    url: currentPath,
    props: { moduleMenus },
  } = usePage();

  console.log("module Menus:", moduleMenus);

  return (
    <Dashboard currentPath={currentPath}>
      <Dashboard.Sidebar>
        <Dashboard.SidebarHeader>
          <h1 className="text-2xl font-bold">Indarchi</h1>
        </Dashboard.SidebarHeader>
        <Dashboard.SidebarContent>
          <Dashboard.MenuGroup>
            <Dashboard.MenuItem href="/" icon={Icons.HomeIcon}>
              Dashboard
            </Dashboard.MenuItem>

            {moduleMenus.map((menu, idx) => {
              const Icon = iconMap[menu.icon] || Icons.PackageIcon;

              return menu.children?.length ? (
                <Dashboard.SubMenu key={idx} title={menu.title} icon={Icon}>
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
        {/* <Dashboard.SidebarFooter>
          <Dashboard.LogoutButton />
        </Dashboard.SidebarFooter> */}
      </Dashboard.Sidebar>

      <Dashboard.Content>
        <Dashboard.Header>
          <Dashboard.Title>Mahasiswa</Dashboard.Title>
        </Dashboard.Header>
        <div>{children}</div>
      </Dashboard.Content>
    </Dashboard>
  );
}
