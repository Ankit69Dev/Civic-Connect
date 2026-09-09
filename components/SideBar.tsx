"use client";

import {
  Bell,
  FileText,
  Home,
  Map,
  Menu,
  Plus,
  Settings,
  User,
  X,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CitizenSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigation = [
    {
      icon: <Home size={19} />,
      label: "Home",
      href: "/dashboard",
    },
    {
      icon: <Plus size={19} />,
      label: "Report Issue",
      href: "/report",
    },
    {
      icon: <Map size={19} />,
      label: "Explore Map",
      href: "/map",
    },
    {
      icon: <FileText size={19} />,
      label: "Complaints",
      href: "/dashboard/complaints",
    },
    {
      icon: <Bell size={19} />,
      label: "Notifications",
      href: "/dashboard/notifications",
    },
    {
      icon: <User size={19} />,
      label: "Profile",
      href: "/profile",
    },
  ];

  // =================================================
  // LOAD UNREAD NOTIFICATION COUNT
  // =================================================

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await fetch(
          "/api/notifications/unread-count",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUnreadCount(data.unreadCount ?? 0);
      } catch (error) {
        console.error(
          "Failed to load unread notification count:",
          error
        );
      }
    };

    loadUnreadCount();

    // Check for new notifications every 5 seconds
    const interval = setInterval(loadUnreadCount, 5000);

    return () => clearInterval(interval);
  }, []);

  function handleNavigation(href: string) {
    setSidebarOpen(false);
    router.push(href);
  }

  return (
    <>
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =================================================
          MOBILE MENU BUTTON
      ================================================= */}

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-5 z-30 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="text-left"
          >
            <h1 className="text-xl font-bold text-slate-950">
              CivicConnect
            </h1>

            <p className="text-xs text-slate-500">
              Team SparkByte
            </p>
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" &&
                pathname === "/dashboard");

            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.icon}

                <span>{item.label}</span>

                {/* =================================================
                    UNREAD NOTIFICATION BADGE
                ================================================= */}

                {item.label === "Notifications" &&
                  unreadCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        {/* =================================================
            SETTINGS
        ================================================= */}

        <div className="border-t border-slate-200 p-4">
          <button
            onClick={() => handleNavigation("/settings")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
              pathname === "/settings"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Settings size={19} />

            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}