"use client";

import { Butterfly } from "@/components/ui/butterfly";
import { toast } from "@/components/ui/toast";
import { useWishlistStore } from "@/features/wishlist/store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

/**
 * Saving something is the one moment the mark gets to be fully iridescent.
 * It works without an account; we only mention signing in once something is
 * actually saved, and never as a gate in front of it.
 */
export function WishlistButton({
  slug,
  productName,
  variant = "icon",
  className,
}: {
  slug: string;
  productName: string;
  variant?: "icon" | "labelled";
  className?: string;
}) {
  const toggle = useWishlistStore((s) => s.toggle);
  const saved = useWishlistStore((s) => s.slugs.includes(slug));
  // Local storage is empty during server rendering, so the filled state is
  // only trusted once the client has taken over.
  const isSaved = useHydrated() && saved;

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const nowSaved = toggle(slug);
    if (nowSaved) {
      toast.success(`Saved ${productName}`, {
        detail: "It stays here on this device. Create an account to keep it everywhere.",
        action: { label: "View wishlist", href: "/wishlist" },
      });
    } else {
      toast.info(`Removed ${productName} from your wishlist`);
    }
  }

  if (variant === "labelled") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isSaved}
        className={cn(
          "inline-flex h-[3.25rem] items-center justify-center gap-2.5 rounded-sm border px-5 text-[0.9375rem] transition-colors",
          isSaved ? "border-peony/45 bg-peony-soft text-ink" : "border-ink/25 text-ink hover:border-ink/60",
          className,
        )}
      >
        <Butterfly
          variant={isSaved ? "duochrome" : "outline"}
          filled={isSaved}
          className="h-4.5 w-4.5"
          animate={isSaved}
        />
        {isSaved ? "Saved" : "Save for later"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-chalk/85 text-ink backdrop-blur-sm transition-all duration-300",
        "hover:bg-chalk hover:scale-105",
        className,
      )}
    >
      <Butterfly
        variant={isSaved ? "duochrome" : "outline"}
        filled={isSaved}
        className="h-4 w-4"
        animate={isSaved}
      />
    </button>
  );
}
