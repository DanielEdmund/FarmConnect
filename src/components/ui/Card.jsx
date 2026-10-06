import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  lift = true,
  padding = true,
  ...props
}) {
  return (
    <motion.div
      className={`
        bg-white rounded-3xl overflow-hidden
        border border-[#87A878]/10
        ${lift ? "card-lift" : ""}
        ${padding ? "p-6" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
