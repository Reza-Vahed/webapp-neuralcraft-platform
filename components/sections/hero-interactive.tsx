"use client";

import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";

import { HeroParallaxContext } from "@/components/sections/hero-parallax-context";

// The only element in the whole Hero that listens for pointer movement —
// deliberately the *outermost* wrapper, not a layer buried inside the
// decorative background. The foreground content (Container, in hero.tsx)
// is a normal in-flow block that occupies its full box for hit-testing
// even in the "empty" space between its centered children, so a listener
// placed only on a background layer would never see pointer events that
// land on or near that content — moving the listener here and relying on
// React's event bubbling is what makes it fire everywhere within the Hero,
// including over the text and buttons, without those needing any special
// handling of their own.
const MAX_OFFSET_PX = 20;
const SPRING_CONFIG = { stiffness: 40, damping: 20, mass: 0.6 };

// Scroll parallax (motion-polish): a second, independent offset added on
// top of the mouse offset below — not a replacement. 24px is deliberately
// smaller than the 20-40px mouse range so the two never fight for visual
// attention; it only needs to read as "the glow sits at a different depth
// than the page" while the Hero scrolls past, not as its own effect.
const MAX_SCROLL_OFFSET_PX = 24;

export function HeroInteractive({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  // Tracks the Hero's own scroll position, not the whole page: progress 0
  // is "Hero just reached the top of the viewport" (effectively page load,
  // since the Hero is the first section), progress 1 is "Hero has fully
  // scrolled past". Framer Motion clamps this to [0, 1] by construction —
  // it can't overshoot before/after those two checkpoints.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const scrollY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, MAX_SCROLL_OFFSET_PX]
  );
  // Summed rather than picking one: the mouse spring should keep responding
  // to pointer movement independently of however far the user has scrolled.
  const combinedY = useTransform(
    [springY, scrollY],
    ([mouse, scroll]) => (mouse as number) + (scroll as number)
  );

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;

    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    // -0.5..0.5 relative to the Hero's own bounds, scaled to the max
    // allowed pixel offset — never more than MAX_OFFSET_PX in either axis.
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    mouseX.set(relativeX * 2 * MAX_OFFSET_PX);
    mouseY.set(relativeY * 2 * MAX_OFFSET_PX);
  }

  function handlePointerLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <HeroParallaxContext.Provider
        value={prefersReducedMotion ? null : { x: springX, y: combinedY }}
      >
        {children}
      </HeroParallaxContext.Provider>
    </div>
  );
}
