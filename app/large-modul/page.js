import { notFound } from "next/navigation";
import { getModel } from "@/lib/models";
import Configurator from "@/components/Configurator";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, OG_IMAGE, buildMetadata, breadcrumbLd } from "@/lib/seo";

const SLUG = "large-modul";

export function generateMetadata() {
  const model = getModel(SLUG);
  const name = model ? model.name : "Konfigurator";
  return buildMetadata({
    title: `${name} — modularna kuća po meri (konfigurator)`,
    description: `Konfigurišite ${name}, modularnu montažnu kuću po meri — krov, fasade i opcije u 3D. Gradnja bez temelja, isporuka širom Srbije.`,
    path: `/${SLUG}`,
  });
}

export default function LargeModulPage() {
  const model = getModel(SLUG);
  if (!model) notFound();

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${model.name} — modularna kuća`,
    category: "Modularne i montažne kuće",
    description: `${model.name}: modularna montažna kuća po meri, sklopiva, sa konfiguracijom krova i fasada. Gradnja bez temelja.`,
    image: `${SITE_URL}${OG_IMAGE}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    url: `${SITE_URL}/${SLUG}`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "EUR",
      areaServed: { "@type": "Country", name: "Srbija" },
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  };

  return (
    <>
      <JsonLd
        data={[
          productLd,
          breadcrumbLd([
            { name: "Početna", path: "/" },
            { name: model.name, path: `/${SLUG}` },
          ]),
        ]}
      />
      <Configurator model={model} />
    </>
  );
}
