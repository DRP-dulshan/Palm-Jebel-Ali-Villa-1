"use client";

import { useEffect, useRef, useState } from "react";
import Picture from "./Picture";
import Reveal from "./Reveal";
import { Container, Eyebrow, Section } from "./ui";
import { listing } from "@/content/listing";
import { CheckIcon } from "./icons";

/* ---- 6. Frond A ------------------------------------------------------ */

export function FrondA() {
  const { frond } = listing;

  return (
    <Section id="frond" tone="sand">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <Eyebrow className="text-ink-mute">{frond.eyebrow}</Eyebrow>
            <h2 className="mt-7 text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08]">
              {frond.heading}
            </h2>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-6 lg:col-start-7">
            <p className="text-[1.0625rem] leading-[1.85] text-ink-soft">{frond.body}</p>
          </Reveal>
        </div>

        {/* The high-villa-number callout — the key selling point of this section */}
        <Reveal className="mt-16 sm:mt-20">
          <div className="relative overflow-hidden border border-accent/25 bg-sand-50">
            <span
              className="absolute inset-y-0 left-0 w-1 bg-accent"
              aria-hidden="true"
            />
            <div className="grid gap-0 lg:grid-cols-12">
              <div className="px-8 py-12 sm:px-12 sm:py-14 lg:col-span-7">
                <Eyebrow className="text-accent-text" withRule={false}>
                  Position on the frond
                </Eyebrow>
                <h3 className="mt-5 text-[clamp(1.5rem,3.6vw,2.25rem)] leading-[1.18]">
                  {frond.callout.heading}
                </h3>
                <p className="mt-6 text-[1.0625rem] leading-[1.85] text-ink-soft">
                  {frond.callout.body}
                </p>

                <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                  {["Greater privacy", "Less passing traffic", "Quieter beach"].map(
                    (point) => (
                      <li
                        key={point}
                        className="eyebrow flex items-center gap-2.5 text-ink"
                      >
                        <CheckIcon className="h-3.5 w-3.5 text-accent-text" />
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="relative min-h-[260px] lg:col-span-5">
                <Picture
                  slug="exterior-arrival"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="absolute inset-0 block h-full w-full"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-16 sm:mt-20">
          <p className="max-w-3xl text-[1.0625rem] leading-[1.85] text-ink-soft">
            {frond.closing}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---- 7. Palm Jebel Ali ----------------------------------------------- */

export function Masterplan() {
  const { masterplan } = listing;

  return (
    <Section id="palm-jebel-ali" tone="dark">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <Eyebrow className="text-sand-100/50">{masterplan.eyebrow}</Eyebrow>
            <h2 className="mt-7 text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08] text-sand-50">
              {masterplan.heading}
            </h2>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            {masterplan.body.map((paragraph, i) => (
              <Reveal key={i} delay={100 + i * 90}>
                <p
                  className={`text-[1.0625rem] leading-[1.85] text-sand-100/70 ${
                    i > 0 ? "mt-6" : ""
                  }`}
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Animated counters */}
        <dl className="mt-20 grid gap-12 border-t border-sand-100/15 pt-14 sm:mt-28 sm:grid-cols-2 sm:gap-20">
          {masterplan.counters.map((counter, i) => (
            <Reveal key={counter.label} delay={i * 140}>
              <dd className="font-serif text-[clamp(4rem,14vw,9rem)] font-light leading-[0.85] text-sand-50">
                <Counter to={counter.value} />
                <span className="text-accent">{counter.suffix}</span>
              </dd>
              <dt className="eyebrow mt-6 text-sand-100/55">{counter.label}</dt>
            </Reveal>
          ))}
        </dl>

        <Reveal className="mt-20 sm:mt-28">
          <p className="font-serif text-[clamp(1.75rem,5vw,3rem)] font-light leading-[1.25] text-sand-50">
            {masterplan.closing.map((word) => (
              <span key={word} className="mr-4 inline-block">
                {word.replace(/\.$/, "")}
                <span className="text-accent">.</span>
              </span>
            ))}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

/** Counts up from zero the first time it scrolls into view. */
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(to);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setValue(Math.round(eased * to));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">{value}</span>
      <span className="sr-only">{to}</span>
    </span>
  );
}

/* ---- 8. The Investment Perspective ----------------------------------- */

export function Investment() {
  const { investment } = listing;

  return (
    <Section id="investment" tone="light">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <Eyebrow className="text-ink-mute">{investment.eyebrow}</Eyebrow>
            <h2 className="mt-7 text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08]">
              {investment.heading}
            </h2>
            {investment.body.map((paragraph, i) => (
              <p
                key={i}
                className="mt-7 text-[1.0625rem] leading-[1.85] text-ink-soft"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {investment.checklist.map((item) => (
                <li key={item} className="flex items-center gap-4 py-4.5">
                  <CheckIcon className="h-4 w-4 shrink-0 text-accent-text" />
                  <span className="text-[0.9375rem] text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-16 sm:mt-20">
          <p className="max-w-3xl font-serif text-[clamp(1.25rem,3vw,1.75rem)] font-light italic leading-[1.5] text-ink">
            {investment.closing}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---- 9. At a Glance --------------------------------------------------- */

export function AtAGlance() {
  const { glance } = listing;

  return (
    <Section id="specification" tone="sand">
      <Container>
        <Reveal className="mb-12 sm:mb-16">
          <Eyebrow className="text-ink-mute">{glance.eyebrow}</Eyebrow>
          <h2 className="mt-7 text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08]">
            {glance.heading}
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <dl className="border-t border-ink/12">
            {glance.rows.map((row) => (
              <div
                key={row.label}
                className={`flex flex-col gap-1 border-b border-ink/12 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-6 ${
                  row.emphasis ? "bg-sand-50/60 px-4 sm:px-6" : ""
                }`}
              >
                <dt className="eyebrow text-ink-mute">{row.label}</dt>
                <dd
                  className={
                    row.emphasis
                      ? "font-serif text-2xl font-light text-accent-text sm:text-3xl"
                      : "font-serif text-xl font-light text-ink sm:text-2xl"
                  }
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

      </Container>
    </Section>
  );
}
