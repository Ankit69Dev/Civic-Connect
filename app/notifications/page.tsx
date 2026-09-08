"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  FileText,
  Home,
  Mail,
  Map,
  Menu,
  MessageSquare,
  Phone,
  Plus,
  Settings,
  ShieldAlert,
  Smartphone,
  User,
  X,
} from "lucide-react";

type Notification = {
  id: number;
  title: string;
  body: string;
  type: "Assignment" | "Status" | "SLA" | "Resolution" | "Reopened";
  time: string;
  read: boolean;
  icon: LucideIcon;
  tone: string;
};

const initialNotifications: Notification[] = [
  { id: 1, title: "Complaint assigned", body: "#SPK-10231 has been assigned to the Road Department.", type: "Assignment", time: "2 hours ago", read: false, icon: FileText, tone: "blue" },
  { id: 2, title: "Issue status updated", body: "Your water leakage report is now In Progress.", type: "Status", time: "5 hours ago", read: false, icon: Clock3, tone: "amber" },
  { id: 3, title: "SLA deadline approaching", body: "#SPK-10187 needs attention within the next 24 hours.", type: "SLA", time: "Yesterday", read: false, icon: ShieldAlert, tone: "rose" },
  { id: 4, title: "Issue resolved", body: "Streetlight not working near Ashok Rajpath was marked resolved.", type: "Resolution", time: "Yesterday", read: true, icon: Check, tone: "green" },
  { id: 5, title: "Complaint reopened", body: "Your drainage complaint was reopened after a verification request.", type: "Reopened", time: "2 days ago", read: true, icon: AlertCircle, tone: "purple" },
  { id: 6, title: "Welcome to CivicConnect", body: "You can now report issues, track progress, and support your community.", type: "Status", time: "3 days ago", read: true, icon: Bell, tone: "cyan" },
];

const channelOptions = [
  { key: "push", label: "Push notifications", detail: "Instant alerts on your device", icon: Bell, enabled: true },
  { key: "sms", label: "SMS / OTP", detail: "Verification codes and critical updates", icon: Smartphone, enabled: true },
  { key: "email", label: "Email notifications", detail: "Detailed complaint updates by email", icon: Mail, enabled: true },
  { key: "whatsapp", label: "WhatsApp notifications", detail: "Planned delivery channel", icon: MessageSquare, enabled: false },
  { key: "ivr", label: "IVR / voice notifications", detail: "Planned voice call channel", icon: Phone, enabled: false },
];

export default function NotificationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const [filter, setFilter] = useState("All notifications");
  const [channels, setChannels] = useState(() => Object.fromEntries(channelOptions.map((channel) => [channel.key, channel.enabled])));

  const unreadCount = items.filter((item) => !item.read).length;
  const visibleItems = useMemo(() => items.filter((item) => filter === "All notifications" || item.type === filter), [filter, items]);

  function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  }

  function toggleRead(id: number) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, read: !item.read } : item));
  }

  return (
    <main className="min-h-screen bg-[#f6f9fc] text-[#17345f]">
      <NotificationSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-[220px]">
        <header className="sticky top-0 z-30 h-[72px] border-b border-[#dce7f2] bg-white/90 backdrop-blur-xl">
          <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-5">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[#f1f5f9] lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">Stay informed</p><h1 className="font-display text-lg font-bold text-[#17345f]">Notifications</h1></div>
            <Link href="/report" className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"><Plus className="h-4 w-4" />Report issue</Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-7">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="font-display text-2xl font-bold text-[#17345f]">Your notification center</h2><p className="mt-1 text-sm text-[#71879d]">Follow assignments, status changes, deadlines, and resolutions in one place.</p></div><button onClick={markAllRead} className="inline-flex items-center gap-2 self-start rounded-lg border border-[#dce7f2] bg-white px-3.5 py-2.5 text-xs font-bold text-[#55718d] transition hover:bg-[#f7fafc]"><CheckCheck className="h-4 w-4 text-emerald-600" />Mark all as read</button></div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <section className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-sm">
              <div className="flex flex-wrap gap-1 border-b border-[#edf2f7] p-3">{["All notifications", "Assignment", "Status", "SLA", "Resolution", "Reopened"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-md px-3 py-2 text-[10px] font-bold transition ${filter === item ? "bg-blue-50 text-blue-600" : "text-[#8296a9] hover:bg-[#f7fafc]"}`}>{item}</button>)}</div>
              <div className="divide-y divide-[#edf2f7]">{visibleItems.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => toggleRead(item.id)} className={`flex w-full gap-3 p-4 text-left transition hover:bg-[#fafcfe] sm:p-5 ${!item.read ? "bg-blue-50/30" : ""}`}><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneStyles(item.tone)}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-xs font-bold text-[#304b68]">{item.title}</h3>{!item.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}<span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${typeStyles(item.type)}`}>{item.type}</span></div><p className="mt-1 text-xs leading-5 text-[#71879d]">{item.body}</p><p className="mt-2 text-[10px] text-[#9aabba]">{item.time}</p></div><ChevronRight className="mt-2 h-4 w-4 shrink-0 text-[#a4b4c2]" /></button>; })}{!visibleItems.length && <p className="px-6 py-16 text-center text-xs text-[#8195a9]">No notifications in this category.</p>}</div>
              <div className="border-t border-[#edf2f7] bg-[#f9fbfd] px-5 py-3 text-[10px] text-[#91a2b2]">{unreadCount} unread notification{unreadCount === 1 ? "" : "s"} · Tap an item to toggle its read status</div>
            </section>

            <aside className="space-y-5"><section className="rounded-xl border border-[#dce7f2] bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="text-sm font-bold">Delivery channels</h2><p className="mt-1 text-[11px] leading-5 text-[#8195a9]">Choose how CivicConnect keeps you updated.</p></div><Settings className="h-4 w-4 text-blue-500" /></div><div className="mt-4 space-y-2">{channelOptions.map((channel) => { const Icon = channel.icon; const enabled = channels[channel.key]; return <div key={channel.key} className={`flex items-center gap-3 rounded-lg border p-3 ${channel.enabled ? "border-[#edf2f7]" : "border-dashed border-[#dce7f2] bg-[#fafcfe]"}`}><div className={`flex h-8 w-8 items-center justify-center rounded-full ${channel.enabled ? "bg-blue-50 text-blue-600" : "bg-[#f0f3f6] text-[#9aabba]"}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-[11px] font-bold text-[#45627f]">{channel.label}</p><p className="mt-0.5 text-[9px] text-[#91a2b2]">{channel.detail}</p></div><button disabled={!channel.enabled} onClick={() => setChannels((current) => ({ ...current, [channel.key]: !current[channel.key] }))} className={`relative h-5 w-9 rounded-full transition ${!channel.enabled ? "cursor-not-allowed bg-[#dce4ea]" : enabled ? "bg-blue-600" : "bg-[#cbd6df]"}`} aria-label={`Toggle ${channel.label}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${enabled ? "left-4" : "left-0.5"}`} /></button></div>; })}</div></section><section className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4"><div className="flex gap-3"><Bell className="h-4 w-4 shrink-0 text-emerald-600" /><div><h2 className="text-xs font-bold text-emerald-900">Notification coverage</h2><p className="mt-1 text-[11px] leading-5 text-emerald-800/70">You will receive assignment, status, SLA, resolution, and reopen alerts through your active channels.</p></div></div></section></aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function toneStyles(tone: string) { return { blue: "bg-blue-50 text-blue-600", amber: "bg-amber-50 text-amber-600", rose: "bg-rose-50 text-rose-600", green: "bg-emerald-50 text-emerald-600", purple: "bg-purple-50 text-purple-600", cyan: "bg-cyan-50 text-cyan-600" }[tone as keyof Record<string, string>] ?? "bg-slate-50 text-slate-600"; }
function typeStyles(type: Notification["type"]) { return { Assignment: "bg-blue-50 text-blue-600", Status: "bg-slate-50 text-slate-600", SLA: "bg-rose-50 text-rose-600", Resolution: "bg-emerald-50 text-emerald-600", Reopened: "bg-purple-50 text-purple-600" }[type]; }

function NotificationSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <><>{open && <div className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm lg:hidden" onClick={onClose} />}</><aside className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[#dce7f2] bg-white transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex h-[72px] items-center border-b border-[#edf2f7] px-5"><Link href="/" className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center"><div className="relative"><div className="h-7 w-4 rotate-45 rounded-full bg-civic-green" /><div className="absolute -bottom-1 left-1 h-5 w-3 -rotate-12 rounded-full bg-blue-500" /></div></div><div><p className="font-display text-[16px] font-bold leading-none text-[#17345f]">Team SparkByte</p><p className="mt-1 text-[8px] font-medium text-[#6c8bab]">Cleaner Cities, Brighter Future</p></div></Link><button onClick={onClose} className="ml-auto lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button></div><nav className="flex-1 px-3 py-5"><NotificationNavItem icon={Home} label="Home" href="/dashboard" /><NotificationNavItem icon={Plus} label="Report Issue" href="/report" /><NotificationNavItem icon={Map} label="Explore Map" href="/explore-map" /><NotificationNavItem icon={FileText} label="My Complaints" href="/my-complaints" /><NotificationNavItem icon={Bell} label="Notifications" href="/notifications" active badge="3" /><NotificationNavItem icon={User} label="Profile" /></nav><div className="relative overflow-hidden border-t border-[#edf2f7] px-5 py-6"><div className="absolute -bottom-8 -left-4 opacity-20"><div className="h-20 w-20 rounded-full bg-civic-green" /></div><p className="relative text-xs font-semibold text-civic-green">Small actions</p><p className="relative mt-1 text-sm leading-relaxed text-[#53708e]">create cleaner,<br />safer and better<br />cities for all.</p></div></aside></>;
}
function NotificationNavItem({ icon: Icon, label, href = "#", active = false, badge }: { icon: LucideIcon; label: string; href?: string; active?: boolean; badge?: string }) { return <a href={href} className={`relative mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-[12px] font-semibold transition ${active ? "bg-blue-50 text-blue-600" : "text-[#344e6b] hover:bg-[#f5f8fb]"}`}><Icon className="h-[17px] w-[17px]" /><span>{label}</span>{badge && <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">{badge}</span>}</a>; }
