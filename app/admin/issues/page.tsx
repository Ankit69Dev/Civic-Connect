"use client";

import { useEffect, useMemo, useState } from "react";
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
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
  RefreshCw,
} from "lucide-react";

type Issue = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  priority: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
  reporterName: string;
  assignedOfficerId?: string | null;
  assignedOfficerName?: string | null;
};

type Officer = {
  id: string;
  name: string;
  email: string;
};

type Verification = {
  total: number;
  confirmed: number;
  disputed: number;
  confidence: number;
};

const STATUS_OPTIONS = [
  "all",
  "reported",
  "in_review",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
];

const PRIORITY_OPTIONS = [
  "all",
  "low",
  "normal",
  "high",
  "critical",
];

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [updatingIssue, setUpdatingIssue] = useState<string | null>(null);
  const [assigningIssue, setAssigningIssue] = useState<string | null>(null);

  const [verificationData, setVerificationData] = useState<
    Record<string, Verification>
  >({});

  async function loadIssues(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch("/api/complaints", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await response.json();

      setIssues(data.complaints ?? data.issues ?? []);
    } catch (error) {
      console.error("Admin issues loading error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function loadOfficers() {
    try {
      /*
       * If you already have an officer API, change only this URL.
       * Expected response:
       * { officers: [{ id, name, email }] }
       */
      const response = await fetch("/api/admin/officers", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setOfficers(data.officers ?? []);
    } catch (error) {
      console.error("Officer loading error:", error);
    }
  }

  async function loadVerification(issueId: string) {
    try {
      const response = await fetch(
        `/api/issues/${issueId}/verify`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setVerificationData((previous) => ({
        ...previous,
        [issueId]: data.stats,
      }));
    } catch (error) {
      console.error("Verification loading error:", error);
    }
  }

  useEffect(() => {
    loadIssues();
    loadOfficers();
  }, []);

  useEffect(() => {
    issues.forEach((issue) => {
      loadVerification(issue.id);
    });
  }, [issues]);

  const filteredIssues = useMemo(() => {
    const query = search.toLowerCase().trim();

    return issues.filter((issue) => {
      const matchesSearch =
        !query ||
        issue.title.toLowerCase().includes(query) ||
        (issue.description ?? "").toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query) ||
        issue.reporterName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        issue.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        issue.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    issues,
    search,
    statusFilter,
    priorityFilter,
  ]);

  const stats = useMemo(() => {
    return {
      total: issues.length,
      reported: issues.filter(
        (issue) => issue.status === "reported"
      ).length,
      inProgress: issues.filter(
        (issue) => issue.status === "in_progress"
      ).length,
      resolved: issues.filter(
        (issue) => issue.status === "resolved"
      ).length,
      critical: issues.filter(
        (issue) => issue.priority === "critical"
      ).length,
    };
  }, [issues]);

  async function updateStatus(
    issueId: string,
    status: string
  ) {
    try {
      setUpdatingIssue(issueId);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update status"
        );
      }

      setIssues((previous) =>
        previous.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                status,
                resolvedAt:
                  status === "resolved"
                    ? new Date().toISOString()
                    : null,
              }
            : issue
        )
      );
    } catch (error) {
      console.error("Status update error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update issue status."
      );
    } finally {
      setUpdatingIssue(null);
    }
  }

  async function assignOfficer(
    issueId: string,
    officerId: string
  ) {
    if (!officerId) return;

    try {
      setAssigningIssue(issueId);

      const response = await fetch(
        "/api/admin/issues/assign",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issueId,
            officerId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to assign officer"
        );
      }

      const officer = officers.find(
        (item) => item.id === officerId
      );

      setIssues((previous) =>
        previous.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                assignedOfficerId: officerId,
                assignedOfficerName:
                  officer?.name ?? "Assigned Officer",
                status: "assigned",
              }
            : issue
        )
      );
    } catch (error) {
      console.error("Officer assignment error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to assign officer."
      );
    } finally {
      setAssigningIssue(null);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "resolved":
        return (
          <CheckCircle2 className="h-4 w-4" />
        );

      case "rejected":
        return (
          <XCircle className="h-4 w-4" />
        );

      case "in_progress":
        return (
          <Clock className="h-4 w-4" />
        );

      default:
        return (
          <AlertCircle className="h-4 w-4" />
        );
    }
  }

  function getStatusClasses(status: string) {
    switch (status) {
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "assigned":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "in_review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  }

  function getPriorityClasses(priority: string) {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700";

      case "high":
        return "bg-orange-100 text-orange-700";

      case "low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  function formatStatus(status: string) {
    return status.replaceAll("_", " ");
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Issue Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review, assign and manage citizen complaints.
            </p>
          </div>

          <button
            onClick={() => loadIssues(true)}
            disabled={refreshing}
            className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Issues"
            value={stats.total}
            icon={AlertCircle}
          />

          <StatCard
            title="Reported"
            value={stats.reported}
            icon={Clock}
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={RefreshCw}
          />

          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
          />

          <StatCard
            title="Critical"
            value={stats.critical}
            icon={AlertCircle}
          />
        </div>

        {/* FILTER BAR */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search issues, location, category or citizen..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* STATUS */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm capitalize outline-none focus:border-slate-400"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Statuses"
                      : formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* PRIORITY */}
            <div>
              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm capitalize outline-none focus:border-slate-400"
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {priority === "all"
                      ? "All Priorities"
                      : priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredIssues.length}
            </span>{" "}
            issues
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading issues...
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredIssues.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No issues found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* ISSUE LIST */}
        {!loading && filteredIssues.length > 0 && (
          <div className="space-y-4">
            {filteredIssues.map((issue) => {
              const verification =
                verificationData[issue.id];

              const isUpdating =
                updatingIssue === issue.id;

              const isAssigning =
                assigningIssue === issue.id;

              return (
                <article
                  key={issue.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  {/* TOP */}
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getPriorityClasses(
                            issue.priority
                          )}`}
                        >
                          {issue.priority}
                        </span>

                        <span
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                            issue.status
                          )}`}
                        >
                          {getStatusIcon(issue.status)}
                          {formatStatus(issue.status)}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {issue.category}
                        </span>
                      </div>

                      <h2 className="mt-3 text-lg font-bold text-slate-900">
                        {issue.title}
                      </h2>

                      {issue.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {issue.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          {issue.reporterName}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {issue.location}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(issue.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* STATUS CONTROL */}
                    <div className="flex items-center gap-2">
                      <select
                        value={issue.status}
                        disabled={isUpdating}
                        onChange={(event) =>
                          updateStatus(
                            issue.id,
                            event.target.value
                          )
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium capitalize outline-none focus:border-slate-400 disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.filter(
                          (status) => status !== "all"
                        ).map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>

                      {isUpdating && (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* LOWER SECTION */}
                  <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 lg:grid-cols-2">
                    {/* VERIFICATION */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-slate-600" />

                          <span className="text-sm font-semibold text-slate-800">
                            Community Verification
                          </span>
                        </div>

                        <span className="text-sm font-bold text-slate-900">
                          {verification?.confidence ?? 0}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-900 transition-all"
                          style={{
                            width: `${
                              verification?.confidence ?? 0
                            }%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 flex gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5 text-green-600" />
                          {verification?.confirmed ?? 0} confirmed
                        </span>

                        <span className="flex items-center gap-1">
                          <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
                          {verification?.disputed ?? 0} disputed
                        </span>

                        <span>
                          {verification?.total ?? 0} total
                        </span>
                      </div>
                    </div>

                    {/* ASSIGNMENT */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-slate-600" />

                        <span className="text-sm font-semibold text-slate-800">
                          Officer Assignment
                        </span>
                      </div>

                      <select
                        value={
                          issue.assignedOfficerId ?? ""
                        }
                        disabled={
                          isAssigning ||
                          officers.length === 0
                        }
                        onChange={(event) =>
                          assignOfficer(
                            issue.id,
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 disabled:opacity-60"
                      >
                        <option value="">
                          {officers.length === 0
                            ? "No officers available"
                            : "Select an officer"}
                        </option>

                        {officers.map((officer) => (
                          <option
                            key={officer.id}
                            value={officer.id}
                          >
                            {officer.name}
                          </option>
                        ))}
                      </select>

                      {isAssigning && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Assigning officer...
                        </div>
                      )}

                      {issue.assignedOfficerName && (
                        <p className="mt-2 text-xs text-slate-500">
                          Assigned to{" "}
                          <span className="font-semibold text-slate-700">
                            {issue.assignedOfficerName}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* QUICK ACTIONS */}
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <button
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          issue.id,
                          "in_review"
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Review
                    </button>

                    <button
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          issue.id,
                          "in_progress"
                        )
                      }
                      className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                    >
                      Start Work
                    </button>

                    <button
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          issue.id,
                          "resolved"
                        )
                      }
                      className="rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-50 disabled:opacity-50"
                    >
                      Mark Resolved
                    </button>

                    <button
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          issue.id,
                          "rejected"
                        )
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 p-2.5">
          <Icon className="h-5 w-5 text-slate-600" />
        </div>
      </div>
    </div>
  );
}