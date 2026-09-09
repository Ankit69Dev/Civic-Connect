"use client";

import { useEffect, useMemo, useState } from "react";
import CitizenSidebar from "@/components/SideBar";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  priority: "low" | "normal" | "high" | "critical";
  status:
    | "reported"
    | "in_review"
    | "assigned"
    | "in_progress"
    | "resolved"
    | "rejected";
  createdAt: string;
  resolvedAt: string | null;
  reporterName: string;
};

const statusOptions = [
  { value: "all", label: "All Complaints" },
  { value: "reported", label: "Reported" },
  { value: "in_review", label: "In Review" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
];

function getStatusLabel(status: Complaint["status"]) {
  return status.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusStyles(status: Complaint["status"]) {
  switch (status) {
    case "reported":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "in_review":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "assigned":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "in_progress":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "resolved":
      return "bg-green-50 text-green-700 border-green-200";

    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getStatusIcon(status: Complaint["status"]) {
  switch (status) {
    case "resolved":
      return <CheckCircle2 size={16} />;

    case "rejected":
      return <XCircle size={16} />;

    case "in_progress":
    case "in_review":
    case "assigned":
      return <Clock size={16} />;

    default:
      return <AlertCircle size={16} />;
  }
}

function getPriorityStyles(priority: Complaint["priority"]) {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-700";

    case "high":
      return "bg-orange-100 text-orange-700";

    case "normal":
      return "bg-blue-100 text-blue-700";

    case "low":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/complaints");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load complaints.");
        }

        setComplaints(data.complaints || []);
      } catch (err) {
        console.error("Complaints fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesStatus =
        statusFilter === "all" || complaint.status === statusFilter;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        complaint.title.toLowerCase().includes(searchText) ||
        complaint.description.toLowerCase().includes(searchText) ||
        complaint.category.toLowerCase().includes(searchText) ||
        complaint.location.toLowerCase().includes(searchText) ||
        complaint.reporterName.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [complaints, search, statusFilter]);

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "resolved"
  ).length;
  const inProgressComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "in_progress" ||
      complaint.status === "assigned"
  ).length;
  const reportedComplaints = complaints.filter(
    (complaint) => complaint.status === "reported"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <CitizenSidebar />

      <main className="lg:ml-72">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white">
          <div className="px-6 py-6 lg:px-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                All Complaints
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View and track civic complaints reported by citizens.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Complaints
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {totalComplaints}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <AlertCircle className="text-blue-600" size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Reported
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {reportedComplaints}
                  </p>
                </div>

                <div className="rounded-lg bg-yellow-50 p-3">
                  <Clock className="text-yellow-600" size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    In Progress
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {inProgressComplaints}
                  </p>
                </div>

                <div className="rounded-lg bg-orange-50 p-3">
                  <Loader2 className="text-orange-600" size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Resolved
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {resolvedComplaints}
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-3">
                  <CheckCircle2 className="text-green-600" size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search complaints, location, category or citizen..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Status Filter */}
              <div className="relative lg:w-64">
                <Filter
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">
              <div className="text-center">
                <Loader2
                  size={32}
                  className="mx-auto animate-spin text-blue-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading complaints...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <AlertCircle
                size={32}
                className="mx-auto text-red-500"
              />

              <h3 className="mt-3 font-semibold text-red-800">
                Unable to load complaints
              </h3>

              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredComplaints.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <AlertCircle
                size={40}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No complaints found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          )}

          {/* Complaints */}
          {!loading && !error && filteredComplaints.length > 0 && (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      {/* Title + Status */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-900">
                          {complaint.title}
                        </h2>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(
                            complaint.status
                          )}`}
                        >
                          {getStatusIcon(complaint.status)}
                          {getStatusLabel(complaint.status)}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getPriorityStyles(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority}
                        </span>
                      </div>

                      {/* Category */}
                      <p className="mt-2 text-sm font-medium text-blue-600">
                        {complaint.category}
                      </p>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {complaint.description}
                      </p>

                      {/* Details */}
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <User size={15} />
                          <span>
                            Reported by{" "}
                            <span className="font-medium text-slate-700">
                              {complaint.reporterName}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin size={15} />
                          <span>{complaint.location}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Calendar size={15} />
                          <span>
                            {new Date(
                              complaint.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Result count */}
          {!loading && !error && complaints.length > 0 && (
            <p className="mt-5 text-center text-xs text-slate-400">
              Showing {filteredComplaints.length} of {complaints.length}{" "}
              complaints
            </p>
          )}
        </div>
      </main>
    </div>
  );
}