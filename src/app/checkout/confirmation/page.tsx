import type { Metadata } from "next";

import { Confirmation } from "@/features/checkout/confirmation";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <div className="shell pt-10">
      <Confirmation />
    </div>
  );
}
