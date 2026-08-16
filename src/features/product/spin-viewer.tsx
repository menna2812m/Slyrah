"use client";

import { useEffect, useRef, useState } from "react";

import type { SpinAsset } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * 360° viewer.
 *
 * Rendered only when a real frame set exists — a single still is never rotated
 * or transformed to imply a spin that wasn’t photographed. Drag, arrow keys and
 * the slider all move through the same frame index.
 */
export function SpinViewer({ spin, className }: { spin: SpinAsset; className?: string }) {
  const [frame, setFrame] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const dragRef = useRef<{ startX: number; startFrame: number } | null>(null);
  const total = spin.frames.length;

  // Warm the frames so dragging isn’t a slideshow of blank boxes.
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    for (const src of spin.frames) {
      const image = new Image();
      image.onload = () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
      };
      image.src = src;
    }
    return () => {
      cancelled = true;
    };
  }, [spin.frames]);

  function move(clientX: number) {
    const state = dragRef.current;
    if (!state) return;
    const delta = clientX - state.startX;
    const step = Math.round(delta / 8);
    setFrame(((state.startFrame + step) % total + total) % total);
  }

  const ready = loaded >= Math.min(total, 6);

  return (
    <div className={cn("relative select-none", className)}>
      <div
        role="img"
        aria-label={spin.alt}
        className="relative w-full cursor-ew-resize overflow-hidden rounded-md bg-shell"
        style={{ aspectRatio: `${spin.width} / ${spin.height}` }}
        onPointerDown={(event) => {
          (event.target as HTMLElement).setPointerCapture(event.pointerId);
          dragRef.current = { startX: event.clientX, startFrame: frame };
        }}
        onPointerMove={(event) => {
          if (dragRef.current) move(event.clientX);
        }}
        onPointerUp={() => {
          dragRef.current = null;
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
      >
        {spin.frames.map((src, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={cn("absolute inset-0 h-full w-full object-cover", index === frame ? "opacity-100" : "opacity-0")}
          />
        ))}

        {!ready ? (
          <div className="absolute inset-0 grid place-items-center bg-shell">
            <p className="text-eyebrow">Loading the spin</p>
          </div>
        ) : null}

        <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-eyebrow text-clay">
          Drag to turn
        </p>
      </div>

      <label className="mt-4 flex items-center gap-3">
        <span className="sr-only">Rotate the product</span>
        <input
          type="range"
          min={0}
          max={total - 1}
          value={frame}
          onChange={(event) => setFrame(Number(event.target.value))}
          className="h-1 w-full appearance-none rounded-full bg-mist accent-iris"
        />
        <span className="font-mono text-[0.6875rem] text-clay" data-numeric>
          {frame + 1}/{total}
        </span>
      </label>
    </div>
  );
}
