"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { Butterfly } from "@/components/ui/butterfly";
import { EmptyState } from "@/components/ui/empty-state";
import { TextField } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { LAST_ORDER_KEY } from "@/features/checkout/checkout-form";
import { OrderSummary } from "@/features/orders/order-summary";
import { accountApi, ApiError } from "@/lib/api/client";
import type { Order } from "@/lib/api/types";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * The order is confirmed first, and only then do we mention an account — and
 * we say what it actually does for her rather than asking her to "join".
 * Skipping is a plain link, not a hidden one.
 */
function readLastOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

export function Confirmation() {
  const hydrated = useHydrated();
  const [claimed, setClaimed] = useState(false);

  // The order is handed over in session storage rather than the URL, so an
  // order number and address never end up in browser history or a referrer.
  const order = useMemo(() => (hydrated ? readLastOrder() : null), [hydrated]);

  if (!hydrated) return <div className="h-96" />;

  if (!order) {
    return (
      <EmptyState
        title="No order to show here"
        body="This page shows an order right after you place it. If you’re looking for one from before, track it with your order number and phone."
        action={{ label: "Track an order", href: "/track" }}
        className="my-16"
      />
    );
  }

  return (
    <div className="pb-24">
      <div className="flex flex-col items-start gap-6 border-b border-mist pb-10">
        <Butterfly variant="duochrome" className="h-10 w-10" animate />
        <div>
          <p className="text-eyebrow mb-3">Order confirmed</p>
          <h1 className="text-display">Welcome to Slyrah.</h1>
          <p className="mt-4 max-w-xl text-lede text-graphite">
            Order{" "}
            <span className="font-mono text-ink" data-numeric>
              {order.orderNumber}
            </span>{" "}
            is with us. We’ll call{" "}
            <span className="font-mono text-ink" data-numeric>
              {order.address.phone}
            </span>{" "}
            to confirm before it’s packed, and it goes out within one working day.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/track?order=${order.orderNumber}&phone=${order.address.phone}`} className={buttonClasses("primary", "md")}>
            Track this order
          </Link>
          <Link href="/shop" className={buttonClasses("ghost", "md")}>
            Keep shopping
          </Link>
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <OrderSummary order={order} />
        </div>

        <div className="lg:col-span-5">
          {claimed ? (
            <div className="rounded-lg border border-success/30 bg-success-soft/50 p-6">
              <h2 className="text-heading text-success">Your account is ready</h2>
              <p className="mt-2 text-[0.9375rem] text-graphite">
                This order is now attached to it, along with the sizes you bought.
              </p>
              <Link href="/account" className={buttonClasses("secondary", "md", "mt-5")}>
                Go to your account
              </Link>
            </div>
          ) : (
            <ClaimAccountForm order={order} onDone={() => setClaimed(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

function ClaimAccountForm({ order, onDone }: { order: Order; onDone: () => void }) {
  const [values, setValues] = useState({
    firstName: order.address.fullName.split(" ")[0] ?? "",
    lastName: order.address.fullName.split(" ").slice(1).join(" ") || "",
    email: order.address.email ?? "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <div className="rounded-lg border border-mist bg-chalk p-6">
        <p className="text-[0.9375rem] text-graphite">
          No account, no problem. Keep your order number —{" "}
          <span className="font-mono text-ink" data-numeric>
            {order.orderNumber}
          </span>{" "}
          — and you can track it any time.
        </p>
        <button
          type="button"
          onClick={() => setSkipped(false)}
          className="mt-3 text-[0.875rem] text-ink underline underline-offset-4"
        >
          Actually, create one
        </button>
      </div>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (values.firstName.trim().length < 2) next.firstName = "Enter your first name.";
    if (values.lastName.trim().length < 2) next.lastName = "Enter your last name.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await accountApi.claim({
        orderNumber: order.orderNumber,
        phone: order.address.phone,
        password: values.password,
        email: values.email || undefined,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      });
      toast.success("Account created", { detail: "This order is now attached to it." });
      onDone();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fields ?? {});
        toast.error(error.message);
      } else {
        toast.error("We couldn’t create the account. Try again in a moment.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="edge-iris rounded-lg bg-chalk p-6" noValidate>
      <h2 className="text-heading">Keep track of all this</h2>
      <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem] text-graphite">
        {[
          "Follow this order without typing the number every time",
          "Save the sizes you just bought, so the size guide stops being a guess",
          "Get the next drop before it goes public",
          "Offers based on what you actually wear",
        ].map((item) => (
          <li key={item} className="flex gap-3">
            <Butterfly variant="duochrome" className="mt-1 h-3.5 w-3.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="First name"
            value={values.firstName}
            onChange={(event) => setValues((v) => ({ ...v, firstName: event.target.value }))}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <TextField
            label="Last name"
            value={values.lastName}
            onChange={(event) => setValues((v) => ({ ...v, lastName: event.target.value }))}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>

        <TextField
          label="Email"
          type="email"
          optional
          value={values.email}
          onChange={(event) => setValues((v) => ({ ...v, email: event.target.value }))}
          error={errors.email}
          autoComplete="email"
        />

        <TextField
          label="Password"
          type="password"
          value={values.password}
          onChange={(event) => setValues((v) => ({ ...v, password: event.target.value }))}
          error={errors.password}
          hint="At least 8 characters."
          autoComplete="new-password"
        />

        <p className="text-[0.8125rem] text-clay">
          We’ll use{" "}
          <span className="font-mono text-graphite" data-numeric>
            {order.address.phone}
          </span>{" "}
          as your sign-in number — the same one on this order.
        </p>

        <Button type="submit" size="lg" loading={saving} loadingLabel="Creating your account">
          Create account
        </Button>

        <button
          type="button"
          onClick={() => setSkipped(true)}
          className="py-1 text-[0.875rem] text-clay underline underline-offset-4 hover:text-ink"
        >
          No thanks, just the order
        </button>
      </div>
    </form>
  );
}
