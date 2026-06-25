import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, CONTACT_EMAIL, buildMetadata, breadcrumbLd } from "@/lib/seo";

export function generateMetadata() {
  return buildMetadata({
    title: "Kontakt",
    description:
      "Kontaktirajte Modular Houses za ponudu za modularne i montažne kuće po meri u Srbiji. Odgovaramo brzo — pošaljite upit putem forme ili emaila.",
    path: "/kontakt",
  });
}

const contactLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kontakt — Modular Houses",
  mainEntity: { "@id": `${SITE_URL}/#organization` },
  email: CONTACT_EMAIL,
};

export default function KontaktPage() {
  return (
    <>
      <JsonLd
        data={[
          contactLd,
          breadcrumbLd([
            { name: "Početna", path: "/" },
            { name: "Kontakt", path: "/kontakt" },
          ]),
        ]}
      />
      <Contact />
      <Footer />
    </>
  );
}
