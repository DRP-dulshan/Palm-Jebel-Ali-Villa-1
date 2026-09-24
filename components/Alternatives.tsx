import Reveal from "./Reveal";
import { Container, Eyebrow, Section } from "./ui";
import { listing } from "@/content/listing";

/**
 * A softer exit for visitors this particular villa does not suit — the CTA
 * drops them into the form with the wider-search option already selected.
 */
export default function Alternatives() {
  const { alternatives } = listing;

  return (
    <Section id="alternatives" tone="dark">
      <Container width="narrow" className="text-center">
        <Reveal>
          <Eyebrow className="justify-center text-sand-100/65" withRule={false}>
            {alternatives.eyebrow}
          </Eyebrow>
          <h2 className="mt-7 text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.1] text-sand-50">
            {alternatives.heading}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-[1.0625rem] leading-[1.85] text-sand-100/70">
            {alternatives.body}
          </p>
          <a
            href="#enquire?looking=another-pja"
            className="eyebrow mt-10 inline-flex items-center border border-sand-100/45 px-8 py-4 text-sand-50 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-ink"
          >
            {alternatives.cta}
          </a>
        </Reveal>
      </Container>
    </Section>
  );
}
