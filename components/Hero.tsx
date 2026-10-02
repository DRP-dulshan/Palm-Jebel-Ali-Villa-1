"use client";

import { useEffect, useRef } from "react";
import Picture from "./Picture";
import { listing } from "@/content/listing";
import { ArrowDownIcon } from "./icons";
import EnquiryDialog from "./EnquiryDialog";

export default function Hero() {
  const layer = useRef<HTMLDivElement>(null);

  /**
   * Gentle parallax — the image drifts at ~25% of scroll speed.
   * Only on sm and up: on mobile the image sits in normal flow above the
   * copy, so shifting it would open a gap.
   */
  useEffect(() => {
    const node = layer.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wide = window.matchMedia("(min-width: 640px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!wide.matches) {
        node.style.transform = "";
        return;
      }
      const y = Math.min(window.scrollY, window.innerHeight);
      node.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(1.12)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    wide.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const { hero } = listing;
  const rise = "animate-[fadeUp_1s_cubic-bezier(.22,1,.36,1)_both]";

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-stone-900 sm:justify-end"
    >
      {/*
        Mobile: a band at the top, so the villa is actually legible.
        sm and up: full-bleed behind the copy.
      */}
      <div
        ref={layer}
        className="relative h-[46svh] w-full shrink-0 will-change-transform sm:absolute sm:inset-0 sm:h-full"
      >
        <Picture
          slug="hero-beachfront"
          priority
          sizes="100vw"
          className="block h-full w-full"
          imgClassName="object-[center_58%] sm:object-[center_62%]"
        />
        {/* Fades the band into the dark copy area below */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-900 to-transparent sm:hidden"
          aria-hidden="true"
        />
      </div>

      {/*
        Legibility scrim, desktop only — on mobile the copy sits on solid dark.

        Two layers rather than one: the copy runs down the left of a very
        bright render (sunlit stone and glass), where a purely vertical
        gradient left the headline at ~2:1 against white. The horizontal
        layer darkens the column the text occupies and clears away to the
        right, so the villa still reads at full brightness.
      */}
      <div
        className="absolute inset-0 hidden bg-gradient-to-t from-stone-900/88 via-stone-900/30 via-55% to-stone-900/40 sm:block"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-gradient-to-r from-stone-900/88 from-5% via-stone-900/64 via-42% to-transparent to-78% sm:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-[92rem] flex-1 flex-col justify-end px-6 pb-28 pt-10 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pb-24">
        <div className="max-w-3xl text-white">
          <p className={`eyebrow ${rise} text-white/85`} style={{ animationDelay: "120ms" }}>
            {hero.eyebrow}
          </p>

          <h1
            className={`mt-5 ${rise} text-[clamp(2.75rem,10vw,7rem)] leading-[0.95] tracking-tight sm:mt-6`}
            style={{ animationDelay: "240ms" }}
          >
            {hero.headline}
          </h1>

          <p
            className={`mt-5 ${rise} font-serif text-2xl font-light text-white/95 sm:mt-6 sm:text-3xl`}
            style={{ animationDelay: "360ms" }}
          >
            {hero.sub}
          </p>

          <p
            className={`mt-4 max-w-xl ${rise} text-[0.9375rem] leading-relaxed text-white/75 sm:mt-5 sm:text-[0.95rem]`}
            style={{ animationDelay: "440ms" }}
          >
            {hero.line}
          </p>

          <p
            className={`mt-7 ${rise} font-serif text-3xl font-light tracking-wide lining-nums tabular-nums sm:mt-8 sm:text-4xl`}
            style={{ animationDelay: "520ms" }}
          >
            {hero.price}
          </p>

          <div
            className={`mt-7 flex flex-col gap-3 ${rise} sm:mt-9 sm:flex-row sm:gap-4`}
            style={{ animationDelay: "600ms" }}
          >
            <EnquiryDialog
              kind="private"
              className="eyebrow inline-flex w-full items-center justify-center bg-ink px-8 py-4 text-sand-50 transition-colors duration-300 hover:bg-teal-deep sm:w-auto"
            >
              {hero.cta}
            </EnquiryDialog>
            <EnquiryDialog
              kind="brochure"
              className="eyebrow inline-flex w-full items-center justify-center border border-white/40 bg-transparent px-8 py-4 text-white backdrop-blur-[2px] transition-colors duration-300 hover:bg-white hover:text-ink sm:w-auto"
            >
              {hero.brochureCta}
            </EnquiryDialog>
          </div>
        </div>

        {/* Stats row */}
        <dl
          className={`mt-10 grid ${rise} grid-cols-2 gap-x-6 gap-y-7 border-t border-white/20 pt-8 text-white sm:mt-16 sm:grid-cols-4 lg:gap-x-10`}
          style={{ animationDelay: "700ms" }}
        >
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="font-serif text-[1.75rem] font-light leading-none sm:text-[2.125rem]">
                {stat.value}
                {stat.unit && (
                  <span className="ml-1.5 font-sans text-xs tracking-wide text-white/70">
                    {stat.unit}
                  </span>
                )}
              </dd>
              <dt className="eyebrow mt-2.5 text-[0.625rem] text-white/60">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Centred: the bottom-right corner belongs to the WhatsApp button */}
      <a
        href="#opportunity"
        aria-label="Scroll to the next section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/60 transition-colors hover:text-white lg:block"
      >
        <ArrowDownIcon className="h-6 w-6 animate-[drift_2.4s_ease-in-out_infinite]" />
      </a>
    </section>
  );
}
