import React, { useState } from "react";
import { StickyNavbar } from "@/components/custom/StickyNavbar";
import { usePage, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Navbar({ children }) {
  const {
    url: currentPath,
    props: { moduleMenus },
  } = usePage();
  const [activeItem, setActiveItem] = useState("Informasi");

  const match = currentPath.match(/projects\/(\d+)/);
  const projectId = match ? match[1] : null;

  const getFullRoute = (route) => {
    if (projectId && !route.startsWith(`/projects/${projectId}`)) {
      return `/projects/${projectId}${route}`;
    }
    return route;
  };

  return (
    <div className="min-h-screen bg-card">
      <StickyNavbar>
        <StickyNavbar.Brand>
          <Button variant="ghost" className="cursor-pointer" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-8 w-8" />
            </Link>
          </Button>
          <img src="/storage/logo.png" alt="Indarchi Logo" className="h-10" />
          <span className="text-2xl font-semibold text-muted-foreground">Indarchi</span>
        </StickyNavbar.Brand>

        <StickyNavbar.Nav>
          {moduleMenus.project?.map((item, idx) => (
            <StickyNavbar.Item
              key={idx}
              asChild
              active={activeItem === item.title}
              onClick={() => setActiveItem(item.title)}
            >
              <Link href={getFullRoute(item.route)}>{item.title}</Link>
            </StickyNavbar.Item>
          ))}
        </StickyNavbar.Nav>
      </StickyNavbar>

      <div className="p-6 bg-background">{children}</div>
    </div>
  );
}
