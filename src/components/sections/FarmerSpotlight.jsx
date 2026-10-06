import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Star, ShieldCheck, ChevronLeft, ChevronRight, Leaf } from "lucide-react";
import { farmers } from "../../data/mockData";
import { useScrollAnimation, containerVariants, revealVariants } from "../../hooks/useScrollAnimation";
import Container from "../layout/Container";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export default function FarmerSpotlight() {
  const [current, setCurrent] = useState(0);
  const [ref, inView] = useScrollAnimation();

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % farmers.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const farmer = farmers[current];

  return (
    <section className="py-24 bg-harvest overflow-hidden">
      <Container>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={revealVariants} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#87A878] text-sm font-semibold uppercase tracking-wider mb-3">
              <Leaf size={14} />
              Farmer Spotlight
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#3A4A3F] mb-4">
              Meet the Hands Behind Your Food
            </h2>
            <p className="text-[#3A4A3F]/60 max-w-xl mx-auto">
              Every product has a story. Every farmer has a heart. Get to know the
              passionate people growing your food.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div variants={revealVariants}>
            <div className="relative max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-[#3A4A3F]/10 grid md:grid-cols-2"
                >
                  {/* Image panel */}
                  <div className="relative h-64 md:h-auto min-h-[320px]">
                    <img
                      src={farmer.coverImage}
                      alt={farmer.farm}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3A4A3F]/70 via-transparent to-transparent" />

                    {/* Farmer avatar */}
                    <div className="absolute bottom-6 left-6 flex items-end gap-3">
                      <div className="w-16 h-16 rounded-2xl border-3 border-white overflow-hidden shadow-lg">
                        <img src={farmer.avatar} alt={farmer.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-white pb-0.5">
                        <div className="font-semibold text-base leading-tight">{farmer.name}</div>
                        <div className="flex items-center gap-1 text-xs text-white/70">
                          <MapPin size={10} />
                          {farmer.location}
                        </div>
                      </div>
                    </div>

                    {/* Verified stamp */}
                    {farmer.verified && (
                      <div className="absolute top-4 right-4">
                        <Badge type="verified" label="Verified Farmer" />
                      </div>
                    )}
                  </div>

                  {/* Info panel */}
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-display text-2xl font-bold text-[#3A4A3F] mb-1">
                            {farmer.farm}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-[#3A4A3F]/50">
                            <Star size={14} className="text-[#D4A373]" fill="#D4A373" />
                            <span className="font-semibold text-[#3A4A3F]">{farmer.rating}</span>
                            <span>({farmer.reviewCount} reviews)</span>
                            <span className="mx-1">·</span>
                            <span>{farmer.yearsActive} years farming</span>
                          </div>
                        </div>
                        {farmer.organic && <Badge type="organic" />}
                      </div>

                      <p className="text-[#3A4A3F]/70 text-sm leading-relaxed mb-5 italic">
                        "{farmer.bio}"
                      </p>

                      <div className="mb-5">
                        <div className="text-xs text-[#3A4A3F]/50 font-semibold uppercase tracking-wider mb-2">
                          Specialises in
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {farmer.specialty.map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1 bg-[#F5F1E8] rounded-full text-xs text-[#3A4A3F] font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#3A4A3F]/50">
                        <span className="font-medium text-[#87A878]">Delivers:</span>
                        {farmer.deliveryDays.join(", ")}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Link to={`/farmer/${farmer.id}`} className="flex-1">
                        <Button variant="primary" className="w-full justify-center">
                          View Profile
                        </Button>
                      </Link>
                      <Link to={`/marketplace?farmer=${farmer.id}`}>
                        <Button variant="outline">Shop Products</Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrent((c) => (c - 1 + farmers.length) % farmers.length)}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#3A4A3F] hover:bg-[#87A878] hover:text-white transition-colors"
                >
                  <ChevronLeft size={18} />
                </motion.button>

                <div className="flex gap-2">
                  {farmers.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-6 h-2.5 bg-[#87A878]"
                          : "w-2.5 h-2.5 bg-[#87A878]/30 hover:bg-[#87A878]/60"
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrent((c) => (c + 1) % farmers.length)}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#3A4A3F] hover:bg-[#87A878] hover:text-white transition-colors"
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
