"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/overlay";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/**
 * Share.
 *
 * WhatsApp is first because it is how most of Egypt shares anything. Instagram
 * has no link-share intent from the web, so we say plainly that we’re copying
 * the link for it rather than opening something that goes nowhere.
 */
export function ShareMenu({
  title,
  path,
  className,
}: {
  title: string;
  path: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const url = typeof window === "undefined" ? path : `${window.location.origin}${path}`;
  const message = `${title} — ${url}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Your browser blocked the clipboard. Copy the address bar instead.");
    }
  }

  async function openShare() {
    // Use the OS sheet where it exists; fall back to our own list otherwise.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Cancelled or unsupported — fall through to the menu.
      }
    }
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openShare}
        className={cn(
          "inline-flex items-center gap-2 text-[0.875rem] text-graphite underline-offset-4 transition-colors hover:text-ink hover:underline",
          className,
        )}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
          <path d="M10 13V3m0 0L6.8 6.2M10 3l3.2 3.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 11v4.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        Share
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Share this" className="sm:max-w-md">
        <ul className="flex flex-col gap-2">
          <li>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-sm border border-mist px-4 py-3.5 text-[0.9375rem] text-ink transition-colors hover:border-ink/50"
            >
              WhatsApp
              <span className="text-[0.8125rem] text-clay">Opens WhatsApp</span>
            </a>
          </li>
          <li>
            <a
              href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=0&redirect_uri=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-sm border border-mist px-4 py-3.5 text-[0.9375rem] text-ink transition-colors hover:border-ink/50"
            >
              Messenger
              <span className="text-[0.8125rem] text-clay">Opens Messenger</span>
            </a>
          </li>
          <li>
            <button
              type="button"
              onClick={async () => {
                await copy();
                setOpen(false);
                toast.info("Paste it into your Instagram story or DM");
              }}
              className="flex w-full items-center justify-between rounded-sm border border-mist px-4 py-3.5 text-start text-[0.9375rem] text-ink transition-colors hover:border-ink/50"
            >
              Instagram
              <span className="text-[0.8125rem] text-clay">Copies the link</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={async () => {
                await copy();
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-sm border border-mist px-4 py-3.5 text-start text-[0.9375rem] text-ink transition-colors hover:border-ink/50"
            >
              Copy link
              <span className="max-w-[12rem] truncate font-mono text-[0.75rem] text-clay">{url}</span>
            </button>
          </li>
        </ul>
      </Modal>
    </>
  );
}
