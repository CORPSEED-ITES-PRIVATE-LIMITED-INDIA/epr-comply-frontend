"use client";

import { useState, useRef, useEffect, cloneElement } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Dropdown({
  children,
  items = [],
  open: controlledOpen,
  onOpenChange,
}) {
  // The menu renders into document.body, which only exists in the browser.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- document.body only exists in the browser
  useEffect(() => setMounted(true), []);

  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (value) => {
    if (!isControlled) setUncontrolledOpen(value);
    onOpenChange?.(value);
  };

  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    placement: "bottom-left",
  });

  // ----------------- OUTSIDE CLICK -----------------
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      const triggerEl = triggerRef.current;
      const menuEl = menuRef.current;

      if (
        menuEl &&
        !menuEl.contains(e.target) &&
        triggerEl &&
        !triggerEl.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // ----------------- AUTO PLACEMENT -----------------
  useEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight;
    const menuWidth = menuRef.current.offsetWidth;

    let placement = "bottom-left";

    if (trigger.bottom + menuHeight > window.innerHeight) placement = "top-left";
    if (trigger.left + menuWidth > window.innerWidth)
      placement = placement.replace("left", "right");

    const positions = {
      "bottom-left": { top: trigger.bottom + 6, left: trigger.left },
      "bottom-right": { top: trigger.bottom + 6, left: trigger.right - menuWidth },
      "top-left": { top: trigger.top - menuHeight - 6, left: trigger.left },
      "top-right": { top: trigger.top - menuHeight - 6, left: trigger.right - menuWidth },
    };

    setCoords({ ...positions[placement], placement });
  }, [open]);

  // ----------------- ITEM CLICK HANDLER -----------------
  const handleItemClick = (item) => {
    item.onClick?.();
    // Only close if explicitly required
    if (!item.noClose) setOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <div ref={triggerRef} className="inline-block">
        {cloneElement(children, {
          onClick: (e) => {
            e.stopPropagation(); // prevent immediate outside click
            setOpen(!open);
          },
        })}
      </div>

      {/* Dropdown Portal */}
      {mounted &&
        createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="dropdown-menu"
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.16 }}
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                zIndex: 99999999,
              }}
              className="bg-gray-50 border border-gray-200 shadow-2xl rounded-lg p-1 w-48"
              onClick={(e) => e.stopPropagation()} // keep dropdown open when clicking inside
            >
              {items.map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleItemClick(item)}
                  className="px-3 py-2 cursor-pointer rounded-md hover:bg-gray-100"
                >
                  {item.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
