// Static snapshot data for the internal /dev dashboard. Values are updated
// by hand as phases complete — this is a status snapshot, not a live
// monitoring feed (the one exception is the last commit, see git-info.ts).
export const projectName = "NeuralCraft Platform";

export type PhaseStatus = "completed" | "active" | "planned";

export type Phase = {
  id:
    | "phase1"
    | "phase2"
    | "phase3"
    | "phase4"
    | "phase5"
    | "phase6"
    | "phase7"
    | "phase8";
  status: PhaseStatus;
};

export const phases: Phase[] = [
  { id: "phase1", status: "completed" },
  { id: "phase2", status: "completed" },
  { id: "phase3", status: "completed" },
  { id: "phase4", status: "completed" },
  { id: "phase5", status: "completed" },
  { id: "phase6", status: "completed" },
  { id: "phase7", status: "completed" },
  { id: "phase8", status: "active" },
];

export type QualityCheckStatus = "pass" | "fail";

export type QualityCheck = {
  id: "build" | "typescript" | "eslint" | "i18n" | "rtl" | "accessibility";
  status: QualityCheckStatus;
};

// Reflects the last local verification (lint/typecheck/build) run for this
// phase — see the Quality Status section's note for the caveat.
export const qualityChecks: QualityCheck[] = [
  { id: "build", status: "pass" },
  { id: "typescript", status: "pass" },
  { id: "eslint", status: "pass" },
  { id: "i18n", status: "pass" },
  { id: "rtl", status: "pass" },
  { id: "accessibility", status: "pass" },
];

export type DevRoute = {
  path: string;
  // Reuses existing `Nav.*` translation keys — these routes are already
  // named in the main navigation, no need for a second set of labels.
  navMessageKey: "home" | "services" | "blog" | "caseStudies" | "careers";
};

export const devRoutes: DevRoute[] = [
  { path: "/", navMessageKey: "home" },
  { path: "/services", navMessageKey: "services" },
  { path: "/blog", navMessageKey: "blog" },
  { path: "/case-studies", navMessageKey: "caseStudies" },
  { path: "/careers", navMessageKey: "careers" },
];

export const architectureItemIds = [
  "frontend",
  "contentLayer",
  "i18n",
  "deployment",
] as const;
