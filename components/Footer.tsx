import Logo from "./Logo";
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
                ["Payment Plan", "#payment-plan"],
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

        <p className="mt-8 max-w-xl text-[0.75rem] leading-relaxed text-sand-100/60">
          {listing.footer.disclaimer}
        </p>
      </Container>
    </footer>
  );
}
