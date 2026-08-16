"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { useProfileStore } from "@/features/account/profile-store";
import { StoredProductRail } from "@/features/catalog/product-rail";
import { useRecentlyViewedStore } from "@/features/catalog/recently-viewed";
import { useWishlistStore } from "@/features/wishlist/store";
import type { SizeGuide } from "@/lib/api/types";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "orders", label: "Orders" },
  { id: "sizes", label: "Your sizes" },
  { id: "saved", label: "Saved" },
  { id: "details", label: "Your details" },
] as const;

export function AccountView({ sizeGuides }: { sizeGuides: SizeGuide[] }) {
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("orders");

  const profile = useProfileStore();
  const wishlist = useWishlistStore((s) => s.slugs);
  const recent = useRecentlyViewedStore((s) => s.slugs);
  const hydrated = useHydrated();

  return (
    <div className="grid gap-10 pb-24 lg:grid-cols-12 lg:gap-16">
      <nav aria-label="Account" className="lg:col-span-3">
        <ul className="rail scrollbar-none -mx-[var(--spacing-gutter)] gap-2 px-[var(--spacing-gutter)] lg:mx-0 lg:flex-col lg:px-0">
          {SECTIONS.map((item) => (
            <li key={item.id} className="lg:w-full">
              <button
                type="button"
                onClick={() => setSection(item.id)}
                aria-current={section === item.id}
                className={cn(
                  "relative w-full rounded-sm px-3.5 py-2.5 text-start text-[0.9375rem] whitespace-nowrap transition-colors",
                  section === item.id ? "bg-chalk text-ink" : "text-clay hover:text-ink",
                )}
              >
                {item.label}
                {section === item.id ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-2 start-0 hidden w-[2px] rounded-full lg:block"
                    style={{ background: "linear-gradient(180deg, var(--color-iris), var(--color-peony))" }}
                  />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="lg:col-span-9">
        {section === "orders" ? (
          <Panel
            title="Your orders"
            body="Accounts are created from a confirmed order, so the first one is placed as a guest. Track any order with its number and the phone you used."
          >
            <div className="flex flex-wrap gap-3">
              <Link href="/track" className={buttonClasses("primary", "md")}>
                Track an order
              </Link>
              <Link href="/shop" className={buttonClasses("ghost", "md")}>
                Start an order
              </Link>
            </div>
            <p className="mt-5 text-[0.875rem] leading-relaxed text-clay">
              Once you create an account at the end of checkout, every order placed with that phone number appears
              here automatically — including the one you just placed.
            </p>
          </Panel>
        ) : null}

        {section === "sizes" ? (
          <Panel
            title="Your sizes"
            body="Save what fits and we’ll pre-select it on every product page. Nothing leaves this device until you create an account."
          >
            <div className="flex flex-col gap-5">
              {sizeGuides.map((guide) => {
                const options = guide.tables[0]?.rows.map((row) => row[0] ?? "") ?? [];
                return (
                  <SelectField
                    key={guide.slug}
                    label={guide.title}
                    value={hydrated ? (profile.savedSizes[guide.slug] ?? "") : ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value) {
                        profile.setSize(guide.slug, value);
                        toast.success(`Saved ${value} for ${guide.title.toLowerCase()}`);
                      } else {
                        profile.removeSize(guide.slug);
                      }
                    }}
                  >
                    <option value="">Not set</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectField>
                );
              })}
            </div>

            <Link href="/pages/size-guide" className="mt-6 inline-block text-[0.9375rem] text-ink underline underline-offset-4">
              Open the full size guide
            </Link>
          </Panel>
        ) : null}

        {section === "saved" ? (
          <div className="flex flex-col gap-12">
            <Panel title="Wishlist" body={hydrated && wishlist.length ? undefined : "Nothing saved yet."}>
              {hydrated && wishlist.length > 0 ? (
                <>
                  <StoredProductRail slugs={wishlist} />
                  <Link href="/wishlist" className="mt-5 inline-block text-[0.9375rem] text-ink underline underline-offset-4">
                    See the full wishlist
                  </Link>
                </>
              ) : (
                <Link href="/shop" className={buttonClasses("secondary", "md")}>
                  Find something to save
                </Link>
              )}
            </Panel>

            {hydrated && recent.length > 0 ? (
              <Panel title="Recently viewed">
                <StoredProductRail slugs={recent} />
              </Panel>
            ) : null}
          </div>
        ) : null}

        {section === "details" ? (
          <Panel
            title="Your details"
            body="Used to pre-fill checkout on this device. We don’t send any of it anywhere until you place an order."
          >
            <div className="flex max-w-md flex-col gap-4">
              <TextField
                label="First name"
                value={hydrated ? profile.firstName : ""}
                onChange={(event) => profile.setDetails({ firstName: event.target.value })}
                autoComplete="given-name"
              />
              <TextField
                label="Mobile number"
                type="tel"
                inputMode="numeric"
                value={hydrated ? profile.phone : ""}
                onChange={(event) => profile.setDetails({ phone: event.target.value })}
                hint="The number you track orders with."
                autoComplete="tel"
              />
              <Button
                variant="ghost"
                onClick={() => {
                  profile.clear();
                  toast.info("Cleared from this device");
                }}
                className="self-start"
              >
                Clear everything on this device
              </Button>
            </div>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}

function Panel({ title, body, children }: { title: string; body?: string; children?: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-title">{title}</h2>
      {body ? <p className="mt-3 max-w-xl text-lede text-graphite">{body}</p> : null}
      <div className="mt-7">{children}</div>
    </section>
  );
}
