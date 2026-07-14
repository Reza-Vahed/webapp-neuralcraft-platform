"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

// Motion-polish: a deliberately tiny, reusable parallax for a *few* hand-
// picked decorative elements outside the Hero (see DESIGN.md's Hero &
// Motion section for why the Hero itself already has its own, separate
// parallax mechanism instead of using this). Kept generic rather than
// hero-specific so it can wrap any small decorative node — currently only
// ServiceCard's icon badge uses it. Deliberately not applied broadly: more
// than a couple of moving elements per view would read as busy rather than
// "subtle depth," which is the whole point.
//
// `offset: ["start end", "end start"]` covers the element's entire transit
// through the viewport (not just its entry, unlike ScrollReveal) — the
// point here is continuous depth as you scroll past, not a one-time
// reveal, so scrollYProgress runs the full 0-1 while any part of the
// element is on-screen at all.
export function ScrollParallax({
  children,
  className,
  range = 10,
}: {
  children: ReactNode;
  className?: string;
  /** Max px offset in either direction — keep small, this is depth, not motion. */
  range?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
