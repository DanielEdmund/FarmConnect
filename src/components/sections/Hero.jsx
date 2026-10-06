import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Leaf } from "lucide-react";
import Button from "../ui/Button";
import Container from "../layout/Container";

const HeroStats = ({ value, label }) => (
  <div className="text-center">
    <div className="font-display font-bold text-2xl text-[#3A4A3F]">{value}</div>
    <div className="text-xs text-[#3A4A3F]/60 mt-0.5">{label}</div>
  </div>
);

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1800&h=1000&fit=crop"
          alt="Nigerian farm landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3A4A3F]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3A4A3F]/85 via-[#3A4A3F]/60 to-[#3A4A3F]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A4A3F]/70 via-transparent to-transparent" />
      </motion.div>

      {/* Floating organic blob decorations */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-[10%] w-64 h-64 bg-[#87A878]/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[20%] w-48 h-48 bg-[#D4A373]/15 rounded-full blur-2xl pointer-events-none"
      />

      <Container className="relative z-10 pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Tag line */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold mb-6"
          >
            <Leaf size={14} className="text-[#87A878]" />
            Nigeria's Freshest Farm Marketplace
            <span className="w-1.5 h-1.5 bg-[#87A878] rounded-full animate-pulse-gentle" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-shadow-hero leading-[1.05] mb-6"
          >
            From the{" "}
            <span className="relative inline-block">
              <span className="shimmer-text">Farm</span>
            </span>
            <br />
            to Your Table,{" "}
            <span className="text-[#87A878]">Fresh.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white font-semibold text-shadow-hero-sm text-lg sm:text-xl max-w-xl leading-relaxed mb-8"
          >
            Connect directly with small-scale Nigerian farmers. Buy fresh, support
            local, skip the middleman. Real food, real farmers, real community.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/marketplace">
              <Button size="lg" variant="primary" iconRight={<ArrowRight size={18} />}>
                Shop Fresh Produce
              </Button>
            </Link>
            <Link to="/farmers">
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/15 border border-white/30"
              >
                Meet Our Farmers
              </Button>
            </Link>
          </motion.div>

          {/* Location hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-6 flex items-center gap-2 text-white/85 font-medium text-sm"
          >
            <MapPin size={14} />
            Delivering across 22 Nigerian states
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-16 glass rounded-3xl p-6 max-w-lg"
        >
          <div className="grid grid-cols-3 divide-x divide-[#3A4A3F]/10">
            <HeroStats value="1,240+" label="Farmers" />
            <HeroStats value="48k+" label="Orders Delivered" />
            <HeroStats value="18 hrs" label="Avg. Farm-to-Table" />
          </div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
