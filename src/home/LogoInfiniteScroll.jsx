import React, { useRef, useEffect, useState } from "react";
import logo1 from "../assets/barbeque.png";
import logo2 from "../assets/capital.png";
import logo3 from "../assets/dynamic.jfif";
import logo4 from "../assets/finance.png";
import logo5 from "../assets/google.png";
import logo6 from "../assets/indian_oil.png";
import logo7 from "../assets/lic.jfif";
import logo8 from "../assets/netflix.png";
 
const LogoInfiniteScroller = ({ speed = 40 }) => {
  const images = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8];
 
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
 
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(trackRef.current.offsetLeft);
  };
 
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX - startX;
    trackRef.current.style.transform = "translateX(calc(${scrollLeft}px + ${x}px))";
  };
 
  const handleMouseUp = () => {
    setIsDragging(false);
  };
 
  return (
    <div
      className="w-full overflow-hidden relative pt-8 select-none"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={trackRef}
        className="flex gap-16 animate-scroll hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* REAL LIST */}
        {[...images,...images]?.map((src, i) => (
          <img key={i} src={src} className="h-16 w-16 object-contain" />
        ))}
 
        {/* DUPLICATED LIST for seamless loop */}
        {[...images,...images]?.map((src, i) => (
          <img
            key={`dup-${i}`}
            src={src}
            className="h-16 w-16 object-contain"
          />
        ))}
      </div>
 
      {/* CSS KEYFRAMES */}
      <style>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
 
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
 
export default LogoInfiniteScroller;