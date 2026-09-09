"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Check, CheckCircle2, FileText, Home, LogOut, Map, Menu, Pencil, Plus, Save, ShieldCheck, User, X } from "lucide-react";

const stats = [
  { label: "Reports submitted", value: "12", icon: FileText },
  { label: "Issues resolved", value: "8", icon: CheckCircle2 },
  { label: "Community support", value: "24", icon: Bell },
];

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("");
  const [preferences, setPreferences] = useState({ updates: true, nearby: true, digest: false });
  const [profile, setProfile] = useState({ name: "Rahul Kumar", email: "rahul.kumar@example.com", phone: "+91 98765 43210", ward: "Ward 38, Patna", bio: "Helping make Patna cleaner, safer and better for everyone." });

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return (
    <main className="min-h-screen bg-[#f6f9fc] text-[#17345f]">
      <ProfileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-[220px]">
        <header className="sticky top-0 z-30 h-[72px] border-b border-[#dce7f2] bg-white/90 backdrop-blur-xl">
          <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-5">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[#f1f5f9] lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">Your account</p><h1 className="font-display text-lg font-bold">Profile</h1></div>
            <Link href="/report" className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"><Plus className="h-4 w-4" />Report issue</Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-7">
          <div className="mb-6"><h2 className="font-display text-2xl font-bold">Your civic profile</h2><p className="mt-1 text-sm text-[#71879d]">Manage your details and how CivicConnect keeps you informed.</p></div>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="space-y-5">
              <section className="rounded-xl border border-[#dce7f2] bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">RK</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-xl font-bold">{profile.name}</h2><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">Citizen</span></div><p className="mt-1 text-xs text-[#8195a9]">Member since March 2025 · {profile.ward}</p></div><button onClick={() => setEditing(!editing)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dce7f2] px-3 py-2 text-xs font-bold text-[#55718d] hover:bg-[#f7fafc]"><Pencil className="h-3.5 w-3.5" />{editing ? "Cancel" : "Edit profile"}</button></div>
                {editing ? <form onSubmit={saveProfile} className="mt-7 grid gap-4 border-t border-[#edf2f7] pt-6 sm:grid-cols-2"><ProfileInput label="Full name" value={profile.name} onChange={(value) => setProfile({ ...profile, name: value })} /><ProfileInput label="Phone number" value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value })} /><ProfileInput label="Email address" value={profile.email} onChange={(value) => setProfile({ ...profile, email: value })} type="email" /><ProfileInput label="Ward / area" value={profile.ward} onChange={(value) => setProfile({ ...profile, ward: value })} /><label className="sm:col-span-2"><span className="text-xs font-bold text-[#45627f]">About you</span><textarea value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} rows={3} className="mt-2 w-full resize-none rounded-lg border border-[#dce7f2] px-3 py-2.5 text-sm outline-none focus:border-blue-500" /></label><button type="submit" className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"><Save className="h-4 w-4" />Save changes</button></form> : <div className="mt-7 grid gap-5 border-t border-[#edf2f7] pt-6 sm:grid-cols-2"><ProfileDetail label="Email address" value={profile.email} /><ProfileDetail label="Phone number" value={profile.phone} /><ProfileDetail label="Ward / area" value={profile.ward} /><ProfileDetail label="About you" value={profile.bio} /></div>}
              </section>
              <section className="grid gap-3 sm:grid-cols-3">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="rounded-xl border border-[#dce7f2] bg-white p-4 shadow-sm"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-4 w-4" /></div><p className="mt-3 text-[10px] font-semibold text-[#70869e]">{stat.label}</p><p className="mt-1 font-display text-2xl font-bold">{stat.value}</p></div>; })}</section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-xl border border-[#dce7f2] bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Bell className="h-4 w-4" /></div><div><h2 className="text-sm font-bold">Notification preferences</h2><p className="mt-1 text-[11px] leading-5 text-[#8195a9]">Choose the updates you want to receive.</p></div></div><div className="mt-5 space-y-4"><Preference label="Complaint updates" detail="Assignments and status changes" enabled={preferences.updates} onChange={() => setPreferences({ ...preferences, updates: !preferences.updates })} /><Preference label="Nearby issue alerts" detail="Important issues around your ward" enabled={preferences.nearby} onChange={() => setPreferences({ ...preferences, nearby: !preferences.nearby })} /><Preference label="Weekly digest" detail="A summary of your civic impact" enabled={preferences.digest} onChange={() => setPreferences({ ...preferences, digest: !preferences.digest })} /></div><Link href="/notifications" className="mt-5 inline-flex text-[11px] font-bold text-blue-600">Manage all notifications -&gt;</Link></section>
              <section className="rounded-xl border border-[#dce7f2] bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><ShieldCheck className="h-4 w-4" /></div><div><h2 className="text-sm font-bold">Account security</h2><p className="mt-1 text-[11px] text-[#8195a9]">Your account is protected.</p></div></div><button onClick={() => setSecurityMessage("Password reset instructions will be sent to your email.")} className="mt-5 w-full rounded-lg border border-[#dce7f2] py-2.5 text-xs font-bold text-[#55718d] hover:bg-[#f7fafc]">Change password</button><button onClick={() => setSecurityMessage("Sign out is ready to connect to your authentication session.")} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-red-500 hover:bg-red-50"><LogOut className="h-4 w-4" />Sign out</button>{securityMessage && <p className="mt-3 text-[10px] leading-4 text-[#71879d]">{securityMessage}</p>}</section>
              {saved && <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700"><Check className="h-4 w-4" />Profile changes saved.</div>}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label><span className="text-xs font-bold text-[#45627f]">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-[#dce7f2] px-3 py-2.5 text-sm outline-none focus:border-blue-500" /></label>; }
function ProfileDetail({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-bold uppercase tracking-wide text-[#9aabba]">{label}</p><p className="mt-1 text-sm text-[#55718d]">{value}</p></div>; }
function Preference({ label, detail, enabled, onChange }: { label: string; detail: string; enabled: boolean; onChange: () => void }) { return <div className="flex items-center gap-3"><div className="min-w-0 flex-1"><p className="text-xs font-bold text-[#45627f]">{label}</p><p className="mt-0.5 text-[10px] text-[#91a2b2]">{detail}</p></div><button onClick={onChange} className={`relative h-5 w-9 shrink-0 rounded-full ${enabled ? "bg-blue-600" : "bg-[#cbd6df]"}`} aria-label={`Toggle ${label}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm ${enabled ? "left-4" : "left-0.5"}`} /></button></div>; }

function ProfileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) { return <><>{open && <div className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm lg:hidden" onClick={onClose} />}</><aside className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[#dce7f2] bg-white transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex h-[72px] items-center border-b border-[#edf2f7] px-5"><Link href="/" className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center"><div className="relative"><div className="h-7 w-4 rotate-45 rounded-full bg-civic-green" /><div className="absolute -bottom-1 left-1 h-5 w-3 -rotate-12 rounded-full bg-blue-500" /></div></div><div><p className="font-display text-[16px] font-bold leading-none">Team SparkByte</p><p className="mt-1 text-[8px] font-medium text-[#6c8bab]">Cleaner Cities, Brighter Future</p></div></Link><button onClick={onClose} className="ml-auto lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button></div><nav className="flex-1 px-3 py-5"><ProfileNavItem icon={Home} label="Home" href="/dashboard" /><ProfileNavItem icon={Plus} label="Report Issue" href="/report" /><ProfileNavItem icon={Map} label="Explore Map" href="/explore-map" /><ProfileNavItem icon={FileText} label="My Complaints" href="/my-complaints" /><ProfileNavItem icon={Bell} label="Notifications" href="/notifications" badge="3" /><ProfileNavItem icon={User} label="Profile" href="/profile" active /></nav><div className="relative overflow-hidden border-t border-[#edf2f7] px-5 py-6"><p className="relative text-xs font-semibold text-civic-green">Small actions</p><p className="relative mt-1 text-sm leading-relaxed text-[#53708e]">create cleaner,<br />safer and better<br />cities for all.</p></div></aside></>; }
function ProfileNavItem({ icon: Icon, label, href = "#", active = false, badge }: { icon: typeof Home; label: string; href?: string; active?: boolean; badge?: string }) { return <a href={href} className={`relative mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-[12px] font-semibold ${active ? "bg-blue-50 text-blue-600" : "text-[#344e6b] hover:bg-[#f5f8fb]"}`}><Icon className="h-[17px] w-[17px]" /><span>{label}</span>{badge && <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">{badge}</span>}</a>; }
