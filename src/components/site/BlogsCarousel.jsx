import Link from "next/link";
import { formatApiDate } from "@/lib/format";
import { marqueeTrack } from "@/lib/marquee";

const CARD_WIDTH = 270 + 32; // card + gap-8

/**
 * Latest-posts marquee.
 *
 * Server component: the scroll is a CSS animation that pauses on hover, so
 * every card (and its link) is in the initial HTML with no JS attached.
 */
const BlogsCarousel = ({ blogs = [] }) => {
  const { items: track, animated } = marqueeTrack(blogs, CARD_WIDTH);
  if (track.length === 0) return null;

  return (
    <section className="py-8 max-w-7xl mx-auto px-6 defer-render defer-render-cards">
      <h2 className="text-3xl font-bold mb-10">Latest Blog Posts</h2>

      <div className="relative overflow-x-auto lg:overflow-hidden custom-scroll-hide">
        <div
          className={`flex gap-8 w-max py-6 ${animated ? "auto-slider" : ""}`}
        >
          {track.map(({ item: blog, key, duplicate }) => (
            <div
              key={key}
              aria-hidden={duplicate ? "true" : undefined}
              className={`w-[270px] h-[290px] bg-white rounded-2xl shrink-0 shadow-sm hover:shadow-xl transition-all duration-300 flex-col overflow-hidden group ${
                duplicate ? "hidden lg:flex" : "flex"
              }`}
            >
              <Link
                href={`/blog/${blog.slug}`}
                prefetch={false}
                tabIndex={duplicate ? -1 : undefined}
              >
                <div className="relative h-[150px] overflow-hidden bg-gray-50">
                  {blog?.image ? (
                    // Editor-uploaded media lives on an arbitrary host, so a
                    // plain img keeps it working whatever the upload target is.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blog.image}
                      alt={blog?.title || ""}
                      loading="lazy"
                      decoding="async"
                      width={270}
                      height={150}
                      className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}

                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-xs px-3 py-1 rounded-full shadow">
                    {formatApiDate(blog?.postDate, "MMM D, YYYY")}
                  </span>
                </div>
              </Link>

              <div className="p-2 flex flex-col flex-1">
                <p className="text-green-700 text-xs font-semibold uppercase tracking-wide truncate">
                  {blog?.categoryName}
                  {blog?.postedByName ? ` • ${blog.postedByName}` : ""}
                </p>

                <h3 className="mt-2 text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
                  {blog.title}
                </h3>

                <p className="mt-2 text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {blog?.metaDescription}
                </p>

                <Link
                  className="mt-auto inline-flex items-center gap-2 text-green-700 font-medium text-sm hover:text-green-800 transition cursor-pointer"
                  href={`/blog/${blog.slug}`}
                  prefetch={false}
                  tabIndex={duplicate ? -1 : undefined}
                >
                  Read More &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogsCarousel;
