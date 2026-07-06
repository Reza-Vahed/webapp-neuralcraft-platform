// Structural data for the /about page — translated copy lives under
// `AboutPage.*` in messages/*.json, keyed by the ids below (same convention
// as lib/services.ts and lib/dev-status.ts).
export const companyValueIds = [
  "transparency",
  "responsibility",
  "curiosity",
  "pragmatism",
] as const;

export const whyNeuralCraftIds = [
  "oneTeam",
  "techAgnostic",
  "strategyToCode",
  "resultsOverBuzzwords",
] as const;

export type TechnologyCategory = {
  id: "llmAgentic" | "automation" | "development" | "cloud";
  tools: string[];
};

// Tool names are proper nouns and intentionally not translated (same
// convention as the "NeuralCraft" brand name elsewhere in the codebase).
export const technologyCategories: TechnologyCategory[] = [
  { id: "llmAgentic", tools: ["Anthropic Claude", "OpenAI", "LangChain"] },
  { id: "automation", tools: ["n8n", "Make", "Custom Workflow Engines"] },
  { id: "development", tools: ["TypeScript", "Next.js", "Python"] },
  { id: "cloud", tools: ["Vercel", "AWS", "Google Cloud", "Azure"] },
];
