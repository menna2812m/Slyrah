import type { Order, OrderStatus } from "@/lib/api/types";
import { ORDER_PROGRESSION, ORDER_STATUS_LABEL, formatDateTime, isTerminalStatus } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_NOTE: Record<OrderStatus, string> = {
  pending: "We’ve got it. We’ll call to confirm before anything is packed.",
  confirmed: "Confirmed with you. It goes to packing next.",
  preparing: "Being packed now.",
  "ready-to-ship": "Packed and waiting for the courier.",
  "out-for-delivery": "With the courier today.",
  delivered: "Delivered. Anything wrong, message us within 14 days.",
  cancelled: "Cancelled. Nothing was charged.",
  returned: "Back with us.",
  refunded: "Refunded in full.",
};

export function OrderTimeline({ order }: { order: Order }) {
  const terminal = isTerminalStatus(order.status);
  const reached = new Map(order.timeline.map((event) => [event.status, event]));
  const currentIndex = ORDER_PROGRESSION.indexOf(order.status);

  if (terminal) {
    return (
      <div className="rounded-md border border-mist bg-chalk p-5">
        <p className="text-eyebrow mb-2">Status</p>
        <p className="text-heading text-ink">{ORDER_STATUS_LABEL[order.status]}</p>
        <p className="mt-2 text-[0.9375rem] text-graphite">{STATUS_NOTE[order.status]}</p>
        <ol className="mt-6 flex flex-col gap-3 border-t border-mist pt-5">
          {order.timeline.map((event) => (
            <li key={`${event.status}-${event.at}`} className="flex justify-between gap-4 text-[0.875rem]">
              <span className="text-ink">{ORDER_STATUS_LABEL[event.status]}</span>
              <time dateTime={event.at} className="font-mono text-[0.75rem] text-clay" data-numeric>
                {formatDateTime(event.at)}
              </time>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div>
      <ol className="flex flex-col">
        {ORDER_PROGRESSION.map((status, index) => {
          const event = reached.get(status);
          const done = index < currentIndex;
          const current = index === currentIndex;
          const isLast = index === ORDER_PROGRESSION.length - 1;

          return (
            <li key={status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors",
                    current
                      ? "border-transparent"
                      : done
                        ? "border-ink bg-ink"
                        : "border-mist bg-chalk",
                  )}
                  style={
                    current
                      ? { backgroundImage: "linear-gradient(120deg, var(--color-iris), var(--color-peony))" }
                      : undefined
                  }
                >
                  {done ? (
                    <svg viewBox="0 0 16 16" className="h-3 w-3 text-chalk">
                      <path d="M4 8.4l2.6 2.6L12 5.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </span>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={cn("w-[2px] flex-1 transition-colors", done ? "bg-ink" : "bg-mist")}
                    style={{ minHeight: "2.25rem" }}
                  />
                ) : null}
              </div>

              <div className={cn("pb-7", isLast && "pb-0")}>
                <p className={cn("text-[0.9375rem]", current || done ? "text-ink" : "text-clay")}>
                  {ORDER_STATUS_LABEL[status]}
                  {current ? <span className="ms-2 text-eyebrow text-peony">Now</span> : null}
                </p>
                {event ? (
                  <time dateTime={event.at} className="mt-1 block font-mono text-[0.6875rem] text-clay" data-numeric>
                    {formatDateTime(event.at)}
                  </time>
                ) : null}
                {current ? <p className="mt-1.5 max-w-sm text-[0.875rem] text-graphite">{STATUS_NOTE[status]}</p> : null}
                {event?.note ? <p className="mt-1 max-w-sm text-[0.875rem] text-clay">{event.note}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>

      {order.deliveryAttempts.length > 0 ? (
        <div className="mt-6 rounded-md border border-warning/30 bg-warning-soft/50 p-4">
          <p className="text-eyebrow mb-2 text-warning">Delivery attempts</p>
          <ul className="flex flex-col gap-2">
            {order.deliveryAttempts.map((attempt) => (
              <li key={attempt.at} className="text-[0.875rem] text-graphite">
                <time dateTime={attempt.at} className="font-mono text-[0.75rem] text-clay" data-numeric>
                  {formatDateTime(attempt.at)}
                </time>{" "}
                — {attempt.outcome.replace(/-/g, " ")}
                {attempt.note ? `. ${attempt.note}` : ""}
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[0.8125rem] text-graphite">
            The courier tries twice. After a second failed attempt the parcel comes back to us and we’ll message you to
            rebook — there’s no extra charge.
          </p>
        </div>
      ) : null}
    </div>
  );
}
