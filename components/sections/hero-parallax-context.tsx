"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

// Thin plumbing so HeroInteractive (tracks pointer + scroll position, owns
// the spring physics) and HeroGlow (pure presentation, several layers deep
// inside the server-rendered HeroBackground) can share the combined offset
// without prop-drilling through a Server Component that has no reason to
// know about any of this — see DESIGN.md's Hero section. `y` already sums
// the mouse and scroll offsets (see hero-interactive.tsx) — HeroGlow just
// applies whatever it's given, it doesn't know there are two sources.
export type HeroParallaxOffset = {
  x: MotionValue<number>;
  y: MotionValue<number>;
} | null;

export const HeroParallaxContext = createContext<HeroParallaxOffset>(null);

export function useHeroParallax() {
  return useContext(HeroParallaxContext);
}
