// `||` (not `??`) is deliberate: an empty string is just as "unset" as
// undefined here (a site URL is never legitimately blank), and Docker builds
// commonly pass through an empty-but-defined env var rather than an unset
// one — see Dockerfile.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
