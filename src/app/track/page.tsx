import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { ButterflyLoader } from "@/components/ui/butterfly";
import { TrackOrder } from "@/features/orders/track-order";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Enter your order number and the phone number you ordered with to see exactly where your parcel is.",
};

export default function TrackPage() {
  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Track", href: "/track" },
        ]}
        title="Track your order"
        lede="Order number plus the phone number you gave at checkout. No account needed."
      />
      <Suspense
        fallback={
          <div className="grid place-items-center py-24">
            <ButterflyLoader />
          </div>
        }
      >
        <TrackOrder />
      </Suspense>
    </div>
  );
}
