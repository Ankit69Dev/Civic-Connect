import { Users, FileCheck2, Building2, Clock } from "lucide-react";

const stats = [
  {
    value: "1.2M+",
    label: "Citizens empowered",
    sub: "Real people, real change",
    icon: Users,
    color: "text-civic-green",
  },
  {
    value: "85K+",
    label: "Issues reported",
    sub: "From potholes to water leaks",
    icon: FileCheck2,
    color: "text-civic-purple",
  },
  {
    value: "25+",
    label: "Departments connected",
    sub: "Working together for you",
    icon: Building2,
    color: "text-civic-orange",
  },
  {
    value: "72%",
    label: "Faster resolution",
    sub: "With AI-powered routing",
    icon: Clock,
    color: "text-civic-blue",
  },
];

export default function StatsBar() {
  return (
    <section className="relative z-10 -mt-10 px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl bg-ink/5 shadow-panel lg:grid-cols-4">
        {stats.map(({ value, label, sub, icon: Icon, color }) => (
          <div key={label} className="flex flex-col gap-2 bg-white p-6">
            <Icon className={`h-5 w-5 ${color}`} strokeWidth={2.25} />
            <p className="font-display text-2xl font-semibold text-navy">
              {value}
            </p>
            <div>
              <p className="text-[13.5px] font-semibold text-ink/80">
                {label}
              </p>
              <p className="text-[12px] text-ink/45">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}