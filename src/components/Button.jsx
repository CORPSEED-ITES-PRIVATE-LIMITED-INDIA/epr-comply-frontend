import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Button = ({ children, variant = "primary", icon: Icon, onClick }) => {
  const base =
    "px-4 py-2 text-sm font-medium rounded-lg cursor-pointer flex items-center gap-2 transition-all duration-200";

  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;
