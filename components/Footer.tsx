import { Sprout, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-navy text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-civic-green/15">
                <Sprout className="h-4 w-4 text-emerald-300" />
              </span>
              <span className="font-display text-[15px] font-semibold text-white">
                CivicConnect
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed">
              A crowdsourced platform connecting citizens, government
              departments and field officers to fix cities faster.
            </p>
          </div>

          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-wide text-white/40">
              Platform
            </p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li><a href="#report" className="hover:text-white">Report an issue</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How it works</a></li>
              <li><a href="#categories" className="hover:text-white">Categories</a></li>
              <li><a href="#map" className="hover:text-white">Explore the map</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-wide text-white/40">
              Company
            </p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">For departments</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Privacy policy</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-wide text-white/40">
              Get in touch
            </p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> hello@civicconnect.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[12.5px] text-white/40">
            © {new Date().getFullYear()} CivicConnect. Built for a cleaner,
            greener India.
          </p>
          <div className="flex h-1.5 w-24 overflow-hidden rounded-full">
            <span className="flex-1 bg-orange-400" />
            <span className="flex-1 bg-white" />
            <span className="flex-1 bg-emerald-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}