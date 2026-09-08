"use client";

import {
  Bell,
  ChevronDown,
  CheckCircle2,
  Clock,
  FileText,
  Map,
  MapPin,
  MessageSquare,
  Search,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";

import CitizenSidebar from "@/components/SideBar";

const CommunityMap = dynamic(
  () => import("@/app/dashboard/CommunityMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center bg-slate-100">
        <div className="text-center">
          <Map size={32} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            Loading map...
          </p>
        </div>
      </div>
    ),
  }
);

type Complaint = {
  id: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  priority: string;
  status: string;
  createdAt: string;
  resolvedAt?: string | null;
};

type MapIssue = {
  id: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  latitude: number;
  longitude: number;
  priority: string;
  status: string;
  createdAt: string;
};

type DashboardData = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  stats: {
    complaints: number;
    supported: number;
    resolved: number;
    averageResolutionTime: string;
  };
  complaints: Complaint[];
  mapIssues: MapIssue[];
};

const defaultData: DashboardData = {
  user: {
    id: "",
    name: "Citizen",
    email: "",
    role: "citizen",
  },
  stats: {
    complaints: 0,
    supported: 0,
    resolved: 0,
    averageResolutionTime: "0 days",
  },
  complaints: [],
  mapIssues: [],
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>(defaultData);

  const [locationName, setLocationName] = useState("Detecting location...");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDashboard();
    detectLocation();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await fetch("/api/dashboard", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load dashboard");
      }

      setData({
        ...defaultData,
        ...result,
        user: {
          ...defaultData.user,
          ...(result.user || {}),
        },
        stats: {
          ...defaultData.stats,
          ...(result.stats || {}),
        },
        complaints: Array.isArray(result.complaints)
          ? result.complaints
          : [],
        mapIssues: Array.isArray(result.mapIssues)
          ? result.mapIssues
          : [],
      });
    } catch (error) {
      console.error("Dashboard loading error:", error);
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocationName("Location unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const result = await response.json();

          const address = result.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "";

          const state = address.state || "";

          if (city && state) {
            setLocationName(`${city}, ${state}`);
          } else if (city) {
            setLocationName(city);
          } else {
            setLocationName("Current location");
          }
        } catch (error) {
          console.error("Location reverse geocoding error:", error);
          setLocationName("Current location");
        }
      },
      () => {
        setLocationName("Location unavailable");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  const filteredComplaints = data.complaints.filter((complaint) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      complaint.title.toLowerCase().includes(query) ||
      complaint.category.toLowerCase().includes(query) ||
      complaint.location.toLowerCase().includes(query) ||
      complaint.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Reusable sidebar */}
      <CitizenSidebar />

      {/* Main content */}
      <main className="min-h-screen lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* Mobile spacing for sidebar menu */}
            <div className="flex min-w-0 flex-1 items-center gap-3 pl-12 lg:pl-0">
              <div className="relative hidden w-full max-w-md sm:block">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your complaints..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="hidden items-center gap-2 text-sm text-slate-600 md:flex">
                <MapPin size={17} className="text-slate-500" />
                <span className="max-w-[220px] truncate">
                  {locationName}
                </span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.push("/dashboard/notifications")}
                className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell size={20} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <div className="hidden h-8 w-px bg-slate-200 sm:block" />

              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {data.user.name?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="max-w-[130px] truncate text-sm font-semibold text-slate-900">
                    {data.user.name || "Citizen"}
                  </p>

                  <p className="text-xs capitalize text-slate-500">
                    {data.user.role || "citizen"}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className="hidden text-slate-400 sm:block"
                />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Banner */}
          <section className="relative mb-6 overflow-hidden rounded-2xl bg-slate-900">
            <img
              src="/dashboard-banner.png"
              alt="CivicConnect"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/30" />

            <div className="relative px-6 py-10 sm:px-8 lg:px-10">
              <p className="mb-2 text-sm font-medium text-slate-300">
                Citizen Dashboard
              </p>

              <h1 className="max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Welcome back, {data.user.name || "Citizen"}!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Track your civic complaints, support community issues, and
                help make your city better.
              </p>

              <button
                onClick={() => router.push("/report")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
              >
                <MessageSquare size={18} />
                Report an Issue
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardStat
              title="My Complaints"
              value={data.stats.complaints}
              icon={<FileText size={22} />}
              description="Issues reported by you"
            />

            <DashboardStat
              title="Supported"
              value={data.stats.supported}
              icon={<ThumbsUp size={22} />}
              description="Community issues supported"
            />

            <DashboardStat
              title="Resolved"
              value={data.stats.resolved}
              icon={<CheckCircle2 size={22} />}
              description="Issues successfully resolved"
            />

            <DashboardStat
              title="Avg. Resolution"
              value={data.stats.averageResolutionTime}
              icon={<Clock size={22} />}
              description="Average resolution time"
            />
          </section>

          {/* Map + impact */}
          <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
            {/* Community Map */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Community Issues
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Explore reported civic issues around the community
                  </p>
                </div>

                <button
                  onClick={() => router.push("/map")}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <Map size={15} />
                  View Map
                </button>
              </div>

              <CommunityMap issues={data.mapIssues} />
            </div>

            {/* Your Impact */}
            <div className="rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-bold text-slate-900">
                  Your Impact
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your contribution to the community
                </p>
              </div>

              <div className="space-y-5 p-5">
                <ImpactRow
                  icon={<FileText size={18} />}
                  label="Issues Reported"
                  value={data.stats.complaints}
                />

                <ImpactRow
                  icon={<ThumbsUp size={18} />}
                  label="Issues Supported"
                  value={data.stats.supported}
                />

                <ImpactRow
                  icon={<CheckCircle2 size={18} />}
                  label="Issues Resolved"
                  value={data.stats.resolved}
                />

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Keep making an impact
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Every report helps improve your community.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Latest complaints */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Latest Complaints
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  All issues you have reported
                </p>
              </div>

              <button
                onClick={() => router.push("/dashboard/complaints")}
                className="self-start rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 sm:self-auto"
              >
                View All
              </button>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

                  <p className="mt-3 text-sm text-slate-500">
                    Loading complaints...
                  </p>
                </div>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <FileText size={22} className="text-slate-500" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No complaints found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  {search
                    ? "Try a different search term."
                    : "You have not reported any civic issues yet."}
                </p>

                {!search && (
                  <button
                    onClick={() => router.push("/report")}
                    className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Report Your First Issue
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Complaint
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Category
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Location
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Priority
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredComplaints.map((complaint) => (
                        <ComplaintTableRow
                          key={complaint.id}
                          complaint={complaint}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile list */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {filteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {complaint.title}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {complaint.category}
                          </p>
                        </div>

                        <PriorityBadge
                          priority={complaint.priority}
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={14} />

                        <span className="truncate">
                          {complaint.location}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <StatusBadge status={complaint.status} />

                        <span className="text-xs text-slate-400">
                          {formatDate(complaint.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Footer */}
          <footer className="py-8 text-center">
            <p className="text-xs text-slate-400">
              CivicConnect • Team SparkByte
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Building better communities together.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------
   Dashboard Stat
------------------------------------------------------- */

function DashboardStat({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------
   Impact Row
------------------------------------------------------- */

function ImpactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      </div>

      <span className="text-lg font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------
   Complaint Table Row
------------------------------------------------------- */

function ComplaintTableRow({
  complaint,
}: {
  complaint: Complaint;
}) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">
      <td className="px-5 py-4">
        <div className="max-w-[250px]">
          <p className="truncate text-sm font-semibold text-slate-900">
            {complaint.title}
          </p>

          {complaint.description && (
            <p className="mt-1 truncate text-xs text-slate-500">
              {complaint.description}
            </p>
          )}
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm text-slate-600">
          {complaint.category}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex max-w-[220px] items-center gap-2">
          <MapPin
            size={15}
            className="shrink-0 text-slate-400"
          />

          <span className="truncate text-sm text-slate-600">
            {complaint.location}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <PriorityBadge priority={complaint.priority} />
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={complaint.status} />
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
        {formatDate(complaint.createdAt)}
      </td>
    </tr>
  );
}

/* -------------------------------------------------------
   Priority Badge
------------------------------------------------------- */

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const normalized = priority?.toLowerCase();

  const styles: Record<string, string> = {
    low: "bg-slate-100 text-slate-600",
    normal: "bg-blue-50 text-blue-700",
    high: "bg-orange-50 text-orange-700",
    critical: "bg-red-50 text-red-700",
  };

  const label =
    normalized === "normal"
      ? "Normal"
      : normalized
        ? normalized.charAt(0).toUpperCase() +
          normalized.slice(1)
        : "Normal";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[normalized] || styles.normal
      }`}
    >
      {label}
    </span>
  );
}

/* -------------------------------------------------------
   Status Badge
------------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status?.toLowerCase();

  const styles: Record<string, string> = {
    reported: "bg-slate-100 text-slate-700",
    in_review: "bg-blue-50 text-blue-700",
    assigned: "bg-purple-50 text-purple-700",
    in_progress: "bg-amber-50 text-amber-700",
    resolved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[normalized] || "bg-slate-100 text-slate-700"
      }`}
    >
      {normalized === "resolved" ? (
        <CheckCircle2 size={13} />
      ) : normalized === "rejected" ? (
        <AlertCircle size={13} />
      ) : (
        <Clock size={13} />
      )}

      {formatStatus(status)}
    </span>
  );
}

/* -------------------------------------------------------
   Format Status
------------------------------------------------------- */

function formatStatus(status: string) {
  if (!status) return "Reported";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* -------------------------------------------------------
   Format Date
------------------------------------------------------- */

function formatDate(date: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}