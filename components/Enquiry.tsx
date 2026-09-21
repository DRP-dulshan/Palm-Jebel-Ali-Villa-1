import type { ComponentType } from "react";
import Reveal from "./Reveal";
import EnquiryForm from "./EnquiryForm";
import { Container, Eyebrow } from "./ui";
import { listing } from "@/content/listing";
import { site, whatsappHref, telHref, mailHref } from "@/content/site";
import { WhatsAppIcon, PhoneIcon, MailIcon } from "./icons";

export default function Enquiry() {
  const { enquiry } = listing;

  return (
    <section id="enquire" className="scroll-mt-20 bg-sand-100 py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Agent */}
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-ink-mute">{enquiry.eyebrow}</Eyebrow>
              <h2 className="mt-7 text-[clamp(2rem,5vw,3.25rem)] leading-[1.1]">
                {enquiry.heading}
              </h2>
              <p className="mt-7 text-[1.0625rem] leading-[1.85] text-ink-soft">
                {enquiry.body}
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-10 border-t border-ink/12 pt-10">
              <p className="font-serif text-3xl font-light">{site.agent.name}</p>
              <p className="mt-2 text-[0.9375rem] text-ink-soft">
                {site.agent.title}
              </p>
              <p className="eyebrow mt-1.5 text-ink-mute">{site.agent.location}</p>

              {/* Every row is a tappable link, sized for a thumb on mobile */}
              <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                <ContactRow
                  icon={PhoneIcon}
                  label={enquiry.contact.phone}
                  value={site.agent.phone}
                  href={telHref()!}
                />
                <ContactRow
                  icon={WhatsAppIcon}
                  label={enquiry.contact.whatsapp}
                  value={site.agent.phone}
                  href={whatsappHref()}
                  external
                />
                <ContactRow
                  icon={MailIcon}
                  label={enquiry.contact.email}
                  value={site.agent.email}
                  href={mailHref()!}
                />
              </ul>

              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow mt-8 inline-flex items-center gap-3 border border-ink/20 px-6 py-4 text-ink transition-colors duration-300 hover:border-accent hover:text-accent-text"
              >
                <WhatsAppIcon className="h-4.5 w-4.5" />
                {enquiry.form.whatsappCta}
              </a>

              <p className="mt-8 text-[0.8125rem] italic text-ink-mute">
                {enquiry.note}
              </p>
            </Reveal>
          </div>

          {/* Form */}
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

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="group flex items-center gap-3 py-4 transition-colors hover:text-accent-text sm:gap-4"
      >
        <Icon className="h-5 w-5 shrink-0 text-ink-mute transition-colors group-hover:text-accent-text" />
        <span className="eyebrow w-[4.5rem] shrink-0 text-ink-mute sm:w-[5.75rem]">
          {label}
        </span>
        {/* min-w-0 + wrapping so a long email cannot widen the page */}
        <span className="min-w-0 break-words text-[0.9375rem] text-ink transition-colors group-hover:text-accent-text">
          {value}
        </span>
      </a>
    </li>
  );
}
