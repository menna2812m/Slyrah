/**
 * Structured data is emitted as a script tag rather than injected, so it is
 * present in the initial HTML for crawlers.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Values come from our own API, and JSON.stringify escapes the payload.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
