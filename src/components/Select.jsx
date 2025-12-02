import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X, Search } from "lucide-react";

const Select = ({
  placeholder = "Select",
  options = [],
  value,
  onChange,
  disabled = false,
  showSearch = false,
  allowClear = false,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

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
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((x) => x.value === value)?.label;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* SELECT TRIGGER */}
      <div
        className={`
          border border-gray-300 rounded-lg px-3 py-2
          flex items-center bg-white cursor-pointer
          transition-all w-full
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${open ? "border-blue-500 shadow-sm" : ""}
          ${className}
        `}
        onClick={() => !disabled && setOpen(true)}
      >
        {/* Search Icon */}
        {showSearch && (
          <Search size={16} className="text-gray-400 mr-2 shrink-0" />
        )}

        {/* Input or Label */}
        {showSearch ? (
          <input
            ref={inputRef}
            value={open ? search : selectedLabel || ""}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            className="flex-1 outline-none text-sm bg-transparent"
          />
        ) : (
          <span
            className={`flex-1 text-sm ${
              value ? "text-gray-800" : "text-gray-400"
            }`}
          >
            {selectedLabel || placeholder}
          </span>
        )}

        {/* Clear Icon */}
        {allowClear && value && (
          <X
            size={16}
            className="text-gray-400 hover:text-gray-600 cursor-pointer ml-2"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              setSearch("");
            }}
          />
        )}

        {/* Chevron */}
        <ChevronDown
          size={18}
          className={`text-gray-500 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
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
              filteredOptions.map((item) => (
                <div
                  key={item.value}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                    value === item.value ? "bg-blue-100" : ""
                  }`}
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {item.label}
                </div>
              ))
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
