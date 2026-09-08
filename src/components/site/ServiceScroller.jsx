import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { marqueeTrack } from "@/lib/marquee";

const CARD_WIDTH = 280 + 24; // card + gap-6

/**
 * Auto-scrolling row of service cards.
 *
 * Server component: the motion is a compositor-driven CSS marquee that pauses
 * on hover, so this ships no JS at all. The previous build drove the same
 * effect from a requestAnimationFrame loop that wrote `scrollLeft` every
 * frame - a forced reflow per frame that never stopped, and by far the largest
 * source of main-thread blocking on the home page.
 */
const ServiceScroller = ({ services = [] }) => {
  const { items: track, animated } = marqueeTrack(services, CARD_WIDTH);
  if (track.length === 0) return null;

  return (
    <div className="mt-14 overflow-x-auto lg:overflow-hidden custom-scroll-hide py-4">
      <div
        className={`flex gap-6 w-max select-none ${animated ? "auto-slider" : ""}`}
      >
        {track.map(({ item, key, duplicate }) => (
          <Link
            key={key}
            href={`/service/${item?.slug}`}
            prefetch={false}
            aria-hidden={duplicate ? "true" : undefined}
            tabIndex={duplicate ? -1 : undefined}
            className={duplicate ? "hidden lg:block" : undefined}
          >
            <div className="w-[280px] h-[200px] bg-white text-black rounded-xl p-6 shadow flex flex-col">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {item?.title}
              </h3>

              <div
                className="tiptap-render line-clamp-3 max-w-none text-sm flex-1 overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: item?.metaDescription || "",
                }}
              />

              <div className="mt-4 text-green-600">
                <ArrowRightIcon size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiceScroller;
