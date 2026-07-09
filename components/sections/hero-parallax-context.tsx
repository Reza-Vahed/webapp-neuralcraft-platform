"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

// Thin plumbing so HeroInteractive (tracks the pointer, owns the spring
// physics) and HeroGlow (pure presentation, several layers deep inside the
// server-rendered HeroBackground) can share the parallax offset without
// prop-drilling through a Server Component that has no reason to know
// about any of this — see DESIGN.md's Hero section.
export type HeroParallaxOffset = {
  x: MotionValue<number>;
  y: MotionValue<number>;
} | null;

export const HeroParallaxContext = createContext<HeroParallaxOffset>(null);

export function useHeroParallax() {
  return useContext(HeroParallaxContext);
}
