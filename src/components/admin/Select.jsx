"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X, Search } from "lucide-react";

const Select = ({
  placeholder = "Select",
  options = [],
  value,
  onChange,
  multiple = false,
  disabled = false,
  showSearch = false,
  allowClear = false,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Detect click outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredOptions = options.filter((item) =>
    item?.label?.toLowerCase()?.includes(search?.toLowerCase())
  );

  const selectedLabel = !multiple
    ? options.find((x) => x?.value === value)?.label
    : "";

  const selectedItems = multiple
    ? options.filter((x) => value?.includes(x.value))
    : [];

  const toggleMultiSelect = (itemValue) => {
    let updated;

    if (value.includes(itemValue)) {
      updated = value.filter((v) => v !== itemValue);
    } else {
      updated = [...value, itemValue];
    }

    onChange(updated);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* SELECT TRIGGER */}
      <div
        className={`
          border border-gray-300 rounded-lg px-3 py-2
          flex items-center bg-white cursor-pointer
          transition-all w-full min-h-[42px]
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${open ? "border-blue-500 shadow-sm" : ""}
          ${className}
        `}
        onClick={() => !disabled && setOpen(true)}
      >
        {/* LEFT SIDE — tags, label, input */}
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {/* MULTIPLE TAGS */}
          {multiple &&
            selectedItems.map((item) => (
              <span
                key={item.value}
                className="flex items-center text-xs bg-blue-100 px-2 py-1 rounded-full"
              >
                {item.label}
                <X
                  size={14}
                  className="ml-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMultiSelect(item.value);
                  }}
                />
              </span>
            ))}

          {/* SINGLE SELECT LABEL */}
          {!multiple && !showSearch && (
            <span
              className={`text-sm truncate ${
                value ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {selectedLabel || placeholder}
            </span>
          )}

          {/* SEARCH INPUT */}
          {showSearch && (
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              onFocus={() => setOpen(true)}
              className="flex-1 outline-none text-sm bg-transparent"
            />
          )}
        </div>

        {/* CLEAR ICON */}
        {allowClear && (multiple ? value.length > 0 : value) && (
          <X
            size={16}
            className="text-gray-400 hover:text-gray-600 cursor-pointer ml-2 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onChange(multiple ? [] : null);
              setSearch("");
            }}
          />
        )}

        {/* FIXED RIGHT CHEVRON */}
        <div className="ml-2 shrink-0 flex items-center">
          <ChevronDown
            size={18}
            className={`text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="select-menu"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="
              absolute left-0 mt-1 w-full bg-white border border-gray-200 
              rounded-lg shadow-lg z-50 max-h-60 overflow-auto
            "
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => {
                const isSelected = multiple
                  ? value?.includes(item.value)
                  : value === item.value;

                return (
                  <div
                    key={item.value}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex justify-between ${
                      isSelected ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      if (multiple) {
                        toggleMultiSelect(item.value);
                      } else {
                        onChange(item.value);
                        setOpen(false);
                      }
                      setSearch("");
                    }}
                  >
                    {item.label}
                    {multiple && isSelected && <X size={14} />}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-3 text-center text-gray-400 text-sm">
                No options found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
