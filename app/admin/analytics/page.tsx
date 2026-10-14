"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";

type Issue = {
  id: string;
  title: string;
  category: string;
  location: string;
  priority: string;
  status: string;
  reporterName: string;
  createdAt: string;
  resolvedAt: string | null;
};

export default function AdminAnalyticsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadAnalytics(refresh = false) {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch("/api/complaints", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to load analytics"
        );
      }

      setIssues(data.complaints ?? data.issues ?? []);
    } catch (error) {
      console.error("Analytics loading error:", error);
      setIssues([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const total = issues.length;

    const resolved = issues.filter(
      (issue) => issue.status === "resolved"
    ).length;

    const inProgress = issues.filter(
      (issue) => issue.status === "in_progress"
    ).length;

    const pending = issues.filter(
      (issue) =>
        issue.status === "reported" ||
        issue.status === "in_review" ||
        issue.status === "assigned"
    ).length;

    const critical = issues.filter(
      (issue) => issue.priority === "critical"
    ).length;

    const resolutionRate =
      total > 0 ? Math.round((resolved / total) * 100) : 0;

    const categoryMap: Record<string, number> = {};
    const locationMap: Record<string, number> = {};
    const priorityMap: Record<string, number> = {};

    for (const issue of issues) {
      categoryMap[issue.category] =
        (categoryMap[issue.category] ?? 0) + 1;

      const location = issue.location || "Unknown";
      locationMap[location] =
        (locationMap[location] ?? 0) + 1;

      priorityMap[issue.priority] =
        (priorityMap[issue.priority] ?? 0) + 1;
    }

    const categories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const locations = Object.entries(locationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const priorities = Object.entries(priorityMap).sort(
      (a, b) => b[1] - a[1]
    );

    const monthlyMap: Record<string, number> = {};

    for (const issue of issues) {
      const date = new Date(issue.createdAt);

      if (Number.isNaN(date.getTime())) continue;

      const key = date.toLocaleDateString("en-IN", {
        month: "short",
      });

      monthlyMap[key] = (monthlyMap[key] ?? 0) + 1;
    }

    const monthly = Object.entries(monthlyMap).slice(-6);

    return {
      total,
      resolved,
      inProgress,
      pending,
      critical,
      resolutionRate,
      categories,
      locations,
      priorities,
      monthly,
    };
  }, [issues]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNavbar />

      <main className="lg:ml-72">
        <div className="p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
          {/* HEADER */}
          <section className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Analytics
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Monitor complaint trends, priorities and resolution
                  performance.
                </p>
              </div>

              <button
                onClick={() => loadAnalytics(true)}
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
          </section>

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading analytics...
              </div>
            </div>
          ) : (
            <>
              {/* KPI CARDS */}
              <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <MetricCard
                  title="Total Issues"
                  value={analytics.total}
                  icon={<BarChart3 className="h-5 w-5" />}
                />

                <MetricCard
                  title="Resolved"
                  value={analytics.resolved}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                />

                <MetricCard
                  title="In Progress"
                  value={analytics.inProgress}
                  icon={<Activity className="h-5 w-5" />}
                />

                <MetricCard
                  title="Pending"
                  value={analytics.pending}
                  icon={<Clock className="h-5 w-5" />}
                />

                <MetricCard
                  title="Critical"
                  value={analytics.critical}
                  icon={<AlertCircle className="h-5 w-5" />}
                />
              </section>

              {/* RESOLUTION RATE */}
              <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_380px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Resolution Performance
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Overall issue resolution rate
                      </p>
                    </div>

                    <TrendingUp className="h-5 w-5 text-slate-500" />
                  </div>

                  <div className="mt-8 flex items-end gap-5">
                    <span className="text-5xl font-bold tracking-tight">
                      {analytics.resolutionRate}%
                    </span>

                    <span className="pb-1 text-sm text-slate-500">
                      resolved
                    </span>
                  </div>

                  <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all"
                      style={{
                        width: `${analytics.resolutionRate}%`,
                      }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <SmallStat
                      label="Resolved"
                      value={analytics.resolved}
                    />

                    <SmallStat
                      label="In Progress"
                      value={analytics.inProgress}
                    />

                    <SmallStat
                      label="Pending"
                      value={analytics.pending}
                    />
                  </div>
                </div>

                {/* PRIORITY */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-slate-600" />

                    <div>
                      <p className="text-sm font-semibold">
                        Priority Breakdown
                      </p>

                      <p className="text-xs text-slate-500">
                        Issues by severity
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {analytics.priorities.map(
                      ([priority, count]) => {
                        const percentage =
                          analytics.total > 0
                            ? Math.round(
                                (count / analytics.total) * 100
                              )
                            : 0;

                        return (
                          <div key={priority}>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="font-semibold capitalize">
                                {priority}
                              </span>

                              <span className="text-slate-500">
                                {count}
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-slate-800"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}

                    {analytics.priorities.length === 0 && (
                      <p className="text-sm text-slate-400">
                        No priority data available.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* CATEGORY + LOCATION */}
              <section className="mb-8 grid gap-6 lg:grid-cols-2">
                <AnalyticsList
                  title="Top Complaint Categories"
                  subtitle="Most reported issue categories"
                  icon={<BarChart3 className="h-5 w-5" />}
                  items={analytics.categories}
                />

                <AnalyticsList
                  title="Complaint Hotspots"
                  subtitle="Areas with the most reported issues"
                  icon={<MapPin className="h-5 w-5" />}
                  items={analytics.locations}
                />
              </section>

              {/* MONTHLY ACTIVITY */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-slate-600" />

                  <div>
                    <p className="text-sm font-semibold">
                      Complaint Activity
                    </p>

                    <p className="text-xs text-slate-500">
                      Issue creation trend
                    </p>
                  </div>
                </div>

                {analytics.monthly.length === 0 ? (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                    No activity data available.
                  </div>
                ) : (
                  <div className="mt-8 flex h-64 items-end gap-4 overflow-x-auto pb-2">
                    {analytics.monthly.map(([month, count]) => {
                      const maximum = Math.max(
                        ...analytics.monthly.map((item) => item[1]),
                        1
                      );

                      const height = Math.max(
                        8,
                        Math.round((count / maximum) * 100)
                      );

                      return (
                        <div
                          key={month}
                          className="flex min-w-14 flex-1 flex-col items-center gap-3"
                        >
                          <span className="text-xs font-semibold text-slate-600">
                            {count}
                          </span>

                          <div className="flex h-44 w-full items-end">
                            <div
                              className="w-full rounded-t-xl bg-slate-900 transition-all"
                              style={{
                                height: `${height}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs text-slate-500">
                            {month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* FOOTER SUMMARY */}
              <section className="mt-8 grid gap-4 sm:grid-cols-3">
                <SummaryCard
                  icon={<FileText className="h-5 w-5" />}
                  label="Issues Tracked"
                  value={analytics.total}
                />

                <SummaryCard
                  icon={<Users className="h-5 w-5" />}
                  label="Unique Reporting Citizens"
                  value={
                    new Set(
                      issues.map((issue) => issue.reporterName)
                    ).size
                  }
                />

                <SummaryCard
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  label="Resolution Rate"
                  value={`${analytics.resolutionRate}%`}
                />
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SmallStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function AnalyticsList({
  title,
  subtitle,
  icon,
  items,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: [string, number][];
}) {
  const maximum = Math.max(
    ...items.map((item) => item[1]),
    1
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="text-slate-600">{icon}</div>

        <div>
          <p className="text-sm font-semibold">{title}</p>

          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">
            No data available.
          </p>
        ) : (
          items.map(([name, count]) => (
            <div key={name}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="truncate text-sm font-medium text-slate-700">
                  {name}
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {count}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900"
                  style={{
                    width: `${(count / maximum) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-500">{label}</p>

        <p className="mt-1 text-xl font-bold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}