"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  FileText,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";

type Citizen = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  provider: string;
  createdAt: string;
  issueCount: number;
  resolvedIssueCount: number;
  unreadNotificationCount: number;
};

type Stats = {
  totalCitizens: number;
  reportingCitizens: number;
  googleCitizens: number;
  credentialCitizens: number;
};

export default function AdminCitizensPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCitizens: 0,
    reportingCitizens: 0,
    googleCitizens: 0,
    credentialCitizens: 0,
  });

  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCitizen, setSelectedCitizen] =
    useState<Citizen | null>(null);

  async function loadCitizens(refresh = false) {
    try {
      refresh ? setRefreshing(true) : setLoading(true);

      const response = await fetch("/api/admin/citizens", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load citizens");
      }

      setCitizens(data.citizens ?? []);
      setStats(
        data.stats ?? {
          totalCitizens: 0,
          reportingCitizens: 0,
          googleCitizens: 0,
          credentialCitizens: 0,
        }
      );
    } catch (error) {
      console.error("Citizens loading error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCitizens();
  }, []);

  const filteredCitizens = useMemo(() => {
    const query = search.trim().toLowerCase();

    return citizens.filter((citizen) => {
      const matchesSearch =
        !query ||
        citizen.name.toLowerCase().includes(query) ||
        citizen.email.toLowerCase().includes(query) ||
        (citizen.phone ?? "").toLowerCase().includes(query);

      const matchesProvider =
        provider === "all" || citizen.provider === provider;

      return matchesSearch && matchesProvider;
    });
  }, [citizens, search, provider]);

  function formatDate(date: string) {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "-";

    return value.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNavbar />

      <main className="lg:ml-72">
        <div className="p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Administration
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Citizens
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage and monitor registered CivicConnect citizens.
              </p>
            </div>

            <button
              onClick={() => loadCitizens(true)}
              disabled={refreshing}
              className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>

          {/* STATS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Citizens"
              value={loading ? "..." : String(stats.totalCitizens)}
              icon={<Users className="h-5 w-5" />}
            />

            <StatCard
              title="Reporting Citizens"
              value={loading ? "..." : String(stats.reportingCitizens)}
              icon={<FileText className="h-5 w-5" />}
            />

            <StatCard
              title="Google Accounts"
              value={loading ? "..." : String(stats.googleCitizens)}
              icon={<ShieldCheck className="h-5 w-5" />}
            />

            <StatCard
              title="Email Accounts"
              value={
                loading ? "..." : String(stats.credentialCitizens)
              }
              icon={<Mail className="h-5 w-5" />}
            />
          </div>

          {/* FILTERS */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_190px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email or phone..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
              >
                <option value="all">All Login Methods</option>
                <option value="credentials">
                  Email & Password
                </option>
                <option value="google">Google</option>
              </select>
            </div>
          </div>

          <p className="mb-4 text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredCitizens.length}
            </span>{" "}
            citizens
          </p>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading citizens...
              </div>
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredCitizens.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-lg font-semibold">
                No citizens found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          )}

          {/* TABLE */}
          {!loading && filteredCitizens.length > 0 && (
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-4">Citizen</th>
                      <th className="px-5 py-4">Contact</th>
                      <th className="px-5 py-4">Issues</th>
                      <th className="px-5 py-4">Login</th>
                      <th className="px-5 py-4">Joined</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCitizens.map((citizen) => (
                      <tr
                        key={citizen.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={citizen.name} />

                            <div>
                              <p className="text-sm font-semibold">
                                {citizen.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                #{citizen.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="flex items-center gap-1.5 text-sm">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {citizen.email}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <Phone className="h-3.5 w-3.5" />
                            {citizen.phone || "No phone"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold">
                              {citizen.issueCount} total
                            </span>

                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                              {citizen.resolvedIssueCount} resolved
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              citizen.provider === "google"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {citizen.provider === "google"
                              ? "Google"
                              : "Email"}
                          </span>

                          {citizen.unreadNotificationCount > 0 && (
                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                              <Bell className="h-3 w-3" />
                              {citizen.unreadNotificationCount} unread
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(citizen.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() =>
                              setSelectedCitizen(citizen)
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MOBILE */}
          {!loading && filteredCitizens.length > 0 && (
            <div className="space-y-4 lg:hidden">
              {filteredCitizens.map((citizen) => (
                <div
                  key={citizen.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={citizen.name} />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {citizen.name}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {citizen.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MiniStat
                      label="Issues"
                      value={String(citizen.issueCount)}
                    />

                    <MiniStat
                      label="Resolved"
                      value={String(
                        citizen.resolvedIssueCount
                      )}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Joined {formatDate(citizen.createdAt)}
                    </span>

                    <button
                      onClick={() =>
                        setSelectedCitizen(citizen)
                      }
                      className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DETAILS MODAL */}
          {selectedCitizen && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
              onClick={() => setSelectedCitizen(null)}
            >
              <div
                className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 border-b border-slate-200 p-6">
                  <Avatar name={selectedCitizen.name} />

                  <div>
                    <p className="text-xs text-slate-400">
                      Citizen Profile
                    </p>

                    <h2 className="text-lg font-bold">
                      {selectedCitizen.name}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <Detail
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={selectedCitizen.email}
                  />

                  <Detail
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={
                      selectedCitizen.phone || "Not provided"
                    }
                  />

                  <Detail
                    icon={<User className="h-4 w-4" />}
                    label="Login"
                    value={
                      selectedCitizen.provider === "google"
                        ? "Google"
                        : "Email & Password"
                    }
                  />

                  <Detail
                    icon={<Calendar className="h-4 w-4" />}
                    label="Joined"
                    value={formatDate(selectedCitizen.createdAt)}
                  />
                </div>

                <div className="flex justify-end border-t border-slate-200 p-4">
                  <button
                    onClick={() => setSelectedCitizen(null)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>

        <div className="rounded-xl bg-slate-100 p-3">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
      {name?.charAt(0)?.toUpperCase() || "C"}
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </p>

      <p className="rounded-xl bg-slate-50 p-3 text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "-";

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}