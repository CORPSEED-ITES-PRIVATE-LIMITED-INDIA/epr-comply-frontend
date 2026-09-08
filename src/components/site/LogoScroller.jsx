import Image from "next/image";
import logo1 from "@/assets/barbeque.png";
import logo2 from "@/assets/capital.png";
import logo3 from "@/assets/dynamic.jpg";
import logo4 from "@/assets/finance.png";
import logo5 from "@/assets/google.png";
import logo6 from "@/assets/indian_oil.png";
import logo7 from "@/assets/lic.jpg";
import logo8 from "@/assets/netflix.png";
import { marqueeTrack } from "@/lib/marquee";

const images = [
  { src: logo1, alt: "Barbeque Nation" },
  { src: logo2, alt: "Capital" },
  { src: logo3, alt: "Dynamic" },
  { src: logo4, alt: "Finance" },
  { src: logo5, alt: "Google" },
  { src: logo6, alt: "Indian Oil" },
  { src: logo7, alt: "LIC" },
  { src: logo8, alt: "Netflix" },
];

const LOGO_WIDTH = 64 + 64; // logo + gap-16

const { items: track, animated } = marqueeTrack(images, LOGO_WIDTH);

/**
 * Server component: the marquee is a pure CSS animation, so this ships no JS.
 */
const LogoScroller = () => (
  <div className="w-full overflow-x-auto lg:overflow-hidden custom-scroll-hide relative pt-8 select-none defer-render defer-render-logos">
    <div className={`flex gap-16 w-max ${animated ? "animate-scroll" : ""}`}>
      {track.map(({ item, key, duplicate }) => (
        <Image
          key={key}
          src={item.src}
          alt={duplicate ? "" : item.alt}
          aria-hidden={duplicate ? "true" : undefined}
          width={64}
          height={64}
          sizes="64px"
          className={`h-16 w-16 object-contain shrink-0 ${
            duplicate ? "hidden lg:block" : ""
          }`}
        />
      ))}
    </div>
  </div>
);

export default LogoScroller;
