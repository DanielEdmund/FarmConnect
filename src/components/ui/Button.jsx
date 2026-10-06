import { motion } from "framer-motion";

const variants = {
  primary: "bg-[#87A878] hover:bg-[#6d8a61] text-white shadow-md hover:shadow-lg",
  secondary: "bg-[#C17C53] hover:bg-[#a36642] text-white shadow-md hover:shadow-lg",
  outline:
    "border-2 border-[#87A878] text-[#87A878] hover:bg-[#87A878] hover:text-white bg-transparent",
  ghost: "text-[#3A4A3F] hover:bg-[#87A878]/10 bg-transparent",
  golden: "bg-[#D4A373] hover:bg-[#b8894c] text-white shadow-md hover:shadow-lg",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-full",
  md: "px-6 py-3 text-sm rounded-full",
  lg: "px-8 py-4 text-base rounded-full",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconRight,
  disabled = false,
  onClick,
  type = "button",
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`
        inline-flex items-center gap-2 font-semibold
        transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </motion.button>
  );
}
