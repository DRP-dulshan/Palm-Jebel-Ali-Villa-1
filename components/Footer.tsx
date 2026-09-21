import Logo from "./Logo";
import PermitQr from "./PermitQr";
import { Container } from "./ui";
import { listing } from "@/content/listing";

export default function Footer() {
  return (
    <footer className="bg-ink pb-24 pt-16 text-sand-100 sm:pb-16">
      <Container>
        <div className="flex flex-col gap-10 border-b border-sand-100/12 pb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo className="h-8" />
            <p className="mt-5 text-[0.9375rem] text-sand-100/70">
              {listing.footer.tagline}
            </p>
          </div>

          <nav aria-label="Page sections">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:grid-cols-1 sm:text-right">
              {[
                ["The Residence", "#residence"],
                ["Floor Plans", "#floor-plans"],
                ["Gallery", "#gallery"],
                ["Frond A", "#frond"],
                ["Location", "#location"],
                ["Specification", "#specification"],
                ["Enquire", "#enquire"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="eyebrow text-sand-100/70 transition-colors hover:text-accent"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-[0.75rem] leading-relaxed text-sand-100/60">
            {listing.footer.disclaimer}
          </p>
          <PermitQr
            size={96}
            label={listing.permit.label}
            align="center"
            className="shrink-0 text-sand-100"
          />
        </div>
      </Container>
    </footer>
  );
}
