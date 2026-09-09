"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
	Bell,
	CheckCircle2,
	ChevronRight,
	Clock3,
	FileText,
	Home,
	Map,
	MapPin,
	Menu,
	Plus,
	Search,
	User,
	X,
} from "lucide-react";

const complaints = [
	{ id: "#SPK-10231", issue: "Large pothole on road", category: "Roads", location: "Gandhi Maidan, Patna", priority: "High", status: "In Progress", date: "2 days ago", updated: "Road Department has been assigned" },
	{ id: "#SPK-10187", issue: "Garbage not collected", category: "Garbage & Waste", location: "Kankarbagh, Patna", priority: "Medium", status: "Assigned", date: "3 days ago", updated: "Assigned to Sanitation Department" },
	{ id: "#SPK-10156", issue: "Water leakage", category: "Water Supply", location: "Boring Road, Patna", priority: "Medium", status: "Open", date: "4 days ago", updated: "Waiting for department review" },
	{ id: "#SPK-10122", issue: "Streetlight not working", category: "Streetlights", location: "Ashok Rajpath, Patna", priority: "Low", status: "Resolved", date: "5 days ago", updated: "Resolved by Electrical Department" },
	{ id: "#SPK-10098", issue: "Drainage blockage", category: "Drainage", location: "Rajendra Nagar, Patna", priority: "High", status: "In Progress", date: "6 days ago", updated: "Field inspection scheduled" },
];

const statusStyles: Record<string, string> = { Open: "bg-red-50 text-red-500", Assigned: "bg-blue-50 text-blue-500", "In Progress": "bg-amber-50 text-amber-600", Resolved: "bg-emerald-50 text-emerald-600" };
const priorityStyles: Record<string, string> = { High: "bg-red-50 text-red-500", Medium: "bg-amber-50 text-amber-600", Low: "bg-emerald-50 text-emerald-600" };

export default function MyComplaintsPage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [tab, setTab] = useState("All complaints");
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const filteredComplaints = useMemo(() => complaints.filter((complaint) => {
		const matchesTab = tab === "All complaints" || (tab === "Active" ? complaint.status !== "Resolved" : complaint.status === "Resolved");
		const haystack = `${complaint.id} ${complaint.issue} ${complaint.category} ${complaint.location}`.toLowerCase();
		return matchesTab && haystack.includes(query.toLowerCase());
	}), [query, tab]);

	const selectedComplaint = complaints.find((complaint) => complaint.id === selectedId);

	return (
		<main className="min-h-screen bg-[#f6f9fc] text-[#17345f]">
			<ComplaintsSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="lg:pl-[220px]">
				<header className="sticky top-0 z-30 h-[72px] border-b border-[#dce7f2] bg-white/90 backdrop-blur-xl">
					<div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-5">
						<button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[#f1f5f9] lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
						<div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">Your activity</p><h1 className="font-display text-lg font-bold text-[#17345f]">My complaints</h1></div>
						<Link href="/report" className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"><Plus className="h-4 w-4" />Report issue</Link>
					</div>
				</header>

				<div className="p-4 sm:p-6 lg:p-7">
					<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="font-display text-2xl font-bold text-[#17345f]">Track your reports</h2><p className="mt-1 text-sm text-[#71879d]">Follow every issue from submission to resolution.</p></div><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-[#91a4b6]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search complaints" className="h-10 w-full rounded-lg border border-[#dce7f2] bg-white pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:w-60" /></div></div>

					<section className="mb-5 grid gap-3 sm:grid-cols-3"><SummaryCard icon={FileText} label="Total reports" value="5" tone="blue" /><SummaryCard icon={Clock3} label="In progress" value="3" tone="amber" /><SummaryCard icon={CheckCircle2} label="Resolved" value="1" tone="green" /></section>

					<section className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-[#edf2f7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-1 rounded-lg bg-[#f5f8fb] p-1">{["All complaints", "Active", "Resolved"].map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-md px-3 py-2 text-[11px] font-bold transition ${tab === item ? "bg-white text-blue-600 shadow-sm" : "text-[#7d92a6] hover:text-[#45627f]"}`}>{item}</button>)}</div><span className="text-[10px] font-semibold text-[#91a2b2]">{filteredComplaints.length} reports shown</span></div>
						<div className="hidden overflow-x-auto md:block"><table className="w-full text-left"><thead><tr className="border-b border-[#edf2f7] bg-[#f9fbfd] text-[8px] font-bold uppercase tracking-wide text-[#8194a8]"><th className="px-4 py-3">Issue</th><th className="px-3 py-3">Location</th><th className="px-3 py-3">Priority</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Reported</th><th /></tr></thead><tbody>{filteredComplaints.map((complaint) => <tr key={complaint.id} onClick={() => setSelectedId(complaint.id)} className="cursor-pointer border-b border-[#edf2f7] text-[10px] transition hover:bg-[#fafcfe]"><td className="px-4 py-3"><p className="font-bold text-[#304b68]">{complaint.issue}</p><p className="mt-1 text-[9px] text-[#91a2b2]">{complaint.id} · {complaint.category}</p></td><td className="px-3 py-3 text-[#6e849a]"><span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-blue-500" />{complaint.location}</span></td><td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold ${priorityStyles[complaint.priority]}`}>{complaint.priority}</span></td><td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[8px] font-bold ${statusStyles[complaint.status]}`}>{complaint.status}</span></td><td className="px-3 py-3 text-[#71879d]">{complaint.date}</td><td className="px-3"><ChevronRight className="h-4 w-4 text-[#9aabba]" /></td></tr>)}</tbody></table></div>
						<div className="divide-y divide-[#edf2f7] md:hidden">{filteredComplaints.map((complaint) => <button key={complaint.id} onClick={() => setSelectedId(complaint.id)} className="w-full p-4 text-left"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-[#304b68]">{complaint.issue}</p><p className="mt-1 text-[10px] text-[#8194a8]">{complaint.id} · {complaint.category}</p><p className="mt-2 flex items-center gap-1 text-[10px] text-[#8194a8]"><MapPin className="h-3 w-3" />{complaint.location}</p></div><span className={`whitespace-nowrap rounded-full px-2 py-1 text-[8px] font-bold ${statusStyles[complaint.status]}`}>{complaint.status}</span></div></button>)}</div>
						{!filteredComplaints.length && <div className="px-6 py-16 text-center text-xs text-[#8195a9]">No complaints match your search.</div>}
					</section>

					{selectedComplaint && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17345f]/30 px-4 backdrop-blur-sm" onClick={() => setSelectedId(null)}><section className="w-full max-w-md rounded-2xl border border-[#dce7f2] bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${statusStyles[selectedComplaint.status]}`}>{selectedComplaint.status}</span><h2 className="mt-4 font-display text-xl font-bold text-[#17345f]">{selectedComplaint.issue}</h2><p className="mt-1 text-xs text-[#91a2b2]">{selectedComplaint.id} · reported {selectedComplaint.date}</p></div><button onClick={() => setSelectedId(null)} aria-label="Close details" className="rounded-lg p-2 text-[#91a2b2] hover:bg-[#f5f8fb]"><X className="h-4 w-4" /></button></div><div className="mt-6 space-y-4 border-t border-[#edf2f7] pt-5"><div className="flex items-center gap-3 text-xs text-[#55718d]"><MapPin className="h-4 w-4 text-blue-500" />{selectedComplaint.location}</div><div className="flex items-center gap-3 text-xs text-[#55718d]"><FileText className="h-4 w-4 text-blue-500" />{selectedComplaint.category}</div><div className="rounded-lg bg-[#f7fafc] p-3 text-xs leading-5 text-[#71879d]"><strong className="text-[#45627f]">Latest update:</strong> {selectedComplaint.updated}.</div></div><Link href="/explore-map" className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-blue-200 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50">View nearby issues</Link></section></div>}
				</div>
			</div>
		</main>
	);
}

function SummaryCard({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: "blue" | "amber" | "green" }) {
	const styles = { blue: "bg-blue-50 text-blue-600", amber: "bg-amber-50 text-amber-600", green: "bg-emerald-50 text-emerald-600" };
	return <div className="rounded-xl border border-[#dce7f2] bg-white p-4 shadow-sm"><div className={`flex h-9 w-9 items-center justify-center rounded-full ${styles[tone]}`}><Icon className="h-4 w-4" /></div><p className="mt-3 text-[10px] font-semibold text-[#70869e]">{label}</p><p className="mt-1 font-display text-2xl font-bold text-[#17345f]">{value}</p></div>;
}

function ComplaintsSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
	return <><>{open && <div className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm lg:hidden" onClick={onClose} />}</><aside className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[#dce7f2] bg-white transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex h-[72px] items-center border-b border-[#edf2f7] px-5"><Link href="/" className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center"><div className="relative"><div className="h-7 w-4 rotate-45 rounded-full bg-civic-green" /><div className="absolute -bottom-1 left-1 h-5 w-3 -rotate-12 rounded-full bg-blue-500" /></div></div><div><p className="font-display text-[16px] font-bold leading-none text-[#17345f]">Team SparkByte</p><p className="mt-1 text-[8px] font-medium text-[#6c8bab]">Cleaner Cities, Brighter Future</p></div></Link><button onClick={onClose} className="ml-auto lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button></div><nav className="flex-1 px-3 py-5"><ComplaintsNavItem icon={Home} label="Home" href="/dashboard" /><ComplaintsNavItem icon={Plus} label="Report Issue" href="/report" /><ComplaintsNavItem icon={Map} label="Explore Map" href="/explore-map" /><ComplaintsNavItem icon={FileText} label="My Complaints" href="/my-complaints" active /><ComplaintsNavItem icon={Bell} label="Notifications" href="/notifications" badge="3" /><ComplaintsNavItem icon={User} label="Profile" href="/profile" /></nav><div className="relative overflow-hidden border-t border-[#edf2f7] px-5 py-6"><div className="absolute -bottom-8 -left-4 opacity-20"><div className="h-20 w-20 rounded-full bg-civic-green" /></div><p className="relative text-xs font-semibold text-civic-green">Small actions</p><p className="relative mt-1 text-sm leading-relaxed text-[#53708e]">create cleaner,<br />safer and better<br />cities for all.</p></div></aside></>;
}

function ComplaintsNavItem({ icon: Icon, label, href = "#", active = false, badge }: { icon: LucideIcon; label: string; href?: string; active?: boolean; badge?: string }) {
	return <a href={href} className={`relative mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-[12px] font-semibold transition ${active ? "bg-blue-50 text-blue-600" : "text-[#344e6b] hover:bg-[#f5f8fb]"}`}><Icon className="h-[17px] w-[17px]" /><span>{label}</span>{badge && <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">{badge}</span>}</a>;
}
