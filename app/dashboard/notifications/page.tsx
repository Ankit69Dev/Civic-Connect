"use client";

import { useEffect, useState } from "react";
import CitizenSidebar from "@/components/SideBar";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Loader2,
  Check,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "issue" | "status" | "system" | "success";
  read: boolean;
  createdAt: string;
};

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "success":
      return (
        <div className="rounded-full bg-emerald-100 p-3">
          <CheckCircle2 size={20} className="text-emerald-600" />
        </div>
      );

    case "status":
      return (
        <div className="rounded-full bg-blue-100 p-3">
          <Clock size={20} className="text-blue-600" />
        </div>
      );

    case "issue":
      return (
        <div className="rounded-full bg-orange-100 p-3">
          <FileText size={20} className="text-orange-600" />
        </div>
      );

    default:
      return (
        <div className="rounded-full bg-slate-100 p-3">
          <Bell size={20} className="text-slate-600" />
        </div>
      );
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/notifications");

      if (!response.ok) {
        throw new Error("Failed to load notifications.");
      }

      const data = await response.json();

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Notifications Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark notification error:", error);
    }
  }

  async function markAllAsRead() {
    try {
      await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Mark all notifications error:", error);
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Existing Citizen Sidebar */}
      <CitizenSidebar />

      {/* Page Content */}
      <main className="lg:ml-72">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-6 py-6 lg:px-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-950">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Stay updated about your civic complaints and community issues.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Check size={16} />
                Mark all as read
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {/* Loading */}
            {loading && (
              <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <div className="text-center">
                  <Loader2
                    size={32}
                    className="mx-auto animate-spin text-blue-600"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    Loading notifications...
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                <AlertCircle
                  size={36}
                  className="mx-auto text-red-500"
                />

                <h2 className="mt-3 font-semibold text-red-800">
                  Unable to load notifications
                </h2>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

                <button
                  onClick={loadNotifications}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              notifications.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <Bell
                      size={30}
                      className="text-slate-400"
                    />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-slate-900">
                    No notifications yet
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                    You will see updates about your complaints,
                    issue assignments, and resolutions here.
                  </p>
                </div>
              )}

            {/* Notification List */}
            {!loading &&
              !error &&
              notifications.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() =>
                        !notification.read &&
                        markAsRead(notification.id)
                      }
                      className={`flex gap-4 border-b border-slate-100 p-5 transition last:border-b-0 ${
                        !notification.read
                          ? "bg-blue-50/40 hover:bg-blue-50"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      {/* Icon */}
                      <div className="shrink-0">
                        {getNotificationIcon(
                          notification.type
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2
                              className={`text-sm ${
                                !notification.read
                                  ? "font-bold text-slate-950"
                                  : "font-semibold text-slate-800"
                              }`}
                            >
                              {notification.title}
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {notification.message}
                            </p>
                          </div>

                          {!notification.read && (
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}