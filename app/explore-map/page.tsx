"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
	AlertCircle,
	Bell,
	CheckCircle2,
	ChevronRight,
	Flame,
	FileText,
	Home,
	Layers,
	Map,
	MapPinned,
	MapPin,
	Menu,
	Navigation,
	Plus,
	Radar,
	ScanSearch,
	Search,
	User,
	X,
} from "lucide-react";

type Issue = {
	id: string;
	title: string;
	category: string;
	location: string;
	status: "Open" | "In Progress" | "Resolved";
	age: string;
	color: string;
	position: string;
	coordinates: string;
	ward: string;
	zone: string;
};

const issues: Issue[] = [
	{ id: "#SPK-10231", title: "Large pothole on road", category: "Roads", location: "Gandhi Maidan, Patna", status: "In Progress", age: "2 days ago", color: "red", position: "left-[26%] top-[28%]", coordinates: "25.5941, 85.1376", ward: "Ward 38", zone: "Central Zone" },
	{ id: "#SPK-10187", title: "Garbage not collected", category: "Garbage", location: "Kankarbagh, Patna", status: "Open", age: "3 days ago", color: "orange", position: "left-[48%] top-[21%]", coordinates: "25.5868, 85.1561", ward: "Ward 32", zone: "East Zone" },
	{ id: "#SPK-10156", title: "Water leakage", category: "Water", location: "Boring Road, Patna", status: "In Progress", age: "4 days ago", color: "blue", position: "left-[31%] top-[54%]", coordinates: "25.6102, 85.1084", ward: "Ward 21", zone: "West Zone" },
	{ id: "#SPK-10122", title: "Streetlight not working", category: "Streetlights", location: "Ashok Rajpath, Patna", status: "Resolved", age: "5 days ago", color: "green", position: "left-[62%] top-[56%]", coordinates: "25.6208, 85.1422", ward: "Ward 48", zone: "Central Zone" },
	{ id: "#SPK-10098", title: "Drainage blockage", category: "Drainage", location: "Rajendra Nagar, Patna", status: "Open", age: "6 days ago", color: "red", position: "left-[73%] top-[24%]", coordinates: "25.6076, 85.1614", ward: "Ward 33", zone: "East Zone" },
	{ id: "#SPK-10071", title: "Broken footpath", category: "Roads", location: "Fraser Road, Patna", status: "Resolved", age: "1 week ago", color: "green", position: "left-[16%] top-[73%]", coordinates: "25.6095, 85.1324", ward: "Ward 28", zone: "Central Zone" },
];

const categoryColors: Record<string, string> = {
	Roads: "bg-red-500",
	Garbage: "bg-orange-400",
	Water: "bg-blue-500",
	Streetlights: "bg-emerald-500",
	Drainage: "bg-red-500",
};

export default function ExploreMapPage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("All issues");
	const [status, setStatus] = useState("All statuses");
	const [selectedId, setSelectedId] = useState(issues[0].id);
	const [manualLocation, setManualLocation] = useState("Patna, Bihar");
	const [gpsState, setGpsState] = useState<"idle" | "detecting" | "detected">("idle");
	const [showHeatmap, setShowHeatmap] = useState(false);
	const [showBoundaries, setShowBoundaries] = useState(false);
	const [nearbyOnly, setNearbyOnly] = useState(false);
	const [radius, setRadius] = useState("5 km");
	const [mapZoom, setMapZoom] = useState(1);
	const [supportedIssues, setSupportedIssues] = useState<string[]>([]);

	function detectLocation() {
		setGpsState("detecting");
		if (!navigator.geolocation) {
			setGpsState("detected");
			setManualLocation("Patna, Bihar (location unavailable)");
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setManualLocation(reverseGeocode(latitude, longitude));
				setGpsState("detected");
			},
			() => {
				setManualLocation("Patna, Bihar (permission needed)");
				setGpsState("idle");
			},
		);
	}

	const filteredIssues = useMemo(() => issues.filter((issue) => {
		const matchesQuery = `${issue.title} ${issue.category} ${issue.location}`.toLowerCase().includes(query.toLowerCase());
		const matchesCategory = category === "All issues" || issue.category === category;
		const matchesStatus = status === "All statuses" || issue.status === status;
		const matchesNearby = !nearbyOnly || issue.location.includes("Patna");
		return matchesQuery && matchesCategory && matchesStatus && matchesNearby;
	}), [category, nearbyOnly, query, status]);

	const selectedIssue = issues.find((issue) => issue.id === selectedId) ?? filteredIssues[0];

	return (
		<main className="min-h-screen bg-[#f6f9fc] text-[#17345f]">
			<MapSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="lg:pl-[220px]">
				<header className="sticky top-0 z-30 h-[72px] border-b border-[#dce7f2] bg-white/90 backdrop-blur-xl">
					<div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-5">
						<button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[#f1f5f9] lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
						<div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">Explore your city</p><h1 className="font-display text-lg font-bold text-[#17345f]">Civic issue map</h1></div>
						<Link href="/report" className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"><Plus className="h-4 w-4" />Report issue</Link>
					</div>
				</header>

				<div className="p-4 sm:p-6 lg:p-7">
					<div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div><h2 className="font-display text-2xl font-bold text-[#17345f]">Issues near you</h2><p className="mt-1 text-sm text-[#71879d]">See what your community is reporting and support issues that matter.</p></div>
						<div className="flex flex-col gap-2 sm:flex-row">
							<label className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-[#91a4b6]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search issues or locations" className="h-10 w-full rounded-lg border border-[#dce7f2] bg-white pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:w-56" /></label>
							<select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-lg border border-[#dce7f2] bg-white px-3 text-xs font-semibold text-[#55718d] outline-none focus:border-blue-500"><option>All issues</option><option>Roads</option><option>Garbage</option><option>Water</option><option>Streetlights</option><option>Drainage</option></select>
							<select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-[#dce7f2] bg-white px-3 text-xs font-semibold text-[#55718d] outline-none focus:border-blue-500"><option>All statuses</option><option>Open</option><option>In Progress</option><option>Resolved</option></select>
						</div>
					</div>
					<div className="mb-5 grid gap-3 rounded-xl border border-[#dce7f2] bg-white p-3 shadow-sm md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
						<label className="relative"><MapPinned className="absolute left-3 top-3 h-4 w-4 text-emerald-600" /><input value={manualLocation} onChange={(event) => setManualLocation(event.target.value)} placeholder="Select a location or landmark" className="h-10 w-full rounded-lg border border-[#dce7f2] pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /><span className="sr-only">Manual location selection with local reverse geocoding</span></label>
						<button onClick={detectLocation} disabled={gpsState === "detecting"} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"><Radar className="h-4 w-4" />{gpsState === "detecting" ? "Detecting..." : gpsState === "detected" ? "Location detected" : "Detect GPS"}</button>
						<button onClick={() => setNearbyOnly(!nearbyOnly)} className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-bold transition ${nearbyOnly ? "border-blue-500 bg-blue-50 text-blue-700" : "border-[#dce7f2] text-[#55718d] hover:bg-[#f7fafc]"}`}><ScanSearch className="h-4 w-4" />Nearby complaints</button>
						<select value={radius} onChange={(event) => setRadius(event.target.value)} aria-label="Nearby search radius" className="h-10 rounded-lg border border-[#dce7f2] bg-white px-3 text-xs font-semibold text-[#55718d] outline-none focus:border-blue-500"><option>1 km</option><option>5 km</option><option>10 km</option></select>
					</div>

					<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
						<section className="rounded-xl border border-[#dce7f2] bg-white p-3 shadow-sm">
							<div className="relative h-[520px] overflow-hidden rounded-lg bg-[#e7f0e6] sm:h-[620px]">
								<div className="absolute inset-0 origin-center transition-transform duration-300" style={{ transform: `scale(${mapZoom})` }}>
								<div className="absolute left-[-10%] top-[37%] h-3 w-[120%] rotate-[12deg] bg-white/90" /><div className="absolute left-[-10%] top-[69%] h-2 w-[120%] rotate-[-8deg] bg-white/90" /><div className="absolute left-[21%] top-[-20%] h-[150%] w-3 rotate-[18deg] bg-white/90" /><div className="absolute left-[62%] top-[-20%] h-[150%] w-2 rotate-[-15deg] bg-white/90" /><div className="absolute -right-28 top-[40%] h-28 w-[130%] rotate-[-12deg] rounded-[50%] bg-blue-200/75" />
								{showHeatmap && <><div className="absolute left-[15%] top-[18%] h-36 w-36 rounded-full bg-red-500/25 blur-2xl" /><div className="absolute left-[39%] top-[35%] h-44 w-44 rounded-full bg-orange-400/25 blur-2xl" /><div className="absolute right-[10%] top-[13%] h-32 w-32 rounded-full bg-red-500/20 blur-2xl" /><div className="absolute left-[25%] bottom-[12%] h-28 w-28 rounded-full bg-amber-400/25 blur-2xl" /></>}
								{showBoundaries && <><div className="absolute left-[8%] top-[10%] h-[38%] w-[40%] rounded-xl border-2 border-dashed border-blue-500/60" /><div className="absolute right-[8%] top-[14%] h-[43%] w-[38%] rounded-xl border-2 border-dashed border-emerald-500/60" /><div className="absolute left-[18%] bottom-[8%] h-[35%] w-[58%] rounded-xl border-2 border-dashed border-purple-500/50" /></>}
								<span className="absolute left-[45%] top-[45%] text-sm font-bold text-[#657c72]">Patna</span><span className="absolute left-[33%] top-[27%] text-[10px] text-[#789080]">Gandhi Maidan</span><span className="absolute left-[29%] top-[76%] text-[10px] text-[#789080]">Kankarbagh</span><span className="absolute right-[17%] top-[65%] text-[10px] text-[#789080]">Rajendra Nagar</span>
								{filteredIssues.map((issue) => <button key={issue.id} onClick={() => setSelectedId(issue.id)} aria-label={`View ${issue.title}`} className={`absolute ${issue.position} z-10 transition hover:scale-110 ${selectedIssue?.id === issue.id ? "scale-125" : ""}`}><MapPin className={`h-8 w-8 fill-current ${issue.color === "red" ? "text-red-500" : issue.color === "orange" ? "text-orange-400" : issue.color === "blue" ? "text-blue-500" : "text-emerald-500"}`} /><span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white" /></button>)}
								<div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/80 bg-white/90 px-3 py-2 text-[10px] font-semibold text-[#5d7891] shadow-sm backdrop-blur"><Navigation className="h-3.5 w-3.5 text-blue-500" />{manualLocation}</div>
								</div><div className="absolute right-4 top-4 flex flex-col gap-2"><div className="rounded-lg border border-white/80 bg-white/90 p-2 shadow-sm backdrop-blur"><button onClick={() => setMapZoom((zoom) => Math.min(zoom + 0.1, 1.4))} className="block rounded p-1 text-lg leading-none text-[#5d7891] hover:bg-blue-50" aria-label="Zoom in">+</button><button onClick={() => setMapZoom((zoom) => Math.max(zoom - 0.1, 0.8))} className="block rounded p-1 text-lg leading-none text-[#5d7891] hover:bg-blue-50" aria-label="Zoom out">−</button></div><button onClick={() => setShowHeatmap(!showHeatmap)} aria-label="Toggle civic issue heatmap" className={`rounded-lg border p-2 shadow-sm backdrop-blur transition ${showHeatmap ? "border-orange-300 bg-orange-50 text-orange-600" : "border-white/80 bg-white/90 text-[#5d7891]"}`}><Flame className="h-4 w-4" /></button><button onClick={() => setShowBoundaries(!showBoundaries)} aria-label="Toggle ward and zone boundaries" className={`rounded-lg border p-2 shadow-sm backdrop-blur transition ${showBoundaries ? "border-purple-300 bg-purple-50 text-purple-600" : "border-white/80 bg-white/90 text-[#5d7891]"}`}><Layers className="h-4 w-4" /></button></div>
							</div>
						</section>

						<aside className="space-y-5">
							<section className="rounded-xl border border-[#dce7f2] bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Nearby issues</h2><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">{filteredIssues.length} found</span></div><div className="mt-3 max-h-[360px] space-y-1 overflow-y-auto">{filteredIssues.length ? filteredIssues.map((issue) => <button key={issue.id} onClick={() => setSelectedId(issue.id)} className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${selectedIssue?.id === issue.id ? "bg-blue-50" : "hover:bg-[#f7fafc]"}`}><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${categoryColors[issue.category] ?? "bg-slate-400"}`} /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold text-[#304b68]">{issue.title}</span><span className="mt-1 block truncate text-[10px] text-[#7b91a6]">{issue.location}</span></span><ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#9aabba]" /></button>) : <p className="px-3 py-8 text-center text-xs text-[#8195a9]">No issues match these filters.</p>}</div></section>
							{selectedIssue && <section className="rounded-xl border border-[#dce7f2] bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${selectedIssue.status === "Resolved" ? "bg-emerald-50 text-emerald-600" : selectedIssue.status === "Open" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>{selectedIssue.status}</span><h2 className="mt-3 text-base font-bold text-[#304b68]">{selectedIssue.title}</h2></div><AlertCircle className="h-5 w-5 text-blue-500" /></div><p className="mt-2 text-xs text-[#71879d]">{selectedIssue.id} · {selectedIssue.age}</p><div className="mt-4 space-y-2 text-xs text-[#55718d]"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" />{selectedIssue.location}</div><div className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-emerald-600" />{selectedIssue.coordinates}</div><p className="text-[10px] text-[#8195a9]">{selectedIssue.ward} · {selectedIssue.zone}</p></div><div className="mt-4 rounded-lg border border-amber-100 bg-amber-50/70 p-3 text-[10px] leading-5 text-amber-800"><strong className="font-bold">Possible duplicate:</strong> A similar report may already exist within {radius} of this location.</div><button onClick={() => setSupportedIssues((current) => current.includes(selectedIssue.id) ? current.filter((id) => id !== selectedIssue.id) : [...current, selectedIssue.id])} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-50">{supportedIssues.includes(selectedIssue.id) ? "Issue supported" : "Support this issue"} <CheckCircle2 className="h-4 w-4" /></button></section>}
			<section className="rounded-xl border border-blue-100 bg-blue-50/70 p-4"><div className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-blue-600" /><div><h2 className="text-xs font-bold text-blue-900">Map intelligence</h2><p className="mt-1 text-[11px] leading-5 text-blue-800/70">Use the flame layer for complaint hotspots and the layers button for ward and zone boundaries. Similar reports are flagged before you submit.</p></div></div></section>
						</aside>
					</div>
				</div>
			</div>
		</main>
	);
}

function reverseGeocode(latitude: number, longitude: number) {
	if (latitude >= 25.4 && latitude <= 25.8 && longitude >= 84.9 && longitude <= 85.3) {
		return `Patna, Bihar (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
	}
	return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

function MapSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
	return <><>{open && <div className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm lg:hidden" onClick={onClose} />}</><aside className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[#dce7f2] bg-white transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex h-[72px] items-center border-b border-[#edf2f7] px-5"><Link href="/" className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center"><div className="relative"><div className="h-7 w-4 rotate-45 rounded-full bg-civic-green" /><div className="absolute -bottom-1 left-1 h-5 w-3 -rotate-12 rounded-full bg-blue-500" /></div></div><div><p className="font-display text-[16px] font-bold leading-none text-[#17345f]">Team SparkByte</p><p className="mt-1 text-[8px] font-medium text-[#6c8bab]">Cleaner Cities, Brighter Future</p></div></Link><button onClick={onClose} className="ml-auto lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button></div><nav className="flex-1 px-3 py-5"><MapNavItem icon={Home} label="Home" href="/dashboard" /><MapNavItem icon={Plus} label="Report Issue" href="/report" /><MapNavItem icon={Map} label="Explore Map" href="/explore-map" active /><MapNavItem icon={FileText} label="My Complaints" href="/my-complaints" /><MapNavItem icon={Bell} label="Notifications" href="/notifications" badge="3" /><MapNavItem icon={User} label="Profile" href="/profile" /></nav><div className="relative overflow-hidden border-t border-[#edf2f7] px-5 py-6"><div className="absolute -bottom-8 -left-4 opacity-20"><div className="h-20 w-20 rounded-full bg-civic-green" /></div><p className="relative text-xs font-semibold text-civic-green">Small actions</p><p className="relative mt-1 text-sm leading-relaxed text-[#53708e]">create cleaner,<br />safer and better<br />cities for all.</p></div></aside></>;
}

function MapNavItem({ icon: Icon, label, href = "#", active = false, badge }: { icon: LucideIcon; label: string; href?: string; active?: boolean; badge?: string }) {
	return <a href={href} className={`relative mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-[12px] font-semibold transition ${active ? "bg-blue-50 text-blue-600" : "text-[#344e6b] hover:bg-[#f5f8fb]"}`}><Icon className="h-[17px] w-[17px]" /><span>{label}</span>{badge && <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">{badge}</span>}</a>;
}
