import { Camera, Cpu, UserCheck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Report the issue",
    text: "Add a photo, your location and a short description of what's wrong.",
  },
  {
    icon: Cpu,
    title: "AI reads and sorts it",
    text: "The report is classified automatically and routed to the right department.",
  },
  {
    icon: UserCheck,
    title: "An officer takes it on",
    text: "The department assigns a field officer, and you're notified who's on it.",
  },
  {
    icon: CheckCircle2,
    title: "It gets resolved",
    text: "Track progress in real time and confirm once the fix is done.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.6fr] lg:gap-10">
        <div>
          <p className="font-display text-[13px] font-semibold text-civic-blue">
            Report. Track. Resolve.
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-ink/60">
            Four steps take a pothole from a phone photo to a fixed road —
            and you can watch every one of them happen.
          </p>
        </div>

        <ol className="relative grid gap-10 sm:grid-cols-2">
          <div
            aria-hidden="true"
            className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-ink/10 sm:left-1/2 sm:block sm:h-px sm:w-[calc(100%-3rem)]"
          />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-white">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[12px] font-semibold tracking-wide text-ink/35">
                  Step {i + 1}
                </p>
                <p className="mt-0.5 font-display text-[16px] font-semibold text-navy">
                  {title}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink/60">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}