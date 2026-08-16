"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ButterflyLoader } from "@/components/ui/butterfly";
import { EmptyState } from "@/components/ui/empty-state";
import { Checkbox, SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { Media } from "@/components/ui/media";
import { toast } from "@/components/ui/toast";
import { useCartStore } from "@/features/cart/store";
import { ApiError, checkoutApi } from "@/lib/api/client";
import type { CheckoutAddress, Governorate, PaymentMethod, PaymentMethodId } from "@/lib/api/types";
import { formatMoney, isValidEgyptianPhone, normalizeEgyptianPhone } from "@/lib/format";
import { cn } from "@/lib/utils";

export const LAST_ORDER_KEY = "slyrah.lastOrder";

type FormValues = CheckoutAddress & { paymentMethod: PaymentMethodId; marketingOptIn: boolean };

const EMPTY: FormValues = {
  fullName: "",
  phone: "",
  email: "",
  governorateId: "",
  cityId: "",
  street: "",
  building: "",
  apartment: "",
  landmark: "",
  notes: "",
  paymentMethod: "cod",
  marketingOptIn: false,
};

/**
 * Guest checkout is the only checkout. There is no sign-in wall, no password,
 * and no step that exists to collect data we don’t need to deliver a parcel.
 * The account offer comes after the order is placed, not before.
 */
export function CheckoutForm({
  governorates,
  paymentMethods,
}: {
  governorates: Governorate[];
  paymentMethods: PaymentMethod[];
}) {
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const cartId = useCartStore((s) => s.cartId);
  const codes = useCartStore((s) => s.codes);
  const status = useCartStore((s) => s.status);
  const setGovernorate = useCartStore((s) => s.setGovernorate);
  const storeGovernorateId = useCartStore((s) => s.governorateId);
  const clear = useCartStore((s) => s.clear);

  const [values, setValues] = useState<FormValues>({ ...EMPTY, governorateId: storeGovernorateId ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const governorate = governorates.find((g) => g.id === values.governorateId);
  const cities = governorate?.cities ?? [];

  // Keep the bag’s shipping estimate in step with the address being typed.
  useEffect(() => {
    if (values.governorateId && values.governorateId !== storeGovernorateId) {
      setGovernorate(values.governorateId);
    }
  }, [values.governorateId, storeGovernorateId, setGovernorate]);

  const lines = cart?.lines ?? [];

  // Two additions — cheap enough that memoising them would cost more than it
  // saves. The authoritative figures still come back from the server on submit.
  const qualifiesForFreeShipping = cart?.totals.freeShippingRemaining === null && lines.length > 0;
  const shipping = !governorate
    ? null
    : qualifiesForFreeShipping
      ? { amount: 0, currency: "EGP" as const }
      : governorate.fee;

  const total = cart
    ? {
        amount: cart.totals.subtotal.amount - cart.totals.discount.amount + (shipping?.amount ?? 0),
        currency: "EGP" as const,
      }
    : null;

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key as string]) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (values.fullName.trim().length < 2) next.fullName = "Enter the name the courier should ask for.";
    if (!isValidEgyptianPhone(values.phone)) next.phone = "Enter an Egyptian mobile number, like 01012345678.";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Check the email address.";
    if (!values.governorateId) next.governorateId = "Choose a governorate.";
    if (!values.cityId) next.cityId = "Choose a city.";
    if (values.street.trim().length < 3) next.street = "Enter the street and number.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const firstKey = Object.keys(next)[0]!;
      document.getElementById(`field-${firstKey}`)?.focus();
      return false;
    }
    return true;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setPlacing(true);
    try {
      const order = await checkoutApi.placeOrder({
        cartId,
        address: {
          fullName: values.fullName.trim(),
          phone: normalizeEgyptianPhone(values.phone),
          email: values.email?.trim() || undefined,
          governorateId: values.governorateId,
          cityId: values.cityId,
          street: values.street.trim(),
          building: values.building?.trim() || undefined,
          apartment: values.apartment?.trim() || undefined,
          landmark: values.landmark?.trim() || undefined,
          notes: values.notes?.trim() || undefined,
        },
        paymentMethod: values.paymentMethod,
        discountCodes: codes,
        marketingOptIn: values.marketingOptIn,
      });

      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      clear();
      router.push("/checkout/confirmation");
    } catch (error) {
      if (error instanceof ApiError) {
        // The API namespaces address errors ("address.phone"); the form’s
        // fields are flat, so strip the prefix before matching them up.
        const flattened = Object.fromEntries(
          Object.entries(error.fields ?? {}).map(([key, message]) => [key.split(".").pop()!, message]),
        );
        setErrors(flattened);
        toast.error(error.message);
        const firstKey = Object.keys(flattened)[0];
        if (firstKey) document.getElementById(`field-${firstKey}`)?.focus();
      } else {
        toast.error("We couldn’t place the order. Try again in a moment.");
      }
    } finally {
      setPlacing(false);
    }
  }

  if (status === "syncing" && !cart) {
    return (
      <div className="grid place-items-center py-24">
        <ButterflyLoader label="Loading your bag" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="There’s nothing to check out"
        body="Your bag is empty. Add something and come back — nothing here is lost."
        action={{ label: "Shop everything", href: "/shop" }}
        className="my-10"
      />
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16" noValidate>
      <div className="lg:col-span-7">
        <Fieldset legend="Who’s receiving it" step={1}>
          <TextField
            id="field-fullName"
            label="Full name"
            value={values.fullName}
            onChange={(event) => set("fullName", event.target.value)}
            error={errors.fullName}
            autoComplete="name"
            enterKeyHint="next"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="field-phone"
              label="Mobile number"
              type="tel"
              inputMode="numeric"
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
              error={errors.phone}
              hint="We call to confirm before dispatch."
              placeholder="01012345678"
              autoComplete="tel"
            />
            <TextField
              id="field-email"
              label="Email"
              type="email"
              optional
              value={values.email ?? ""}
              onChange={(event) => set("email", event.target.value)}
              error={errors.email}
              hint="For the confirmation, if you want one."
              autoComplete="email"
            />
          </div>
        </Fieldset>

        <Fieldset legend="Where it’s going" step={2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id="field-governorateId"
              label="Governorate"
              value={values.governorateId}
              onChange={(event) => {
                set("governorateId", event.target.value);
                set("cityId", "");
              }}
              error={errors.governorateId}
              autoComplete="address-level1"
            >
              <option value="">Choose one</option>
              {governorates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {formatMoney(item.fee)}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="field-cityId"
              label="City or area"
              value={values.cityId}
              onChange={(event) => set("cityId", event.target.value)}
              error={errors.cityId}
              disabled={!governorate}
              hint={governorate ? governorate.estimate : "Choose a governorate first."}
              autoComplete="address-level2"
            >
              <option value="">{governorate ? "Choose one" : "—"}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </SelectField>
          </div>

          <TextField
            id="field-street"
            label="Street and number"
            value={values.street}
            onChange={(event) => set("street", event.target.value)}
            error={errors.street}
            autoComplete="address-line1"
            placeholder="12 Road 9"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="field-building"
              label="Building"
              optional
              value={values.building ?? ""}
              onChange={(event) => set("building", event.target.value)}
            />
            <TextField
              id="field-apartment"
              label="Apartment or floor"
              optional
              value={values.apartment ?? ""}
              onChange={(event) => set("apartment", event.target.value)}
            />
          </div>

          <TextField
            id="field-landmark"
            label="Landmark"
            optional
            value={values.landmark ?? ""}
            onChange={(event) => set("landmark", event.target.value)}
            hint="What the courier should look for. This is what actually gets parcels delivered."
            placeholder="Above the pharmacy"
          />

          <TextAreaField
            id="field-notes"
            label="Anything else for the courier"
            optional
            value={values.notes ?? ""}
            onChange={(event) => set("notes", event.target.value)}
            placeholder="Please call before coming up"
          />
        </Fieldset>

        <Fieldset legend="How you’ll pay" step={3}>
          <ul className="flex flex-col gap-2.5">
            {paymentMethods.map((method) => {
              const selected = values.paymentMethod === method.id;
              return (
                <li key={method.id}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors",
                      selected ? "border-ink bg-chalk" : "border-mist",
                      !method.available && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selected}
                      disabled={!method.available}
                      onChange={() => set("paymentMethod", method.id)}
                      className="mt-1 h-4 w-4 accent-ink"
                    />
                    <span>
                      <span className="block text-[0.9375rem] text-ink">{method.label}</span>
                      <span className="mt-0.5 block text-[0.8125rem] text-clay">{method.description}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <Checkbox
            label="Email me when there’s a new drop"
            description="Roughly once a month. Unsubscribe in one tap."
            checked={values.marketingOptIn}
            onChange={(event) => set("marketingOptIn", event.target.checked)}
            className="mt-2"
          />
        </Fieldset>
      </div>

      {/* Summary — sticky on desktop, a real bar at the bottom on mobile */}
      <aside className="lg:col-span-5">
        <div className="rounded-lg border border-mist bg-chalk p-6 lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
          <h2 className="text-heading">Your order</h2>

          <ul className="mt-5 flex flex-col gap-4">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-3">
                <Media
                  asset={line.image}
                  tone={line.colorHex}
                  alt={line.name}
                  aspect="4 / 5"
                  className="w-14 shrink-0 rounded-xs"
                  sizes="56px"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.875rem] text-ink">{line.name}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-clay">
                    {line.colorName} · {line.sizeLabel} · ×{line.quantity}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[0.8125rem] text-ink" data-numeric>
                  {formatMoney(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 flex flex-col gap-2.5 border-t border-mist pt-5 text-[0.9375rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-graphite">Subtotal</dt>
              <dd className="font-mono text-ink" data-numeric>
                {formatMoney(cart?.totals.subtotal)}
              </dd>
            </div>

            {cart && cart.totals.discount.amount > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-graphite">Discount</dt>
                <dd className="font-mono text-sale" data-numeric>
                  − {formatMoney(cart.totals.discount)}
                </dd>
              </div>
            ) : null}

            <div className="flex justify-between gap-4">
              <dt className="text-graphite">Shipping</dt>
              <dd className="font-mono text-ink" data-numeric>
                {shipping == null ? "Choose a governorate" : shipping.amount === 0 ? "Free" : formatMoney(shipping)}
              </dd>
            </div>

            <div className="mt-2 flex items-baseline justify-between border-t border-mist pt-4">
              <dt className="text-heading">Total to pay</dt>
              <dd className="font-mono text-xl text-ink" data-numeric>
                {formatMoney(total)}
              </dd>
            </div>
          </dl>

          <Button type="submit" size="lg" fullWidth loading={placing} loadingLabel="Placing your order" className="mt-6">
            Place order
          </Button>

          <p className="mt-3 text-[0.8125rem] leading-relaxed text-clay">
            You’ll pay the courier on delivery. By placing the order you agree to our{" "}
            <Link href="/pages/terms" className="underline underline-offset-4 hover:text-ink">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/pages/returns-policy" className="underline underline-offset-4 hover:text-ink">
              returns policy
            </Link>
            .
          </p>
        </div>
      </aside>
    </form>
  );
}

function Fieldset({ legend, step, children }: { legend: string; step: number; children: React.ReactNode }) {
  return (
    <fieldset className="mb-10 last:mb-0">
      <legend className="mb-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid h-6 w-6 place-items-center rounded-full border border-ink/20 font-mono text-[0.6875rem] text-ink"
        >
          {step}
        </span>
        <span className="text-heading">{legend}</span>
      </legend>
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}
