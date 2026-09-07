import {
  Megaphone,
  MapPin,
  ClipboardList,
  Bell,
  Wifi,
  Signal,
  BatteryFull,
  ChevronRight,
  Sprout,
  Car,
  Trash2,
  Droplet,
  Zap,
  Waves,
  Lightbulb,
} from "lucide-react";

const actions = [
  { label: "Report Issue", icon: Megaphone, bg: "bg-civic-blue" },
  { label: "Explore Map", icon: MapPin, bg: "bg-civic-green" },
  { label: "My Complaints", icon: ClipboardList, bg: "bg-civic-purple" },
  { label: "Notifications", icon: Bell, bg: "bg-civic-orange" },
];

const categories = [
  { label: "Roads", icon: Car, color: "text-civic-blue", bg: "bg-civic-blue/10" },
  { label: "Garbage", icon: Trash2, color: "text-civic-green", bg: "bg-civic-green/10" },
  { label: "Water", icon: Droplet, color: "text-civic-cyan", bg: "bg-civic-cyan/10" },
  { label: "Electricity", icon: Zap, color: "text-civic-orange", bg: "bg-civic-orange/10" },
  { label: "Drainage", icon: Waves, color: "text-civic-purple", bg: "bg-civic-purple/10" },
  { label: "Streetlights", icon: Lightbulb, color: "text-civic-rose", bg: "bg-civic-rose/10" },
];

export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] select-none sm:w-[320px]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-white/10 blur-2xl" />
      <div className="rounded-[2.75rem] border-[6px] border-navy/90 bg-navy/90 p-2 shadow-panel">
        <div className="overflow-hidden rounded-[2.1rem] bg-white">
          {/* status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold text-ink">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <BatteryFull className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="px-5 pb-6">
            {/* app header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-civic-green/15">
                  <Sprout className="h-4 w-4 text-civic-green" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-[13px] font-semibold text-navy">
                    CivicConnect
                  </p>
                  <p className="text-[9.5px] text-ink/50">
                    Cleaner Cities, Brighter Future
                  </p>
                </div>
              </div>
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-ink/5">
                <Bell className="h-3.5 w-3.5 text-ink/60" />
                <span className="pulse-dot absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-civic-rose" />
              </span>
            </div>

            {/* greeting */}
            <div className="mt-4">
              <p className="font-display text-[15px] font-semibold text-navy">
                Good Morning, Citizen!
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-ink/55">
                Together we can build a cleaner, safer and better city.
              </p>
            </div>

            {/* action grid */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {actions.map(({ label, icon: Icon, bg }) => (
                <div
                  key={label}
                  className={`${bg} flex flex-col gap-2 rounded-xl px-3 py-3 text-white`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.25} />
                  <span className="text-[11px] font-semibold leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* nearby issues */}
            <div className="mt-5 flex items-center justify-between">
              <p className="text-[12px] font-semibold text-navy">
                Nearby Civic Issues
              </p>
              <p className="text-[10.5px] font-medium text-civic-blue">
                View All
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-ink/5 bg-mist p-2">
              <span className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-civic-orange/40 to-civic-rose/40" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-navy">
                  Pothole on MG Road
                </p>
                <p className="text-[9.5px] text-ink/45">0.5 km away</p>
                <span className="mt-0.5 inline-block rounded-full bg-civic-rose/10 px-1.5 py-0.5 text-[8.5px] font-semibold text-civic-rose">
                  High Priority
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-ink/30" />
            </div>

            {/* categories */}
            <p className="mt-5 text-[12px] font-semibold text-navy">
              Quick Categories
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {categories.map(({ label, icon: Icon, color, bg }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-ink/5 py-2.5"
                >
                  <span className={`${bg} flex h-7 w-7 items-center justify-center rounded-full`}>
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                  </span>
                  <span className="text-[9px] font-medium text-ink/60">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}