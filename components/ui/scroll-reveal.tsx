"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Sparse, single-shot scroll-reveal for section heading blocks (see
// DESIGN.md's Hero section for the broader "restrained motion" principle —
// this follows the same rule: one subtle fade+rise per section, never a
// staggered per-card animation). `useReducedMotion` short-circuits to the
// plain (already server-rendered) children, no animation props at all —
// not just a zero-duration transition — so reduced-motion users get
// perfectly ordinary static markup.
//
// `data-scroll-reveal` is a hook for the `<noscript>` override in the root
// layout: this component's SSR output is opacity:0 until Framer Motion
// hydrates and reveals it, so without JS the content would otherwise stay
// invisible forever — the noscript rule forces it visible in that case.
export function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-scroll-reveal
      className={className}
      // 16px rise: enough to read as motion, small enough to stay "restrained"
      // rather than a slide-in. `ease` duplicates --ease-premium's curve
      // literally (globals.css) because Framer Motion's `transition.ease`
      // takes a JS array/string, not a CSS custom property — keep both in
      // sync if that token ever changes.
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      // -80px shrinks the trigger area inward from the real viewport edge,
      // so the reveal fires once a section is meaningfully on-screen
      // instead of the instant its top pixel appears at the bottom edge.
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
