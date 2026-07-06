import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code2,
  Compass,
  GraduationCap,
  MessageSquare,
  Workflow,
} from "lucide-react";

// Canonical list of the six service offerings — the single source of truth
// for both the homepage teaser and the future /services overview + detail
// pages. Translated copy lives under `Services.<messageKey>` in messages/*.json.
export type Service = {
  slug: string;
  messageKey:
    | "strategy"
    | "agenticAi"
    | "automation"
    | "chatbots"
    | "aiCoding"
    | "training";
  icon: LucideIcon;
};

export const services: Service[] = [
  { slug: "ki-strategie", messageKey: "strategy", icon: Compass },
  { slug: "agentic-ai", messageKey: "agenticAi", icon: Bot },
  {
    slug: "workflow-automatisierung",
    messageKey: "automation",
    icon: Workflow,
  },
  {
    slug: "chatbots-ai-assistants",
    messageKey: "chatbots",
    icon: MessageSquare,
  },
  { slug: "ai-coding", messageKey: "aiCoding", icon: Code2 },
  { slug: "ki-schulungen", messageKey: "training", icon: GraduationCap },
];
