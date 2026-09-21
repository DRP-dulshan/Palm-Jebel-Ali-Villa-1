import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { listing } from "@/content/listing";
import { site } from "@/content/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: listing.meta.title,
  description: listing.meta.description,
  applicationName: site.brand,
  authors: [{ name: site.agent.name }],
  keywords: [
    "Palm Jebel Ali",
    "Frond A",
    "Wave Crest",
    "beach villa Dubai",
    "beachfront villa",
    "Beach Collection",
    "Nakheel",
    "5 bedroom villa Dubai",
    "Dubai Rapid Properties",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: site.url,
    siteName: site.brand,
    title: listing.meta.title,
    description: listing.meta.description,
    images: [
      {
        url: listing.meta.ogImage,
        width: 1200,
        height: 630,
        alt: "Wave Crest beach villa on Frond A of Palm Jebel Ali, seen from the beach.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: listing.meta.title,
    description: listing.meta.description,
    images: [listing.meta.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#2e2e2e",
  width: "device-width",
  initialScale: 1,
};

/** Structured data so the listing reads correctly to search engines. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SingleFamilyResidence",
  name: "Wave Crest · 5 Bedroom Beach Villa",
  description: listing.meta.description,
  numberOfBedrooms: 5,
  floorSize: { "@type": "QuantitativeValue", value: 8368, unitCode: "FTK" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Palm Jebel Ali, Frond A",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  image: `${site.url}${listing.meta.ogImage}`,
  offers: {
    "@type": "Offer",
    price: 24500000,
    priceCurrency: "AED",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "RealEstateAgent",
      name: site.agent.name,
      worksFor: { "@type": "Organization", name: site.brand },
      areaServed: "Dubai",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        {/* Preload the hero at the width the device will actually use */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/images/hero-beachfront-1200.webp"
          imageSrcSet="/images/hero-beachfront-480.webp 480w, /images/hero-beachfront-768.webp 768w, /images/hero-beachfront-1200.webp 1200w, /images/hero-beachfront-1920.webp 1920w"
          imageSizes="100vw"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
