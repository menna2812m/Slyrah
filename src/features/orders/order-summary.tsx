import Link from "next/link";

import { Media } from "@/components/ui/media";
import type { Order } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";

export function OrderSummary({ order }: { order: Order }) {
  const paymentLabel =
    order.paymentMethod === "cod" ? "Cash on delivery" : order.paymentMethod === "card" ? "Card" : "Mobile wallet";

  return (
    <div className="rounded-lg border border-mist bg-chalk p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-heading">Order {order.orderNumber}</h2>
        <span className="font-mono text-[0.75rem] text-clay" data-numeric>
          {order.lines.reduce((n, line) => n + line.quantity, 0)} items
        </span>
      </div>

      <ul className="mt-5 flex flex-col gap-4">
        {order.lines.map((line) => (
          <li key={`${line.productSlug}-${line.sizeLabel}-${line.colorName}`} className="flex gap-3.5">
            <Media
              asset={line.image}
              alt={line.name}
              aspect="4 / 5"
              className="w-16 shrink-0 rounded-sm"
              sizes="64px"
            />
            <div className="min-w-0 flex-1">
              <Link href={`/products/${line.productSlug}`} className="text-[0.9375rem] text-ink hover:text-iris">
                {line.name}
              </Link>
              <p className="mt-0.5 text-[0.8125rem] text-clay">
                {line.colorName} · Size {line.sizeLabel} · ×{line.quantity}
              </p>
            </div>
            <span className="shrink-0 font-mono text-[0.875rem] text-ink" data-numeric>
              {formatMoney(line.lineTotal)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 flex flex-col gap-2.5 border-t border-mist pt-5 text-[0.9375rem]">
        <Row label="Subtotal" value={formatMoney(order.totals.subtotal)} />
        {order.totals.discount.amount > 0 ? (
          <Row label="Discount" value={`− ${formatMoney(order.totals.discount)}`} tone="sale" />
        ) : null}
        <Row
          label="Shipping"
          value={
            order.totals.shipping == null
              ? "—"
              : order.totals.shipping.amount === 0
                ? "Free"
                : formatMoney(order.totals.shipping)
          }
        />
        <div className="mt-2 flex items-baseline justify-between border-t border-mist pt-4">
          <dt className="text-heading">{order.paymentMethod === "cod" ? "Pay on delivery" : "Total"}</dt>
          <dd className="font-mono text-xl text-ink" data-numeric>
            {formatMoney(order.totals.total)}
          </dd>
        </div>
      </dl>

      <dl className="mt-6 grid gap-4 border-t border-mist pt-5 text-[0.875rem] sm:grid-cols-2">
        <div>
          <dt className="text-eyebrow mb-1.5">Delivering to</dt>
          <dd className="text-graphite">
            {order.address.fullName}
            <br />
            {order.address.street}
            {order.address.building ? `, Bldg ${order.address.building}` : ""}
            {order.address.apartment ? `, Apt ${order.address.apartment}` : ""}
            <br />
            {order.cityName}, {order.governorateName}
            {order.address.landmark ? (
              <>
                <br />
                <span className="text-clay">{order.address.landmark}</span>
              </>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-eyebrow mb-1.5">Contact</dt>
          <dd className="text-graphite">
            <span className="font-mono" data-numeric>
              {order.address.phone}
            </span>
            {order.address.email ? (
              <>
                <br />
                {order.address.email}
              </>
            ) : null}
          </dd>
          <dt className="text-eyebrow mt-4 mb-1.5">Payment</dt>
          <dd className="text-graphite">{paymentLabel}</dd>
        </div>
      </dl>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "sale" }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-graphite">{label}</dt>
      <dd className={`font-mono ${tone === "sale" ? "text-sale" : "text-ink"}`} data-numeric>
        {value}
      </dd>
    </div>
  );
}
