import Link from "next/link";

import { Butterfly } from "@/components/ui/butterfly";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell grid min-h-[60vh] place-items-center py-20">
      <div className="max-w-md text-center">
        <Butterfly variant="outline" filled={false} className="mx-auto h-10 w-10 text-mist" />
        <p className="text-eyebrow mt-6">404</p>
        <h1 className="mt-3 text-display">This page isn’t here</h1>
        <p className="mt-4 text-lede text-graphite">
          The link may be old, or the piece may have sold out and come off the site. Both are fixable from here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className={buttonClasses("primary", "md")}>
            Shop everything
          </Link>
          <Link href="/characters" className={buttonClasses("secondary", "md")}>
            Start from a person
          </Link>
        </div>
        <p className="mt-6 text-[0.875rem] text-clay">
          Looking for an order?{" "}
          <Link href="/track" className="text-ink underline underline-offset-4">
            Track it here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
