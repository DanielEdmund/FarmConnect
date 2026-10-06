import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Star, ShieldCheck, Truck, MessageCircle,
  Calendar, Package, ArrowLeft
} from "lucide-react";
import { farmers, products } from "../data/mockData";
import { useStore } from "../context/StoreContext";
import { containerVariants, revealVariants, useScrollAnimation } from "../hooks/useScrollAnimation";
import Container from "../components/layout/Container";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { ShoppingCart } from "lucide-react";

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.floor(rating) ? "text-[#D4A373]" : "text-[#D4A373]/20"}
            fill={i < Math.floor(rating) ? "#D4A373" : "none"}
          />
        ))}
      </div>
      <span className="font-semibold text-sm text-[#3A4A3F]">{rating}</span>
      {count && <span className="text-sm text-[#3A4A3F]/40">({count} reviews)</span>}
    </div>
  );
}

export default function FarmerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openThreadWith, toggleConnect, connections, addToCart } = useStore();
  const farmer = farmers.find((f) => f.id === Number(id)) || farmers[0];
  const farmerProducts = products.filter((p) => p.farmerId === farmer.id);
  const [ref, inView] = useScrollAnimation();
  const connected = connections.includes(farmer.id);

  const handleMessage = () => {
    navigate(`/dashboard?tab=messages&thread=${openThreadWith(farmer.id)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-20 pb-16"
    >
      {/* Cover */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={farmer.coverImage}
          alt={farmer.farm}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A4A3F]/80 via-[#3A4A3F]/20 to-transparent" />

        {/* Back */}
        <Link
          to="/farmers"
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} /> All Farmers
        </Link>

        {/* Farmer info overlay */}
        <div className="absolute bottom-0 inset-x-0 px-6 pb-8 max-w-7xl mx-auto">
          <div className="flex items-end gap-5">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white overflow-hidden shadow-2xl flex-shrink-0"
            >
              <img src={farmer.avatar} alt={farmer.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="text-white mb-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-3xl sm:text-4xl font-bold">{farmer.name}</h1>
                {farmer.verified && <ShieldCheck size={20} className="text-[#87A878]" />}
              </div>
              <div className="text-white/70 flex items-center gap-2 text-sm">
                <MapPin size={13} /> {farmer.location}
                <span className="mx-1">·</span>
                {farmer.farm}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container className="mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border border-[#87A878]/10"
            >
              <h2 className="font-display text-2xl font-bold text-[#3A4A3F] mb-4">
                My Story
              </h2>
              <p className="text-[#3A4A3F]/70 leading-relaxed text-base italic">
                "{farmer.bio}"
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {farmer.badges.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1.5 bg-[#F5F1E8] text-[#3A4A3F] text-xs font-semibold rounded-full"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { label: "Years Farming", value: farmer.yearsActive, icon: Calendar },
                { label: "Reviews", value: farmer.reviewCount, icon: Star },
                { label: "Products", value: farmerProducts.length, icon: Package },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-3xl p-6 border border-[#87A878]/10 text-center">
                  <div className="w-10 h-10 bg-[#87A878]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon size={18} className="text-[#87A878]" />
                  </div>
                  <div className="font-display font-bold text-2xl text-[#3A4A3F]">{value}</div>
                  <div className="text-xs text-[#3A4A3F]/50 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>

            {/* Products */}
            <div>
              <h2 className="font-display text-2xl font-bold text-[#3A4A3F] mb-5">
                Available Products
              </h2>
              <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="grid sm:grid-cols-2 gap-4"
              >
                {farmerProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={revealVariants}
                    className="bg-white rounded-3xl overflow-hidden border border-[#87A878]/10 card-lift flex"
                  >
                    <div className="w-28 flex-shrink-0 overflow-hidden">
                      <Link to={`/product/${product.id}`} className="block h-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-semibold text-[#3A4A3F] text-sm">
                          <Link to={`/product/${product.id}`} className="hover:text-[#87A878] transition-colors">
                            {product.name}
                          </Link>
                        </h3>
                        <StarRating rating={product.rating} />
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <div className="font-bold text-[#3A4A3F]">₦{product.price.toLocaleString()}</div>
                          <div className="text-xs text-[#3A4A3F]/40">{product.unit}</div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={!product.inStock}
                          onClick={() => addToCart(product)}
                          aria-label={product.inStock ? `Add ${product.name} to cart` : "Out of stock"}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                            product.inStock
                              ? "bg-[#87A878] text-white cursor-pointer"
                              : "bg-[#87A878]/20 text-[#87A878]/40 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart size={12} /> Add
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Rating card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 border border-[#87A878]/10 sticky top-28"
            >
              <StarRating rating={farmer.rating} count={farmer.reviewCount} />

              <div className="mt-5 space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const fakePercent = [72, 18, 6, 2, 2][5 - star];
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs text-[#3A4A3F]/50 w-4">{star}</span>
                      <Star size={11} className="text-[#D4A373]" fill="#D4A373" />
                      <div className="flex-1 bg-[#F5F1E8] rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${fakePercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                          className="h-full bg-[#D4A373] rounded-full"
                        />
                      </div>
                      <span className="text-xs text-[#3A4A3F]/40 w-6">{fakePercent}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <Link to={`/marketplace?farmer=${farmer.id}`} className="block">
                  <Button variant="primary" className="w-full justify-center">
                    <ShoppingCart size={15} /> Shop Products
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={handleMessage}
                >
                  <MessageCircle size={15} /> Message Farmer
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-center border-2 border-[#87A878]/20"
                  onClick={() => toggleConnect(farmer.id, farmer.name)}
                >
                  {connected ? "✓ Connected" : "Connect with Farmer"}
                </Button>
              </div>

              {/* Delivery */}
              <div className="mt-6 pt-5 border-t border-[#87A878]/10">
                <div className="text-xs text-[#3A4A3F]/50 font-semibold uppercase tracking-wider mb-2">
                  Delivery Schedule
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                    <span
                      key={d}
                      className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        farmer.deliveryDays.includes(d)
                          ? "bg-[#87A878] text-white"
                          : "bg-[#F5F1E8] text-[#3A4A3F]/30"
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-[#3A4A3F]/50">
                  <Truck size={12} className="text-[#87A878]" />
                  Min. order: ₦{farmer.minOrder.toLocaleString()}
                </div>
              </div>

              {/* Badges */}
              <div className="mt-5 flex flex-wrap gap-2">
                {farmer.organic && <Badge type="organic" />}
                <Badge type="verified" />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
