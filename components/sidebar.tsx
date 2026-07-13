"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Clock3,
  Upload,
  CreditCard,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Members",
    href: "/members",
    icon: Users,
  },
  {
    name: "Add Member",
    href: "/members/new",
    icon: UserPlus,
  },
  {
    name: "Expiring Soon",
    href: "/members/expiring",
    icon: Clock3,
  },
  {
    name: "Import Excel",
    href: "/import",
    icon: Upload,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-zinc-900 text-white min-h-screen p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Aura Gym</h1>
        <p className="text-zinc-400 text-sm">Membership CRM</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${pathname === link.href ? "bg-red-600" : "hover:bg-zinc-800"}
              `}
            >
              <Icon size={20} />

              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
