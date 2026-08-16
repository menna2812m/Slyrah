import { cn, isLightHex, shiftHex } from "@/lib/utils";

/**
 * The Slyrah mark.
 *
 * A butterfly’s colour is structural — it comes from how the wing bends light,
 * not from pigment. Fabric does the same thing. So the mark is drawn as a
 * matched pair of wings and the two halves carry the same colour at two light
 * angles: the flat face on the left, the shadow side on the right.
 *
 * One mark, three jobs: the colour swatch, the wishlist toggle, and the
 * loading state. It is the only place iridescence is allowed to be a fill.
 */

/**
 * Forewing and hindwing, not two equal lobes — four matching lobes read as a
 * clover at 16px. The forewing sweeps up and out past the shoulder; the
 * hindwing is smaller, rounder and sits lower.
 */
const WING_UPPER = "M12 5.1C14.1 1.1 17.8 0.9 20.4 2.6c2.7 1.8 2.6 6.1-.4 8.1-1.9 1.3-4.7 1.9-8 2Z";
const WING_LOWER = "M12 13.2c3 0 5.6 1 6.3 3.2.8 2.4-.9 4.6-3.3 4.6-1.4 0-2.4-.6-3-1.6Z";

interface ButterflyProps {
  className?: string;
  /** Flat face of the wing. */
  hex?: string;
  /** Shadow side. Derived from `hex` when Admin hasn’t supplied one. */
  hexShift?: string | null;
  /** "duochrome" paints the brand gradient — reserved for the wishlist. */
  variant?: "color" | "duochrome" | "outline";
  filled?: boolean;
  animate?: boolean;
}

export function Butterfly({
  className,
  hex = "#6d5c9b",
  hexShift,
  variant = "color",
  filled = true,
  animate = false,
}: ButterflyProps) {
  const left = hex;
  const right = hexShift ?? shiftHex(hex, -0.16);
  const needsOutline = variant === "color" && isLightHex(left);

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("block", animate && "motion-safe:[animation:slyrah-wing_.5s_var(--ease-wing)]", className)}
    >
      {/* The duochrome gradient is defined once, in the root layout, so that
          fifty butterflies on a listing page don’t declare fifty identical
          ids. */}

      {/* Left wings — flat face */}
      <g transform="translate(24 0) scale(-1 1)">
        <path
          d={WING_UPPER}
          fill={variant === "outline" || !filled ? "none" : variant === "duochrome" ? "url(#slyrah-wing-grad)" : left}
          stroke={variant === "outline" || !filled ? "currentColor" : needsOutline ? "rgb(34 29 35 / .22)" : "none"}
          strokeWidth={variant === "outline" || !filled ? 1.4 : 0.75}
          strokeLinejoin="round"
        />
        <path
          d={WING_LOWER}
          fill={variant === "outline" || !filled ? "none" : variant === "duochrome" ? "url(#slyrah-wing-grad)" : left}
          stroke={variant === "outline" || !filled ? "currentColor" : needsOutline ? "rgb(34 29 35 / .22)" : "none"}
          strokeWidth={variant === "outline" || !filled ? 1.4 : 0.75}
          strokeLinejoin="round"
        />
      </g>

      {/* Right wings — shadow side */}
      <g>
        <path
          d={WING_UPPER}
          fill={variant === "outline" || !filled ? "none" : variant === "duochrome" ? "url(#slyrah-wing-grad)" : right}
          stroke={variant === "outline" || !filled ? "currentColor" : needsOutline ? "rgb(34 29 35 / .22)" : "none"}
          strokeWidth={variant === "outline" || !filled ? 1.4 : 0.75}
          strokeLinejoin="round"
        />
        <path
          d={WING_LOWER}
          fill={variant === "outline" || !filled ? "none" : variant === "duochrome" ? "url(#slyrah-wing-grad)" : right}
          stroke={variant === "outline" || !filled ? "currentColor" : needsOutline ? "rgb(34 29 35 / .22)" : "none"}
          strokeWidth={variant === "outline" || !filled ? 1.4 : 0.75}
          strokeLinejoin="round"
        />
      </g>

      {/* Body and antennae: enough to read as a butterfly, not an insect diagram */}
      <path
        d="M12 4.6v15.2"
        stroke={variant === "outline" || !filled ? "currentColor" : "rgb(34 29 35 / .34)"}
        strokeWidth={variant === "outline" || !filled ? 1.5 : 1.1}
        strokeLinecap="round"
      />
      <path
        d="M12 4.8 9.9 2.2M12 4.8l2.1-2.6"
        fill="none"
        stroke={variant === "outline" || !filled ? "currentColor" : "rgb(34 29 35 / .28)"}
        strokeWidth={variant === "outline" || !filled ? 1.2 : 0.85}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Rendered once per document. Every duochrome butterfly points at this.
 */
export function ButterflyDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <defs>
        <linearGradient id="slyrah-wing-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-iris)" />
          <stop offset="100%" stopColor="var(--color-peony)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Wordmark lockup used in the header and footer. */
export function SlyrahLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <Butterfly variant="duochrome" className="h-[0.72em] w-[0.72em] translate-y-[0.02em] self-center" />
      <span
        className="font-display text-[1.35em] leading-none tracking-[-0.02em] text-ink"
        style={{ fontVariationSettings: '"SOFT" 40, "WONK" 1, "opsz" 40, "wght" 500' }}
      >
        Slyrah
      </span>
    </span>
  );
}

/** Loading state. The wings breathe rather than a spinner going round. */
export function ButterflyLoader({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-clay", className)}>
      <Butterfly
        variant="duochrome"
        className="h-5 w-5 motion-safe:[animation:slyrah-wing_1.4s_var(--ease-drape)_infinite]"
      />
      <span className="text-eyebrow">{label}</span>
    </span>
  );
}
