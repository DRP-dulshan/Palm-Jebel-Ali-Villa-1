"use client";

import { listing } from "@/content/listing";
import { site } from "@/content/site";
import { GOOGLE_ADS_ID, WHATSAPP_CONVERSION_LABEL } from "@/content/consent";
import { WhatsAppIcon } from "./icons";

const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  listing.whatsapp.message
)}`;

/**
 * Floating WhatsApp button, bottom right on every screen size.
 *
 * It rides above the mobile sticky bar and the cookie banner while either is
 * showing — both publish their height through useReserveBottom.
 */
export default function WhatsAppButton() {
  const track = () => {
    window.gtag?.("event", "whatsapp_click", { placement: "floating_button" });
    if (WHATSAPP_CONVERSION_LABEL) {
      window.gtag?.("event", "conversion", {
        send_to: `${GOOGLE_ADS_ID}/${WHATSAPP_CONVERSION_LABEL}`,
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={track}
      aria-label={listing.whatsapp.label}
      title={listing.whatsapp.label}
      className="fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_8px_24px_rgba(13,38,56,0.28)] transition-[bottom,transform] duration-400 hover:scale-105 sm:right-6"
      style={{
        bottom:
          "calc(max(var(--reserve-sticky, 0px), var(--reserve-consent, 0px), env(safe-area-inset-bottom)) + 1rem)",
      }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
