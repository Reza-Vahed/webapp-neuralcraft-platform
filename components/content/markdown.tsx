// Renders Velite's pre-compiled Markdown → HTML output. Safe to inject
// directly: this content is authored by us in the repo, not user-submitted.
export function Markdown({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
