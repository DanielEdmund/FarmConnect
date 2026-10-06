import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Building2, Home, Package } from "lucide-react";
import { testimonials } from "../../data/mockData";
import {
  useScrollAnimation,
  containerVariants,
  revealVariants,
} from "../../hooks/useScrollAnimation";
import Container from "../layout/Container";

const typeConfig = {
  restaurant: { icon: Building2, label: "Restaurant", color: "#C17C53" },
  household: { icon: Home, label: "Household", color: "#87A878" },
  "bulk-buyer": { icon: Package, label: "Bulk Buyer", color: "#D4A373" },
};

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-[#D4A373]" : "text-[#D4A373]/20"}
          fill={i < rating ? "#D4A373" : "none"}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, inView] = useScrollAnimation();
  const dragX = useMotionValue(0);

  const navigate = (dir) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];
  const typeInfo = typeConfig[t.type];
  const TypeIcon = typeInfo.icon;

  return (
    <section className="py-24 bg-[#F5F1E8] overflow-hidden">
      <Container>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={revealVariants} className="text-center mb-16">
            <span className="text-[#87A878] text-sm font-semibold uppercase tracking-wider mb-3 block">
              Voices from Our Community
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#3A4A3F]">
              Real People, Real Results
            </h2>
          </motion.div>

          {/* Testimonial card */}
          <motion.div variants={revealVariants} className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Large quote mark */}
              <div className="absolute -top-8 left-0 opacity-10">
                <Quote size={80} className="text-[#87A878]" fill="#87A878" />
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50) navigate(1);
                    else if (info.offset.x > 50) navigate(-1);
                  }}
                  className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-[#3A4A3F]/6 cursor-grab active:cursor-grabbing"
                >
                  {/* User type badge */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                    style={{
                      backgroundColor: `${typeInfo.color}15`,
                      color: typeInfo.color,
                      border: `1px solid ${typeInfo.color}30`,
                    }}
                  >
                    <TypeIcon size={12} />
                    {typeInfo.label}
                  </div>

                  {/* Stars */}
                  <StarRating rating={t.rating} />

                  {/* Quote */}
                  <blockquote className="font-display text-xl sm:text-2xl text-[#3A4A3F] leading-relaxed mt-4 mb-8 italic">
                    "{t.text}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#87A878]/20"
                    />
                    <div>
                      <div className="font-semibold text-[#3A4A3F]">{t.name}</div>
                      <div className="text-sm text-[#3A4A3F]/50">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Swipe hint */}
              <p className="text-center text-[#3A4A3F]/30 text-xs mt-4">
                Drag or swipe to explore more
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#3A4A3F] hover:bg-[#87A878] hover:text-white transition-colors"
              >
                <ChevronLeft size={18} />
              </motion.button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 h-2.5 bg-[#C17C53]"
                        : "w-2.5 h-2.5 bg-[#C17C53]/25 hover:bg-[#C17C53]/50"
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(1)}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#3A4A3F] hover:bg-[#87A878] hover:text-white transition-colors"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>

            {/* Type filter pills */}
            <motion.div variants={revealVariants} className="flex justify-center gap-3 mt-8 flex-wrap">
              {Object.entries(typeConfig).map(([type, info]) => {
                const Icon = info.icon;
                const isActive = testimonials[current].type === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      const idx = testimonials.findIndex((t) => t.type === type);
                      if (idx !== -1) { setDirection(idx > current ? 1 : -1); setCurrent(idx); }
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all
                      ${isActive
                        ? "text-white shadow-md"
                        : "bg-white text-[#3A4A3F]/60 hover:text-[#3A4A3F]"}`}
                    style={isActive ? { backgroundColor: info.color } : {}}
                  >
                    <Icon size={12} />
                    {info.label}s
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
