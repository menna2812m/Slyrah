"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button, buttonClasses } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire this to the error reporter once one is configured.
    console.error(error);
  }, [error]);

  return (
    <div className="shell grid min-h-[60vh] place-items-center py-20">
      <div className="max-w-md text-center">
        <p className="text-eyebrow">Something broke</p>
        <h1 className="mt-3 text-display">This page didn’t load</h1>
        <p className="mt-4 text-lede text-graphite">
          It’s our side, not yours. Reloading usually fixes it — if it doesn’t, message us and we’ll sort it out.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-clay" data-numeric>
            Reference {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link href="/" className={buttonClasses("secondary", "md")}>
            Back to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
