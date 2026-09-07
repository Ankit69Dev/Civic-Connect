
import Image from "next/image";
import { Zap, ShieldCheck, Users2, ArrowRight, MapPin } from "lucide-react";


const features = [
  { label: "Fast Reporting", icon: Zap },
  { label: "Transparent Tracking", icon: ShieldCheck },
  { label: "Stronger Communities", icon: Users2 },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative  overflow-hidden bg-navy"
    >
      {/* Background banner */}
      <Image
        src="/hero-banner.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Dark / gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,37,64,0.88) 0%, rgba(18,58,99,0.75) 32%, rgba(44,94,124,0.55) 58%, rgba(201,138,75,0.35) 82%, rgba(244,199,122,0.25) 100%)",
        }}
      />
      {/* Main content */}
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 pb-40 pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pb-64 lg:pt-52">
        
        {/* Left column */}
        <div className="flex flex-col justify-center">
          
          {/* Badge */}
          <span className="animate-rise-1 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[12.5px] font-medium text-white/85 backdrop-blur">
            <span className="flex gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>

            For a cleaner, safer, smarter India
          </span>

          {/* Heading */}
          <h1 className="animate-rise-2 mt-6 font-display text-[2.6rem] font-semibold leading-[1.08] text-white sm:text-[3.25rem]">
            Report civic issues.
            <br />
            Build a better tomorrow.
          </h1>

          {/* Description */}
          <p className="animate-rise-3 mt-5 max-w-md text-[15.5px] leading-relaxed text-white/70">
            CivicConnect turns every citizen into a first responder for their
            city — snap a photo, drop a pin, and watch it route straight to
            the department that can fix it.
          </p>

          {/* Buttons */}
          <div className="animate-rise-4 mt-8 flex flex-wrap items-center gap-4">
            
            <a
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-civic-green px-6 py-3.5 text-[14.5px] font-semibold text-white shadow-panel transition-transform hover:-translate-y-0.5"
            >
              Report an issue

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            
          </div>

          {/* Features */}
          <div className="animate-rise-4 mt-11 flex flex-wrap gap-x-8 gap-y-3">
            {features.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-white/75"
              >
                <Icon className="h-4 w-4 text-emerald-300" />

                <span className="text-[13.5px] font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="relative flex items-center justify-center lg:justify-end">
          
         
          </div>
        </div>
    </section>
  );
}
