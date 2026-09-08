"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SearchIcon } from "@/components/ui/icons";

const EMPTY_RESULTS = { blogs: [], services: [] };

/**
 * Desktop global search. Small client island: the rest of the header is
 * server-rendered, so this is the only part of the bar that costs JS.
 */
const HeaderSearch = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState(EMPTY_RESULTS);
  const inputRef = useRef(null);

  const closeSearch = () => {
    setShowDropdown(false);
    setQuery("");
  };

  // close on click outside the search area
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".mega-search")) closeSearch();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // debounced query against the public search endpoint
  useEffect(() => {
    const term = query.trim();
    if (!term) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/client/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        setResults({
          blogs: data?.blogs || [],
          services: data?.services || [],
        });
      } catch {
        /* aborted or offline: keep whatever is already on screen */
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Results belong to the current term; an empty box shows nothing rather
  // than the previous query stale results.
  const shown = query.trim() ? results : EMPTY_RESULTS;

  return (
    <>
      <div className="hidden lg:flex items-center relative mega-search">
        <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 transition-all duration-300 max-w-[180px]">
          <SearchIcon
            size={18}
            className="cursor-pointer shrink-0 text-gray-400"
            onClick={() => inputRef.current?.focus()}
          />

          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            aria-label="Search services and blogs"
            className="ml-2 bg-transparent outline-none text-sm transition-all duration-300 w-full opacity-100"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              setShowDropdown(v.length > 0);
            }}
          />
        </div>
      </div>

      {showDropdown && (
        <div className="fixed top-[72px] left-0 w-screen bg-white shadow-lg z-50 mega-search">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Blogs</h3>

              {shown.blogs.length === 0 ? (
                <p className="text-sm text-gray-400">No blogs found</p>
              ) : (
                <ul className="space-y-2 max-h-[60vh] overflow-auto">
                  {shown.blogs.map((blog) => (
                    <li key={blog.id}>
                      <Link
                        href={`/blog/${blog.slug}`}
                        prefetch={false}
                        onClick={closeSearch}
                        className="block cursor-pointer text-sm px-2 py-1.5 rounded hover:bg-gray-100"
                      >
                        {blog.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                Services
              </h3>

              {shown.services.length === 0 ? (
                <p className="text-sm text-gray-400">No services found</p>
              ) : (
                <ul className="space-y-2 max-h-[60vh] overflow-auto">
                  {shown.services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/service/${service.slug}`}
                        prefetch={false}
                        onClick={closeSearch}
                        className="block cursor-pointer text-sm px-2 py-1.5 rounded hover:bg-gray-100"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderSearch;
