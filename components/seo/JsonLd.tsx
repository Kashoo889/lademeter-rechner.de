/**
 * Renders JSON-LD. `<` is escaped so a string value can never close the
 * script element (defense in depth once content comes from a CMS).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
