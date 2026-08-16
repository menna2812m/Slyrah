"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/overlay";
import type { SizeGuide } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function SizeGuideModal({ guide, className }: { guide: SizeGuide; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "text-[0.8125rem] text-clay underline underline-offset-4 transition-colors hover:text-ink",
          className,
        )}
      >
        Size guide
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={guide.title} description={guide.intro}>
        <SizeGuideTables guide={guide} />
      </Modal>
    </>
  );
}

export function SizeGuideTables({ guide }: { guide: SizeGuide }) {
  return (
    <div className="flex flex-col gap-9">
      {guide.tables.map((table) => (
        <section key={table.id}>
          <h3 className="text-eyebrow mb-3">{table.title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-start">
              <thead>
                <tr className="border-b border-ink/20">
                  {table.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="py-2.5 pe-4 text-start font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-clay"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.join()} className="border-b border-mist">
                    {row.map((cell, i) => (
                      <td
                        key={`${row.join()}-${i}`}
                        className={cn(
                          "py-3 pe-4 font-mono text-[0.8125rem] tabular-nums",
                          i === 0 ? "text-ink" : "text-graphite",
                        )}
                        data-numeric
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.note ? <p className="mt-3 text-[0.875rem] text-clay">{table.note}</p> : null}
        </section>
      ))}

      <section>
        <h3 className="text-eyebrow mb-3">How to measure</h3>
        <dl className="flex flex-col gap-4">
          {guide.howToMeasure.map((step) => (
            <div key={step.step}>
              <dt className="text-[0.9375rem] text-ink">{step.step}</dt>
              <dd className="mt-1 text-[0.9375rem] leading-relaxed text-graphite">{step.detail}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
