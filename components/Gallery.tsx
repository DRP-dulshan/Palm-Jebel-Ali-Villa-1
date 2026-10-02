"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Picture from "./Picture";
import Reveal from "./Reveal";
import { Container, Eyebrow } from "./ui";
import { listing, photos } from "@/content/listing";
import { CloseIcon, ChevronIcon, ExpandIcon } from "./icons";
import BrochureCta from "./BrochureCta";

/** Editorial grid — deliberately uneven so it reads as a magazine spread. */
const SPANS = [
  "sm:col-span-7 aspect-[4/3]",
  "sm:col-span-5 aspect-[4/5]",
  "sm:col-span-5 aspect-[4/5]",
  "sm:col-span-7 aspect-[4/3]",
  "sm:col-span-6 aspect-[3/2]",
  "sm:col-span-6 aspect-[3/2]",
  "sm:col-span-7 aspect-[4/3]",
  "sm:col-span-5 aspect-[4/5]",
];

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const { gallery } = listing;

  return (
    <section id="gallery" className="scroll-mt-20 bg-sand-50 py-24 sm:py-32 lg:py-40">
      <Container width="wide">
        <Reveal className="mb-14 sm:mb-20">
          <Eyebrow className="text-ink-mute">{gallery.eyebrow}</Eyebrow>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08]">
              {gallery.heading}
            </h2>
            <p className="text-sm text-ink-mute">{gallery.note}</p>
          </div>
        </Reveal>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-5 lg:gap-6">
          {photos.map((item, i) => (
            <Reveal
              as="li"
              key={item.slug}
              delay={(i % 2) * 110}
              className={`${SPANS[i] ?? "sm:col-span-6 aspect-[3/2]"} group relative`}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View ${item.caption} full screen`}
                className="relative block h-full w-full overflow-hidden bg-sand-200"
              >
                <Picture
                  slug={item.slug}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                  className="block h-full w-full"
                  imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="eyebrow pointer-events-none absolute bottom-5 left-5 flex items-center gap-2.5 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <ExpandIcon className="h-4 w-4" />
                  {item.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 flex flex-col gap-7 border-t border-ink/10 pt-10 sm:mt-20 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:pt-12">
          <p className="max-w-xl font-serif text-[1.625rem] font-light leading-snug sm:text-3xl">
            {gallery.brochureLine}
          </p>
          <BrochureCta className="eyebrow inline-flex w-full shrink-0 items-center justify-center bg-ink px-8 py-4 text-sand-50 transition-colors duration-300 hover:bg-teal-deep sm:w-auto">
            {gallery.brochureCta}
          </BrochureCta>
        </Reveal>
      </Container>

      {open !== null && (
        <Lightbox index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      )}
    </section>
  );
}

/* ---- Fullscreen lightbox -------------------------------------------- */

function Lightbox({
  index,
  onClose,
  onIndex,
}: {
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const last = photos.length - 1;

  const go = useCallback(
    (delta: number) => onIndex((index + delta + photos.length) % photos.length),
    [index, onIndex]
  );

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [go, onClose]);

  const current = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${current.caption} — image ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-[70] flex animate-[fadeIn_.35s_ease-out] flex-col bg-stone-900/97 backdrop-blur-sm"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 text-sand-100 sm:px-8">
        <span className="eyebrow text-sand-100/60">
          {String(index + 1).padStart(2, "0")}{" "}
          <span className="mx-1 opacity-40">/</span>{" "}
          {String(photos.length).padStart(2, "0")}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-11 w-11 items-center justify-center text-sand-100/70 transition-colors hover:text-white"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3 sm:px-16">
        <Picture
          key={current.slug}
          slug={current.slug}
          priority
          sizes="(max-width: 640px) 100vw, 88vw"
          className="block max-h-full max-w-full animate-[fadeIn_.5s_ease-out]"
          imgClassName="max-h-[74svh] w-auto object-contain"
        />

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="absolute left-1 flex h-12 w-12 items-center justify-center text-sand-100/60 transition-colors hover:text-white sm:left-4"
        >
          <ChevronIcon className="h-7 w-7" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="absolute right-1 flex h-12 w-12 items-center justify-center text-sand-100/60 transition-colors hover:text-white sm:right-4"
        >
          <ChevronIcon className="h-7 w-7 rotate-180" />
        </button>
      </div>

      <div className="px-5 pb-8 pt-5 text-center sm:px-8">
        <p className="eyebrow text-sand-100">{current.caption}</p>
        <p className="mx-auto mt-2 max-w-xl text-[0.8125rem] leading-relaxed text-sand-100/65">
          {current.alt}
        </p>
        <p className="sr-only" aria-live="polite">
          Image {index + 1} of {photos.length}: {current.caption}
        </p>
        {index === last && <span className="sr-only">Last image</span>}
      </div>
    </div>
  );
}
