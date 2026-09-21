"use client";

import { useEffect, useState } from "react";
import { whatsappHref } from "@/content/site";
import { WhatsAppIcon } from "./icons";

/**
 * Floating WhatsApp button, mobile only — it sits just above the sticky
 * enquiry bar. On desktop the enquiry section carries the WhatsApp action.
 */
export default function WhatsAppFab() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Tara on WhatsApp"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={`fixed right-4 bottom-24 z-45 flex h-13 w-13 items-center justify-center rounded-full bg-[#1da851] text-white shadow-[0_6px_24px_rgba(0,0,0,0.18)] transition-all duration-400 hover:scale-105 sm:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsAppIcon className="h-6.5 w-6.5" />
    </a>
  );
}
