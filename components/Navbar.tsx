"use client";

import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Track Complaints", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-white/30 text-black shadow-lg backdrop-blur-xl"
          : "border-ink/10 bg-white"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-8 py-5 transition-all duration-300 lg:px-14 xl:px-20">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-civic-green/10 ring-1 ring-civic-green/20">
            <Sprout
              className="h-6 w-6 text-civic-green"
              strokeWidth={2.25}
            />
          </span>

          <span className="font-display leading-tight text-ink">
            <span className="block text-[18px] font-semibold tracking-tight">
              CivicConnect
            </span>

            <span className="block text-[12px] font-medium text-ink/50">
              Cleaner Cities, Brighter Future
            </span>
          </span>
        </a>

        {/* Navigation links */}
        <ul className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[16px] font-medium text-ink/70 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Login / Register */}
        <a
          href="/login"
          className="rounded-full bg-navy px-7 py-3 text-[15px] font-semibold text-white shadow-panel transition-transform hover:-translate-y-0.5"
        >
          Login / Register
        </a>
        
      </nav>
    </header>
  );
}