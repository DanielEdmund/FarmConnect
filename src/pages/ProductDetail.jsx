import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, MapPin, Clock, ShoppingCart, Heart, Share2,
  Truck, ShieldCheck, ArrowLeft, ChevronLeft, ChevronRight,
  MessageCircle, Leaf, Package
} from "lucide-react";
import { products, farmers } from "../data/mockData";
import { useStore } from "../context/StoreContext";
import { revealVariants, containerVariants, useScrollAnimation } from "../hooks/useScrollAnimation";
import Container from "../components/layout/Container";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const additionalImages = [
  "https://images.unsplash.com/photo-1467453678174-768ec283a940?w=600&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=500&fit=crop",
];

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const farmer = farmers.find((f) => f.id === product.farmerId);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [ref, inView] = useScrollAnimation();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist, notify, openThreadWith } = useStore();
  const wishlisted = wishlist.includes(product.id);
  const allImages = [product.image, ...additionalImages];
  const isNew = Date.now() - new Date(product.harvestDate).getTime() < 48 * 3600 * 1000;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      notify("Product link copied to clipboard", "info");
    } catch {
      notify("Sharing was cancelled", "info");
    }
  };

  const handleMessage = () => {
    const threadId = openThreadWith(product.farmerId);
    navigate(`/dashboard?tab=messages&thread=${threadId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-24 pb-16"
    >
      <Container>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#3A4A3F]/50 mb-8">
          <Link to="/" className="hover:text-[#87A878] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-[#87A878] transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-[#3A4A3F]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-3xl aspect-square mb-4 bg-[#F5F1E8]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImg}
                  src={allImages[selectedImg]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Nav arrows */}
              <button
                onClick={() => setSelectedImg((i) => (i - 1 + allImages.length) % allImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setSelectedImg((i) => (i + 1) % allImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
              >
                <Heart
                  size={18}
                  className={wishlisted ? "text-red-500" : "text-[#C17C53]"}
                  fill={wishlisted ? "#ef4444" : "none"}
                />
              </motion.button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    i === selectedImg ? "border-[#87A878] shadow-md" : "border-transparent opacity-60"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.featured && <Badge type="featured" />}
              {isNew && <Badge type="fresh" />}
              {product.tags.includes("Organic") && <Badge type="organic" />}
            </div>

            <h1 className="font-display text-4xl font-bold text-[#3A4A3F] mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? "text-[#D4A373]" : "text-[#D4A373]/20"}
                    fill={i < Math.floor(product.rating) ? "#D4A373" : "none"}
                  />
                ))}
              </div>
              <span className="font-semibold text-[#3A4A3F]">{product.rating}</span>
              <span className="text-[#3A4A3F]/40">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="font-display text-4xl font-bold text-[#3A4A3F]">
                ₦{product.price.toLocaleString()}
              </span>
              <span className="text-[#3A4A3F]/50 ml-2 text-sm">{product.unit}</span>
            </div>

            {/* Description */}
            <p className="text-[#3A4A3F]/65 leading-relaxed mb-6">{product.description}</p>

            {/* Harvest info */}
            <div className="bg-[#E8F4F8] rounded-2xl p-4 mb-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#87A878]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Leaf size={18} className="text-[#87A878]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#3A4A3F]">Harvest Date</div>
                <div className="text-xs text-[#3A4A3F]/55">
                  {new Date(product.harvestDate).toLocaleDateString("en-NG", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric"
                  })}
                </div>
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 bg-[#F5F1E8] rounded-2xl px-4 py-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#3A4A3F] font-bold text-lg shadow-sm hover:bg-[#87A878] hover:text-white transition-colors"
                >
                  −
                </button>
                <span className="font-bold text-[#3A4A3F] text-lg w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#3A4A3F] font-bold text-lg shadow-sm hover:bg-[#87A878] hover:text-white transition-colors"
                >
                  +
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.button
                  key={addedToCart ? "added" : "add"}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-colors
                    ${addedToCart
                      ? "bg-[#3A4A3F] text-white"
                      : product.inStock
                        ? "bg-[#87A878] hover:bg-[#6d8a61] text-white cursor-pointer"
                        : "bg-[#87A878]/20 text-[#87A878]/40 cursor-not-allowed"}`}
                >
                  {addedToCart ? (
                    <> ✓ Added to Cart</>
                  ) : (
                    <><ShoppingCart size={16} /> Add to Cart — ₦{(product.price * qty).toLocaleString()}</>
                  )}
                </motion.button>
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                aria-label="Share this product"
                className="p-3.5 rounded-2xl border border-[#87A878]/20 text-[#3A4A3F] hover:border-[#87A878]/40 transition-colors"
              >
                <Share2 size={16} />
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-5 border-t border-[#87A878]/10">
              {[
                { icon: Truck, text: "Farm-fresh delivery in 24hrs" },
                { icon: ShieldCheck, text: "Quality guaranteed" },
                { icon: Package, text: "Secure packaging" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-[#3A4A3F]/55">
                  <Icon size={14} className="text-[#87A878]" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Farmer card */}
        {farmer && (
          <motion.div
            ref={ref}
            variants={revealVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="bg-[#3A4A3F] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="w-20 h-20 rounded-2xl border-2 border-[#87A878]/40 object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display text-xl font-bold">{farmer.name}</h3>
                {farmer.verified && <ShieldCheck size={16} className="text-[#87A878]" />}
              </div>
              <p className="text-white/60 text-sm flex items-center gap-1 mb-1">
                <MapPin size={12} /> {farmer.location}
              </p>
              <div className="flex items-center gap-1">
                <Star size={13} className="text-[#D4A373]" fill="#D4A373" />
                <span className="text-sm font-semibold">{farmer.rating}</span>
                <span className="text-white/40 text-sm">· {farmer.yearsActive} years farming</span>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to={`/farmer/${farmer.id}`}>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View Profile
                </Button>
              </Link>
              <Button variant="primary" icon={<MessageCircle size={15} />} onClick={handleMessage}>
                Message
              </Button>
            </div>
          </motion.div>
        )}
      </Container>
    </motion.div>
  );
}
