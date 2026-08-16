"use client";

import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { ButterflyLoader } from "@/components/ui/butterfly";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Media } from "@/components/ui/media";
import { Drawer } from "@/components/ui/overlay";
import { QuantityStepper } from "@/components/ui/quantity";
import { useCartStore } from "@/features/cart/store";
import type { CartLine } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export function FreeShippingMeter({
  remaining,
  className,
}: {
  remaining: { amount: number; currency: "EGP" } | null;
  className?: string;
}) {
  const threshold = 120000;
  const progress = remaining ? Math.min(1, (threshold - remaining.amount) / threshold) : 1;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-[0.8125rem] text-graphite">
        {remaining ? (
          <>
            <span className="font-mono text-ink" data-numeric>
              {formatMoney(remaining)}
            </span>{" "}
            away from free shipping
          </>
        ) : (
          <span className="text-success">Shipping is on us</span>
        )}
      </p>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-[var(--ease-drape)]"
          style={{
            width: `${Math.max(4, progress * 100)}%`,
            background: "linear-gradient(90deg, var(--color-iris), var(--color-peony))",
          }}
        />
      </div>
    </div>
  );
}

export function CartLineRow({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const overStock = line.maxQuantity != null && line.quantity >= line.maxQuantity;

  return (
    <li className="flex gap-3.5 py-4">
      <Link href={`/products/${line.productSlug}`} className="shrink-0">
        <Media
          asset={line.image}
          tone={line.colorHex}
          weave="jersey"
          alt={`${line.name} in ${line.colorName}`}
          aspect="4 / 5"
          className={cn("rounded-sm", compact ? "w-16" : "w-20")}
          sizes="80px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/products/${line.productSlug}`} className="block truncate text-[0.9375rem] text-ink hover:text-iris">
              {line.name}
            </Link>
            <p className="mt-0.5 text-[0.8125rem] text-clay">
              {line.colorName} · Size {line.sizeLabel}
            </p>
          </div>
          <span className="shrink-0 font-mono text-[0.875rem] text-ink" data-numeric>
            {formatMoney(line.lineTotal)}
          </span>
        </div>

        {line.stockStatus === "out-of-stock" ? (
          <p className="text-[0.8125rem] text-danger">Sold out while it was in your bag — remove it to check out.</p>
        ) : overStock ? (
          <p className="text-[0.8125rem] text-warning">That’s all we have left in this size.</p>
        ) : null}

        <div className="mt-1 flex items-center justify-between gap-3">
          <QuantityStepper
            value={line.quantity}
            size="sm"
            max={line.maxQuantity ?? 20}
            onChange={(next) => setQuantity(line.variantId, next)}
            label={`Quantity of ${line.name}`}
          />
          <button
            type="button"
            onClick={() => removeLine(line.variantId)}
            className="text-[0.8125rem] text-clay underline-offset-4 transition-colors hover:text-danger hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCartStore((s) => s.cart);
  const status = useCartStore((s) => s.status);
  const error = useCartStore((s) => s.error);
  const sync = useCartStore((s) => s.sync);
  const lines = cart?.lines ?? [];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Your bag"
      description={lines.length ? `${lines.reduce((n, l) => n + l.quantity, 0)} items` : undefined}
      footer={
        lines.length ? (
          <div className="flex flex-col gap-3">
            <FreeShippingMeter remaining={cart?.totals.freeShippingRemaining ?? null} />
            <div className="flex items-baseline justify-between">
              <span className="text-[0.9375rem] text-graphite">Subtotal</span>
              <span className="font-mono text-lg text-ink" data-numeric>
                {formatMoney(cart?.totals.subtotal)}
              </span>
            </div>
            <p className="text-[0.8125rem] text-clay">Shipping is calculated once you choose your governorate.</p>
            <Link href="/checkout" onClick={onClose} className={buttonClasses("primary", "lg", "w-full")}>
              Check out
            </Link>
            <Link href="/cart" onClick={onClose} className={buttonClasses("ghost", "sm", "w-full")}>
              View full bag
            </Link>
          </div>
        ) : null
      }
    >
      {status === "syncing" && lines.length === 0 ? (
        <div className="grid place-items-center py-16">
          <ButterflyLoader label="Loading your bag" />
        </div>
      ) : status === "error" ? (
        <ErrorState body={error ?? "We couldn’t load your bag."} onRetry={() => sync()} />
      ) : lines.length === 0 ? (
        <EmptyState
          title="Your bag is empty"
          body="Start with the woman whose day looks most like yours — it’s a faster route than a filter list."
          action={{ label: "Meet the four of them", href: "/characters" }}
        />
      ) : (
        <ul className="divide-y divide-mist">
          {lines.map((line) => (
            <CartLineRow key={line.id} line={line} compact />
          ))}
        </ul>
      )}
    </Drawer>
  );
}
