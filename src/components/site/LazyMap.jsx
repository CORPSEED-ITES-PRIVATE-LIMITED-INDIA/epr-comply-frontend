"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google Maps embed that only mounts once it is scrolled near.
 *
 * The plain iframe pulled ~75 KB of third-party script during page load and
 * pushed First Contentful Paint out to 4s on the contact page. The wrapper
 * keeps the same footprint reserved, so swapping the iframe in causes no shift.
 */
const LazyMap = ({ src, title, height = 400 }) => {
  const ref = useRef(null);
  // Browsers without IntersectionObserver just get the iframe immediately.
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ height }} className="w-full bg-green-50">
      {visible ? (
        <iframe
          title={title}
          src={src}
          width="100%"
          height={height}
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
          Loading map…
        </div>
      )}
    </div>
  );
};

export default LazyMap;
