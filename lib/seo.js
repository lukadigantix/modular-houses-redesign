// ============================================================================
// Central SEO configuration: site identity, target keywords, the list of
// Serbian cities we serve, and helpers that build Next.js metadata + JSON-LD
// structured data. Keeping it all here means every page stays consistent and
// there is a single place to update the domain, brand copy, or keyword set.
// ============================================================================

// ⚠️ CHANGE ME IF THE DOMAIN IS DIFFERENT. Inferred from the contact email
// (contact@modularhouses.rs). Used for canonical URLs, Open Graph, sitemap.
export const SITE_URL = "https://modularhouses.rs";

export const SITE_NAME = "Modular Houses";
export const SITE_LEGAL_NAME = "Modular Houses";
export const SITE_LOCALE = "sr_RS";
export const CONTACT_EMAIL = "info@modularhouses.rs";
export const CONTACT_PHONE = "+381 65 444 4545";
// Full postal address — complete NAP (name/address/phone) is a strong local
// SEO signal and powers the address in the Organization/LocalBusiness schema.
export const ADDRESS = {
  street: "Gajska 32",
  locality: "Tabanovac",
  postalCode: "12306",
  country: "RS",
};
export const OG_IMAGE = "/og-image.jpg"; // 1200×630

// schema.org PostalAddress built from ADDRESS (reused across structured data).
export const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: ADDRESS.street,
  addressLocality: ADDRESS.locality,
  postalCode: ADDRESS.postalCode,
  addressCountry: ADDRESS.country,
};

// ---- Primary target keywords (the searches we want to rank for) ----
export const BASE_KEYWORDS = [
  "modularne kuće",
  "montažne kuće",
  "modularni objekti",
  "montažni objekti",
  "modularne kuće u Srbiji",
  "montažne kuće u Srbiji",
  "modularne kuće po meri",
  "montažne kuće po meri",
  "modularne kuće cena",
  "gradnja bez temelja",
  "modularna kuća",
  "montažna kuća",
  "modular",
  "modular house",
  "modular houses",
  "kuća",
  "kuće",
  "modularne",
  "montažne",
  "sklopive kuće",
  "prefabrikovane kuće",
  "ekološke kuće",
  "vikendice",
  "kuće za odmor",
];

// ---- Every meaningful city / municipality in Serbia ----
// Used in the LocalBusiness `areaServed` structured data (the legitimate,
// Google-rewarded way to signal "we build modular houses across all of these
// places") and to derive long-tail keywords. NOT injected as hidden DOM text.
export const SERBIAN_CITIES = [...new Set([
  // — Major cities —
  "Beograd", "Novi Sad", "Niš", "Kragujevac", "Subotica", "Zrenjanin",
  "Pančevo", "Čačak", "Kraljevo", "Novi Pazar", "Smederevo", "Leskovac",
  "Valjevo", "Kruševac", "Vranje", "Šabac", "Užice", "Sombor", "Požarevac",
  "Pirot", "Zaječar", "Kikinda", "Sremska Mitrovica", "Jagodina", "Vršac",
  "Bor", "Prokuplje", "Loznica", "Smederevska Palanka", "Velika Plana",
  // — Vojvodina —
  "Apatin", "Bač", "Bačka Palanka", "Bačka Topola", "Bečej", "Bela Crkva",
  "Beočin", "Vrbas", "Inđija", "Irig", "Kanjiža", "Kovačica", "Kovin",
  "Kula", "Mali Iđoš", "Nova Crnja", "Novi Bečej", "Novi Kneževac", "Odžaci",
  "Opovo", "Pećinci", "Plandište", "Ruma", "Sečanj", "Senta", "Sremski Karlovci",
  "Stara Pazova", "Temerin", "Titel", "Ada", "Alibunar", "Bačka Palanka",
  "Čoka", "Žabalj", "Žitište", "Šid", "Crvenka",
  // — Šumadija & Western Serbia —
  "Aranđelovac", "Topola", "Rača", "Batočina", "Lapovo", "Knić",
  "Gornji Milanovac", "Lučani", "Ivanjica", "Arilje", "Požega", "Bajina Bašta",
  "Čajetina", "Kosjerić", "Priboj", "Prijepolje", "Nova Varoš", "Sjenica",
  "Tutin", "Raška", "Vrnjačka Banja", "Trstenik", "Aleksandrovac", "Brus",
  "Ub", "Lajkovac", "Mionica", "Ljig", "Osečina", "Krupanj", "Koceljeva",
  "Vladimirci", "Bogatić", "Mali Zvornik", "Ljubovija",
  // — Šumadija/Pomoravlje —
  "Ćuprija", "Paraćin", "Despotovac", "Svilajnac", "Rekovac", "Varvarin",
  "Ražanj", "Ćićevac",
  // — Eastern Serbia —
  "Knjaževac", "Boljevac", "Sokobanja", "Kladovo", "Negotin", "Majdanpek",
  "Golubac", "Veliko Gradište", "Petrovac na Mlavi", "Žagubica", "Kučevo",
  "Malo Crniće", "Žabari",
  // — Southern Serbia —
  "Aleksinac", "Doljevac", "Merošina", "Gadžin Han", "Svrljig", "Bela Palanka",
  "Babušnica", "Dimitrovgrad", "Surdulica", "Vladičin Han", "Bujanovac",
  "Preševo", "Bosilegrad", "Trgovište", "Crna Trava", "Medveđa", "Bojnik",
  "Lebane", "Vlasotince", "Blace", "Kuršumlija", "Žitorađa",
  // — Belgrade municipalities (peri-urban building demand) —
  "Lazarevac", "Obrenovac", "Mladenovac", "Sopot", "Barajevo", "Grocka",
])];

// Long-tail keywords: "modularne/montažne kuće {grad}" for the highest-volume
// cities (kept moderate — meta keywords are a minor signal; the full city list
// lives in structured data where it carries real weight).
const TOP_CITIES_FOR_KEYWORDS = SERBIAN_CITIES.slice(0, 25);
export const KEYWORDS = [
  ...BASE_KEYWORDS,
  ...TOP_CITIES_FOR_KEYWORDS.flatMap((c) => [
    `modularne kuće ${c}`,
    `montažne kuće ${c}`,
  ]),
];

// ---------------------------------------------------------------------------
// Metadata builder — merges per-page values over sensible, keyword-rich
// defaults. `path` should start with "/" (used for the canonical URL).
// ---------------------------------------------------------------------------
export function buildMetadata({ title, description, path = "/", keywords } = {}) {
  const desc =
    description ||
    "Modularne i montažne kuće po meri u Srbiji. Modularni i montažni objekti — gradnja bez temelja, brzo, precizno i ekološki. Dostupno u celoj Srbiji.";
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description: desc,
    keywords: keywords || KEYWORDS,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url,
      title: title || `${SITE_NAME} — Modularne i montažne kuće po meri`,
      description: desc,
      // Static share image (public/og-image.jpg, 1200×630). metadataBase in the
      // root layout resolves this relative path to an absolute URL.
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Modular Houses — Modularne i montažne kuće po meri u Srbiji",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title || `${SITE_NAME} — Modularne i montažne kuće po meri`,
      description: desc,
      images: [OG_IMAGE],
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD structured data builders
// ---------------------------------------------------------------------------

// Organization + brand. Emitted once, site-wide.
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/ModularHouseslogo.png`,
    email: CONTACT_EMAIL,
    ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE } : {}),
    address: POSTAL_ADDRESS,
    areaServed: { "@type": "Country", name: "Srbija" },
  };
}

// WebSite node (enables the sitelinks search box + ties pages to the brand).
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "sr-RS",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

// LocalBusiness with areaServed = every Serbian city. THIS is the legitimate,
// high-value home for "all cities in Serbia": a real schema.org field that tells
// Google we provide our service across all these places — no hidden text needed.
export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    image: `${SITE_URL}${OG_IMAGE}`,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE } : {}),
    priceRange: "$$",
    address: POSTAL_ADDRESS,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    knowsAbout: BASE_KEYWORDS,
    areaServed: SERBIAN_CITIES.map((name) => ({ "@type": "City", name })),
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Izgradnja modularnih i montažnih kuća",
        serviceType: "Modularne i montažne kuće po meri",
        areaServed: { "@type": "Country", name: "Srbija" },
      },
    },
  };
}

// BreadcrumbList for a subpage. `items` = [{ name, path }] from home → page.
export function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.path === "/" ? SITE_URL : `${SITE_URL}${it.path}`,
    })),
  };
}
