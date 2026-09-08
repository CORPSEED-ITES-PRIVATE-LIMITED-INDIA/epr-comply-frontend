"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Mobile navigation drawer.
 *
 * The drawer markup is only created once it is opened, so a phone pays for the
 * button and nothing else on first load.
 */
const MobileMenu = ({ serviceCategories = [], blogCategories = [] }) => {
  const [open, setOpen] = useState(false);

  // Don't let the page scroll behind the drawer.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => setOpen(false);

  const renderGroup = (label, categories, basePath, emptyLabel) => (
    <div>
      <div className="text-sm font-semibold text-gray-800 mb-2">{label}</div>

      {categories.length === 0 ? (
        <div className="text-sm text-gray-400">{emptyLabel}</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat, idx) => (
            <div key={cat.title + idx}>
              <div className="text-xs font-semibold text-gray-600 mb-2">
                {cat.title}
              </div>
              <div className="space-y-1">
                {(cat.items || []).map((x) => (
                  <Link
                    key={x.id}
                    href={`${basePath}/${x.slug}`}
                    prefetch={false}
                    onClick={close}
                    className="block text-sm text-gray-700 hover:text-green-600 px-2 py-1 rounded cursor-pointer"
                  >
                    {x.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="lg:hidden text-3xl cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        &#9776;
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-[10001]">
          <div className="absolute inset-0 bg-black/40" onClick={close} />

          <div className="absolute right-0 top-0 h-full w-[86%] max-w-[360px] bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <div className="font-semibold">Menu</div>
              <button
                type="button"
                className="text-2xl cursor-pointer"
                onClick={close}
                aria-label="Close menu"
              >
                &#10005;
              </button>
            </div>

            <div className="px-4 py-4 space-y-6">
              {renderGroup("Services", serviceCategories, "/service", "No services")}
              {renderGroup("Blogs", blogCategories, "/blog", "No blogs")}

              <div className="space-y-2 pt-2 border-t">
                <Link
                  href="/aboutus"
                  prefetch={false}
                  onClick={close}
                  className="block font-semibold hover:text-green-600 cursor-pointer"
                >
                  About Us
                </Link>
                <Link
                  href="/contactus"
                  prefetch={false}
                  onClick={close}
                  className="block font-semibold hover:text-green-600 cursor-pointer"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
