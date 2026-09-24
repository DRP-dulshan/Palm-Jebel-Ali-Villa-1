import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { Container } from "@/components/ui";
import { listing } from "@/content/listing";

const { thankYou } = listing;

export const metadata: Metadata = {
  title: `${thankYou.heading} — ${listing.meta.title}`,
  description: thankYou.body,
  // A confirmation page has no business in search results, and indexing it
  // would let people land here without ever submitting the form.
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="flex min-h-[100svh] flex-col bg-stone-900 text-sand-50">
      <header className="py-6 sm:py-8">
        <Container width="wide">
          {/* White artwork, so it stays on the dark background */}
          <a href="/" aria-label="Back to the homepage" className="inline-flex">
            <Logo priority className="h-6 sm:h-7" />
          </a>
        </Container>
      </header>

      <Container className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow text-sand-100/65">{thankYou.eyebrow}</p>

        <h1 className="mt-7 text-[clamp(2.75rem,9vw,5rem)] leading-[1.02] text-sand-50">
          {thankYou.heading}
        </h1>

        <p className="mx-auto mt-7 max-w-md text-[1.0625rem] leading-[1.85] text-sand-100/70">
          {thankYou.body}
        </p>

        <a
          href="/"
          className="eyebrow mt-12 inline-flex items-center border border-sand-100/45 px-8 py-4 text-sand-50 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-ink"
        >
          {thankYou.cta}
        </a>
      </Container>

      <footer className="py-8">
        <Container>
          <p className="text-center text-[0.75rem] text-sand-100/60">
            {listing.footer.tagline}
          </p>
        </Container>
      </footer>
    </main>
  );
}
