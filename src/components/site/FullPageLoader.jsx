import Image from "next/image";
import logo from "@/assets/logo-header.webp";

/**
 * Full-page loading state.
 *
 * Server component with a CSS-only spinner, so the fallback itself costs no
 * JavaScript and paints immediately while the route streams in.
 *
 * @param {string} height Tailwind height class for the area to fill. The
 *   default fills the whole viewport; pass a smaller one when the loader sits
 *   inside a shell that is already on screen (header, admin sidebar).
 */
const FullPageLoader = ({
  height = "min-h-screen",
  background = "bg-white",
  label = "Loading",
}) => (
  <div
    role="status"
    aria-live="polite"
    className={`${height} ${background} w-full flex flex-col items-center justify-center gap-6`}
  >
    <Image
      src={logo}
      alt=""
      width={68}
      height={53}
      sizes="68px"
      priority
      className="h-12 w-auto"
    />

    <span
      aria-hidden="true"
      className="h-9 w-9 rounded-full border-[3px] border-green-100 border-t-green-700 animate-spin"
    />

    <span className="sr-only">{label}</span>
  </div>
);

export default FullPageLoader;
