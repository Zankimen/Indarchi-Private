import React from "react";

import { cn } from "../lib/utils";

const StickyNavbar = ({ children, className }) => {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full bg-background dark:bg-[#1e1b4b] border-b border-border shadow",
        className
      )}
    >
      <div className="flex items-center justify-between px-12 py-8">{children}</div>
    </nav>
  );
};

const NavbarBrand = ({ children, className }) => {
  return <div className={cn("flex items-center space-x-4", className)}>{children}</div>;
};

const NavbarNav = ({ children, className }) => {
  return <div className={cn("flex items-center space-x-8", className)}>{children}</div>;
};

const NavbarItem = ({ children, active = false, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "transition-colors hover:text-primary cursor-pointer font-bold",
        active
          ? "text-primary border-b-2 border-primary pb-1 dark:text-foreground dark:border-foreground"
          : "text-muted-foreground hover:text-primary dark:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
};

StickyNavbar.Brand = NavbarBrand;
StickyNavbar.Nav = NavbarNav;
StickyNavbar.Item = NavbarItem;

export { StickyNavbar };
