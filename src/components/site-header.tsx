"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { nav, site } from "@/data/site";

/**
 * Site header.
 *
 * Unified navigation — deliberately NOT segmented into GC vs. architect tracks
 * (build prompt §13). One voice speaking to all of them.
 *
 * On small screens this collapses to a real full-height menu panel rather than
 * shrinking the desktop row.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the panel on route change. Adjusting state during render is React's
  // recommended pattern for resetting state when a value changes — doing this
  // in an effect would render the stale open panel for a frame first.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Subtle background once the page has moved, so the header never floats over
  // content unreadably.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape to close, and keep focus inside the open panel.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-rule bg-charcoal/92 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="relative z-10 flex items-center"
          aria-label={`${site.name} — home`}
        >
          {/* The link already carries the accessible name, so the mark itself
              is decorative to avoid a duplicate announcement. */}
          <BrandMark decorative eager className="h-11 w-auto sm:h-12" />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`link-caps label-caps-lg link-underline py-2 transition-colors duration-300 ${
                      active ? "text-amber" : "text-bone hover:text-amber"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Plain text, not a bordered pill. The reference layout keeps all
            button weight out of the nav so the hero's single primary CTA is the
            only filled element on the first screen. */}
        <div className="hidden lg:block">
          <a
            href={site.phoneHref}
            className="label-caps-lg link-underline text-bone transition-colors duration-300 hover:text-amber"
          >
            {site.phone}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-px w-6 bg-bone transition-all duration-300 ${
                open ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 block h-px w-6 bg-bone transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-6 bg-bone transition-all duration-300 ${
                open ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-rule bg-charcoal lg:hidden"
      >
        <nav aria-label="Primary" className="px-5 py-8 sm:px-8">
          <ul className="flex flex-col gap-1">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b border-rule py-4 font-display text-2xl transition-colors ${
                      active ? "text-amber" : "text-bone"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <a href={site.phoneHref} className="text-lg text-bone">
              {site.phone}
            </a>
            <a href={site.emailHref} className="text-lg text-amber">
              {site.email}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
