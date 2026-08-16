import Link from "next/link";
import type { ReactNode } from "react";

import { Butterfly } from "@/components/ui/butterfly";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * An empty screen is an invitation to act, so every one of these carries a way
 * forward rather than just an apology.
 */
export function EmptyState({
  title,
  body,
  action,
  secondary,
  className,
}: {
  title: string;
  body: string;
  action?: { label: string; href: string };
  secondary?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4 px-6 py-16 text-center", className)}>
      <Butterfly variant="outline" filled={false} className="h-9 w-9 text-mist" />
      <div className="max-w-sm">
        <h3 className="text-heading">{title}</h3>
        <p className="mt-2 text-[0.9375rem] text-clay">{body}</p>
      </div>
      {action ? (
        <Link href={action.href} className={buttonClasses("primary", "md", "mt-1")}>
          {action.label}
        </Link>
      ) : null}
      {secondary}
    </div>
  );
}

/** Failure states name what went wrong and what to do — they don’t apologise. */
export function ErrorState({
  title = "That didn’t load",
  body,
  onRetry,
  className,
}: {
  title?: string;
  body: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4 rounded-md border border-danger/25 bg-danger-soft/40 px-6 py-10 text-center", className)}>
      <div className="max-w-sm">
        <h3 className="text-heading text-danger">{title}</h3>
        <p className="mt-2 text-[0.9375rem] text-graphite">{body}</p>
      </div>
      {onRetry ? (
        <button type="button" onClick={onRetry} className={buttonClasses("secondary", "sm")}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
