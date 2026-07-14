"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

// Shared shell for the clickable preview cards on the Services/Blog/
// Case-Studies/Careers overview grids — same hover/ring treatment
// everywhere, so it lives in one place instead of four.
//
// Two separate hover mechanisms, deliberately not unified:
// - Ring color and shadow are plain CSS `group-hover:` — always active,
//   regardless of reduced-motion, because a color/shadow swap isn't the
//   kind of motion prefers-reduced-motion is meant to suppress.
// - The 3D tilt (motion-polish) is the actual "motion" part: pointer-driven
//   rotateX/rotateY via a spring, gated behind both `useReducedMotion()`
//   and `pointerType === "mouse"`. The pointerType check matters on
//   touch/hybrid devices — a touch "move" only fires during an active drag,
//   which would make the card tilt as a side effect of scrolling past it
//   with a finger, not as a deliberate hover gesture the way it is with a
//   mouse. Tap-to-navigate on touch is unaffected either way, since it
//   never depends on this handler firing.
const MAX_TILT_DEG = 6;
const SPRING_CONFIG = { stiffness: 300, damping: 20, mass: 0.5 };

export function ContentCardLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, SPRING_CONFIG);
  const springRotateY = useSpring(rotateY, SPRING_CONFIG);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    // Tilts *toward* the cursor: pointer above the card's center pitches
    // the top back (negative rotateX), pointer left of center yaws the
    // left edge back (negative rotateY) — the sign flip on Y is what
    // makes it feel like the card is tipping away from the cursor rather
    // than into it.
    rotateY.set(relativeX * MAX_TILT_DEG * 2);
    rotateX.set(relativeY * -MAX_TILT_DEG * 2);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <Link href={href} className="group" style={{ perspective: 800 }}>
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX: springRotateX, rotateY: springRotateY }}
      >
        <Card className="ring-foreground/16 dark:ring-foreground/10 group-hover:ring-primary/50 h-full shadow-sm transition-shadow duration-300 ease-(--ease-premium) group-hover:shadow-lg">
          {children}
        </Card>
      </motion.div>
    </Link>
  );
}
