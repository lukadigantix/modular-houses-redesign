import Founders from "@/components/Founders";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";

export function generateMetadata() {
  return buildMetadata({
    title: "O nama",
    description:
      "Upoznajte tim Modular Houses — gradimo modularne i montažne kuće po meri u Srbiji, spajajući savremenu arhitekturu, brzu gradnju bez temelja i prirodu.",
    path: "/o-nama",
  });
}

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "O nama — Modular Houses",
  description:
    "O kompaniji Modular Houses, graditelju modularnih i montažnih kuća po meri u Srbiji.",
};

export default function ONamaPage() {
  return (
    <>
      <JsonLd
        data={[
          aboutLd,
          breadcrumbLd([
            { name: "Početna", path: "/" },
            { name: "O nama", path: "/o-nama" },
          ]),
        ]}
      />
      <Founders />
      <Footer />
    </>
  );
}
