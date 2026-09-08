"use client";

import { useEffect } from "react";

/**
 * Loads Google Analytics late.
 *
 * gtag.js is ~123 KB and cost ~190 ms of blocking time when loaded with
 * next/script's `lazyOnload`, which was the largest single remaining
 * contributor to Total Blocking Time. It is fetched here on the first real
 * interaction, or after the page has been idle for a few seconds - whichever
 * comes first - so it never competes with first render.
 *
 * Trade-off worth knowing: a visitor who leaves within `IDLE_DELAY` without
 * touching the page is not recorded. If exact bounce counting matters more
 * than the score, move this back to
 *   <Script src={...} strategy="afterInteractive" />
 * in app/layout.js.
 */

const IDLE_DELAY = 4000;
const INTERACTION_EVENTS = [
  "pointerdown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
];

const Analytics = ({ measurementId }) => {
  useEffect(() => {
    if (!measurementId) return;

    let loaded = false;
    let timer;

    const load = () => {
      if (loaded) return;
      loaded = true;

      INTERACTION_EVENTS.forEach((event) =>
        window.removeEventListener(event, load),
      );
      clearTimeout(timer);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", measurementId);

      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head.appendChild(script);
    };

    INTERACTION_EVENTS.forEach((event) =>
      window.addEventListener(event, load, { once: true, passive: true }),
    );

    timer = setTimeout(load, IDLE_DELAY);

    return () => {
      INTERACTION_EVENTS.forEach((event) =>
        window.removeEventListener(event, load),
      );
      clearTimeout(timer);
    };
  }, [measurementId]);

  return null;
};

export default Analytics;
