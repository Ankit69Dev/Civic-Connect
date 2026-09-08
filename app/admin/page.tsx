"use client";

import {
  AlertCircle,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  MapPin,
} from "lucide-react";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

type Issue = {
  id: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  priority: string;
  status: string;
  reporterName: string;
  reporterEmail: string;
  createdAt: string;
};

type AdminData = {
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  stats: {
    total: number;
    reported: number;
    inProgress: number;
    resolved: number;
    critical: number;
  };

  issues: Issue[];
};

const initialData: AdminData = {
  admin: {
    id: "",
    name: "Administrator",
    email: "",
    role: "admin",
  },

  stats: {
    total: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
  },

  issues: [],
};

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [data, setData] =
    useState<AdminData>(initialData);

  const [selectedIssue, setSelectedIssue] =
    useState<Issue | null>(null);

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  async function loadAdminDashboard() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/dashboard",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to load admin dashboard"
        );
      }

      setData({
        admin: {
          ...initialData.admin,
          ...(result.admin || {}),
        },

        stats: {
          ...initialData.stats,
          ...(result.stats || {}),
        },

        issues: Array.isArray(result.issues)
          ? result.issues
          : [],
      });
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      setData(initialData);
    } finally {
      setLoading(false);
    }
  }

  async function updateIssueStatus(
    issueId: string,
    status: string
  ) {
    try {
      setUpdating(true);

      const response = await fetch(
        "/api/admin/issues/status",
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            issueId,
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to update issue"
        );
      }

      await loadAdminDashboard();

      if (selectedIssue?.id === issueId) {
        setSelectedIssue(null);
      }
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update issue"
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleSignOut() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  const adminName =
    data.admin.name?.split(" ")[0] ||
    "Admin";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">

          <div>
            <h1 className="text-xl font-bold">
              CivicConnect
            </h1>

            <p className="text-xs text-slate-500">
              Admin Control Center
            </p>
          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-2 px-4 py-6">

          <AdminNavItem
            icon={<Home size={19} />}
            label="Dashboard"
            href="/admin"
            active
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <AdminNavItem
            icon={<FileText size={19} />}
            label="All Issues"
            href="/admin/issues"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <AdminNavItem
            icon={<Users size={19} />}
            label="Citizens"
            href="/admin/users"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <AdminNavItem
            icon={<BarChart3 size={19} />}
            label="Analytics"
            href="/admin/analytics"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <AdminNavItem
            icon={<Bell size={19} />}
            label="Notifications"
            href="/admin/notifications"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <AdminNavItem
            icon={<Settings size={19} />}
            label="Settings"
            href="/admin/settings"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

        </nav>

        {/* ADMIN PROFILE */}

        <div className="border-t border-slate-200 p-4">

          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {adminName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold">
                {data.admin.name ||
                  "Administrator"}
              </p>

              <p className="truncate text-xs text-slate-500">
                Administrator
              </p>

            </div>

          </div>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut size={18} />
            Sign Out
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="lg:ml-72">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="hidden w-80 items-center gap-3 rounded-xl bg-slate-100 px-4 py-2.5 md:flex">

              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Search issues..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 sm:flex">

              <ShieldCheck size={15} />

              Admin Mode

            </div>

            <button
              className="relative rounded-xl p-2.5 hover:bg-slate-100"
              aria-label="Notifications"
            >

              <Bell size={21} />

              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />

            </button>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold">
                  {data.admin.name ||
                    "Administrator"}
                </p>

                <p className="text-xs text-slate-500">
                  Admin
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {adminName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <ChevronDown
                size={17}
                className="hidden text-slate-400 sm:block"
              />

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-4 sm:p-6 lg:p-8">

          {/* WELCOME */}

          <section className="mb-8">

            <p className="mb-1 text-sm font-medium text-slate-500">
              Administration
            </p>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Good Morning, {adminName}! 👋
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Monitor civic issues and manage
              their resolution.
            </p>

          </section>

          {/* STATS */}

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

            <AdminStat
              title="Total Issues"
              value={
                loading
                  ? "..."
                  : data.stats.total.toString()
              }
              icon={
                <FileText size={21} />
              }
            />

            <AdminStat
              title="Reported"
              value={
                loading
                  ? "..."
                  : data.stats.reported.toString()
              }
              icon={
                <AlertCircle size={21} />
              }
            />

            <AdminStat
              title="In Progress"
              value={
                loading
                  ? "..."
                  : data.stats.inProgress.toString()
              }
              icon={
                <Clock size={21} />
              }
            />

            <AdminStat
              title="Resolved"
              value={
                loading
                  ? "..."
                  : data.stats.resolved.toString()
              }
              icon={
                <CheckCircle2 size={21} />
              }
            />

            <AdminStat
              title="Critical"
              value={
                loading
                  ? "..."
                  : data.stats.critical.toString()
              }
              icon={
                <AlertCircle size={21} />
              }
            />

          </section>

          {/* ISSUE MANAGEMENT */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-5 py-5 lg:flex-row lg:items-center">

              <div>

                <h3 className="font-semibold">
                  Issue Management
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Review and update citizen
                  complaints
                </p>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={
                    loadAdminDashboard
                  }
                  disabled={loading}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Refreshing..."
                    : "Refresh"}
                </button>

                <Link
                  href="/admin/issues"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  View All Issues
                </Link>

              </div>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>

                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">

                    <th className="px-5 py-4 font-medium">
                      Issue
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Citizen
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Location
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Priority
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Date
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        Loading issues...
                      </td>

                    </tr>

                  ) : data.issues.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center"
                      >

                        <FileText
                          size={32}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium">
                          No issues found
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Citizen complaints
                          will appear here.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    data.issues.map(
                      (issue) => (
                        <AdminIssueRow
                          key={issue.id}
                          issue={issue}
                          onView={() =>
                            setSelectedIssue(
                              issue
                            )
                          }
                          onResolve={() =>
                            updateIssueStatus(
                              issue.id,
                              "resolved"
                            )
                          }
                        />
                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>

          {/* FOOTER */}

          <footer className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-400">
            © 2026 CivicConnect · Team SparkByte
          </footer>

        </div>

      </main>

      {/* ISSUE DETAILS MODAL */}

      {selectedIssue && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setSelectedIssue(null)
          }
        >

          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Issue Details
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {selectedIssue.title}
                </h3>

              </div>

              <button
                onClick={() =>
                  setSelectedIssue(null)
                }
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close issue details"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-6">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <DetailItem
                  label="Citizen"
                  value={
                    selectedIssue.reporterName
                  }
                />

                <DetailItem
                  label="Email"
                  value={
                    selectedIssue.reporterEmail
                  }
                />

                <DetailItem
                  label="Category"
                  value={
                    selectedIssue.category
                  }
                />

                <DetailItem
                  label="Location"
                  value={
                    selectedIssue.location
                  }
                />

                <DetailItem
                  label="Priority"
                  value={
                    formatStatus(
                      selectedIssue.priority
                    )
                  }
                />

                <DetailItem
                  label="Status"
                  value={formatStatus(
                    selectedIssue.status
                  )}
                />

              </div>

              {selectedIssue.description && (

                <div>

                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Description
                  </p>

                  <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {selectedIssue.description}
                  </p>

                </div>

              )}

              {/* ACTIONS */}

              <div className="border-t border-slate-200 pt-5">

                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Update Status
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                  <StatusButton
                    label="Reported"
                    onClick={() =>
                      updateIssueStatus(
                        selectedIssue.id,
                        "reported"
                      )
                    }
                    disabled={updating}
                  />

                  <StatusButton
                    label="In Review"
                    onClick={() =>
                      updateIssueStatus(
                        selectedIssue.id,
                        "in_review"
                      )
                    }
                    disabled={updating}
                  />

                  <StatusButton
                    label="In Progress"
                    onClick={() =>
                      updateIssueStatus(
                        selectedIssue.id,
                        "in_progress"
                      )
                    }
                    disabled={updating}
                  />

                  <StatusButton
                    label="Resolve"
                    onClick={() =>
                      updateIssueStatus(
                        selectedIssue.id,
                        "resolved"
                      )
                    }
                    disabled={updating}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   NAV ITEM
========================================================= */

function AdminNavItem({
  icon,
  label,
  href,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

/* =========================================================
   ADMIN STAT
========================================================= */

function AdminStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   ISSUE ROW
========================================================= */

function AdminIssueRow({
  issue,
  onView,
  onResolve,
}: {
  issue: Issue;
  onView: () => void;
  onResolve: () => void;
}) {
  const resolved =
    issue.status?.toLowerCase() ===
    "resolved";

  return (
    <tr className="border-b border-slate-100 last:border-0">

      <td className="px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
            <FileText size={16} />
          </div>

          <div>

            <p className="max-w-[220px] truncate text-sm font-semibold">
              {issue.title}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              #
              {issue.id
                ? issue.id.slice(0, 8)
                : "--------"}
            </p>

          </div>

        </div>

      </td>

      <td className="px-5 py-4">

        <p className="text-sm font-medium">
          {issue.reporterName || "-"}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {issue.reporterEmail || "-"}
        </p>

      </td>

      <td className="px-5 py-4">

        <div className="flex items-center gap-1.5 text-sm text-slate-600">

          <MapPin size={14} />

          <span className="max-w-[150px] truncate">
            {issue.location ||
              "Location unavailable"}
          </span>

        </div>

      </td>

      <td className="px-5 py-4">

        <PriorityBadge
          priority={issue.priority}
        />

      </td>

      <td className="px-5 py-4">

        <StatusBadge
          status={issue.status}
        />

      </td>

      <td className="px-5 py-4 text-sm text-slate-500">

        {formatDate(issue.createdAt)}

      </td>

      <td className="px-5 py-4">

        <div className="flex items-center gap-2">

          <button
            onClick={onView}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
          >
            View
          </button>

          {!resolved && (
            <button
              onClick={onResolve}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Resolve
            </button>
          )}

        </div>

      </td>

    </tr>
  );
}

/* =========================================================
   STATUS BUTTON
========================================================= */

function StatusButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled
        ? "Updating..."
        : label}
    </button>
  );
}

/* =========================================================
   DETAIL
========================================================= */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-700">
        {value || "-"}
      </p>

    </div>
  );
}

/* =========================================================
   PRIORITY
========================================================= */

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const value =
    priority?.toLowerCase();

  let className =
    "bg-slate-100 text-slate-600";

  if (
    value === "critical" ||
    value === "high"
  ) {
    className =
      "bg-red-50 text-red-600";
  } else if (
    value === "normal"
  ) {
    className =
      "bg-yellow-50 text-yellow-700";
  } else if (
    value === "low"
  ) {
    className =
      "bg-green-50 text-green-600";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {formatStatus(
        priority
      )}
    </span>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const value =
    status?.toLowerCase();

  let className =
    "bg-slate-100 text-slate-600";

  if (
    value === "resolved"
  ) {
    className =
      "bg-green-50 text-green-600";
  } else if (
    value === "in_progress"
  ) {
    className =
      "bg-blue-50 text-blue-600";
  } else if (
    value === "reported" ||
    value === "in_review"
  ) {
    className =
      "bg-yellow-50 text-yellow-700";
  } else if (
    value === "assigned"
  ) {
    className =
      "bg-purple-50 text-purple-600";
  } else if (
    value === "rejected"
  ) {
    className =
      "bg-red-50 text-red-600";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatStatus(
  status: string
) {
  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(
  date: string
) {
  if (!date) {
    return "-";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}