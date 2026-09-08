"use client";

import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium", // small | medium | large
  icon: Icon, // optional icon component
  iconSize, // optional icon size override
  onClick,
  ...props
}) => {
  // Base button styles
  const base =
    "font-medium rounded-lg cursor-pointer flex items-center gap-2 transition-all duration-200 justify-center";

  // Variant styles
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    text: "hover:bg-gray-200",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200",
  };

  // Size styles
  const sizeStyles = {
    small: "px-2 py-1 text-tiny",
    medium: "px-3 py-2 text-small",
    large: "px-4 py-2 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${sizeStyles[size]}`}
      {...props}
    >
      {Icon && Icon}
      {children}
    </button>
  );
};

export default Button;
