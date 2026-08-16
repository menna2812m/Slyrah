"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function useOverlayBehaviour(open: boolean, onClose: () => void, panelRef: React.RefObject<HTMLElement | null>) {
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    // Lock scroll without the page jumping as the scrollbar disappears.
    const { body } = document;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (firstFocusable ?? panel)?.focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      restoreRef.current?.focus({ preventScroll: true });
    };
  }, [open, onClose, panelRef]);
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Hide the title visually but keep it for screen readers. */
  hideTitle?: boolean;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

interface DrawerProps extends OverlayProps {
  side?: "end" | "bottom";
}

/**
 * Side drawer on desktop, bottom sheet on mobile — the sheet is the right
 * shape for a thumb, the drawer for a cursor.
 */
export function Drawer({
  open,
  onClose,
  title,
  hideTitle,
  description,
  children,
  footer,
  side = "end",
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  useOverlayBehaviour(open, onClose, panelRef);

  const handleBackdrop = useCallback(() => onClose(), [onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-70">
      <button
        type="button"
        aria-label="Close"
        onClick={handleBackdrop}
        className="absolute inset-0 h-full w-full cursor-default bg-aubergine-deep/45 backdrop-blur-[2px] motion-safe:animate-[slyrah-fade-in_.25s_var(--ease-drape)]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "absolute flex flex-col bg-chalk shadow-panel outline-none",
          side === "end"
            ? "inset-y-0 end-0 w-full max-w-[27rem] motion-safe:animate-[slyrah-slide-end_.35s_var(--ease-drape)]"
            : "inset-x-0 bottom-0 max-h-[88svh] rounded-t-xl motion-safe:animate-[slyrah-sheet-up_.35s_var(--ease-drape)]",
          className,
        )}
      >
        {side === "bottom" ? (
          <span aria-hidden="true" className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-mist" />
        ) : null}

        <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-4">
          <div>
            <h2 id={titleId} className={cn("text-heading", hideTitle && "sr-only")}>
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 text-[0.875rem] text-clay">
                {description}
              </p>
            ) : null}
          </div>
          <CloseButton onClick={onClose} />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>

        {footer ? <div className="border-t border-mist bg-chalk px-5 py-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

/** Centred dialog for size guides, share, and confirmations. */
export function Modal({ open, onClose, title, hideTitle, description, children, footer, className }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  useOverlayBehaviour(open, onClose, panelRef);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-70 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-aubergine-deep/45 backdrop-blur-[2px] motion-safe:animate-[slyrah-fade-in_.25s_var(--ease-drape)]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[90svh] w-full flex-col overflow-hidden rounded-t-xl bg-chalk shadow-panel outline-none",
          "motion-safe:animate-[slyrah-sheet-up_.3s_var(--ease-drape)] sm:max-w-[42rem] sm:rounded-lg sm:motion-safe:animate-[slyrah-rise_.3s_var(--ease-drape)]",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-3 sm:px-7 sm:pt-6">
          <div>
            <h2 id={titleId} className={cn("text-heading", hideTitle && "sr-only")}>
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 text-[0.875rem] text-clay">
                {description}
              </p>
            ) : null}
          </div>
          <CloseButton onClick={onClose} />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-7">{children}</div>

        {footer ? <div className="border-t border-mist px-5 py-4 sm:px-7">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

export function CloseButton({ onClick, label = "Close" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-me-1.5 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-sm text-clay transition-colors hover:bg-shell hover:text-ink"
    >
      <span className="sr-only">{label}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
        <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}
