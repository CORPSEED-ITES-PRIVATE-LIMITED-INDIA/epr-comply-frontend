import React, { useRef, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BlogsCarousel = () => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const blogList = useSelector((state) => state.blogs.clientBlogList);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Lightweight native formatter (removes dayjs from bundle)
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // ✅ Memoize duplicated list (prevents recalculation on re-render)
  const duplicatedBlogs = useMemo(() => {
    if (!blogList?.length) return [];
    return [...blogList, ...blogList];
  }, [blogList]);

  // ✅ Start animation only when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!blogList?.length) return null;

  return (
    <section
      ref={containerRef}
      className="py-8 max-w-7xl mx-auto px-6"
    >
      <h2 className="text-3xl font-bold mb-10">Latest Blog Posts</h2>

      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className={`flex gap-8 whitespace-nowrap no-scrollbar py-6 ${
            isVisible ? "auto-slider" : ""
          }`}
        >
          {duplicatedBlogs.map((blog, index) => (
            <div
              key={index}
              className="w-[270px] h-[290px] bg-white rounded-2xl shrink-0 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              <Link to={`/blog/${blog.slug}`}>
                <div className="relative h-[150px] overflow-hidden">
                  <img
                    src={blog?.image}
                    alt={blog?.title}
                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    width="270"
                    height="150"
                  />

                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-xs px-3 py-1 rounded-full shadow">
                    {formatDate(blog?.postDate)}
                  </span>
                </div>
              </Link>

              <div className="p-2 flex flex-col flex-1">
                <p className="text-green-600 text-xs font-semibold uppercase tracking-wide truncate">
                  {blog?.categoryName} • {blog.author}
                </p>

                <h3 className="mt-2 text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
                  {blog.title}
                </h3>

                <p className="mt-2 text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {blog?.metaDescription}
                </p>

                <Link
                  className="mt-auto inline-flex items-center gap-2 text-green-600 font-medium text-sm hover:text-green-700 transition"
                  to={`/blog/${blog.slug}`}
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .auto-slider {
          animation: smoothScroll 40s linear infinite;
        }

        .auto-slider:hover {
          animation-play-state: paused;
        }

        @keyframes smoothScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default BlogsCarousel;