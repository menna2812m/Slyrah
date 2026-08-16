"use client";

import { useEffect, useState } from "react";

import { countdownParts } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Flash-sale clock. Renders nothing until it is mounted so the server and the
 * client can’t disagree about the time, and it says so plainly when it runs out
 * rather than sitting at zero.
 */
export function Countdown({
  endsAt,
  tone = "light",
  className,
  onExpire,
}: {
  endsAt: string;
  tone?: "light" | "dark";
  className?: string;
  onExpire?: () => void;
}) {
  const target = new Date(endsAt).getTime();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(target - Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  useEffect(() => {
    if (remaining !== null && remaining <= 0) onExpire?.();
  }, [remaining, onExpire]);

  if (remaining === null) {
    return <div className={cn("h-[3.25rem]", className)} aria-hidden="true" />;
  }

  const parts = countdownParts(remaining);

  if (parts.expired) {
    return (
      <p className={cn("text-[0.9375rem]", tone === "dark" ? "text-chalk/70" : "text-clay", className)}>
        This one’s finished. The next drop is usually within a fortnight.
      </p>
    );
  }

  const cells: [string, number][] = [
    ...(parts.days > 0 ? ([["Days", parts.days]] as [string, number][]) : []),
    ["Hrs", parts.hours],
    ["Min", parts.minutes],
    ["Sec", parts.seconds],
  ];

  return (
    <div className={cn("flex items-start gap-2", className)}>
      <span className="sr-only" aria-live="off">
        {parts.days > 0 ? `${parts.days} days, ` : ""}
        {parts.hours} hours and {parts.minutes} minutes left
      </span>
      {cells.map(([label, value]) => (
        <div key={label} aria-hidden="true" className="flex flex-col items-center gap-1.5">
          <span
            className={cn(
              "grid h-11 min-w-11 place-items-center rounded-sm px-2 font-mono text-lg tabular-nums",
              tone === "dark" ? "bg-chalk/10 text-chalk" : "bg-ink text-chalk",
            )}
            data-numeric
          >
            {String(value).padStart(2, "0")}
          </span>
          <span className={cn("text-eyebrow", tone === "dark" && "text-chalk/45")}>{label}</span>
        </div>
      ))}
    </div>
  );
}
