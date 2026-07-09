import { HeroGlow } from "@/components/sections/hero-glow";

// Purely decorative, aria-hidden ambient background for the Hero — five
// layered effects (atmosphere gradient, glow orbs, grid, particles, neural
// lines). Everything except the glow orbs (hero-glow.tsx, mouse-parallax)
// is static markup: no "use client", no hooks, nothing that needs to run in
// the browser. This whole component (bar the one island it renders) costs
// zero JS — see DESIGN.md's Hero section for the full reasoning.
//
// The wrapper below is pointer-events-none (nothing here should ever
// intercept a click meant for the real content, which sits above this at
// a higher z-index in hero.tsx) — except HeroGlow, which re-enables its
// own pointer-events so it alone can track mouse position across the
// whole Hero for the parallax effect.
const PARTICLE_COUNT = 30;

type Particle = {
  id: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  visibleOnMobile: boolean;
};

// Randomized once per render. This is a Server Component with no client
// counterpart, so there is no hydration mismatch to worry about — the
// values are simply baked into the static HTML for that build/request
// (see DESIGN.md).
function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 2 + Math.random() * 3,
    opacity: 0.1 + Math.random() * 0.25,
    duration: 16 + Math.random() * 14,
    delay: Math.random() * -20,
    driftX: (Math.random() - 0.5) * 24,
    driftY: -8 - Math.random() * 16,
    // Roughly half render only from `sm:` up — keeps the mobile compositing
    // budget smaller while still showing the full field on larger screens.
    visibleOnMobile: id % 2 === 0,
  }));
}

export function HeroBackground() {
  const particles = generateParticles(PARTICLE_COUNT);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Layer 1 — base atmosphere */}
      <div className="hero-atmosphere hero-animate" />

      {/* Layer 2 — glow orbs (mouse parallax, see hero-glow.tsx) */}
      <HeroGlow />

      {/* Layer 3 — grid */}
      <div className="hero-grid hero-animate text-foreground" />

      {/* Layer 4 — floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`hero-particle hero-animate bg-foreground absolute rounded-full ${
            particle.visibleOnMobile ? "" : "hidden sm:block"
          }`}
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            ["--particle-drift-x" as string]: `${particle.driftX}px`,
            ["--particle-drift-y" as string]: `${particle.driftY}px`,
          }}
        />
      ))}

      {/* Layer 5 — neural connection lines */}
      <svg
        className="text-foreground absolute inset-0 size-full opacity-[0.07]"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="1">
          <line x1="80" y1="80" x2="260" y2="160" />
          <line x1="260" y1="160" x2="480" y2="90" />
          <line x1="480" y1="90" x2="700" y2="180" />
          <line x1="260" y1="160" x2="340" y2="300" />
          <line x1="340" y1="300" x2="560" y2="320" />
          <line
            className="hero-signal hero-animate"
            x1="480"
            y1="90"
            x2="340"
            y2="300"
            strokeDasharray="24"
          />
        </g>
        <g fill="currentColor">
          <circle cx="80" cy="80" r="3" />
          <circle cx="260" cy="160" r="3" />
          <circle cx="480" cy="90" r="3" />
          <circle cx="700" cy="180" r="3" />
          <circle cx="340" cy="300" r="3" />
          <circle cx="560" cy="320" r="3" />
        </g>
      </svg>
    </div>
  );
}
