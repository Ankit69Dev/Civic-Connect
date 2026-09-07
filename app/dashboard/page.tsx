"use client";

import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Droplets,
  FileText,
  Home,
  Lightbulb,
  Map,
  MapPin,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ThumbsUp,
  Trash2,
  User,
  Users,
  Waves,
  X,
  Zap,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const complaints = [
  {
    id: "#SPK-10231",
    issue: "Large pothole on road",
    category: "Roads",
    location: "Gandhi Maidan, Patna",
    priority: "High",
    status: "In Progress",
    date: "2 days ago",
  },
  {
    id: "#SPK-10187",
    issue: "Garbage not collected",
    category: "Garbage & Waste",
    location: "Kankarbagh, Patna",
    priority: "Medium",
    status: "Assigned",
    date: "3 days ago",
  },
  {
    id: "#SPK-10156",
    issue: "Water leakage",
    category: "Water Supply",
    location: "Boring Road, Patna",
    priority: "Medium",
    status: "Open",
    date: "4 days ago",
  },
  {
    id: "#SPK-10122",
    issue: "Streetlight not working",
    category: "Streetlights",
    location: "Ashok Rajpath, Patna",
    priority: "Low",
    status: "Resolved",
    date: "5 days ago",
  },
  {
    id: "#SPK-10098",
    issue: "Drainage blockage",
    category: "Drainage",
    location: "Rajendra Nagar, Patna",
    priority: "High",
    status: "In Progress",
    date: "6 days ago",
  },
];

const notifications = [
  {
    icon: CheckCircle2,
    title: "Your complaint #SPK-10231",
    text: "has been assigned to Road Department.",
    time: "2 hours ago",
    type: "green",
  },
  {
    icon: CheckCircle2,
    title: "Your issue has been marked",
    text: "as resolved. Please verify.",
    time: "5 hours ago",
    type: "blue",
  },
  {
    icon: AlertCircle,
    title: "SLA warning: Your complaint",
    text: "#SPK-10187 is approaching deadline.",
    time: "1 day ago",
    type: "orange",
  },
  {
    icon: ThumbsUp,
    title: "Thank you for supporting",
    text: "Pothole near Gandhi Maidan.",
    time: "1 day ago",
    type: "purple",
  },
];

const categories = [
  { name: "Roads", icon: AlertCircle, type: "red" },
  { name: "Garbage", icon: Trash2, type: "green" },
  { name: "Water", icon: Droplets, type: "blue" },
  { name: "Electricity", icon: Zap, type: "orange" },
  { name: "Drainage", icon: Waves, type: "purple" },
  { name: "Streetlights", icon: Lightbulb, type: "cyan" },
  { name: "Public Safety", icon: ShieldCheck, type: "pink" },
  { name: "Other", icon: MoreIcon, type: "gray" },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f6f9fc] text-[#17345f]">

      {/* ================= MOBILE OVERLAY ================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[#dce7f2] bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}

        <div className="flex h-[72px] items-center border-b border-[#edf2f7] px-5">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center">
              <div className="relative">
                <div className="h-7 w-4 rotate-45 rounded-full bg-civic-green" />
                <div className="absolute -bottom-1 left-1 h-5 w-3 -rotate-12 rounded-full bg-blue-500" />
              </div>
            </div>

            <div>
              <p className="font-display text-[16px] font-bold leading-none text-[#17345f]">
                Team SparkByte
              </p>

              <p className="mt-1 text-[8px] font-medium text-[#6c8bab]">
                Cleaner Cities, Brighter Future
              </p>
            </div>
          </a>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}

        <nav className="flex-1 px-3 py-5">

          <SidebarItem
            icon={Home}
            label="Home"
            active
          />

          <SidebarItem
            icon={Plus}
            label="Report Issue"
            href="/report"
          />

          <SidebarItem
            icon={Map}
            label="Explore Map"
          />

          <SidebarItem
            icon={FileText}
            label="My Complaints"
          />

          <SidebarItem
            icon={Bell}
            label="Notifications"
            badge="3"
          />

          <SidebarItem
            icon={User}
            label="Profile"
          />
        </nav>

        {/* Bottom decoration */}

        <div className="relative overflow-hidden border-t border-[#edf2f7] px-5 py-6">
          <div className="absolute -bottom-8 -left-4 opacity-20">
            <div className="h-20 w-20 rounded-full bg-civic-green" />
          </div>

          <p className="relative text-xs font-semibold text-civic-green">
            Small actions
          </p>

          <p className="relative mt-1 text-sm leading-relaxed text-[#53708e]">
            create cleaner,
            <br />
            safer and better
            <br />
            cities for all.
          </p>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <div className="lg:pl-[220px]">

        {/* ================= TOP BAR ================= */}

        <header className="sticky top-0 z-30 h-[72px] border-b border-[#dce7f2] bg-white/90 backdrop-blur-xl">
          <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-5">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-[#f1f5f9] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}

            <div className="relative max-w-[530px] flex-1">
              <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#57718e]" />

              <input
                type="text"
                placeholder="Search issues, locations, categories..."
                className="h-11 w-full rounded-xl border border-[#edf2f7] bg-[#f8fafc] pl-11 pr-4 text-[13px] text-[#17345f] outline-none transition focus:border-blue-300 focus:bg-white"
              />
            </div>

            {/* Right controls */}

            <div className="ml-auto flex items-center gap-3">

              {/* Location */}

              <button className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#f5f8fb] sm:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                </span>

                Patna

                <ChevronDown className="h-3.5 w-3.5 text-[#7087a0]" />
              </button>

              {/* Notification */}

              <button className="relative rounded-xl p-2.5 hover:bg-[#f5f8fb]">
                <Bell className="h-5 w-5 text-[#17345f]" />

                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  3
                </span>
              </button>

              {/* Profile */}

              <button className="hidden items-center gap-2 border-l border-[#edf2f7] pl-3 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  RK
                </div>

                <div className="text-left">
                  <p className="text-xs font-bold text-[#17345f]">
                    Rahul Kumar
                  </p>

                  <p className="text-[9px] text-[#8295aa]">
                    Citizen
                  </p>
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-[#7087a0]" />
              </button>
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}

        <div className="p-4 sm:p-5 lg:p-6">

          {/* ================= WELCOME BANNER ================= */}

          <section className="relative mb-4 min-h-[130px] overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-[#e7f3ff] via-[#eef8ff] to-[#dff3ed] px-5 py-5 sm:px-6">

            {/* City illustration */}

            <div className="absolute bottom-0 right-[18%] hidden opacity-80 lg:block">
              <div className="flex items-end gap-1">
                <div className="h-14 w-5 bg-blue-200" />
                <div className="h-20 w-7 bg-blue-300" />
                <div className="h-12 w-6 bg-emerald-200" />
                <div className="h-24 w-8 bg-blue-200" />
                <div className="h-16 w-5 bg-blue-300" />
                <div className="h-28 w-9 bg-blue-200" />
                <div className="h-20 w-6 bg-emerald-300" />
              </div>
            </div>

            {/* Tree */}

            <div className="absolute bottom-0 right-[30%] hidden lg:block">
              <div className="h-16 w-4 bg-amber-700" />
              <div className="absolute -left-8 -top-10 h-20 w-20 rounded-full bg-emerald-400" />
              <div className="absolute -left-2 -top-14 h-16 w-16 rounded-full bg-emerald-500" />
            </div>

            <div className="relative z-10 max-w-[560px]">
              <h1 className="font-display text-xl font-bold text-[#17345f] sm:text-2xl">
                Good Morning, Rahul! 👋
              </h1>

              <p className="mt-1 text-sm text-[#4f7196]">
                Together we can build a cleaner, safer and better city.
              </p>

              <Link href="/report" className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Report an Issue
              </Link>
            </div>

            {/* Impact */}

            <div className="absolute right-5 top-4 hidden w-[150px] rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur sm:block">
              <p className="text-[10px] font-bold text-[#526e8c]">
                Your Impact
              </p>

              <p className="mt-1 text-2xl font-bold text-[#17345f]">
                12
              </p>

              <p className="text-[10px] text-[#758ba2]">
                issues reported
              </p>
            </div>
          </section>

          {/* ================= STAT CARDS ================= */}

          <section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <DashboardStat
              icon={AlertCircle}
              iconType="red"
              label="My Complaints"
              value="4"
              footer={
                <>
                  <span className="text-red-400">● 1 In Progress</span>
                  <span className="text-emerald-500">● 2 Resolved</span>
                  <span className="text-[#8aa0b5]">● 1 Reopened</span>
                </>
              }
            />

            <DashboardStat
              icon={ThumbsUp}
              iconType="green"
              label="Issues Supported"
              value="8"
              footer={
                <span>
                  You&apos;ve supported 8 issues
                </span>
              }
            />

            <DashboardStat
              icon={CheckCircle2}
              iconType="blue"
              label="Resolved Issues"
              value="2"
              footer={
                <span className="font-semibold text-blue-500">
                  ● 56% resolution rate
                </span>
              }
            />

            <DashboardStat
              icon={Clock3}
              iconType="purple"
              label="Avg. Resolution Time"
              value="3.2 days"
              footer={
                <span className="font-semibold text-emerald-500">
                  ↓ 42% than last month
                </span>
              }
            />

          </section>

          {/* ================= MIDDLE ================= */}

          <section className="grid gap-4 xl:grid-cols-[1.8fr_1fr_0.95fr]">

            {/* ================= MAP ================= */}

            <div className="rounded-xl border border-[#dce7f2] bg-white p-3 shadow-sm">

              <div className="flex items-center justify-between px-2 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />

                  <h2 className="text-sm font-bold">
                    Nearby Civic Issues
                  </h2>
                </div>

                <button className="text-[10px] font-semibold text-blue-600">
                  View All
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_150px]">

                {/* Map */}

                <div className="relative h-[270px] overflow-hidden rounded-lg bg-[#e8f0e7]">

                  {/* Map roads */}

                  <div className="absolute left-[-10%] top-[45%] h-2 w-[120%] rotate-[12deg] bg-white/80" />
                  <div className="absolute left-[-10%] top-[68%] h-2 w-[120%] rotate-[-8deg] bg-white/80" />
                  <div className="absolute left-[20%] top-[-20%] h-[150%] w-2 rotate-[18deg] bg-white/80" />
                  <div className="absolute left-[62%] top-[-20%] h-[150%] w-2 rotate-[-15deg] bg-white/80" />

                  {/* River */}

                  <div className="absolute -right-20 top-[40%] h-20 w-[130%] rotate-[-12deg] rounded-[50%] bg-blue-200/80" />

                  {/* Place name */}

                  <span className="absolute left-[46%] top-[47%] text-xs font-semibold text-[#657c72]">
                    Patna
                  </span>

                  <span className="absolute left-[35%] top-[27%] text-[9px] text-[#789080]">
                    Gandhi Maidan
                  </span>

                  <span className="absolute left-[30%] top-[75%] text-[9px] text-[#789080]">
                    Kankarbagh
                  </span>

                  {/* Pins */}

                  <MapPin
                    className="absolute left-[28%] top-[25%] h-7 w-7 fill-red-500 text-red-500"
                  />

                  <MapPin
                    className="absolute left-[48%] top-[22%] h-7 w-7 fill-red-500 text-red-500"
                  />

                  <MapPin
                    className="absolute left-[30%] top-[52%] h-7 w-7 fill-red-500 text-red-500"
                  />

                  <MapPin
                    className="absolute left-[62%] top-[54%] h-7 w-7 fill-red-500 text-red-500"
                  />

                  <MapPin
                    className="absolute left-[74%] top-[20%] h-7 w-7 fill-orange-400 text-orange-400"
                  />

                  <MapPin
                    className="absolute left-[12%] top-[40%] h-7 w-7 fill-orange-400 text-orange-400"
                  />

                  <MapPin
                    className="absolute left-[15%] top-[76%] h-7 w-7 fill-emerald-500 text-emerald-500"
                  />

                  <MapPin
                    className="absolute left-[72%] top-[77%] h-7 w-7 fill-emerald-500 text-emerald-500"
                  />

                  {/* User location */}

                  <div className="absolute left-[51%] top-[52%] flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 ring-4 ring-blue-500/20">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>

                  {/* Zoom */}

                  <div className="absolute right-2 top-2 overflow-hidden rounded-lg bg-white shadow-md">
                    <button className="block h-9 w-9 text-lg hover:bg-gray-50">
                      +
                    </button>

                    <div className="h-px bg-gray-200" />

                    <button className="block h-9 w-9 text-lg hover:bg-gray-50">
                      −
                    </button>

                    <div className="h-px bg-gray-200" />

                    <button className="block h-9 w-9 text-sm hover:bg-gray-50">
                      ◎
                    </button>
                  </div>
                </div>

                {/* Category legend */}

                <div className="space-y-4 px-2 py-2">
                  <MapLegend color="red" label="Roads" count="12" />
                  <MapLegend color="green" label="Garbage & Waste" count="8" />
                  <MapLegend color="blue" label="Water Supply" count="6" />
                  <MapLegend color="orange" label="Electricity" count="5" />
                  <MapLegend color="purple" label="Drainage" count="4" />
                  <MapLegend color="cyan" label="Streetlights" count="3" />
                  <MapLegend color="gray" label="Other" count="5" />
                </div>
              </div>
            </div>

            {/* ================= QUICK CATEGORIES ================= */}

            <div className="rounded-xl border border-[#dce7f2] bg-white p-4 shadow-sm">

              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500" />

                <h2 className="text-sm font-bold">
                  Quick Report Categories
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <button
                      key={category.name}
                      className={`flex aspect-square flex-col items-center justify-center rounded-xl border transition hover:-translate-y-0.5 hover:shadow-sm ${categoryStyle(
                        category.type
                      )}`}
                    >
                      <Icon className="h-5 w-5" />

                      <span className="mt-2 text-[9px] font-semibold">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= NOTIFICATIONS ================= */}

            <div className="rounded-xl border border-[#dce7f2] bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-[#edf2f7] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600" />

                  <h2 className="text-sm font-bold">
                    Recent Notifications
                  </h2>
                </div>

                <button className="text-[10px] font-semibold text-blue-600">
                  View All
                </button>
              </div>

              <div className="divide-y divide-[#edf2f7]">
                {notifications.map((notification, index) => {
                  const Icon = notification.icon;

                  return (
                    <div
                      key={index}
                      className="flex gap-3 px-4 py-3"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notificationIcon(
                          notification.type
                        )}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold leading-relaxed">
                          {notification.title}
                        </p>

                        <p className="text-[10px] leading-relaxed text-[#71869d]">
                          {notification.text}
                        </p>

                        <p className="mt-1 text-[8px] text-[#9aabba]">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ================= BOTTOM GRID ================= */}

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.8fr_0.95fr]">

            {/* ================= LATEST COMPLAINTS ================= */}

            <div className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-[#edf2f7] px-4 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />

                  <h2 className="text-sm font-bold">
                    Latest Complaints
                  </h2>
                </div>

                <button className="text-[10px] font-semibold text-blue-600">
                  View All
                </button>
              </div>

              {/* Desktop table */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#edf2f7] bg-[#f9fbfd] text-[8px] font-bold uppercase tracking-wide text-[#8194a8]">
                      <th className="px-3 py-2.5">ID</th>
                      <th className="px-3 py-2.5">Issue</th>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5">Location</th>
                      <th className="px-3 py-2.5">Priority</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">Date</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {complaints.map((complaint) => (
                      <ComplaintTableRow
                        key={complaint.id}
                        complaint={complaint}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}

              <div className="divide-y divide-[#edf2f7] md:hidden">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold">
                          {complaint.issue}
                        </p>

                        <p className="mt-1 text-[10px] text-[#8194a8]">
                          {complaint.id} · {complaint.category}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-[10px] text-[#8194a8]">
                          <MapPin className="h-3 w-3" />
                          {complaint.location}
                        </p>
                      </div>

                      <StatusBadge status={complaint.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN */}

            <div className="space-y-4">

              {/* Community */}

              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-[#e9f4ff] to-[#f0f8ff] p-5">

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold">
                      Join the community
                    </h3>

                    <p className="mt-1 text-[11px] leading-relaxed text-[#6b829b]">
                      Support issues, help your city
                      <br />
                      and make an impact together!
                    </p>

                    <button className="mt-3 text-[11px] font-bold text-blue-600">
                      Explore Map →
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick stats */}

              <div className="rounded-xl border border-[#dce7f2] bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-[#edf2f7] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />

                    <h3 className="text-sm font-bold">
                      Quick Stats
                    </h3>
                  </div>

                  <button className="flex items-center gap-1 text-[9px] text-[#7d91a5]">
                    This Month
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 divide-x divide-[#edf2f7]">
                  <QuickStat
                    label="Total Reports"
                    value="6"
                    change="↑ 20%"
                    positive
                  />

                  <QuickStat
                    label="Resolved"
                    value="2"
                    change="↑ 50%"
                    positive
                  />

                  <QuickStat
                    label="Pending"
                    value="4"
                    change="↑ 33%"
                    positive={false}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}

          <footer className="py-5 text-center text-[10px] text-[#9aabba]">
            Team SparkByte · Cleaner Cities, Brighter Future
          </footer>
        </div>
      </div>
    </main>
  );
}


/* ========================================================= */
/* SIDEBAR ITEM */
/* ========================================================= */

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  badge,
  href = "#",
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      className={`relative mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-[12px] font-semibold transition ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-[#344e6b] hover:bg-[#f5f8fb]"
      }`}
    >
      <Icon className="h-[17px] w-[17px]" />

      <span>{label}</span>

      {badge && (
        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">
          {badge}
        </span>
      )}
    </a>
  );
}


/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function DashboardStat({
  icon: Icon,
  iconType,
  label,
  value,
  footer,
}: {
  icon: LucideIcon;
  iconType: string;
  label: string;
  value: string;
  footer: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#dce7f2] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${statIconBackground(
            iconType
          )}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <ChevronRight className="h-4 w-4 text-[#a1b1c0]" />
      </div>

      <p className="mt-3 text-[10px] font-semibold text-[#70869e]">
        {label}
      </p>

      <p className="mt-0.5 font-display text-2xl font-bold text-[#17345f]">
        {value}
      </p>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[8px] text-[#7f93a7]">
        {footer}
      </div>
    </div>
  );
}


/* ========================================================= */
/* MAP LEGEND */
/* ========================================================= */

function MapLegend({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className={`h-2.5 w-2.5 rounded-full ${mapColor(color)}`} />

      <span className="flex-1 text-[#536e89]">
        {label}
      </span>

      <span className="font-semibold text-[#71879d]">
        {count}
      </span>
    </div>
  );
}


/* ========================================================= */
/* COMPLAINT ROW */
/* ========================================================= */

function ComplaintTableRow({
  complaint,
}: {
  complaint: (typeof complaints)[number];
}) {
  return (
    <tr className="border-b border-[#edf2f7] text-[9px] transition hover:bg-[#fafcfe]">

      <td className="px-3 py-2.5 font-semibold text-[#4d7196]">
        {complaint.id}
      </td>

      <td className="px-3 py-2.5 font-semibold text-[#304b68]">
        {complaint.issue}
      </td>

      <td className="px-3 py-2.5 text-[#6e849a]">
        {complaint.category}
      </td>

      <td className="px-3 py-2.5 text-[#6e849a]">
        {complaint.location}
      </td>

      <td className="px-3 py-2.5">
        <PriorityBadge priority={complaint.priority} />
      </td>

      <td className="px-3 py-2.5">
        <StatusBadge status={complaint.status} />
      </td>

      <td className="whitespace-nowrap px-3 py-2.5 text-[#71879d]">
        {complaint.date}
      </td>

      <td className="px-2">
        <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
      </td>
    </tr>
  );
}


/* ========================================================= */
/* PRIORITY */
/* ========================================================= */

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const styles = {
    High: "bg-red-50 text-red-500",
    Medium: "bg-amber-50 text-amber-500",
    Low: "bg-emerald-50 text-emerald-500",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[8px] font-bold ${
        styles[priority as keyof typeof styles]
      }`}
    >
      {priority}
    </span>
  );
}


/* ========================================================= */
/* STATUS */
/* ========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles = {
    "In Progress": "bg-amber-50 text-amber-500",
    Assigned: "bg-blue-50 text-blue-500",
    Open: "bg-red-50 text-red-500",
    Resolved: "bg-emerald-50 text-emerald-500",
  };

  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[8px] font-bold ${
        styles[status as keyof typeof styles] ||
        "bg-gray-50 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}


/* ========================================================= */
/* QUICK STATS */
/* ========================================================= */

function QuickStat({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="px-3 py-4">
      <p className="text-[9px] text-[#7c91a6]">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-[#17345f]">
        {value}
      </p>

      <p
        className={`mt-1 text-[9px] font-bold ${
          positive ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {change}
      </p>
    </div>
  );
}


/* ========================================================= */
/* STYLES */
/* ========================================================= */

function statIconBackground(type: string) {
  const styles: Record<string, string> = {
    red: "bg-red-50 text-red-500",
    green: "bg-emerald-50 text-emerald-500",
    blue: "bg-blue-50 text-blue-500",
    purple: "bg-purple-50 text-purple-500",
  };

  return styles[type] || "bg-gray-50 text-gray-500";
}


function notificationIcon(type: string) {
  const styles: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-500",
    blue: "bg-blue-50 text-blue-500",
    orange: "bg-amber-50 text-amber-500",
    purple: "bg-purple-50 text-purple-500",
  };

  return styles[type] || "bg-gray-50 text-gray-500";
}


function mapColor(color: string) {
  const colors: Record<string, string> = {
    red: "bg-red-500",
    green: "bg-emerald-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    gray: "bg-slate-400",
  };

  return colors[color] || "bg-gray-400";
}


function categoryStyle(type: string) {
  const styles: Record<string, string> = {
    red: "border-red-100 bg-red-50/60 text-red-500",
    green: "border-emerald-100 bg-emerald-50/60 text-emerald-500",
    blue: "border-blue-100 bg-blue-50/60 text-blue-500",
    orange: "border-orange-100 bg-orange-50/60 text-orange-500",
    purple: "border-purple-100 bg-purple-50/60 text-purple-500",
    cyan: "border-cyan-100 bg-cyan-50/60 text-cyan-500",
    pink: "border-pink-100 bg-pink-50/60 text-pink-500",
    gray: "border-slate-100 bg-slate-50 text-slate-500",
  };

  return styles[type] || styles.gray;
}


/* ========================================================= */
/* OTHER ICON */
/* ========================================================= */

function MoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  );
}