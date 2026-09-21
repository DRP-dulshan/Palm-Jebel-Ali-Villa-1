"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { listing } from "@/content/listing";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-ink" : "bg-transparent"
      }`}
    >
      {/*
        The logo is white artwork, so over the hero photo it needs its own
        scrim. This fades out once the header takes a solid background.
      */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-stone-900/75 via-stone-900/35 to-transparent transition-opacity duration-500 ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-[92rem] items-center justify-between px-6 py-4 sm:px-8 sm:py-5 lg:px-12">
        <a
          href="#top"
          className="flex items-center"
          aria-label="Back to top"
        >
          <Logo priority className="h-6 sm:h-7" />
        </a>

        <a
          href="#enquire"
          className="eyebrow hidden items-center border border-white/50 px-6 py-3 text-white transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-ink sm:inline-flex"
        >
          {listing.hero.cta}
        </a>

        {/* Mobile: the sticky bottom bar carries the CTA, so keep the header quiet */}
        <a href="#enquire" className="eyebrow text-white sm:hidden">
          Enquire
        </a>
      </div>
    </header>
  );
}
