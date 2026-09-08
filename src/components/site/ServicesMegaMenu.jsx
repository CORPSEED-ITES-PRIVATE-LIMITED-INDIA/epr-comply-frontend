"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Hover-revealed "Services" panel.
 *
 * Client island holding just the trigger and the panel; the categories are
 * pre-grouped on the server and handed in as a plain array.
 */
const ServicesMegaMenu = ({ categories = [] }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasData = categories.length > 0;

  return (
    <>
      <span
        onMouseEnter={() => {
          if (hasData) {
            setActiveIndex(0);
            setOpen(true);
          }
        }}
        className="cursor-pointer font-semibold hover:text-green-600"
      >
        Services
      </span>

      {open && (
        <div
          className="hidden lg:flex fixed top-[88px] left-1/2 -translate-x-1/2 w-[75vw] h-[400px] bg-white border border-gray-200 rounded-2xl shadow-xl z-[9999]"
          onMouseLeave={() => setOpen(false)}
        >
          {/* LEFT - CATEGORIES */}
          <div className="w-1/4 border-r border-gray-200 overflow-y-auto py-4">
            {categories.map((cat, idx) => (
              <div
                key={cat.title + idx}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`px-4 py-3 cursor-pointer font-medium ${
                  activeIndex === idx
                    ? "bg-[#006400] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {cat.title}
              </div>
            ))}
          </div>

          {/* RIGHT - ITEMS */}
          <div className="w-3/4 grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-x-6 gap-y-7 p-3 content-start overflow-y-auto">
            {(categories[activeIndex]?.items || []).map((x) => (
              <Link
                key={x.id}
                href={x.type === "blog" ? `/blog/${x.slug}` : `/service/${x.slug}`}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100 p-3 rounded-md cursor-pointer"
              >
                {x.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesMegaMenu;
