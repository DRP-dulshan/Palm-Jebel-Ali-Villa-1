import Reveal from "./Reveal";
import { Container, Eyebrow, Section } from "./ui";
import { listing } from "@/content/listing";
import legend from "@/content/map-legend.json";

const { location } = listing;

/**
 * Where the villa sits on Dubai's coastline.
 *
 * The map is real geometry, not an illustration: OpenStreetMap coastline
 * and motorway data, Web-Mercator projected at build time by
 * scripts/build-map.mjs, with every pin placed from its coordinates.
 *
 * It ships as a static SVG file rather than inline markup — ~90KB of paths
 * in the page HTML cost 0.3s of mobile LCP. Lazy-loaded below the fold, it
 * costs nothing until it is scrolled to.
 */
export default function LocationMap() {
  return (
    <Section id="location" tone="dark" className="overflow-hidden">
      <Container>
        <Reveal className="text-center">
          <Eyebrow className="justify-center text-sand-100/50" withRule={false}>
            {location.eyebrow}
          </Eyebrow>
          <h2 className="mx-auto mt-7 max-w-3xl text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08] text-sand-50">
            {location.heading}
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2 sm:gap-12">
          {location.body.map((paragraph, i) => (
            <Reveal key={i} delay={100 + i * 90}>
              <p className="text-[0.9375rem] leading-[1.9] text-sand-100/65">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>

      {/*
        Shown whole on desktop. On a phone the full 60 km frame shrinks to an
        unreadable band, so the container goes tall and object-position crops
        the map from its left edge — keeping the island, its label and the
        nearer destinations legible. The compact cut drops the place labels
        that would be too small to read there; the legend below carries them.
      */}
      <Reveal delay={160} className="mt-16 sm:mt-20">
        <div className="aspect-[4/5] w-full overflow-hidden xs:aspect-[1/1] sm:aspect-auto">
          <picture>
            <source media="(min-width: 640px)" srcSet="/images/location-map.svg" />
            <img
              src="/images/location-map-compact.svg"
              alt="Map of Dubai's southern coastline showing Palm Jebel Ali, with the Wave Crest villa marked on Frond A, and the surrounding destinations listed below."
              width={1600}
              height={Math.round(1600 / legend.aspect)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-left sm:h-auto sm:object-contain"
            />
          </picture>
        </div>
      </Reveal>

      {/* Legend */}
      <Container className="mt-14 sm:mt-16">
        <Reveal>
          <p className="eyebrow text-sand-100/50">{location.legendHeading}</p>
          <ul className="mt-7 grid grid-cols-1 gap-x-10 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
            {legend.points.map((p) => (
              <li
                key={p.n}
                className="flex items-baseline gap-3.5 border-b border-sand-100/10 py-3"
              >
                <span
                  className="eyebrow w-5 shrink-0 text-sand-100/40 lining-nums tabular-nums"
                  aria-hidden="true"
                >
                  {p.n}
                </span>
                <span className="flex-1 text-[0.9375rem] text-sand-100/80">
                  {p.label}
                </span>
                <span className="eyebrow shrink-0 text-sand-100/50 lining-nums tabular-nums">
                  {p.minutes} min
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[0.75rem] leading-relaxed text-sand-100/40">
            {location.note}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
