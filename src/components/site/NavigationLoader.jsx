"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import FullPageLoader from "./FullPageLoader";

/**
 * Full-page loader shown while a client-side navigation is in flight.
 *
 * Why not a `loading.js` file? That creates a Suspense boundary the
 * prerenderer also uses, so the loader ended up in the initial HTML of every
 * static page - Speed Index went from 2.1s to 3.6s because visitors saw a
 * spinner before content that was already in the response. This shows the
 * loader only for real navigations and leaves first paint untouched.
 *
 * Pending state is derived (clicked path vs. committed path) rather than
 * toggled from an effect, so arriving on the new page costs no extra render.
 */

// Most navigations are prefetched and land in a few milliseconds. Waiting a
// moment before covering the page means those never flash a spinner.
const SHOW_DELAY = 150;

// If a navigation never commits (aborted, blocked, offline), stop covering the
// page rather than trapping the visitor behind a spinner.
const STUCK_TIMEOUT = 8000;

const NavigationLoader = () => {
  const pathname = usePathname();
  const [target, setTarget] = useState(null);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const showTimer = useRef(null);
  const stuckTimer = useRef(null);

  const pending = target !== null && target !== pathname;
  const visible = pending && delayElapsed;

  const clearTimers = useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    if (stuckTimer.current) {
      clearTimeout(stuckTimer.current);
      stuckTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = event.target?.closest?.("a[href]");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      let url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Only same-origin route changes; hash and query-only jumps are instant.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      // Files (sitemap.xml, PDFs...) are not route changes.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;

      clearTimers();
      setTarget(url.pathname);
      setDelayElapsed(false);

      showTimer.current = setTimeout(() => setDelayElapsed(true), SHOW_DELAY);
      stuckTimer.current = setTimeout(() => setTarget(null), STUCK_TIMEOUT);
    };

    // Capture phase on purpose: next/link calls preventDefault() in its own
    // handler, so a bubble-phase listener sees defaultPrevented on every
    // internal link and can never tell a real navigation from a no-op.
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, [clearTimers]);

  // Back/forward buttons change the path without a click to observe.
  useEffect(() => {
    const onPopState = () => setTarget(null);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!pending) clearTimers();
  }, [pending, clearTimers]);

  if (!visible) return null;

  return (
    <div aria-busy="true" className="fixed inset-0 z-[10050] bg-white">
      <FullPageLoader label="Loading page" />
    </div>
  );
};

export default NavigationLoader;
