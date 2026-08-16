"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Butterfly, SlyrahLogo } from "@/components/ui/butterfly";
import { Drawer } from "@/components/ui/overlay";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { useCartCount } from "@/features/cart/store";
import { SearchOverlay } from "@/features/search/search-overlay";
import { useWishlistStore } from "@/features/wishlist/store";
import type { CharacterSummary, StoreSettings } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function Header({
  settings,
  characters,
}: {
  settings: StoreSettings;
  characters: CharacterSummary[];
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = useCartCount();
  const wishlistCount = useWishlistStore((s) => s.slugs.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    // Read after paint rather than synchronously, so a restored scroll
    // position is picked up without an extra render on every mount.
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Any navigation closes everything. Adjusting during render rather than in
  // an effect means the new page never paints with the old drawer still open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
  }

  // Cmd/Ctrl-K opens search, the shortcut people already try.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-60 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "border-mist bg-oyster/85 backdrop-blur-md" : "border-transparent bg-oyster",
        )}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="shell flex items-center justify-between gap-4" style={{ height: "var(--header-height)" }}>
          {/* Mobile: menu */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="-ms-2 grid h-10 w-10 place-items-center rounded-sm text-ink lg:hidden"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4.5 w-4.5">
              <path d="M2.5 6h15M2.5 10h15M2.5 14h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <Link href="/" className="shrink-0 lg:me-8" aria-label="Slyrah — home">
            <SlyrahLogo className="text-[0.95rem] lg:text-[1.05rem]" />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-1">
              {settings.navigation.map((group) => {
                const isOpen = openMenu === group.label;
                const hasMenu = group.columns.length > 0;
                return (
                  <li key={group.label} className="relative">
                    <Link
                      href={group.href}
                      onMouseEnter={() => setOpenMenu(hasMenu ? group.label : null)}
                      onFocus={() => setOpenMenu(hasMenu ? group.label : null)}
                      aria-expanded={hasMenu ? isOpen : undefined}
                      className={cn(
                        "relative inline-block px-3 py-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink",
                        isOpen && "text-ink",
                      )}
                    >
                      {group.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3 bottom-0.5 h-[1.5px] origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-drape)]",
                          isOpen && "scale-x-100",
                        )}
                        style={{ background: "linear-gradient(90deg, var(--color-iris), var(--color-peony))" }}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4.5 w-4.5">
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </IconButton>

            <IconLink href="/wishlist" label="Wishlist" count={wishlistCount} className="hidden sm:inline-grid">
              <Butterfly variant="outline" filled={false} className="h-4.5 w-4.5" />
            </IconLink>

            <IconLink href="/account" label="Account" className="hidden sm:inline-grid">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4.5 w-4.5">
                <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M3.8 17c.7-3.2 3.2-5 6.2-5s5.5 1.8 6.2 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </IconLink>

            <IconButton label="Bag" onClick={() => setCartOpen(true)} count={cartCount}>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4.5 w-4.5">
                <path d="M4.2 6.5h11.6l-.9 10.2a1 1 0 0 1-1 .9H6.1a1 1 0 0 1-1-.9Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M7.4 8V5.8a2.6 2.6 0 0 1 5.2 0V8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </IconButton>
          </div>
        </div>

        {/* Mega menu */}
        {settings.navigation.map((group) => {
          if (group.columns.length === 0) return null;
          const isOpen = openMenu === group.label;
          return (
            <div
              key={group.label}
              hidden={!isOpen}
              onMouseEnter={() => setOpenMenu(group.label)}
              className="absolute inset-x-0 top-full hidden border-y border-mist bg-chalk shadow-lift motion-safe:animate-[slyrah-fade-in_.2s_var(--ease-drape)] lg:block"
            >
              <div className="shell grid grid-cols-12 gap-10 py-9">
                {group.columns.map((column) => (
                  <div key={column.heading} className={cn(column.links.length > 6 ? "col-span-4" : "col-span-3")}>
                    <p className="text-eyebrow mb-4">{column.heading}</p>
                    <ul className="flex flex-col gap-2.5">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="group block">
                            <span className="text-[0.9375rem] text-ink transition-colors group-hover:text-iris">
                              {link.label}
                            </span>
                            {link.description ? (
                              <span className="mt-0.5 block max-w-xs text-[0.8125rem] leading-snug text-clay">
                                {link.description}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {group.label === "Shop" ? (
                  <div className="col-span-3 col-start-10 border-s border-mist ps-8">
                    <p className="text-eyebrow mb-4">Not sure where to start?</p>
                    <ul className="flex flex-col gap-3">
                      {characters.map((character) => (
                        <li key={character.id}>
                          <Link href={`/characters/${character.slug}`} className="group flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className="h-9 w-9 shrink-0 rounded-full"
                              style={{
                                backgroundImage: `linear-gradient(140deg, ${character.accent.from}, ${character.accent.to})`,
                              }}
                            />
                            <span>
                              <span className="block text-[0.9375rem] text-ink transition-colors group-hover:text-iris">
                                {character.name}
                              </span>
                              <span className="block text-[0.8125rem] text-clay">{character.title}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="col-span-3 col-start-10 flex flex-col gap-2.5 border-s border-mist ps-8">
                    {group.featured.map((link) => (
                      <Link key={link.href} href={link.href} className="text-[0.9375rem] text-ink hover:text-iris">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        settings={settings}
        characters={characters}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function IconButton({
  label,
  count,
  onClick,
  children,
  className,
}: {
  label: string;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("relative grid h-10 w-10 place-items-center rounded-sm text-ink transition-colors hover:bg-shell", className)}
    >
      <span className="sr-only">
        {label}
        {count ? ` (${count})` : ""}
      </span>
      {children}
      <Counter count={count} />
    </button>
  );
}

function IconLink({
  href,
  label,
  count,
  children,
  className,
}: {
  href: string;
  label: string;
  count?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("relative grid h-10 w-10 place-items-center rounded-sm text-ink transition-colors hover:bg-shell", className)}
    >
      <span className="sr-only">
        {label}
        {count ? ` (${count})` : ""}
      </span>
      {children}
      <Counter count={count} />
    </Link>
  );
}

function Counter({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute end-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 font-mono text-[0.5625rem] leading-none text-chalk"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function MobileMenu({
  open,
  onClose,
  settings,
  characters,
}: {
  open: boolean;
  onClose: () => void;
  settings: StoreSettings;
  characters: CharacterSummary[];
}) {
  const [expanded, setExpanded] = useState<string | null>("Shop");

  return (
    <Drawer open={open} onClose={onClose} title="Menu" hideTitle className="max-w-full sm:max-w-[24rem]">
      <nav aria-label="Mobile">
        <section className="mb-7">
          <p className="text-eyebrow mb-3">Start with a person</p>
          <ul className="grid grid-cols-2 gap-2.5">
            {characters.map((character) => (
              <li key={character.id}>
                <Link
                  href={`/characters/${character.slug}`}
                  onClick={onClose}
                  className="flex flex-col gap-2 rounded-sm border border-mist p-3"
                >
                  <span
                    aria-hidden="true"
                    className="h-10 w-10 rounded-full"
                    style={{ backgroundImage: `linear-gradient(140deg, ${character.accent.from}, ${character.accent.to})` }}
                  />
                  <span className="text-[0.9375rem] text-ink">{character.name}</span>
                  <span className="text-[0.75rem] leading-snug text-clay">{character.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ul className="divide-y divide-mist border-y border-mist">
          {settings.navigation.map((group) => {
            const hasChildren = group.columns.length > 0;
            const isExpanded = expanded === group.label;
            return (
              <li key={group.label}>
                <div className="flex items-center justify-between">
                  <Link href={group.href} onClick={onClose} className="flex-1 py-3.5 text-[1.0625rem] text-ink">
                    {group.label}
                  </Link>
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : group.label)}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Hide" : "Show"} ${group.label} links`}
                      className="grid h-10 w-10 place-items-center text-clay"
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                        <path
                          d="M8 2v12M2 8h12"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          className={cn("origin-center transition-transform duration-300", isExpanded && "rotate-45")}
                        />
                      </svg>
                    </button>
                  ) : null}
                </div>

                {hasChildren && isExpanded ? (
                  <div className="pb-4">
                    {group.columns.map((column) => (
                      <div key={column.heading} className="mb-4 last:mb-0">
                        <p className="text-eyebrow mb-2">{column.heading}</p>
                        <ul className="flex flex-col">
                          {column.links.map((link) => (
                            <li key={link.href}>
                              <Link href={link.href} onClick={onClose} className="block py-2 text-[0.9375rem] text-graphite">
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <ul className="mt-6 flex flex-col gap-3">
          <li>
            <Link href="/wishlist" onClick={onClose} className="text-[0.9375rem] text-graphite">
              Wishlist
            </Link>
          </li>
          <li>
            <Link href="/account" onClick={onClose} className="text-[0.9375rem] text-graphite">
              Account
            </Link>
          </li>
          <li>
            <Link href="/track" onClick={onClose} className="text-[0.9375rem] text-graphite">
              Track your order
            </Link>
          </li>
          <li>
            <a href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, "")}`} className="text-[0.9375rem] text-graphite">
              WhatsApp us
            </a>
          </li>
        </ul>
      </nav>
    </Drawer>
  );
}
