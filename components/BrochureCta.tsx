"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import EnquiryForm from "./EnquiryForm";
import { listing } from "@/content/listing";
import { CloseIcon } from "./icons";

const { brochure } = listing;

/**
 * "Get Floor Plans & Payment Plan" — a button that opens the short brochure
 * form in a modal. The form posts through /api/enquiry like the main one,
 * marked as a brochure request, and lands on /thank-you/.
 *
 * Uses the native <dialog>: showModal() gives the top layer, Escape to
 * close and inert page content behind it for free.
 */
export default function BrochureCta({
  className = "",
  children = listing.hero.brochureCta,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const node = dialog.current;
    if (!node || !open) return;

    node.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      if (node.open) node.close();
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={className}
      >
        {children}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        // A click on the backdrop lands on the <dialog> itself
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-auto max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto border-0 bg-sand-50 p-0 text-ink backdrop:bg-stone-900/80 backdrop:backdrop-blur-sm open:animate-[fadeUp_.45s_cubic-bezier(.22,1,.36,1)_both]"
      >
        {/* Rendered only while open, so every opening starts with a fresh form */}
        {open && (
          <div className="relative px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={brochure.close}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-ink-mute transition-colors hover:text-ink"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            <p className="eyebrow text-ink-mute">{brochure.eyebrow}</p>
            <h2
              id={titleId}
              className="mt-4 text-[clamp(1.75rem,6vw,2.25rem)] leading-[1.1]"
            >
              {brochure.heading}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              {brochure.sub}
            </p>

            <div className="mt-6">
              <EnquiryForm kind="brochure" />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
