"use client";

import {
  Bell,
  ChevronDown,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  Map,
  MapPin,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ThumbsUp,
  User,
  X,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";


// =========================================================
// LEAFLET MAP
//
// Dynamic import is important because Leaflet needs the browser.
// =========================================================

const CommunityMap = dynamic(
  () => import("@/app/dashboard/CommunityMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center bg-slate-100">
        <div className="text-center">
          <Map
            size={32}
            className="mx-auto text-slate-400"
          />

          <p className="mt-3 text-sm font-medium text-slate-600">
            Loading map...
          </p>
        </div>
      </div>
    ),
  }
);


// =========================================================
// TYPES
// =========================================================

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


// =========================================================
// DEFAULT DATA
// =========================================================

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


// =========================================================
// DASHBOARD
// =========================================================

export default function DashboardPage() {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<DashboardData>(defaultData);

  // User's browser location
  const [userLocation, setUserLocation] =
    useState<{
      latitude: number;
      longitude: number;
    } | null>(null);

  const [locationName, setLocationName] =
    useState("Your Location");


  // =======================================================
  // LOAD DASHBOARD
  // =======================================================

  useEffect(() => {
    loadDashboard();
    detectLocation();
  }, []);


  async function loadDashboard() {

    try {

      setLoading(true);

      const response =
        await fetch("/api/dashboard", {
          method: "GET",
          cache: "no-store",
        });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
          "Failed to load dashboard"
        );
      }

      setData(result);

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

    } finally {

      setLoading(false);

    }
  }


  // =======================================================
  // DETECT USER LOCATION
  // =======================================================

  function detectLocation() {

    if (!navigator.geolocation) {

      setLocationName(
        "Location unavailable"
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;


        setUserLocation({
          latitude,
          longitude,
        });


        // Try reverse geocoding
        try {

          const response =
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

          if (!response.ok) {
            return;
          }

          const result =
            await response.json();

          const address =
            result?.address;

          const city =
            address?.city ||
            address?.town ||
            address?.village ||
            address?.municipality;

          const state =
            address?.state;

          if (city && state) {

            setLocationName(
              `${city}, ${state}`
            );

          } else if (city) {

            setLocationName(city);

          } else {

            setLocationName(
              "Your Location"
            );

          }

        } catch {

          setLocationName(
            "Your Location"
          );

        }

      },

      () => {

        setLocationName(
          "Location permission denied"
        );

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }


  const firstName =
    data.user.name
      ?.split(" ")[0] ||
    "Citizen";
    const router = useRouter();


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">


      {/* ===================================================
          MOBILE OVERLAY
      =================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* ===================================================
          SIDEBAR
      =================================================== */}

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
              Team SparkByte
            </p>

          </div>


          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>

        </div>


        {/* NAVIGATION */}

        <nav className="flex-1 space-y-2 px-4 py-6">

          <SidebarItem
            icon={<Home size={19} />}
            label="Home"
            href="/dashboard"
            active
          />

          <SidebarItem
            icon={<Plus size={19} />}
            label="Report Issue"
            href="/report"
          />

          <SidebarItem
            icon={<Map size={19} />}
            label="Explore Map"
            href="/map"
          />

          <SidebarItem
            icon={<FileText size={19} />}
            label="My Complaints"
            href="/dashboard/complaints"
          />

          <SidebarItem
            icon={<Bell size={19} />}
            label="Notifications"
            href="/dashboard/notifications"
          />

          <SidebarItem
            icon={<User size={19} />}
            label="Profile"
            href="/profile"
          />

        </nav>


        {/* SETTINGS */}

        <div className="border-t border-slate-200 p-4">

          <SidebarItem
            icon={<Settings size={19} />}
            label="Settings"
            href="/settings"
          />

        </div>

      </aside>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="lg:ml-72">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">


          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>


            {/* SEARCH */}

            <div className="hidden w-72 items-center gap-3 rounded-xl bg-slate-100 px-4 py-2.5 md:flex">

              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Search complaints..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="flex items-center gap-4">


            {/* LOCATION */}

            <div className="hidden items-center gap-2 text-sm text-slate-600 sm:flex">

              <MapPin size={17} />

              <span>
                {locationName}
              </span>

            </div>


            {/* NOTIFICATION */}

            <button className="relative rounded-xl p-2.5 hover:bg-slate-100">

              <Bell size={21} />

              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />

            </button>


            {/* USER */}

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold">
                  {data.user.name ||
                    "Citizen"}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {data.user.role ||
                    "Citizen"}
                </p>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">

                {firstName
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


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-4 sm:p-6 lg:p-8">


          {/* =================================================
              WELCOME
          ================================================= */}

         { /* Dashboard Content */}
<div className="space-y-6">

  {/* Banner */}
  <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
    <img
      src="/dashboard-banner.png"
      alt="CivicConnect city banner"
      className="h-[280px] w-full object-cover"
    />
  </div>

  {/* Welcome Section */}
  <div className="flex items-start justify-between gap-6">
    <div>
      <p className="text-sm font-medium text-blue-600">
        Citizen Dashboard
      </p>

      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
        Good Morning, {data.user.name}! 👋
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Track your complaints and see the impact you're making in your community.
      </p>
    </div>

    <button
      onClick={() => router.push("/report")}
      className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
    >
      <Plus className="h-4 w-4" />
      Report an Issue
    </button>
  </div>
</div>

          {/* =================================================
              STATS
          ================================================= */}

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <DashboardStat
              title="My Complaints"
              value={
                loading
                  ? "..."
                  : String(
                      data.stats.complaints
                    )
              }
              subtitle="Issues reported by you"
              icon={
                <FileText size={22} />
              }
            />


            <DashboardStat
              title="Issues Supported"
              value={
                loading
                  ? "..."
                  : String(
                      data.stats.supported
                    )
              }
              subtitle="Community issues you supported"
              icon={
                <ThumbsUp size={22} />
              }
            />


            <DashboardStat
              title="Resolved Issues"
              value={
                loading
                  ? "..."
                  : String(
                      data.stats.resolved
                    )
              }
              subtitle="Your complaints resolved"
              icon={
                <CheckCircle2 size={22} />
              }
            />


            <DashboardStat
              title="Avg. Resolution Time"
              value={
                loading
                  ? "..."
                  : data.stats
                      .averageResolutionTime
              }
              subtitle="Average time to resolve"
              icon={
                <Clock size={22} />
              }
            />

          </section>


          {/* =================================================
              MAP + IMPACT
          ================================================= */}

          <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">


            {/* =================================================
                REAL LEAFLET MAP
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">


              {/* MAP HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div>

                  <h3 className="font-semibold">
                    Community Issues
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Live civic issues reported around you
                  </p>

                </div>


                <a
                  href="/map"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  View Full Map
                </a>

              </div>


              {/* LEAFLET */}

              <CommunityMap
                issues={data.mapIssues}
                userLocation={userLocation}
              />

            </div>


            {/* =================================================
                YOUR IMPACT
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h3 className="font-semibold">
                  Your Impact
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Your contribution to the community
                </p>

              </div>


              <div className="flex flex-col items-center justify-center py-6">


                <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-slate-200">

                  <div className="text-center">

                    <p className="text-3xl font-bold">
                      {loading
                        ? "..."
                        : data.stats
                            .supported}
                    </p>

                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                      Supports
                    </p>

                  </div>

                </div>


                <p className="mt-5 text-center text-sm font-medium">
                  Every report and support helps improve your city.
                </p>


                <div className="mt-6 w-full space-y-3">

                  <ImpactRow
                    icon={
                      <FileText size={16} />
                    }
                    label="Complaints"
                    value={
                      data.stats.complaints
                    }
                  />

                  <ImpactRow
                    icon={
                      <ThumbsUp size={16} />
                    }
                    label="Supported"
                    value={
                      data.stats.supported
                    }
                  />

                  <ImpactRow
                    icon={
                      <CheckCircle2 size={16} />
                    }
                    label="Resolved"
                    value={
                      data.stats.resolved
                    }
                  />

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              LATEST COMPLAINTS
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">


            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center">

              <div>

                <h3 className="font-semibold">
                  Latest Complaints
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Recent issues reported by you
                </p>

              </div>


              <a
                href="/dashboard/complaints"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                View All
              </a>

            </div>


            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">

                    <th className="px-5 py-4 font-medium">
                      Complaint
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Category
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

                  </tr>

                </thead>


                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        Loading complaints...
                      </td>

                    </tr>

                  ) : data.complaints.length === 0 ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center"
                      >

                        <FileText
                          size={32}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium">
                          No complaints yet
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Report your first civic issue.
                        </p>

                        <a
                          href="/report"
                          className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                        >
                          Report Issue
                        </a>

                      </td>

                    </tr>

                  ) : (

                    data.complaints.map(
                      (complaint) => (
                        <ComplaintTableRow
                          key={complaint.id}
                          complaint={
                            complaint
                          }
                        />
                      )
                    )

                  )}

                </tbody>

              </table>

            </div>


            {/* MOBILE */}

            <div className="space-y-3 p-4 md:hidden">

              {loading ? (

                <div className="py-8 text-center text-sm text-slate-500">
                  Loading complaints...
                </div>

              ) : data.complaints.length === 0 ? (

                <div className="py-8 text-center">

                  <FileText
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-medium">
                    No complaints yet
                  </p>

                </div>

              ) : (

                data.complaints.map(
                  (complaint) => (

                    <div
                      key={complaint.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="font-semibold">
                            {complaint.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {complaint.category}
                          </p>

                        </div>

                        <StatusBadge
                          status={
                            complaint.status
                          }
                        />

                      </div>


                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

                        <MapPin size={14} />

                        {complaint.location}

                      </div>


                      <div className="mt-3 flex items-center justify-between">

                        <PriorityBadge
                          priority={
                            complaint.priority
                          }
                        />

                        <span className="text-xs text-slate-400">
                          {formatDate(
                            complaint.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>


          {/* FOOTER */}

          <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row">

            <p>
              © 2026 CivicConnect · Team SparkByte
            </p>

            <div className="flex gap-5">

              <a
                href="#"
                className="hover:text-slate-600"
              >
                Help
              </a>

              <a
                href="#"
                className="hover:text-slate-600"
              >
                Privacy
              </a>

              <a
                href="#"
                className="hover:text-slate-600"
              >
                Terms
              </a>

            </div>

          </footer>

        </div>

      </main>

    </div>
  );
}


// =========================================================
// SIDEBAR ITEM
// =========================================================

function SidebarItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {

  return (

    <a
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >

      {icon}

      <span>
        {label}
      </span>

    </a>

  );
}


// =========================================================
// STAT CARD
// =========================================================

function DashboardStat({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">

          {icon}

        </div>

      </div>

      <p className="mt-3 text-xs text-slate-400">
        {subtitle}
      </p>

    </div>

  );
}


// =========================================================
// IMPACT ROW
// =========================================================

function ImpactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {

  return (

    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

      <div className="flex items-center gap-3">

        <div className="text-slate-500">
          {icon}
        </div>

        <span className="text-sm text-slate-600">
          {label}
        </span>

      </div>

      <span className="text-sm font-bold">
        {value}
      </span>

    </div>

  );
}


// =========================================================
// COMPLAINT TABLE ROW
// =========================================================

function ComplaintTableRow({
  complaint,
}: {
  complaint: Complaint;
}) {

  return (

    <tr className="border-b border-slate-100 last:border-0">


      <td className="px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">

            <MessageSquare size={17} />

          </div>

          <div>

            <p className="max-w-[230px] truncate text-sm font-semibold">
              {complaint.title}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              #{complaint.id.slice(0, 8)}
            </p>

          </div>

        </div>

      </td>


      <td className="px-5 py-4 text-sm text-slate-600">

        {complaint.category}

      </td>


      <td className="px-5 py-4">

        <div className="flex items-center gap-1.5 text-sm text-slate-600">

          <MapPin size={14} />

          <span className="max-w-[180px] truncate">
            {complaint.location}
          </span>

        </div>

      </td>


      <td className="px-5 py-4">

        <PriorityBadge
          priority={
            complaint.priority
          }
        />

      </td>


      <td className="px-5 py-4">

        <StatusBadge
          status={
            complaint.status
          }
        />

      </td>


      <td className="px-5 py-4 text-sm text-slate-500">

        {formatDate(
          complaint.createdAt
        )}

      </td>

    </tr>

  );
}


// =========================================================
// PRIORITY BADGE
// =========================================================

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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {formatStatus(priority)}
    </span>

  );
}


// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
  status,
}: {
  status: string;
}) {

  const value =
    status?.toLowerCase();


  let className =
    "bg-slate-100 text-slate-600";


  let icon =
    <AlertCircle size={12} />;


  if (
    value === "resolved"
  ) {

    className =
      "bg-green-50 text-green-600";

    icon =
      <CheckCircle2 size={12} />;

  } else if (
    value === "in_progress"
  ) {

    className =
      "bg-blue-50 text-blue-600";

    icon =
      <Clock size={12} />;

  } else if (
    value === "reported" ||
    value === "in_review"
  ) {

    className =
      "bg-yellow-50 text-yellow-700";

  }


  return (

    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >

      {icon}

      {formatStatus(status)}

    </span>

  );
}


// =========================================================
// FORMAT STATUS
// =========================================================

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


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(
  date: string
) {

  if (!date) {
    return "-";
  }

  try {

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  } catch {

    return "-";

  }

}