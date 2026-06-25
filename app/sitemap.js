import { SITE_URL } from "@/lib/seo";

// Generates /sitemap.xml. Cookie-based locale means one URL per page (no
// per-language routes), so we list each route once.
export default function sitemap() {
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/o-nama", priority: 0.7, changeFrequency: "monthly" },
    { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" },
    { path: "/large-modul", priority: 0.9, changeFrequency: "monthly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
