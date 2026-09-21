"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Picture from "./Picture";
import Reveal from "./Reveal";
import { Container, Eyebrow, Section } from "./ui";
import { listing } from "@/content/listing";
import { CloseIcon, ZoomIcon, MinusIcon, PlusIcon } from "./icons";

const { floorPlans } = listing;

export default function FloorPlans() {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const level = floorPlans.levels[active];

  return (
    <Section id="floor-plans" tone="light">
      <Container>
        <Reveal>
          <Eyebrow className="text-ink-mute">{floorPlans.eyebrow}</Eyebrow>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08]">
              {floorPlans.heading}
            </h2>
            <p className="text-sm text-ink-mute">{floorPlans.note}</p>
          </div>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={100} className="mt-12">
          <div
            role="tablist"
            aria-label="Floor plan levels"
            className="flex flex-wrap gap-2 border-b border-ink/12 pb-px"
          >
            {floorPlans.levels.map((item, i) => (
              <button
                key={item.id}
                role="tab"
                id={`plan-tab-${item.id}`}
                aria-selected={i === active}
                aria-controls={`plan-panel-${item.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const next =
                      (active + (e.key === "ArrowRight" ? 1 : -1) + floorPlans.levels.length) %
                      floorPlans.levels.length;
                    setActive(next);
                    document.getElementById(`plan-tab-${floorPlans.levels[next].id}`)?.focus();
                  }
                }}
                className={`eyebrow -mb-px border-b-2 px-5 py-4 transition-colors duration-300 ${
                  i === active
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-mute hover:text-ink"
                }`}
              >
                {item.tab}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Panel */}
        <Reveal delay={160} className="mt-10">
          <div
            role="tabpanel"
            id={`plan-panel-${level.id}`}
            aria-labelledby={`plan-tab-${level.id}`}
            className="grid gap-8 lg:grid-cols-12 lg:gap-12"
          >
            <div className="lg:col-span-4 lg:pt-4">
              <h3 className="font-serif text-2xl font-light sm:text-3xl">
                {level.title}
              </h3>
              <dl className="mt-6 space-y-4 border-t border-ink/12 pt-6">
                <div>
                  <dt className="eyebrow text-ink-mute">Internal Area</dt>
                  <dd className="mt-1.5 font-serif text-xl font-light text-ink">
                    {level.area}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-mute">Outdoor</dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-ink-soft">
                    {level.outdoor}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => setZoomed(true)}
                className="eyebrow mt-8 inline-flex items-center gap-2.5 border border-ink/20 px-6 py-3.5 text-ink transition-colors duration-300 hover:border-accent hover:text-accent-text"
              >
                <ZoomIcon className="h-4 w-4" />
                View full screen
              </button>
            </div>

            {/*
              Light neutral plate behind the drawing so the thin linework
              keeps its contrast. The sheets are upscaled 6x from the source
              screenshots, so at ~1940px they stay sharp well past the
              displayed size and through the fullscreen zoom.
            */}
            <div className="lg:col-span-8">
              <button
                type="button"
                onClick={() => setZoomed(true)}
                aria-label={`Open the ${level.title} plan full screen`}
                className="group block w-full cursor-zoom-in border border-ink/10 bg-white p-4 transition-colors duration-300 hover:border-accent/40 sm:p-8"
              >
                <Picture
                  key={level.slug}
                  slug={level.slug}
                  alt={level.alt}
                  noBlur
                  sizes="(max-width: 1024px) 90vw, 620px"
                  className="mx-auto block w-full max-w-[620px]"
                  imgClassName="object-contain"
                />
              </button>
            </div>
          </div>
        </Reveal>
      </Container>

      {zoomed && (
        <PlanViewer
          index={active}
          onIndex={setActive}
          onClose={() => setZoomed(false)}
        />
      )}
    </Section>
  );
}

/* ---- Fullscreen viewer with pinch / wheel zoom ----------------------- */

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function PlanViewer({
  index,
  onIndex,
  onClose,
}: {
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const level = listing.floorPlans.levels[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Live gesture state — refs so pointer handlers never go stale
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<
    { dist: number; scale: number; x: number; y: number; ox: number; oy: number } | null
  >(null);
  const pan = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [gesturing, setGesturing] = useState(false);

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setGesturing(false);
  }, []);

  useEffect(() => reset(), [index, reset]);

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => clamp(s * 1.4, MIN_SCALE, MAX_SCALE));
      if (e.key === "-") setScale((s) => clamp(s / 1.4, MIN_SCALE, MAX_SCALE));
      if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, reset]);

  /** Zoom toward a point, keeping that point visually anchored. */
  const zoomAt = useCallback((factor: number, cx: number, cy: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const px = cx - rect.left - rect.width / 2;
    const py = cy - rect.top - rect.height / 2;

    setScale((prev) => {
      const next = clamp(prev * factor, MIN_SCALE, MAX_SCALE);
      const ratio = next / prev;
      setOffset((o) =>
        next === MIN_SCALE
          ? { x: 0, y: 0 }
          : { x: px - (px - o.x) * ratio, y: py - (py - o.y) * ratio }
      );
      return next;
    });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    // Register first: capture can throw (detached node, or a pointer id the
    // browser no longer considers active) and must not abort the gesture.
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {
      /* capture is an optimisation, not a requirement */
    }

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        scale,
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
        ox: offset.x,
        oy: offset.y,
      };
      pan.current = null;
      setGesturing(true);
    } else if (pointers.current.size === 1 && scale > 1) {
      pan.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
      setGesturing(true);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Two fingers: pinch
    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const start = gesture.current;
      const next = clamp((dist / start.dist) * start.scale, MIN_SCALE, MAX_SCALE);

      const stage = stageRef.current;
      if (stage) {
        const rect = stage.getBoundingClientRect();
        const px = start.x - rect.left - rect.width / 2;
        const py = start.y - rect.top - rect.height / 2;
        const ratio = next / start.scale;
        setOffset(
          next === MIN_SCALE
            ? { x: 0, y: 0 }
            : {
                x: px - (px - start.ox) * ratio,
                y: py - (py - start.oy) * ratio,
              }
        );
      }
      setScale(next);
      return;
    }

    // One finger / mouse: pan, only once zoomed in
    if (pan.current && scale > 1) {
      setOffset({
        x: pan.current.ox + (e.clientX - pan.current.x),
        y: pan.current.oy + (e.clientY - pan.current.y),
      });
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
    if (pointers.current.size === 0) {
      pan.current = null;
      setGesturing(false);
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && Math.abs(e.deltaY) < 2) return;
    zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${level.title} plan`}
      className="fixed inset-0 z-[70] flex animate-[fadeIn_.3s_ease-out] flex-col bg-stone-900/97 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-sand-100 sm:px-8">
        <p className="eyebrow text-sand-100">{level.title}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close floor plan"
          className="flex h-11 w-11 items-center justify-center text-sand-100/70 transition-colors hover:text-white"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Level switcher */}
      <div className="flex justify-center gap-2 px-5 pb-3">
        {listing.floorPlans.levels.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onIndex(i)}
            aria-current={i === index}
            className={`eyebrow border px-4 py-2 transition-colors ${
              i === index
                ? "border-ink bg-ink text-sand-50"
                : "border-sand-100/25 text-sand-100/70 hover:text-white"
            }`}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onWheel={onWheel}
        onDoubleClick={(e) =>
          scale > 1 ? reset() : zoomAt(2.5, e.clientX, e.clientY)
        }
        // touch-action none so the browser hands us the pinch instead of
        // zooming the whole page
        className="relative flex flex-1 touch-none items-center justify-center overflow-hidden px-3 sm:px-10"
        style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
      >
        <div
          className="max-h-full will-change-transform"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
            transition: gesturing ? "none" : "transform .25s ease-out",
          }}
        >
          <img
            src={`/images/${level.slug}.webp`}
            alt={level.alt}
            draggable={false}
            className="max-h-[68svh] w-auto max-w-full bg-white object-contain p-2 select-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={() => setScale((s) => clamp(s / 1.4, MIN_SCALE, MAX_SCALE))}
          disabled={scale <= MIN_SCALE}
          aria-label="Zoom out"
          className="flex h-11 w-11 items-center justify-center border border-sand-100/25 text-sand-100 transition-colors hover:border-sand-100/60 disabled:opacity-30"
        >
          <MinusIcon className="h-5 w-5" />
        </button>
        <span className="eyebrow w-16 text-center text-sand-100/60 lining-nums tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setScale((s) => clamp(s * 1.4, MIN_SCALE, MAX_SCALE))}
          disabled={scale >= MAX_SCALE}
          aria-label="Zoom in"
          className="flex h-11 w-11 items-center justify-center border border-sand-100/25 text-sand-100 transition-colors hover:border-sand-100/60 disabled:opacity-30"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
