import {
  Car,
  Trash2,
  Droplet,
  Zap,
  Waves,
  Lightbulb,
  ShieldAlert,
  MoreHorizontal,
} from "lucide-react";

const categories = [
  { label: "Roads", icon: Car, color: "text-civic-blue", bg: "bg-civic-blue/10" },
  { label: "Garbage & waste", icon: Trash2, color: "text-civic-green", bg: "bg-civic-green/10" },
  { label: "Water supply", icon: Droplet, color: "text-civic-cyan", bg: "bg-civic-cyan/10" },
  { label: "Electricity", icon: Zap, color: "text-civic-orange", bg: "bg-civic-orange/10" },
  { label: "Drainage", icon: Waves, color: "text-civic-purple", bg: "bg-civic-purple/10" },
  { label: "Streetlights", icon: Lightbulb, color: "text-civic-rose", bg: "bg-civic-rose/10" },
  { label: "Public safety", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-600/10" },
  { label: "Other", icon: MoreHorizontal, color: "text-ink/60", bg: "bg-ink/5" },
];

export default function Categories() {
  return (
    <section id="categories" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-lg">
          <p className="font-display text-[13px] font-semibold text-civic-purple">
            Categories
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy sm:text-4xl">
            Report across every kind of civic issue
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink/60">
            From a cracked pavement to a flickering streetlight, every
            category reaches a department that's ready to act on it.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map(({ label, icon: Icon, color, bg }) => (
            <a
              key={label}
              href="#report"
              className="group flex flex-col gap-4 rounded-2xl border border-ink/10 p-5 transition-colors hover:border-navy/20"
            >
              <span
                className={`${bg} flex h-11 w-11 items-center justify-center rounded-xl`}
              >
                <Icon className={`h-5 w-5 ${color}`} strokeWidth={2.1} />
              </span>
              <span className="text-[14px] font-semibold text-navy">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}