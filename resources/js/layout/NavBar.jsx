import React from "react";

import { useState } from "react";

import { StickyNavbar } from "@/components/custom/StickyNavbar";

export default function Navbar({ children }) {
  const [activeItem, setActiveItem] = useState("Presensi");

  const navItems = ["Informasi", "Timeline", "Pekerja", "Presensi"];

  return (
    <div className="min-h-screen bg-card">
      <StickyNavbar>
        <StickyNavbar.Brand>
          <img src="/storage/logo.png" alt="Indarchi Logo" className="h-10" />
          <span className="text-2xl font-semibold text-foreground">Indarchi</span>
        </StickyNavbar.Brand>

        <StickyNavbar.Nav>
          {navItems.map((item) => (
            <StickyNavbar.Item
              key={item}
              active={activeItem === item}
              onClick={() => setActiveItem(item)}
            >
              {item}
            </StickyNavbar.Item>
          ))}
        </StickyNavbar.Nav>
      </StickyNavbar>

      <div className="p-6 bg-background">{children}</div>
    </div>
  );
}
