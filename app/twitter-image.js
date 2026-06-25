// Twitter/X share image — reuse the same branded generator as Open Graph so
// the card looks identical. Re-exporting wires twitter:image automatically.
// `runtime` must be a literal in each route file, so it is declared here.
export const runtime = "nodejs";
export { default, alt, size, contentType } from "./opengraph-image";
