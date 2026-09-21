import Reveal from "./Reveal";
import EnquiryForm from "./EnquiryForm";
import { Container, Eyebrow } from "./ui";
import { listing } from "@/content/listing";

/**
 * Register Your Interest.
 *
 * No personal contact details appear here by design — every enquiry goes
 * through the form to the address in LEAD_EMAIL.
 */
export default function Enquiry() {
  const { enquiry } = listing;

  return (
    <section id="enquire" className="scroll-mt-20 bg-sand-100 py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-ink-mute">{enquiry.eyebrow}</Eyebrow>
              <h2 className="mt-7 text-[clamp(2rem,5vw,3.25rem)] leading-[1.1]">
                {enquiry.heading}
              </h2>
              <p className="mt-7 text-[1.0625rem] leading-[1.85] text-ink-soft">
                {enquiry.sub}
              </p>
              <p className="mt-8 text-[0.8125rem] italic text-ink-mute">
                {enquiry.note}
              </p>
            </Reveal>
          </div>

          <Reveal delay={160} className="lg:col-span-6 lg:col-start-7">
            <div className="bg-sand-50 px-7 py-10 sm:px-10 sm:py-12">
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
