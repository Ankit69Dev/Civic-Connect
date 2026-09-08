"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileText,
  Home,
  Map,
  MapPin,
  Menu,
  Navigation,
  Send,
  Upload,
  User,
  Bell,
  Plus,
  X,
} from "lucide-react";

const categories = [
  { name: "Roads & Potholes", color: "blue" },
  { name: "Garbage & Waste", color: "green" },
  { name: "Water Supply", color: "cyan" },
  { name: "Streetlights", color: "amber" },
  { name: "Drainage", color: "purple" },
  { name: "Public Safety", color: "rose" },
  { name: "Other", color: "slate" },
];

export default function ReportPage() {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f6f9fc] text-[#17345f]">
        <ReportSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-[220px]">
          <header className="sticky top-0 z-30 h-[72px] border-b border-[#dce7f2] bg-white/90 backdrop-blur-xl">
            <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-5">
              <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[#f1f5f9] lg:hidden" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#55718d] transition hover:text-blue-600">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
            </div>
          </header>
          <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-6 sm:px-8 lg:px-12">
            <div className="w-full max-w-3xl">
          <section className="w-full rounded-2xl border border-[#dce7f2] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              Report submitted
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-[#17345f]">
              Thank you for speaking up.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f849a]">
              Your issue has been logged as <strong className="text-[#17345f]">#SPK-10244</strong>. We will notify you as it moves through review and resolution.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/dashboard" className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                Go to dashboard
              </Link>
              <button onClick={() => setSubmitted(false)} className="rounded-lg border border-[#dce7f2] px-5 py-3 text-sm font-bold text-[#45627f] transition hover:bg-[#f7fafc]">
                Report another issue
              </button>
            </div>
          </section>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f9fc] text-[#17345f]">
      <ReportSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-[220px]">
        <header className="sticky top-0 z-30 h-[72px] border-b border-[#dce7f2] bg-white/90 backdrop-blur-xl">
          <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-5">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[#f1f5f9] lg:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </button>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#55718d] transition hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
            <div className="ml-auto hidden items-center gap-2 text-xs font-semibold text-[#7890a7] sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">1</span>
              <span>Report issue</span>
            </div>
          </div>
        </header>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 lg:px-12 lg:py-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Make your neighborhood better</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#17345f] sm:text-4xl">Report a civic issue</h1>
          <p className="mt-3 text-sm leading-6 text-[#6f849a]">Give us a few details and the right city team can start working on it.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#dce7f2] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><FileText className="h-4 w-4" /></div>
                <div><h2 className="text-base font-bold">Issue details</h2><p className="mt-1 text-xs text-[#8195a9]">Describe what is happening so it can be routed correctly.</p></div>
              </div>

              <label className="block text-xs font-bold text-[#45627f]" htmlFor="title">What is the issue?</label>
              <input id="title" required placeholder="Example: Large pothole near Gandhi Maidan" className="mt-2 w-full rounded-lg border border-[#dce7f2] px-3.5 py-3 text-sm text-[#17345f] outline-none transition placeholder:text-[#a2b1bf] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />

              <label className="mt-5 block text-xs font-bold text-[#45627f]" htmlFor="description">Add more details</label>
              <textarea id="description" required rows={5} placeholder="Tell us what you saw, when it started, and who may be affected..." className="mt-2 w-full resize-none rounded-lg border border-[#dce7f2] px-3.5 py-3 text-sm leading-6 text-[#17345f] outline-none transition placeholder:text-[#a2b1bf] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#45627f]" htmlFor="category">Category</label>
                  <div className="relative mt-2">
                    <select id="category" required value={category} onChange={(event) => setCategory(event.target.value)} className="w-full appearance-none rounded-lg border border-[#dce7f2] bg-white px-3.5 py-3 text-sm text-[#17345f] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"><option value="">Select a category</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[#8da0b2]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#45627f]" htmlFor="priority">Priority</label>
                  <div className="mt-2 flex gap-2">
                    {["Low", "Medium", "High"].map((item) => <button type="button" key={item} onClick={() => setPriority(item)} className={`flex-1 rounded-lg border px-2 py-3 text-xs font-bold transition ${priority === item ? "border-blue-500 bg-blue-50 text-blue-700" : "border-[#dce7f2] text-[#7890a7] hover:bg-[#f7fafc]"}`}>{item}</button>)}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#dce7f2] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><MapPin className="h-4 w-4" /></div><div><h2 className="text-base font-bold">Where is it?</h2><p className="mt-1 text-xs text-[#8195a9]">A precise location helps the field team respond faster.</p></div></div>
              <div className="flex gap-2"><input required placeholder="Search an address or landmark" className="min-w-0 flex-1 rounded-lg border border-[#dce7f2] px-3.5 py-3 text-sm outline-none placeholder:text-[#a2b1bf] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /><button type="button" aria-label="Use current location" className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"><Navigation className="h-4 w-4" /></button></div>
              <div className="relative mt-4 h-36 overflow-hidden rounded-xl border border-[#dce7f2] bg-[#e9f1e8]"><div className="absolute left-[-10%] top-[42%] h-2 w-[120%] rotate-[-12deg] bg-white/90" /><div className="absolute left-[45%] top-[-30%] h-[160%] w-2 rotate-[20deg] bg-white/90" /><div className="absolute right-[10%] top-[35%] h-24 w-36 rotate-12 rounded-[50%] bg-blue-200/70" /><MapPin className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-full fill-blue-600 text-blue-600 drop-shadow" /><span className="absolute bottom-3 left-3 rounded bg-white/80 px-2 py-1 text-[10px] font-semibold text-[#66809a]">Patna, Bihar</span></div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#dce7f2] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Camera className="h-4 w-4" /></div><div><h2 className="text-base font-bold">Add a photo</h2><p className="mt-1 text-xs leading-5 text-[#8195a9]">A photo makes the issue easier to verify.</p></div></div>
              <label className="mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#b9cddd] bg-[#f9fbfd] text-center transition hover:border-blue-400 hover:bg-blue-50/40"><Upload className="h-5 w-5 text-[#7890a7]" /><span className="mt-2 text-xs font-bold text-[#56718d]">Upload an image</span><span className="mt-1 text-[10px] text-[#9aabba]">JPG or PNG up to 10 MB</span><input type="file" accept="image/png,image/jpeg" className="sr-only" /></label>
            </section>

            <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
              <div className="flex gap-3"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /><div><h2 className="text-xs font-bold text-blue-900">What happens next?</h2><p className="mt-2 text-xs leading-5 text-blue-800/70">We will review your report, send it to the responsible department, and keep you updated.</p></div></div>
            </section>

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"><Send className="h-4 w-4" />Submit report</button>
            <p className="text-center text-[10px] leading-5 text-[#91a2b2]">By submitting, you confirm the information is accurate to the best of your knowledge.</p>
          </aside>
        </form>
      </div>
      </div>
    </main>
  );
}

function ReportSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[#dce7f2] bg-white transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[72px] items-center border-b border-[#edf2f7] px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center"><div className="relative"><div className="h-7 w-4 rotate-45 rounded-full bg-civic-green" /><div className="absolute -bottom-1 left-1 h-5 w-3 -rotate-12 rounded-full bg-blue-500" /></div></div>
            <div><p className="font-display text-[16px] font-bold leading-none text-[#17345f]">Team SparkByte</p><p className="mt-1 text-[8px] font-medium text-[#6c8bab]">Cleaner Cities, Brighter Future</p></div>
          </Link>
          <button onClick={onClose} className="ml-auto lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 px-3 py-5">
          <ReportNavItem icon={Home} label="Home" href="/dashboard" />
          <ReportNavItem icon={Plus} label="Report Issue" href="/report" active />
          <ReportNavItem icon={Map} label="Explore Map" href="/explore-map" />
          <ReportNavItem icon={FileText} label="My Complaints" href="/my-complaints" />
          <ReportNavItem icon={Bell} label="Notifications" href="/notifications" badge="3" />
          <ReportNavItem icon={User} label="Profile" />
        </nav>
        <div className="relative overflow-hidden border-t border-[#edf2f7] px-5 py-6"><div className="absolute -bottom-8 -left-4 opacity-20"><div className="h-20 w-20 rounded-full bg-civic-green" /></div><p className="relative text-xs font-semibold text-civic-green">Small actions</p><p className="relative mt-1 text-sm leading-relaxed text-[#53708e]">create cleaner,<br />safer and better<br />cities for all.</p></div>
      </aside>
    </>
  );
}

function ReportNavItem({
  icon: Icon,
  label,
  href = "#",
  active = false,
  badge,
}: {
  icon: typeof Home;
  label: string;
  href?: string;
  active?: boolean;
  badge?: string;
}) {
  return <a href={href} className={`relative mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-[12px] font-semibold transition ${active ? "bg-blue-50 text-blue-600" : "text-[#344e6b] hover:bg-[#f5f8fb]"}`}><Icon className="h-[17px] w-[17px]" /><span>{label}</span>{badge && <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">{badge}</span>}</a>;
}
