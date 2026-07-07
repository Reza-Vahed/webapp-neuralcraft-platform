// Section ids for /imprint and /privacy — translated copy lives under
// `ImprintPage.sections.<id>` / `PrivacyPage.sections.<id>` in
// messages/*.json (same "ids array + messages" convention as
// lib/services.ts, lib/about-content.ts, lib/dev-status.ts).
export const imprintSectionIds = [
  "provider",
  "contact",
  "responsible",
  "disputeResolution",
  "liability",
  "copyright",
] as const;

export const privacySectionIds = [
  "overview",
  "controller",
  "dataCollected",
  "purpose",
  "legalBasis",
  "retention",
  "rights",
  "cookies",
  "contactForm",
  "hosting",
  "contact",
] as const;

// Rendered as a <ul> instead of a paragraph — see PrivacyPage.rights.items.*
export const privacyRightsItemIds = [
  "access",
  "rectification",
  "erasure",
  "restriction",
  "portability",
  "objection",
  "complaint",
] as const;
