"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

// Sparse scroll-reveal for section heading blocks (see DESIGN.md's Hero &
// Motion section for the broader "restrained motion" principle — this
// follows the same rule: one subtle fade+rise per section, never a
// staggered per-card animation). `useReducedMotion` short-circuits to the
// plain (already server-rendered) children, no animation props at all —
// not just a zero-duration transition — so reduced-motion users get
// perfectly ordinary static markup.
//
// Motion-polish: upgraded from a one-shot `whileInView` trigger to a
// scroll-linked mapping (`useScroll` + `useTransform`) so the fade+rise
// tracks scroll position continuously rather than snapping to its end
// state the instant a fixed viewport threshold is crossed — the effect
// this section's task brief calls "Scroll-Progress-Animationen". Framer
// Motion's `useTransform` clamps its output to the given range by default,
// so scrollYProgress moving outside [0, 1] before/after the offset window
// can't overshoot opacity/y past their rest values.
//
// `offset: ["start 90%", "start 45%"]` is the entry window: progress 0 is
// "the element's top has reached 90% down the viewport" (i.e. just barely
// appeared at the bottom), progress 1 is "it has reached 45%" (solidly
// on-screen, above the fold's midpoint) — chosen empirically to finish the
// reveal before a section reaches eye level, not right as it does.
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 45%"],
  });
  // 16px rise: enough to read as motion, small enough to stay "restrained"
  // rather than a slide-in.
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [16, 0]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      data-scroll-reveal
      className={className}
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  );
}
