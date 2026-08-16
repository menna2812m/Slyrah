import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { CartView } from "@/features/cart/cart-view";
import { getGovernorates } from "@/lib/api/server-data";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review what’s in your bag, apply a discount code and check the shipping estimate for your governorate.",
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const governorates = await getGovernorates();

  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Bag", href: "/cart" },
        ]}
        title="Your bag"
      />
      <CartView governorates={governorates} />
    </div>
  );
}
