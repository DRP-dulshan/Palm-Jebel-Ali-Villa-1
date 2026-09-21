import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Intro, Residence, Architecture } from "@/components/Sections";
import FloorPlans from "@/components/FloorPlans";
import Gallery from "@/components/Gallery";
import { FrondA, Masterplan, Investment, AtAGlance } from "@/components/Location";
import LocationMap from "@/components/LocationMap";
import PaymentPlan from "@/components/PaymentPlan";
import Alternatives from "@/components/Alternatives";
import Enquiry from "@/components/Enquiry";
import Footer from "@/components/Footer";
import StickyBar from "@/components/StickyBar";

export default function Page() {
  return (
    <>
      <a
        href="#opportunity"
        className="eyebrow sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-5 focus:py-3 focus:text-sand-50"
      >
        Skip to content
      </a>

      <Header />

      <main>
        <Hero />
        <Intro />
        <Residence />
        <FloorPlans />
        <Gallery />
        <Architecture />
        <FrondA />
        <LocationMap />
        <Masterplan />
        <Investment />
        <PaymentPlan />
        <AtAGlance />
        <Alternatives />
        <Enquiry />
      </main>

      <Footer />
      <StickyBar />
    </>
  );
}
