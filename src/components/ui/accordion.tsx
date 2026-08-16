"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  question: ReactNode;
  answer: ReactNode;
  meta?: ReactNode;
}

export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}: {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  function toggle(id: string) {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  }

  return (
    <div className={cn("divide-y divide-mist border-y border-mist", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                className="group flex w-full items-start justify-between gap-6 py-4 text-start"
              >
                <span className="flex-1 text-[1rem] leading-snug text-ink transition-colors group-hover:text-iris">
                  {item.question}
                </span>
                <span className="mt-1 flex shrink-0 items-center gap-3">
                  {item.meta}
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 text-clay">
                    <path
                      d="M8 2v12M2 8h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      className={cn(
                        "origin-center transition-transform duration-300 ease-[var(--ease-drape)]",
                        isOpen && "rotate-45",
                      )}
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`panel-${item.id}`}
              hidden={!isOpen}
              className="pb-5 text-[0.9375rem] leading-relaxed text-graphite motion-safe:animate-[slyrah-fade-in_.25s_var(--ease-drape)]"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
