import Link from "next/link";

import { Media } from "@/components/ui/media";
import type { ContentBlock, ProductSummary } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";

/**
 * Admin sends ordered blocks rather than an HTML blob, so the storefront
 * controls typography and nothing can inject markup.
 */
export function ContentBlocks({
  blocks,
  products,
}: {
  blocks: ContentBlock[];
  products?: Map<string, ProductSummary>;
}) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h3 key={index} className="text-heading mt-4">
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p key={index} className="text-lede text-graphite">
                {block.text}
              </p>
            );

          case "list":
            return (
              <ul key={index} className="flex flex-col gap-2.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[1.0625rem] leading-relaxed text-graphite">
                    <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-peony" />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <blockquote key={index} className="my-3 border-s-2 border-iris ps-6">
                <p className="font-display text-[clamp(1.25rem,1.05rem+0.9vw,1.65rem)] leading-[1.3] text-ink">
                  {block.text}
                </p>
                {block.attribution ? (
                  <cite className="mt-3 block text-[0.875rem] not-italic text-clay">— {block.attribution}</cite>
                ) : null}
              </blockquote>
            );

          case "image":
            return (
              <figure key={index} className="my-3">
                <Media
                  asset={block.image}
                  weave="jersey"
                  tone="#D8D0D6"
                  alt={block.image.alt}
                  aspect="16 / 10"
                  sizes="(max-width: 768px) 92vw, 46rem"
                  className="rounded-md"
                />
                {block.image.alt ? (
                  <figcaption className="mt-2.5 text-[0.8125rem] text-clay">{block.image.alt}</figcaption>
                ) : null}
              </figure>
            );

          case "video":
            return (
              <figure key={index} className="my-3">
                {block.video.url ? (
                  <video controls preload="none" playsInline poster={block.video.poster.url || undefined} className="w-full rounded-md">
                    <source src={block.video.url} />
                  </video>
                ) : (
                  <Media
                    asset={block.video.poster}
                    weave="satin"
                    tone="#C3AFC0"
                    alt={block.video.poster.alt}
                    aspect="16 / 9"
                    sizes="(max-width: 768px) 92vw, 46rem"
                    className="rounded-md"
                    label={block.video.title}
                  />
                )}
              </figure>
            );

          case "product": {
            const product = products?.get(block.productSlug);
            if (!product) return null;
            return (
              <Link
                key={index}
                href={`/products/${product.slug}`}
                className="group my-3 flex items-center gap-4 rounded-md border border-mist bg-chalk p-4 transition-colors hover:border-clay"
              >
                <Media
                  asset={product.primaryImage}
                  weave={product.materialWeave}
                  tone={product.colors[0]?.hex}
                  alt={product.name}
                  aspect="4 / 5"
                  className="w-16 shrink-0 rounded-sm"
                  sizes="64px"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] text-ink transition-colors group-hover:text-iris">
                    {product.name}
                  </span>
                  <span className="block text-[0.8125rem] text-clay">{product.subtitle}</span>
                </span>
                <span className="shrink-0 font-mono text-[0.875rem] text-ink" data-numeric>
                  {formatMoney(product.price)}
                </span>
              </Link>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
