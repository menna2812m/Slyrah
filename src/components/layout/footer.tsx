import Link from "next/link";

import { SlyrahLogo } from "@/components/ui/butterfly";
import type { StoreSettings } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";

export function Footer({ settings }: { settings: StoreSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative mt-20 bg-aubergine text-chalk/70">
      <div className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SlyrahLogo className="text-[1.1rem] [&_span]:text-chalk" />
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-chalk/65">
              Underwear made in Egypt from long-staple Delta cotton, ribbed modal, seamless microfibre and
              cotton-backed lace. Six fabrics, eight cuts, kept in stock.
            </p>

            <dl className="mt-7 flex flex-col gap-2 text-[0.875rem]">
              <div className="flex gap-2">
                <dt className="text-chalk/45">WhatsApp</dt>
                <dd>
                  <a
                    href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, "")}`}
                    className="border-b border-chalk/25 pb-px text-chalk/85 transition-colors hover:border-chalk"
                  >
                    {settings.contact.whatsapp}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-chalk/45">Email</dt>
                <dd>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="border-b border-chalk/25 pb-px text-chalk/85 transition-colors hover:border-chalk"
                  >
                    {settings.contact.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-chalk/45">Hours</dt>
                <dd className="text-chalk/85">{settings.contact.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {settings.footerColumns.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <p className="text-eyebrow mb-4 text-chalk/45">{column.heading}</p>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[0.9375rem] text-chalk/70 transition-colors hover:text-chalk">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-chalk/12 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-[0.8125rem] text-chalk/45">
              © {year} Slyrah. Made in Egypt.
            </p>
            {settings.freeShippingThreshold ? (
              <p className="text-[0.8125rem] text-chalk/45">
                Free shipping over{" "}
                <span className="font-mono text-chalk/70" data-numeric>
                  {formatMoney(settings.freeShippingThreshold)}
                </span>
              </p>
            ) : null}
            <p className="text-[0.8125rem] text-chalk/45">Cash on delivery, all 27 governorates</p>
          </div>

          <ul className="flex items-center gap-5">
            {settings.social.map((item) => (
              <li key={item.platform}>
                <a
                  href={item.href}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="text-[0.8125rem] text-chalk/60 transition-colors hover:text-chalk"
                >
                  {item.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
