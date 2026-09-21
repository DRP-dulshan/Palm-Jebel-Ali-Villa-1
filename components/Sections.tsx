import Picture from "./Picture";
import Reveal from "./Reveal";
import { Container, Eyebrow, Section } from "./ui";
import { listing } from "@/content/listing";
import { featureIcons } from "./icons";

/* ---- 2. A New Generation of Beachfront Living ----------------------- */

export function Intro() {
  const { intro } = listing;
  return (
    <Section id="opportunity" tone="light">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow className="text-ink-mute">{intro.eyebrow}</Eyebrow>
            <h2 className="mt-7 text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08]">
              {intro.heading}
            </h2>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            {intro.body.map((paragraph, i) => (
              <Reveal key={i} delay={100 + i * 90}>
                <p
                  className={`text-[1.0625rem] leading-[1.85] text-ink-soft ${
                    i > 0 ? "mt-6" : ""
                  }`}
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>

      {/* Full-bleed beach elevation */}
      <Reveal className="mt-20 sm:mt-28">
        <figure className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[21/9]">
          <Picture
            slug="hero-beachfront"
            sizes="100vw"
            className="block h-full w-full"
            imgClassName="object-[60%_center] sm:object-center"
          />
        </figure>
      </Reveal>

      <Container width="narrow" className="mt-20 sm:mt-28">
        <Reveal>
          <blockquote className="border-l border-accent pl-7 sm:pl-10">
            <p className="font-serif text-[clamp(1.5rem,4vw,2.375rem)] font-light italic leading-[1.35] text-ink">
              “{intro.quote}”
            </p>
          </blockquote>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---- 3. The Residence ----------------------------------------------- */

export function Residence() {
  const { residence } = listing;
  return (
    <Section id="residence" tone="sand">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-6 lg:order-2">
            <figure className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4]">
              <Picture
                slug="master-bedroom"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="block h-full w-full"
              />
            </figure>
          </Reveal>

          <div className="lg:col-span-6 lg:order-1">
            <Reveal>
              <Eyebrow className="text-ink-mute">{residence.eyebrow}</Eyebrow>
              <h2 className="mt-7 text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08]">
                {residence.heading}
              </h2>
            </Reveal>
            {residence.body.map((paragraph, i) => (
              <Reveal key={i} delay={100 + i * 90}>
                <p className="mt-6 text-[1.0625rem] leading-[1.85] text-ink-soft">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <ul className="mt-20 grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:mt-28 sm:grid-cols-2 lg:grid-cols-4">
          {residence.features.map((feature, i) => {
            const Icon = featureIcons[feature.icon];
            return (
              <Reveal
                as="li"
                key={feature.label}
                delay={i * 70}
                className="flex items-center gap-5 bg-sand-100 px-7 py-8"
              >
                <Icon className="h-7 w-7 shrink-0 text-accent-text" />
                <span className="text-[0.9375rem] leading-snug text-ink">
                  {feature.label}
                </span>
              </Reveal>
            );
          })}
          {/* Fills the 8th cell on 2- and 4-column layouts */}
          <li className="hidden bg-sand-100 sm:block" aria-hidden="true" />
        </ul>
      </Container>
    </Section>
  );
}

/* ---- 5. Wave Crest: Architecture ------------------------------------ */

export function Architecture() {
  const { architecture } = listing;
  return (
    <Section id="architecture" tone="dark" className="overflow-hidden">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <Eyebrow className="text-sand-100/50">{architecture.eyebrow}</Eyebrow>
            <h2 className="mt-7 text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08] text-sand-50">
              {architecture.heading}
            </h2>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            {architecture.body.map((paragraph, i) => (
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
      </Container>

      <Container width="wide" className="mt-20 sm:mt-28">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <Reveal>
            <figure className="relative aspect-[4/3] overflow-hidden">
              <Picture
                slug="exterior-arrival"
                sizes="(max-width: 640px) 100vw, 46vw"
                className="block h-full w-full"
              />
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <figure className="relative aspect-[4/3] overflow-hidden">
              <Picture
                slug="living-room"
                sizes="(max-width: 640px) 100vw, 46vw"
                className="block h-full w-full"
              />
            </figure>
          </Reveal>
        </div>
      </Container>

      <Container className="mt-20 sm:mt-28">
        <Reveal>
          <p className="font-serif text-[clamp(1.5rem,4.2vw,2.75rem)] font-light leading-[1.3] text-sand-50">
            {architecture.closing.map((line) => (
              <span key={line} className="block">
                {line.replace(/\.$/, "")}
                <span className="text-accent">.</span>
              </span>
            ))}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
