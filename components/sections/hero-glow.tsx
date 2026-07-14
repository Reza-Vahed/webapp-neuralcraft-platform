"use client";

import { motion } from "framer-motion";

import { useHeroParallax } from "@/components/sections/hero-parallax-context";

// Layer 2 (glow orbs) — pure presentation. The parallax offset itself is
// tracked by the ancestor HeroInteractive (mouse *and*, since the
// motion-polish pass, scroll position summed into the same `y`) and
// reaches this component via HeroParallaxContext (see that file for why
// the listener has to live on the outermost wrapper, not here). Each
// orb's own idle CSS drift (see .hero-orb keyframes in globals.css) is a
// *separate* transform on a separate element, so it never fights with
// this parallax transform over the same CSS property.
//
// Colors (Design Refresh "B"): fuchsia/rose/amber — the warm family that
// matches the plum --primary accent, replacing the original cool
// indigo/violet/cyan trio.
//
// Light-mode polish: light-mode opacity bumped (fuchsia 20->35, rose
// 15->28, amber 15->25) — the original values were tuned to be visible
// against dark mode's much darker atmosphere and read as "almost not
// there" on the light cream background, which is a much closer luminance
// match to a pastel glow than a near-black background is. Dark mode's
// `dark:` opacities are untouched.
//
// Blur radius is smaller below `sm`: `blur-[100px]` is a real compositing
// cost (each orb is a full-screen-ish backdrop the GPU has to filter every
// frame it repaints), and phones both have less GPU headroom and show the
// blur at a smaller physical size anyway — 60px still reads as a soft glow
// there, just cheaper.
export function HeroGlow() {
  const parallax = useHeroParallax();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.div
        style={parallax ? { x: parallax.x, y: parallax.y } : undefined}
        className="absolute inset-0"
      >
        <div
          className="hero-orb hero-animate absolute top-[8%] left-[12%] size-72 rounded-full bg-fuchsia-400/35 blur-[60px] sm:size-96 sm:blur-[100px] dark:bg-fuchsia-500/25"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="hero-orb hero-animate absolute top-[15%] right-[10%] size-64 rounded-full bg-rose-400/28 blur-[60px] sm:size-80 sm:blur-[100px] dark:bg-rose-500/20"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="hero-orb hero-animate absolute bottom-[5%] left-[35%] size-64 rounded-full bg-amber-300/25 blur-[60px] sm:size-80 sm:blur-[100px] dark:bg-amber-400/20"
          style={{ animationDelay: "-12s" }}
        />
      </motion.div>
    </div>
  );
}
