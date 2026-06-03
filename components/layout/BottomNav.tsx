"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PieChart, List, User } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, href: "/dashboard", label: "Home" },
  { icon: PieChart, href: "/reports", label: "Reports" },
  { icon: List, href: "/transactions", label: "Activity" },
  { icon: User, href: "/settings", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map(({ icon: Icon, href, label }) => {
        const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`nav-item ${isActive ? "active" : ""}`}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
          </Link>
        );
      })}
    </nav>
  );
}
