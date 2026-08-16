import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { CheckoutForm } from "@/features/checkout/checkout-form";
import { getGovernorates, getPaymentMethods } from "@/lib/api/server-data";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Guest checkout with cash on delivery across Egypt.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const [governorates, paymentMethods] = await Promise.all([getGovernorates(), getPaymentMethods()]);

  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Bag", href: "/cart" },
          { label: "Checkout", href: "/checkout" },
        ]}
        title="Checkout"
        lede="No account needed. Name, number, address — that’s it."
      />
      <CheckoutForm governorates={governorates} paymentMethods={paymentMethods} />
    </div>
  );
}
