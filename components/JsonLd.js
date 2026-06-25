// Renders a JSON-LD structured-data block. Pass one schema object or an array
// of them. Next.js recommends emitting JSON-LD as a <script> in the component
// tree (App Router) — search engines parse it; it is invisible to users.
export default function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // schema objects are app-controlled (no user input) → safe to inline
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
