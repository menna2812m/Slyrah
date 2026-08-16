"use client";

import Link from "next/link";
import { useState } from "react";

import { buttonClasses } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { ButterflyLoader } from "@/components/ui/butterfly";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { SelectField, TextField } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { CartLineRow, FreeShippingMeter } from "@/features/cart/cart-drawer";
import { useCartStore } from "@/features/cart/store";
import { ApiError } from "@/lib/api/client";
import type { Governorate } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";

export function CartView({ governorates }: { governorates: Governorate[] }) {
  const cart = useCartStore((s) => s.cart);
  const status = useCartStore((s) => s.status);
  const error = useCartStore((s) => s.error);
  const sync = useCartStore((s) => s.sync);
  const applyCode = useCartStore((s) => s.applyCode);
  const removeCode = useCartStore((s) => s.removeCode);
  const setGovernorate = useCartStore((s) => s.setGovernorate);
  const governorateId = useCartStore((s) => s.governorateId);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const lines = cart?.lines ?? [];
  const chosen = governorates.find((g) => g.id === governorateId);

  async function onApplyCode(event: React.FormEvent) {
    event.preventDefault();
    if (!code.trim()) return;
    setApplying(true);
    setCodeError(null);
    try {
      await applyCode(code);
      toast.success(`${code.trim().toUpperCase()} applied`);
      setCode("");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "That code didn’t apply. Check the spelling.";
      setCodeError(message);
    } finally {
      setApplying(false);
    }
  }

  if (status === "syncing" && !cart) {
    return (
      <div className="grid place-items-center py-24">
        <ButterflyLoader label="Loading your bag" />
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState body={error ?? "We couldn’t load your bag."} onRetry={() => sync()} className="my-16" />;
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your bag is empty"
        body="Nothing saved here yet. Start from the woman whose day looks most like yours, or browse everything."
        action={{ label: "Meet the four of them", href: "/characters" }}
        secondary={
          <Link href="/shop" className="text-[0.875rem] text-clay underline underline-offset-4 hover:text-ink">
            Or shop everything
          </Link>
        }
        className="my-10"
      />
    );
  }

  return (
    <div className="grid gap-12 pb-20 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <ul className="divide-y divide-mist border-y border-mist">
          {lines.map((line) => (
            <CartLineRow key={line.id} line={line} />
          ))}
        </ul>

        <Link href="/shop" className="mt-6 inline-block text-[0.9375rem] text-ink underline underline-offset-4">
          Keep shopping
        </Link>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-lg border border-mist bg-chalk p-6 lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
          <h2 className="text-heading">Order summary</h2>

          <FreeShippingMeter remaining={cart?.totals.freeShippingRemaining ?? null} className="mt-5" />

          <form onSubmit={onApplyCode} className="mt-6 flex items-end gap-2">
            <TextField
              label="Discount code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setCodeError(null);
              }}
              error={codeError ?? undefined}
              placeholder="FIRSTLIGHT"
              wrapperClassName="flex-1"
              autoCapitalize="characters"
            />
            <Button type="submit" variant="secondary" loading={applying} loadingLabel="Checking" className="mb-[1px]">
              Apply
            </Button>
          </form>

          {cart && cart.discounts.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {cart.discounts.map((discount) => (
                <li key={discount.code} className="flex items-center justify-between gap-3 rounded-sm bg-success-soft px-3 py-2.5">
                  <span className="text-[0.875rem] text-success">{discount.label}</span>
                  <button
                    type="button"
                    onClick={() => removeCode(discount.code)}
                    className="text-[0.8125rem] text-clay underline-offset-4 hover:text-danger hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6">
            <SelectField
              label="Shipping estimate"
              value={governorateId ?? ""}
              onChange={(event) => setGovernorate(event.target.value || null)}
              hint={chosen ? `${chosen.estimate}. Fee shown at checkout.` : "Pick your governorate to see the fee."}
            >
              <option value="">Choose a governorate</option>
              {governorates.map((governorate) => (
                <option key={governorate.id} value={governorate.id}>
                  {governorate.name} — {formatMoney(governorate.fee)}
                </option>
              ))}
            </SelectField>
          </div>

          <dl className="mt-6 flex flex-col gap-2.5 border-t border-mist pt-5 text-[0.9375rem]">
            <Row label="Subtotal" value={formatMoney(cart?.totals.subtotal)} />
            {cart && cart.totals.discount.amount > 0 ? (
              <Row label="Discount" value={`− ${formatMoney(cart.totals.discount)}`} tone="sale" />
            ) : null}
            <Row
              label="Shipping"
              value={
                cart?.totals.shipping == null
                  ? "Choose a governorate"
                  : cart.totals.shipping.amount === 0
                    ? "Free"
                    : formatMoney(cart.totals.shipping)
              }
            />
            <div className="mt-2 flex items-baseline justify-between border-t border-mist pt-4">
              <dt className="text-heading">Total</dt>
              <dd className="font-mono text-xl text-ink" data-numeric>
                {formatMoney(cart?.totals.total)}
              </dd>
            </div>
          </dl>

          <Link href="/checkout" className={buttonClasses("primary", "lg", "mt-6 w-full")}>
            Check out
          </Link>

          <p className="mt-3 text-center text-[0.8125rem] text-clay">
            Cash on delivery. We call to confirm before dispatch.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "sale" }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-graphite">{label}</dt>
      <dd className={`font-mono ${tone === "sale" ? "text-sale" : "text-ink"}`} data-numeric>
        {value}
      </dd>
    </div>
  );
}
