import React, { useRef, useEffect } from "react";
import img1 from "../assets/nature1.jfif";
import img2 from "../assets/nature2.webp";
import img3 from "../assets/nature3.jpg";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const BlogsCarousel = () => {
  const scrollRef = useRef(null);
  const blogList = useSelector((state) => state.blogs.clientBlogList);

  useEffect(() => {
    const slider = scrollRef.current;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });

    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active");
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // drag speed
      slider.scrollLeft = scrollLeft - walk;
    });
  }, []);


  return (
    <section className="py-8 max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-10">Latest Blog Posts</h2>

      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-8 whitespace-nowrap no-scrollbar auto-slider cursor-grab py-6"
        >
          {blogList?.length > 0 &&
            [...blogList, ...blogList,...blogList]?.map((blog, index) => (
              <div
                key={index}
                className="
            w-[360px] h-[260px] bg-white rounded-2xl shrink-0
            shadow-sm hover:shadow-xl transition-all duration-300
            flex flex-col overflow-hidden group
          "
              >
                {/* Image */}
                <div className="relative h-[130px] overflow-hidden">
                  <img
                    src={blog?.image}
                    alt=""
                    className="
                w-full h-full object-cover
                transition-transform duration-500
                group-hover:scale-105
              "
                  />

                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-xs px-3 py-1 rounded-full shadow">
                    {dayjs(blog?.postDate).format("MMM D, YYYY")}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
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
                    className="
                mt-auto inline-flex items-center gap-2
                text-green-600 font-medium text-sm
                hover:text-green-700 transition cursor-pointer
              "
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Auto scroll CSS */}
      <style>{`
        .auto-slider {
          animation: smoothScroll 40s linear infinite;
        }
        .auto-slider.active {
          animation-play-state: paused;
        }
        .auto-slider:hover {
          animation-play-state: paused;
        }

        @keyframes smoothScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default BlogsCarousel;
