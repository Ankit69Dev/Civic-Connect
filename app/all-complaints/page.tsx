"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, MapPin, Plus, Search } from "lucide-react";

const reports = [
  { id: "#SPK-10244", issue: "Open drain near school", reporter: "Priya Singh", category: "Drainage", location: "Rajendra Nagar, Patna", status: "Open", date: "Today" },
  { id: "#SPK-10241", issue: "Garbage collection delayed", reporter: "Amit Verma", category: "Garbage & Waste", location: "Kankarbagh, Patna", status: "Assigned", date: "Today" },
  { id: "#SPK-10231", issue: "Large pothole on road", reporter: "Rahul Kumar", category: "Roads", location: "Gandhi Maidan, Patna", status: "In Progress", date: "2 days ago" },
  { id: "#SPK-10218", issue: "Broken park bench", reporter: "Neha Kumari", category: "Public Spaces", location: "Patliputra Colony, Patna", status: "In Progress", date: "2 days ago" },
  { id: "#SPK-10187", issue: "Garbage not collected", reporter: "Sanjay Das", category: "Garbage & Waste", location: "Kankarbagh, Patna", status: "Assigned", date: "3 days ago" },
  { id: "#SPK-10156", issue: "Water leakage", reporter: "Rahul Kumar", category: "Water Supply", location: "Boring Road, Patna", status: "In Progress", date: "4 days ago" },
  { id: "#SPK-10139", issue: "Traffic signal not working", reporter: "Mohit Raj", category: "Public Safety", location: "Dak Bungalow Road, Patna", status: "Resolved", date: "4 days ago" },
  { id: "#SPK-10122", issue: "Streetlight not working", reporter: "Anjali Singh", category: "Streetlights", location: "Ashok Rajpath, Patna", status: "Resolved", date: "5 days ago" },
  { id: "#SPK-10098", issue: "Drainage blockage", reporter: "Rahul Kumar", category: "Drainage", location: "Rajendra Nagar, Patna", status: "In Progress", date: "6 days ago" },
];

const statusStyles: Record<string, string> = { Open: "bg-red-50 text-red-500", Assigned: "bg-blue-50 text-blue-500", "In Progress": "bg-amber-50 text-amber-600", Resolved: "bg-emerald-50 text-emerald-600" };

export default function AllComplaintsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All reports");
  const visibleReports = useMemo(() => reports.filter((report) => {
    const matchesFilter = filter === "All reports" || report.status === filter;
    const text = `${report.id} ${report.issue} ${report.reporter} ${report.category} ${report.location}`.toLowerCase();
    return matchesFilter && text.includes(query.toLowerCase());
  }), [filter, query]);

  return (
    <main className="min-h-screen bg-[#f6f9fc] text-[#17345f]">
      <header className="border-b border-[#dce7f2] bg-white"><div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-8 lg:px-12"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#55718d] hover:text-blue-600"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link><Link href="/report" className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"><Plus className="h-4 w-4" />Report issue</Link></div></header>
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 lg:px-12 lg:py-10">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Community reports</p><h1 className="mt-2 font-display text-3xl font-bold">All reported complaints</h1><p className="mt-2 text-sm text-[#71879d]">Explore civic issues reported by citizens across your city.</p></div><label className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-[#91a4b6]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all reports" className="h-10 w-full rounded-lg border border-[#dce7f2] bg-white pl-9 pr-3 text-xs outline-none focus:border-blue-500 sm:w-64" /></label></div>
        <section className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2f7] p-4"><div className="flex flex-wrap gap-1 rounded-lg bg-[#f5f8fb] p-1">{["All reports", "Open", "Assigned", "In Progress", "Resolved"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-md px-3 py-2 text-[10px] font-bold ${filter === item ? "bg-white text-blue-600 shadow-sm" : "text-[#8296a9]"}`}>{item}</button>)}</div><span className="text-[10px] font-semibold text-[#91a2b2]">{visibleReports.length} community reports</span></div><div className="hidden overflow-x-auto md:block"><table className="w-full text-left"><thead><tr className="border-b border-[#edf2f7] bg-[#f9fbfd] text-[8px] font-bold uppercase tracking-wide text-[#8194a8]"><th className="px-4 py-3">Issue</th><th className="px-3 py-3">Reported by</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Location</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Date</th><th /></tr></thead><tbody>{visibleReports.map((report) => <tr key={report.id} className="border-b border-[#edf2f7] text-[10px] hover:bg-[#fafcfe]"><td className="px-4 py-3"><p className="font-bold text-[#304b68]">{report.issue}</p><p className="mt-1 text-[9px] text-[#91a2b2]">{report.id}</p></td><td className="px-3 py-3 font-semibold text-[#55718d]">{report.reporter}</td><td className="px-3 py-3 text-[#6e849a]">{report.category}</td><td className="px-3 py-3 text-[#6e849a]"><span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-blue-500" />{report.location}</span></td><td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold ${statusStyles[report.status]}`}>{report.status}</span></td><td className="px-3 py-3 text-[#71879d]">{report.date}</td><td className="px-3"><ChevronRight className="h-4 w-4 text-[#9aabba]" /></td></tr>)}</tbody></table></div><div className="divide-y divide-[#edf2f7] md:hidden">{visibleReports.map((report) => <div key={report.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold">{report.issue}</p><p className="mt-1 text-[10px] text-[#8194a8]">{report.id} · reported by {report.reporter}</p><p className="mt-2 flex items-center gap-1 text-[10px] text-[#8194a8]"><MapPin className="h-3 w-3" />{report.location}</p></div><span className={`whitespace-nowrap rounded-full px-2 py-1 text-[8px] font-bold ${statusStyles[report.status]}`}>{report.status}</span></div></div>)}</div>{!visibleReports.length && <div className="px-6 py-16 text-center text-xs text-[#8195a9]">No community reports match your search.</div>}</section>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/70 p-4 text-xs text-blue-800/70"><CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />These are shared community issues. Your own submissions remain in <Link href="/my-complaints" className="font-bold text-blue-700">My Complaints</Link>.</div>
      </div>
    </main>
  );
}
