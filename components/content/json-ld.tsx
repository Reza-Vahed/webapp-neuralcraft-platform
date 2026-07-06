// Renders a JSON-LD <script> tag. `dangerouslySetInnerHTML` is required by
// the JSON-LD convention itself and is safe here: the payload is built from
// our own typed data, never from user input.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
