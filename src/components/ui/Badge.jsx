import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Star, Zap } from "lucide-react";

const badgeConfig = {
  organic: {
    label: "Organic",
    icon: Leaf,
    className: "bg-[#87A878]/15 text-[#5a8a4a] border border-[#87A878]/30",
  },
  verified: {
    label: "Verified",
    icon: ShieldCheck,
    className: "bg-[#E8F4F8] text-[#3A4A3F] border border-[#87A878]/20",
  },
  featured: {
    label: "Featured",
    icon: Star,
    className: "bg-[#D4A373]/15 text-[#a07840] border border-[#D4A373]/30",
  },
  fresh: {
    label: "Just Harvested",
    icon: Zap,
    className: "bg-[#C17C53]/10 text-[#C17C53] border border-[#C17C53]/20",
  },
  "top-seller": {
    label: "Top Seller",
    icon: Star,
    className: "bg-[#D4A373]/20 text-[#8c6030] border border-[#D4A373]/40",
  },
};

export default function Badge({ type = "organic", label, className = "" }) {
  const config = badgeConfig[type] || badgeConfig.organic;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-1 px-2.5 py-1
        text-xs font-semibold rounded-full
        ${config.className} ${className}
      `}
    >
      <Icon size={11} strokeWidth={2.5} />
      {displayLabel}
    </motion.span>
  );
}
