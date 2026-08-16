import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { AccountView } from "@/features/account/account-view";
import { getSizeGuides } from "@/lib/api/server-data";

export const metadata: Metadata = {
  title: "Your account",
  description: "Orders, saved sizes, wishlist and details.",
  robots: { index: false, follow: true },
};

export default async function AccountPage() {
  const sizeGuides = await getSizeGuides();

  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
        ]}
        title="Your account"
        lede="Accounts start from your first order. Everything below already works on this device."
      />
      <AccountView sizeGuides={sizeGuides} />
    </div>
  );
}
