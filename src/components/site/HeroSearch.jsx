"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/**
 * Hero service finder. Filtering happens against the already-rendered service
 * list, so typing never waits on the network.
 */
const HeroSearch = ({ services = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return services;
    return services.filter((service) =>
      service?.title?.toLowerCase().includes(term),
    );
  }, [services, searchTerm]);

  return (
    <div className="flex justify-center mb-6 relative" ref={dropdownRef}>
      <div className="flex bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-2xl relative z-20">
        <input
          type="text"
          placeholder="Search for EPR Services..."
          aria-label="Search for EPR services"
          className="flex-1 px-4 py-2 text-gray-800 focus:outline-none"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
      </div>

      {showDropdown && searchTerm.length > 0 && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white mt-1 rounded-lg shadow-2xl overflow-hidden z-50 border border-gray-200">
          {filteredServices?.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {filteredServices.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/service/${service.slug}`}
                    prefetch={false}
                    className="block px-4 py-3 text-left text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-none"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="font-medium">{service.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-gray-500 text-left">
              No services found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroSearch;
