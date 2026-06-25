import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Products from "@/components/Products";
import Features from "@/components/Features";
import HorizontalDetails from "@/components/HorizontalDetails";
import Testimonials from "@/components/Testimonials";
import ReserveNow from "@/components/ReserveNow";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, buildMetadata } from "@/lib/seo";

export function generateMetadata() {
  const meta = buildMetadata({
    title: "Modularne i montažne kuće po meri u Srbiji",
    description:
      "Modular Houses gradi modularne i montažne kuće po meri širom Srbije — modularni i montažni objekti bez temelja, brza i precizna gradnja, moderan dizajn. Zatražite ponudu.",
    path: "/",
  });
  // Let the document <title> inherit the layout's branded default
  // ("…u Srbiji | Modular Houses") while keeping the keyword-rich OG/Twitter
  // title set above. Avoids a doubled brand on the homepage.
  delete meta.title;
  return meta;
}

// Home-page Service node: the core offering with primary keywords, served
// across the whole country.
const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Modularne i montažne kuće po meri",
  serviceType: "Izgradnja modularnih i montažnih kuća",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: { "@type": "Country", name: "Srbija" },
  description:
    "Projektovanje i izgradnja modularnih i montažnih kuća i objekata po meri u Srbiji — gradnja bez temelja, brzo i precizno.",
  url: SITE_URL,
  brand: SITE_NAME,
};

export default function Home() {
  return (
    <main className="overflow-clip">
      <JsonLd data={serviceLd} />
      <Hero />
      <Intro />
      <Products />
      <Features />
      <HorizontalDetails />
      <Testimonials />
      <ReserveNow />
      <Footer />
    </main>
  );
}
