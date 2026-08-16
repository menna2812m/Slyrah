"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { Media } from "@/components/ui/media";
import { Modal } from "@/components/ui/overlay";
import { SpinViewer } from "@/features/product/spin-viewer";
import type { ColorOption, Product, ProductImage, ProductView } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const VIEW_LABEL: Record<ProductView, string> = {
  front: "Front",
  back: "Back",
  detail: "Detail",
  "closure-open": "Closure open",
  "closure-closed": "Closure closed",
  worn: "On the body",
  flat: "Flat",
};

/** Thumbnails are 72px wide — the long labels don’t fit, so they’re shortened. */
const THUMB_LABEL: Record<ProductView, string> = {
  front: "Front",
  back: "Back",
  detail: "Detail",
  "closure-open": "Open",
  "closure-closed": "Shut",
  worn: "Worn",
  flat: "Flat",
};

/** Views we show when photography hasn’t been uploaded for a colour yet. */
function placeholderViews(product: Product): ProductView[] {
  const views: ProductView[] = ["front", "back", "detail"];
  if (product.closureId && product.closureId !== "clo-pullon") {
    views.push("closure-closed", "closure-open");
  }
  return views;
}

type Slide =
  | { kind: "photo"; id: string; image: ProductImage }
  | { kind: "placeholder"; id: string; view: ProductView }
  | { kind: "video"; id: string }
  | { kind: "spin"; id: string };

export function ProductGallery({
  product,
  selectedColor,
  className,
}: {
  product: Product;
  selectedColor: ColorOption | null;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const tone = selectedColor?.hex ?? product.colors[0]?.hex ?? "#E4DCD3";

  const slides = useMemo<Slide[]>(() => {
    const photos = product.images
      .filter((image) => !image.colorId || image.colorId === selectedColor?.id)
      .sort((a, b) => a.order - b.order);

    const base: Slide[] = photos.length
      ? photos.map((image) => ({ kind: "photo" as const, id: image.id, image }))
      : placeholderViews(product).map((view) => ({ kind: "placeholder" as const, id: `ph-${view}`, view }));

    if (product.video?.url) base.push({ kind: "video", id: "video" });
    if (product.spin) base.push({ kind: "spin", id: "spin" });

    return base;
  }, [product, selectedColor]);

  // Changing colour resets to the first view of that colour.
  const safeIndex = Math.min(index, slides.length - 1);
  const active = slides[safeIndex];

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    if (active?.kind !== "photo") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className={cn("lg:flex lg:gap-4", className)}>
      {/* Thumbnails — desktop */}
      <ul className="hidden shrink-0 flex-col gap-2 lg:flex lg:w-[4.5rem]">
        {slides.map((slide, i) => (
          <li key={slide.id}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === safeIndex}
              aria-label={`View ${slideLabel(slide)}`}
              className={cn(
                "block w-full overflow-hidden rounded-sm border transition-colors",
                i === safeIndex ? "border-ink" : "border-mist hover:border-clay",
              )}
            >
              <ThumbContent slide={slide} product={product} tone={tone} />
            </button>
          </li>
        ))}
      </ul>

      {/* Main */}
      <div className="min-w-0 flex-1">
        {/* Mobile: swipeable rail */}
        <div
          className="rail scrollbar-none -mx-[var(--spacing-gutter)] gap-2 px-[var(--spacing-gutter)] lg:hidden"
          onScroll={(event) => {
            const el = event.currentTarget;
            const next = Math.round(el.scrollLeft / el.clientWidth);
            if (next !== safeIndex) setIndex(next);
          }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full">
              <SlideContent slide={slide} product={product} tone={tone} priority />
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 lg:hidden">
          {slides.map((slide, i) => (
            <span
              key={slide.id}
              aria-hidden="true"
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === safeIndex ? "w-5 bg-ink" : "w-1 bg-mist",
              )}
            />
          ))}
        </div>

        {/* Desktop: single large view */}
        <div className="hidden lg:block">
          <div
            ref={mainRef}
            className="relative overflow-hidden rounded-md"
            onMouseMove={onMove}
            onMouseLeave={() => setZoom(null)}
          >
            <SlideContent slide={active} product={product} tone={tone} priority zoom={zoom} />

            {active?.kind === "photo" || active?.kind === "placeholder" ? (
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="absolute end-3 top-3 rounded-full bg-chalk/85 px-3 py-2 text-[0.75rem] text-ink backdrop-blur-sm transition-colors hover:bg-chalk"
              >
                Full screen
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        title={`${product.name} — ${active ? slideLabel(active) : ""}`}
        hideTitle
        className="sm:max-w-[64rem]"
      >
        <SlideContent slide={active} product={product} tone={tone} priority />
        <div className="mt-4 flex flex-wrap gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[0.8125rem] transition-colors",
                i === safeIndex ? "border-ink bg-ink text-chalk" : "border-mist text-graphite hover:border-ink/50",
              )}
            >
              {slideLabel(slide)}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function slideLabel(slide: Slide) {
  if (slide.kind === "photo") return VIEW_LABEL[slide.image.view];
  if (slide.kind === "placeholder") return VIEW_LABEL[slide.view];
  if (slide.kind === "video") return "Video";
  return "360°";
}

function ThumbContent({ slide, product, tone }: { slide: Slide; product: Product; tone: string }) {
  if (slide.kind === "photo") {
    return (
      <div className="relative" style={{ aspectRatio: "4 / 5" }}>
        <Image src={slide.image.url} alt="" fill sizes="72px" className="object-cover" />
      </div>
    );
  }
  if (slide.kind === "placeholder") {
    return (
      <Media
        asset={null}
        weave={product.materialWeave}
        tone={tone}
        alt=""
        aspect="4 / 5"
        sizes="72px"
        label={THUMB_LABEL[slide.view]}
      />
    );
  }
  return (
    <div className="grid aspect-[4/5] place-items-center bg-shell text-eyebrow text-clay">
      {slide.kind === "video" ? "Film" : "360"}
    </div>
  );
}

function SlideContent({
  slide,
  product,
  tone,
  priority,
  zoom,
  heightClass,
}: {
  slide: Slide | undefined;
  product: Product;
  tone: string;
  priority?: boolean;
  zoom?: { x: number; y: number } | null;
  /** When set, the slide sizes to this height instead of an aspect ratio. */
  heightClass?: string;
}) {
  if (!slide) return null;

  if (slide.kind === "photo") {
    return (
      <div
        className={cn("relative overflow-hidden rounded-md bg-shell", heightClass)}
        style={heightClass ? undefined : { aspectRatio: "4 / 5" }}
      >
        <Image
          src={slide.image.url}
          alt={slide.image.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 45vw"
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            zoom ? "scale-[1.9]" : "scale-100",
          )}
          style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
      </div>
    );
  }

  if (slide.kind === "placeholder") {
    return (
      <Media
        asset={null}
        weave={product.materialWeave}
        tone={tone}
        alt={`${product.name} — ${VIEW_LABEL[slide.view].toLowerCase()} view. Photography coming soon.`}
        aspect={heightClass ? null : "4 / 5"}
        sizes="(max-width: 1024px) 100vw, 45vw"
        priority={priority}
        className={cn("rounded-md", heightClass)}
        label={VIEW_LABEL[slide.view]}
      />
    );
  }

  if (slide.kind === "video" && product.video) {
    return (
      <video
        controls
        preload="none"
        playsInline
        poster={product.video.poster.url || undefined}
        className={cn("w-full rounded-md bg-shell object-cover", heightClass ?? "aspect-[4/5]")}
      >
        <source src={product.video.url} />
        {product.video.captionsUrl ? (
          <track kind="captions" src={product.video.captionsUrl} srcLang="en" label="English" default />
        ) : null}
      </video>
    );
  }

  if (slide.kind === "spin" && product.spin) {
    return <SpinViewer spin={product.spin} />;
  }

  return null;
}
