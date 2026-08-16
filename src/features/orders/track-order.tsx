"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ButterflyLoader } from "@/components/ui/butterfly";
import { TextField } from "@/components/ui/field";
import { OrderSummary } from "@/features/orders/order-summary";
import { OrderTimeline } from "@/features/orders/order-timeline";
import { ApiError, orderApi } from "@/lib/api/client";
import type { Order } from "@/lib/api/types";
import { formatDate } from "@/lib/format";

type Outcome = { order: Order } | { error: string };

async function fetchOrder(number: string, tel: string): Promise<Outcome> {
  try {
    return { order: await orderApi.track(number, tel) };
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "We couldn’t reach the order service. Try again in a moment.",
    };
  }
}

export function TrackOrder() {
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get("order") ?? "");
  const [phone, setPhone] = useState(params.get("phone") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  // Arriving from a confirmation with both values in the URL, the lookup is
  // already on its way — start in the loading state rather than flashing the
  // empty panel first.
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">(
    params.get("order") && params.get("phone") ? "loading" : "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback((outcome: Outcome) => {
    if ("order" in outcome) {
      setOrder(outcome.order);
      setStatus("found");
    } else {
      setOrder(null);
      setError(outcome.error);
      setStatus("error");
    }
  }, []);

  // Arriving straight from a confirmation, both values are already in the URL,
  // so the lookup runs on mount. State is only touched once the request
  // settles — never synchronously as the effect runs.
  useEffect(() => {
    const number = params.get("order");
    const tel = params.get("phone");
    if (!number || !tel) return;

    let cancelled = false;
    fetchOrder(number, tel).then((outcome) => {
      if (!cancelled) apply(outcome);
    });

    return () => {
      cancelled = true;
    };
  }, [params, apply]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setError("Both the order number and the phone number on the order are needed.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError(null);
    void fetchOrder(orderNumber, phone).then(apply);
  }

  return (
    <div className="grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-4">
        <form onSubmit={submit} className="rounded-lg border border-mist bg-chalk p-6" noValidate>
          <h2 className="text-heading">Find your order</h2>
          <div className="mt-5 flex flex-col gap-4">
            <TextField
              label="Order number"
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="SLY-2608-4471"
              hint="It’s in the message we sent when you ordered."
              autoCapitalize="characters"
            />
            <TextField
              label="Mobile number"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="01012345678"
              hint="The one you gave at checkout."
              autoComplete="tel"
            />
            <Button type="submit" size="lg" loading={status === "loading"} loadingLabel="Looking">
              Track order
            </Button>
          </div>

          {status === "error" && error ? (
            <p role="alert" className="mt-4 rounded-sm bg-danger-soft px-3.5 py-3 text-[0.875rem] text-danger">
              {error}
            </p>
          ) : null}
        </form>

        <p className="mt-5 text-[0.875rem] leading-relaxed text-clay">
          Can’t find the number? Message us on WhatsApp with the phone number you ordered with and we’ll look it up.
        </p>
      </div>

      <div className="lg:col-span-8">
        {status === "loading" ? (
          <div className="grid place-items-center py-24">
            <ButterflyLoader label="Finding your order" />
          </div>
        ) : status === "found" && order ? (
          <div className="flex flex-col gap-10">
            <div className="rounded-lg border border-mist bg-chalk p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-heading">Where it is</h2>
                {order.estimatedDelivery ? (
                  <p className="text-[0.875rem] text-graphite">
                    Expected{" "}
                    <span className="font-mono text-ink" data-numeric>
                      {formatDate(order.estimatedDelivery)}
                    </span>
                  </p>
                ) : null}
              </div>
              <div className="mt-7">
                <OrderTimeline order={order} />
              </div>
            </div>

            <OrderSummary order={order} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-mist p-10 text-center">
            <p className="text-[0.9375rem] text-clay">
              Enter your order number and phone and the full history appears here — every status change, and any
              delivery attempts the courier has made.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
