"use client";

import { motion } from "framer-motion";

import { useHeroParallax } from "@/components/sections/hero-parallax-context";

// Layer 2 (glow orbs) — pure presentation. The parallax offset itself is
// tracked by the ancestor HeroInteractive and reaches this component via
// HeroParallaxContext (see that file for why the listener has to live on
// the outermost wrapper, not here). Each orb's own idle CSS drift (see
// .hero-orb keyframes in globals.css) is a *separate* transform on a
// separate element, so it never fights with this parallax transform over
// the same CSS property.
export function HeroGlow() {
  const parallax = useHeroParallax();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.div
        style={parallax ? { x: parallax.x, y: parallax.y } : undefined}
        className="absolute inset-0"
      >
        <div
          className="hero-orb hero-animate absolute top-[8%] left-[12%] size-72 rounded-full bg-indigo-400/20 blur-[100px] sm:size-96 dark:bg-indigo-500/25"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="hero-orb hero-animate absolute top-[15%] right-[10%] size-64 rounded-full bg-violet-400/15 blur-[100px] sm:size-80 dark:bg-violet-500/20"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="hero-orb hero-animate absolute bottom-[5%] left-[35%] size-64 rounded-full bg-cyan-300/15 blur-[100px] sm:size-80 dark:bg-cyan-400/20"
          style={{ animationDelay: "-12s" }}
        />
      </motion.div>
    </div>
  );
}
