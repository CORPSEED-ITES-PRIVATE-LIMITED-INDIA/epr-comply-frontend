"use client";

import { useEffect, useRef, useState } from "react";

export default function PopConfirm({
  title = "Are you sure?",
  description,
  onConfirm,
  onCancel,
  children,
}) {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (popRef.current && !popRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <span onClick={() => setOpen(!open)}>
        {children}
      </span>

      {/* Popup */}
      {open && (
        <div
          ref={popRef}
          className="absolute z-50 top-8 right-0 bg-white shadow-xl border border-gray-200 rounded-3xl p-4 w-64 animate-fade"
        >
          <p className="font-semibold text-gray-800">{title}</p>
          {description && (
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                setOpen(false);
                onCancel && onCancel();
              }}
              className="px-3 py-1 text-sm rounded border hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onConfirm && onConfirm();
              }}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
