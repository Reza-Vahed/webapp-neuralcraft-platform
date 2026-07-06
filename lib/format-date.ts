export function formatDate(locale: string, iso: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(iso)
  );
}
