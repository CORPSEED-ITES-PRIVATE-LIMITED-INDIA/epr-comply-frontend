import { Search } from "lucide-react";

const Input = ({
  label,
  icon = <Search size={18} />,
  showIcon = false,
  iconPosition = "left",
  wrapperClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div
        className={`
          relative 
          flex items-center
          border border-gray-300 rounded-lg 
          focus-within:border-blue-500
          transition-all
          bg-white
        `}
      >
        {/* LEFT ICON */}
        {showIcon && iconPosition === "left" && (
          <span className="absolute left-3 text-gray-400">{icon}</span>
        )}

        <input
          {...props}
          className={`
            w-full
            px-3 py-2.5
            text-sm 
            bg-transparent
            outline-none
            ${showIcon && iconPosition === "left" ? "pl-10" : ""}
            ${showIcon && iconPosition === "right" ? "pr-10" : ""}
            rounded-lg
            ${className}
          `}
        />

        {/* RIGHT ICON */}
        {showIcon && iconPosition === "right" && (
          <span className="absolute right-3 text-gray-400">{icon}</span>
        )}
      </div>
    </div>
  );
};

export default Input;
