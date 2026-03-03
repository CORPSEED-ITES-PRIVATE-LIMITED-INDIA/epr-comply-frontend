import React, { useRef, useEffect, useState } from "react";

import logo1 from "../assets/optimized/barbeque1.webp";
import logo2 from "../assets/optimized/capital1.webp";
import logo3 from "../assets/optimized/dynamic1.webp";
import logo4 from "../assets/optimized/finance1.webp";
import logo5 from "../assets/optimized/google1.webp";
import logo6 from "../assets/optimized/indian_oil1.webp";
import logo7 from "../assets/optimized/lic1.webp";
import logo8 from "../assets/optimized/netflix1.webp";

const LogoInfiniteScroller = () => {
  const images = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8];

  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Intersection Observer (start only when visible)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden relative pt-8 select-none"
    >
      <div
        ref={trackRef}
        className={`flex gap-16 ${
          isVisible ? "animate-scroll" : ""
        }`}
      >
        {[...images, ...images].map((src, i) => (
          <img
            key={i}
            src={src}
            className="h-16 w-16 object-contain"
            loading="lazy"
            decoding="async"
            width="64"
            height="64"
            alt="client logo"
          />
        ))}
      </div>

      <style>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default LogoInfiniteScroller;