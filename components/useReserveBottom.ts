"use client";

import { useEffect, type RefObject } from "react";

/**
 * Publishes how much of the bottom of the viewport a fixed bar is covering,
 * as a CSS variable on <html> (--reserve-sticky, --reserve-consent).
 *
 * The floating WhatsApp button reads these to sit just above whichever bar
 * is showing, rather than hiding behind it or covering its buttons.
 */
export function useReserveBottom(
  name: "sticky" | "consent",
  ref: RefObject<HTMLElement | null>,
  active: boolean
) {
  useEffect(() => {
    const root = document.documentElement;
    const prop = `--reserve-${name}`;
    const node = ref.current;

    if (!node || !active) {
      root.style.removeProperty(prop);
      return;
    }

    // offsetHeight is 0 while the bar is display:none (e.g. sm:hidden)
    const update = () => root.style.setProperty(prop, `${node.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => {
      observer.disconnect();
      root.style.removeProperty(prop);
    };
  }, [name, ref, active]);
}
