"use client";

import { useEffect, useState } from "react";
import { listing } from "@/content/listing";

/**
 * Mobile-only sticky enquiry bar. Appears once the hero is scrolled past
 * and hides again while the enquiry form itself is on screen.
 */
export default function StickyBar() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.6;
      const form = document.getElementById("enquire");
      const formVisible = form
        ? form.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setShown(past && !formVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-sand-50/95 backdrop-blur-md transition-transform duration-400 sm:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!shown}
    >
      <div className="p-3">
        <a
          href="#enquire"
          tabIndex={shown ? 0 : -1}
          className="eyebrow flex items-center justify-center bg-accent px-4 py-4 text-center text-ink"
        >
          {listing.hero.cta}
        </a>
      </div>
    </div>
  );
}
