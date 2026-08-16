import Image from "next/image";
import type { CSSProperties } from "react";

import type { ImageAsset, WeavePattern } from "@/lib/api/types";
import { cn, shiftHex } from "@/lib/utils";

/**
 * Product photography has not been shot yet, so `ImageAsset` is null across the
 * fixtures. Rather than grey boxes, we render the fabric itself: a CSS weave
 * built from the same colour the garment comes in. The moment Admin supplies a
 * real URL, <Image> takes over and the placeholder disappears — no other code
 * changes, and the aspect ratio is identical either way so nothing shifts.
 */

export function weaveStyle(weave: WeavePattern, hex: string): CSSProperties {
  const deep = shiftHex(hex, -0.18);
  const deeper = shiftHex(hex, -0.32);
  const light = shiftHex(hex, 0.12);

  switch (weave) {
    case "rib":
      return {
        backgroundColor: hex,
        backgroundImage: `repeating-linear-gradient(90deg, ${deep} 0 2px, ${light} 2px 6px, ${hex} 6px 8px)`,
      };
    case "jersey":
      return {
        backgroundColor: hex,
        backgroundImage: `repeating-linear-gradient(58deg, ${deep}22 0 1px, transparent 1px 3px), repeating-linear-gradient(-58deg, ${light}55 0 1px, transparent 1px 3px)`,
      };
    case "lace":
      return {
        backgroundColor: hex,
        backgroundImage: `radial-gradient(circle at 25% 25%, ${light} 0 3px, transparent 3.5px), radial-gradient(circle at 75% 75%, ${light} 0 3px, transparent 3.5px), radial-gradient(circle at 75% 25%, ${deeper}55 0 5px, transparent 5.5px), radial-gradient(circle at 25% 75%, ${deeper}55 0 5px, transparent 5.5px)`,
        backgroundSize: "26px 26px",
      };
    case "microfibre":
      return {
        backgroundColor: hex,
        backgroundImage: `linear-gradient(160deg, ${light} 0%, ${hex} 45%, ${deep} 100%)`,
      };
    case "mesh":
      return {
        backgroundColor: deep,
        backgroundImage: `repeating-linear-gradient(0deg, ${light} 0 1px, transparent 1px 7px), repeating-linear-gradient(90deg, ${light} 0 1px, transparent 1px 7px)`,
      };
    case "satin":
      return {
        backgroundColor: hex,
        backgroundImage: `linear-gradient(115deg, ${deeper} 0%, ${hex} 30%, ${light} 46%, ${hex} 62%, ${deep} 100%)`,
      };
    default:
      return { backgroundColor: hex };
  }
}

interface MediaProps {
  asset: ImageAsset | null | undefined;
  /** Rendered when there is no photograph yet. */
  weave?: WeavePattern;
  tone?: string;
  /** Short label shown over the placeholder. Never shown over a real photo. */
  label?: string;
  alt?: string;
  /** Pass `null` to size from the className instead of an aspect ratio. */
  aspect?: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}

export function Media({
  asset,
  weave = "jersey",
  tone = "#E4DCD3",
  label,
  alt,
  aspect = "4 / 5",
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
  className,
  imageClassName,
}: MediaProps) {
  const hasPhoto = Boolean(asset?.url);

  return (
    <div
      className={cn("relative overflow-hidden bg-shell", className)}
      style={aspect ? { aspectRatio: aspect } : undefined}
      data-media={hasPhoto ? "photo" : "placeholder"}
    >
      {hasPhoto ? (
        <Image
          src={asset!.url}
          alt={alt ?? asset!.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={asset!.blurDataUrl ? "blur" : "empty"}
          blurDataURL={asset!.blurDataUrl}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div
          role="img"
          aria-label={alt ?? label ?? "Product photography coming soon"}
          className="grain absolute inset-0"
          style={weaveStyle(weave, tone)}
        >
          {label ? (
            <span className="absolute inset-x-0 bottom-0 p-2.5 text-eyebrow text-ink/45 mix-blend-luminosity">
              {label}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

/**
 * Character portraits get their own treatment: a two-stop field in her accent
 * pair with her initial set large in the display face.
 */
export function PortraitMedia({
  asset,
  name,
  accent,
  alt,
  aspect = "3 / 4",
  sizes = "(max-width: 768px) 90vw, 30vw",
  priority = false,
  className,
}: {
  asset: ImageAsset | null | undefined;
  name: string;
  accent: { from: string; to: string };
  alt?: string;
  /** Pass `null` to size from the className instead of an aspect ratio. */
  aspect?: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const hasPhoto = Boolean(asset?.url);

  return (
    <div
      className={cn("relative overflow-hidden bg-shell", className)}
      style={aspect ? { aspectRatio: aspect } : undefined}
      data-media={hasPhoto ? "photo" : "placeholder"}
    >
      {hasPhoto ? (
        <Image
          src={asset!.url}
          alt={alt ?? asset!.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt ?? `${name} — portrait coming soon`}
          className="grain absolute inset-0 flex items-center justify-center"
          style={{
            backgroundImage: `radial-gradient(120% 90% at 30% 10%, ${accent.from} 0%, ${accent.to} 55%, ${shiftHex(accent.to, -0.4)} 100%)`,
          }}
        >
          <span
            aria-hidden="true"
            className="font-display text-[38vmin] leading-none text-white/12 sm:text-[22vmin]"
            style={{ fontVariationSettings: '"SOFT" 60, "WONK" 1, "opsz" 144' }}
          >
            {name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}
