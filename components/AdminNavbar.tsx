"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  Sprout,
  Users,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "All Issues",
    href: "/admin/issues",
    icon: ClipboardList,
  },
  {
    label: "Citizens",
    href: "/admin/citizens",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

function AdminNavItem({
  label,
  href,
  icon: Icon,
  onNavigate,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active =
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export default function AdminNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-100">
            <Sprout className="h-5 w-5 text-green-600" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-slate-900">
              CivicConnect
            </span>
            <span className="block text-[10px] text-slate-400">
              Admin Portal
            </span>
          </span>
        </Link>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col p-5">
          <Link href="/admin" className="mb-8 flex items-center gap-3 px-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-100">
              <Sprout className="h-6 w-6 text-green-600" />
            </span>

            <span className="leading-tight">
              <span className="block text-lg font-bold text-slate-900">
                CivicConnect
              </span>
              <span className="block text-xs font-medium text-slate-400">
                Admin Portal
              </span>
            </span>
          </Link>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => (
              <AdminNavItem
                key={item.href}
                {...item}
              />
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700">
              CivicConnect Admin
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Manage citizen complaints and monitor civic services.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          />

          <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white shadow-xl lg:hidden">
            <div className="flex h-full flex-col p-5">
              <div className="mb-8 flex items-center justify-between">
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-100">
                    <Sprout className="h-5 w-5 text-green-600" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-base font-bold text-slate-900">
                      CivicConnect
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Admin Portal
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {NAV_ITEMS.map((item) => (
                  <AdminNavItem
                    key={item.href}
                    {...item}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
