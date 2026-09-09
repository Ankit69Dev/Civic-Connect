"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import CitizenSidebar from "@/components/SideBar";

const CommunityMap = dynamic(
  () => import("@/app/dashboard/CommunityMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[500px] items-center justify-center bg-slate-100">
        <div className="text-center">
          <MapPin size={32} className="mx-auto text-slate-400" />

          <p className="mt-3 text-sm font-medium text-slate-600">
            Loading map...
          </p>
        </div>
      </div>
    ),
  }
);

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

export default function ExploreMapPage() {
  const router = useRouter();

  const [issues, setIssues] = useState<MapIssue[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [selectedIssue, setSelectedIssue] =
    useState<MapIssue | null>(null);

  useEffect(() => {
    loadIssues();
  }, []);

  async function loadIssues() {
    try {
      setLoading(true);

      const response = await fetch("/api/dashboard");

      if (!response.ok) {
        throw new Error("Failed to load map issues");
      }

      const result = await response.json();

      setIssues(result.mapIssues || []);
    } catch (error) {
      console.error("Explore Map Error:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        issues
          .map((issue) => issue.category)
          .filter(Boolean)
      )
    );
  }, [issues]);

  const filteredIssues = useMemo(() => {
    const query = search.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesSearch =
        !query ||
        issue.title.toLowerCase().includes(query) ||
        issue.description?.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        issue.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        issue.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    issues,
    search,
    statusFilter,
    categoryFilter,
  ]);

  function formatStatus(status: string) {
    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function priorityClass(priority: string) {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700";

      case "high":
        return "bg-orange-100 text-orange-700";

      case "normal":
        return "bg-blue-100 text-blue-700";

      case "low":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  function statusClass(status: string) {
    switch (status) {
      case "resolved":
        return "bg-emerald-100 text-emerald-700";

      case "in_progress":
        return "bg-blue-100 text-blue-700";

      case "assigned":
        return "bg-purple-100 text-purple-700";

      case "in_review":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* EXISTING CITIZEN SIDEBAR */}
      <CitizenSidebar />

      {/* PAGE CONTENT */}
      <main className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-950">
                Explore Map
              </h1>

              <p className="text-xs text-slate-500">
                Discover civic issues in your community
              </p>
            </div>

            <div className="ml-auto rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {filteredIssues.length} Issues
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Search + Filters */}
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search issues, locations, categories..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="reported">
                  Reported
                </option>

                <option value="in_review">
                  In Review
                </option>

                <option value="assigned">
                  Assigned
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="resolved">
                  Resolved
                </option>

                <option value="rejected">
                  Rejected
                </option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* MAP + ISSUE LIST */}
          <div className="grid min-h-[calc(100vh-220px)] gap-5 lg:grid-cols-[1fr_380px]">
            {/* MAP */}
            <div className="relative min-h-[550px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {loading ? (
                <div className="flex h-full min-h-[550px] items-center justify-center">
                  <div className="text-center">
                    <MapPin
                      size={38}
                      className="mx-auto animate-pulse text-slate-400"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Loading community map...
                    </p>
                  </div>
                </div>
              ) : (
                <CommunityMap
                  issues={filteredIssues}
                />
              )}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
                <p className="mb-3 text-xs font-bold text-slate-800">
                  Priority
                </p>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    Critical
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-orange-500" />
                    High
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-500" />
                    Normal
                  </div>
                </div>
              </div>
            </div>

            {/* ISSUE LIST */}
            <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h2 className="font-bold text-slate-950">
                  Community Issues
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Select an issue to view details
                </p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {filteredIssues.length === 0 ? (
                  <div className="px-6 py-16 text-center">
                    <FileText
                      size={38}
                      className="mx-auto text-slate-300"
                    />

                    <h3 className="mt-4 text-sm font-semibold text-slate-700">
                      No issues found
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Try changing your search or filters.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredIssues.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() =>
                          setSelectedIssue(issue)
                        }
                        className="w-full p-4 text-left transition hover:bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-slate-900">
                              {issue.title}
                            </h3>

                            <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                              <MapPin
                                size={13}
                                className="mt-0.5 shrink-0"
                              />

                              <span className="line-clamp-2">
                                {issue.location}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${priorityClass(
                              issue.priority
                            )}`}
                          >
                            {issue.priority}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(
                              issue.status
                            )}`}
                          >
                            {formatStatus(
                              issue.status
                            )}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {formatDate(
                              issue.createdAt
                            )}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ISSUE DETAILS MODAL */}
      {selectedIssue && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setSelectedIssue(null)
          }
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div className="pr-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {selectedIssue.category}
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {selectedIssue.title}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedIssue(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-5">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {selectedIssue.description ||
                    "No description provided."}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {selectedIssue.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <AlertCircle size={16} />

                    <span className="text-xs font-semibold">
                      Priority
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold capitalize text-slate-900">
                    {selectedIssue.priority}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={16} />

                    <span className="text-xs font-semibold">
                      Status
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {formatStatus(
                      selectedIssue.status
                    )}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <CheckCircle2 size={16} />

                  <span className="text-xs font-semibold">
                    Reported
                  </span>
                </div>

                <p className="mt-2 text-sm font-medium text-slate-800">
                  {formatDate(
                    selectedIssue.createdAt
                  )}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 p-4">
              <button
                onClick={() =>
                  setSelectedIssue(null)
                }
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}