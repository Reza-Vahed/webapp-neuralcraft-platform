"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

// Motion-polish: wraps a single Button on the Home page only (Hero's two
// CTAs, CtaSection's one) — deliberately not built into the global Button
// component, since a magnetic pull on every button sitewide (forms, legal
// pages, pagination, …) would read as a gimmick rather than a homepage
// flourish. See hero.tsx/cta-section.tsx for the three call sites.
//
// Direction is purely "toward the cursor, relative to this element's own
// box" — clientX/Y minus the element's own bounds, nothing tied to
// document reading direction. That's what makes it correct on the Farsi
// (RTL) page without any dir-aware branching: the pull always points at
// the pointer regardless of which side "start"/"end" is on.
const MAX_PULL_PX = 8;
const SPRING_CONFIG = { stiffness: 200, damping: 15, mass: 0.4 };

export function MagneticButton({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    // Same reasoning as ContentCardLink's tilt: skip on touch/pen so a
    // scroll-by-finger over the button doesn't nudge it, and tapping still
    // navigates normally since that never depends on this handler.
    if (prefersReducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    x.set(relativeX * MAX_PULL_PX * 2);
    y.set(relativeY * MAX_PULL_PX * 2);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className="inline-block"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
