"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronArrowRightIcon } from "@/components/ui/icons";

/**
 * Sticky "table of content" rail for a service page.
 *
 * Only the rail is a client island - the section bodies themselves are server
 * rendered in the page, so all of that copy is in the initial HTML. The active
 * item also tracks scroll position, which the previous build did not do.
 */
const TableOfContentNav = ({ sections = [] }) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const clickLockRef = useRef(false);

  useEffect(() => {
    if (sections.length === 0) return;

    const targets = sections
      .map((item) => document.getElementById(`section-${item.id}`))
      .filter(Boolean);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Ignore observer updates while a click-driven smooth scroll runs.
        if (clickLockRef.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(Number(visible[0].target.dataset.sectionId));
        }
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    if (!element) return;

    clickLockRef.current = true;
    setTimeout(() => {
      clickLockRef.current = false;
    }, 800);
    setActiveId(id);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (sections.length === 0) return null;

  return (
    <div className="bg-green-100 rounded-xl p-8 shadow-sm sticky top-24 h-fit">
      <nav className="space-y-4" aria-label="On this page">
        {sections.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            aria-current={activeId === item.id ? "true" : undefined}
            className={`w-full text-left flex items-center p-3 rounded-lg shadow cursor-pointer transition-all duration-300 ${
              activeId === item.id
                ? "bg-white shadow-md border-l-4 border-green-700 translate-x-1"
                : "bg-white/90 hover:bg-white"
            }`}
          >
            <ChevronArrowRightIcon
              className={`text-green-700 mr-3 h-4 w-4 shrink-0 transition-transform ${
                activeId === item.id ? "rotate-90" : ""
              }`}
            />
            <p className="font-semibold text-[15px]">{item.tabName}</p>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContentNav;
