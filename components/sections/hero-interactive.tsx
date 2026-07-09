"use client";

import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
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

export function HeroInteractive({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

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
        value={prefersReducedMotion ? null : { x: springX, y: springY }}
      >
        {children}
      </HeroParallaxContext.Provider>
    </div>
  );
}
