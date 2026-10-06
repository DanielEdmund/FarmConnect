import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, MapPin, ShieldCheck, Leaf, ArrowRight } from "lucide-react";
import { farmers } from "../data/mockData";
import { containerVariants, revealVariants, useScrollAnimation } from "../hooks/useScrollAnimation";
import Container from "../components/layout/Container";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

function FarmerCard({ farmer, index }) {
  return (
    <motion.div
      variants={revealVariants}
      custom={index}
      className="group bg-white rounded-3xl overflow-hidden border border-[#87A878]/10 card-lift"
    >
      {/* Cover */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={farmer.coverImage}
          alt={farmer.farm}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A4A3F]/70 via-transparent to-transparent" />
        {/* Avatar */}
        <div className="absolute bottom-4 left-4 flex items-end gap-3">
          <div className="w-14 h-14 rounded-2xl border-2 border-white overflow-hidden shadow-lg">
            <img src={farmer.avatar} alt={farmer.name} className="w-full h-full object-cover" />
          </div>
        </div>
        {farmer.verified && (
          <div className="absolute top-3 right-3">
            <Badge type="verified" label="Verified" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display font-bold text-lg text-[#3A4A3F] leading-tight">
              {farmer.name}
            </h3>
            <div className="text-xs text-[#C17C53] font-medium">{farmer.farm}</div>
          </div>
          {farmer.organic && <Badge type="organic" />}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star size={13} className="text-[#D4A373]" fill="#D4A373" />
            <span className="text-sm font-semibold text-[#3A4A3F]">{farmer.rating}</span>
            <span className="text-xs text-[#3A4A3F]/40">({farmer.reviewCount})</span>
          </div>
          <span className="text-[#3A4A3F]/30">·</span>
          <div className="flex items-center gap-1 text-xs text-[#3A4A3F]/50">
            <MapPin size={10} />
            {farmer.location}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {farmer.specialty.map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 bg-[#F5F1E8] text-[#3A4A3F] rounded-full font-medium">
              {s}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Link to={`/farmer/${farmer.id}`} className="flex-1">
            <Button variant="primary" className="w-full justify-center" size="sm">
              View Profile
            </Button>
          </Link>
          <Link to={`/marketplace?farmer=${farmer.id}`}>
            <Button variant="outline" size="sm" iconRight={<ArrowRight size={13} />}>
              Shop
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Farmers() {
  const [ref, inView] = useScrollAnimation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-24 pb-16"
    >
      {/* Header */}
      <div className="bg-[#3A4A3F] py-16 mb-12">
        <Container>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-[#87A878] text-sm font-semibold uppercase tracking-wider mb-3">
              <Leaf size={14} /> Our Community
            </span>
            <h1 className="font-display text-5xl font-bold text-[#F5F1E8] mb-4">
              Meet Our Farmers
            </h1>
            <p className="text-[#F5F1E8]/55 max-w-xl mx-auto">
              {farmers.length} verified farmers across Nigeria. Real people, real farms, real food.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {farmers.map((farmer, i) => (
            <FarmerCard key={farmer.id} farmer={farmer} index={i} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-[#87A878]/10 rounded-3xl p-12 text-center border border-[#87A878]/20"
        >
          <Leaf size={40} className="text-[#87A878] mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-[#3A4A3F] mb-3">
            Are You a Farmer?
          </h2>
          <p className="text-[#3A4A3F]/60 mb-6 max-w-md mx-auto">
            Join 1,200+ farmers earning 40–60% more by selling directly to households,
            restaurants, and bulk buyers near you.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Apply to Sell on FarmConnect
            </Button>
          </Link>
        </motion.div>
      </Container>
    </motion.div>
  );
}
