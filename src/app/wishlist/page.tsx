import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { WishlistView } from "@/features/wishlist/wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Everything you’ve saved.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Wishlist", href: "/wishlist" },
        ]}
        title="Saved"
        lede="Kept on this device. Create an account and it follows you to the next one."
      />
      <WishlistView />
    </div>
  );
}
