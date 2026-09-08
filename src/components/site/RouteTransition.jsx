"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Re-keys the page subtree on every path change so the `page-enter` CSS
 * animation replays on client-side navigation.
 *
 * The animation is deliberately skipped for the first render: it starts at
 * `opacity: 0`, and on a cold load that hides the hero heading until the
 * animation runs, which pushed Largest Contentful Paint out by ~2s. Fading in
 * only matters when moving between pages, so that is the only time it applies.
 */
const RouteTransition = ({ children }) => {
  const pathname = usePathname();
  const [firstPath] = useState(pathname);
  const animate = pathname !== firstPath;

  return (
    <div key={pathname} className={`flex-1 ${animate ? "page-enter" : ""}`}>
      {children}
    </div>
  );
};

export default RouteTransition;
