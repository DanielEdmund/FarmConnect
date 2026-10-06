import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock, ShoppingCart, Heart } from "lucide-react";
import { products } from "../../data/mockData";
import { useStore } from "../../context/StoreContext";
import {
  useScrollAnimation,
  containerVariants,
  revealVariants,
} from "../../hooks/useScrollAnimation";
import Container from "../layout/Container";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function ProductCard({ product, index }) {
  const isNew = Date.now() - new Date(product.harvestDate).getTime() < 48 * 3600 * 1000;
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const saved = wishlist.includes(product.id);

  return (
    <motion.div
      variants={revealVariants}
      custom={index}
      className="group bg-white rounded-3xl overflow-hidden border border-[#87A878]/10 card-lift"
    >
      {/* Image */}
      <div className="relative h-52">
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 overflow-hidden block"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && <Badge type="featured" />}
            {isNew && <Badge type="fresh" />}
            {product.tags.includes("Organic") && <Badge type="organic" />}
          </div>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-[#3A4A3F]/60 flex items-center justify-center">
              <span className="bg-white text-[#3A4A3F] text-xs font-bold px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Wishlist (sibling of the link so it stays clickable) */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleWishlist(product.id)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10"
        >
          <Heart
            size={15}
            className={saved ? "text-red-500" : "text-[#C17C53]"}
            fill={saved ? "#ef4444" : "none"}
          />
        </motion.button>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Farmer */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={product.farmerAvatar}
            alt={product.farmerName}
            className="w-6 h-6 rounded-full object-cover border border-[#87A878]/20"
          />
          <span className="text-xs text-[#3A4A3F]/55 font-medium">{product.farmerName}</span>
          <span className="ml-auto flex items-center gap-0.5 text-xs text-[#3A4A3F]/50">
            <MapPin size={10} />
            {product.origin}
          </span>
        </div>

        <h3 className="font-semibold text-[#3A4A3F] text-base mb-1 leading-tight">
          <Link to={`/product/${product.id}`} className="hover:text-[#87A878] transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Rating + harvest */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-[#D4A373]" fill="#D4A373" />
            <span className="text-xs font-semibold text-[#3A4A3F]">{product.rating}</span>
            <span className="text-xs text-[#3A4A3F]/40">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#87A878]">
            <Clock size={10} />
            {new Date(product.harvestDate).toLocaleDateString("en-NG", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-display font-bold text-xl text-[#3A4A3F]">
              ₦{product.price.toLocaleString()}
            </div>
            <div className="text-xs text-[#3A4A3F]/45">{product.unit}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            aria-label={product.inStock ? `Add ${product.name} to cart` : "Out of stock"}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
              product.inStock
                ? "bg-[#87A878] hover:bg-[#6d8a61] text-white cursor-pointer"
                : "bg-[#87A878]/20 text-[#87A878]/40 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={14} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductGrid({ limit = 6, title = "Fresh From the Farm" }) {
  const [ref, inView] = useScrollAnimation();
  const displayProducts = products.slice(0, limit);

  return (
    <section className="py-24 bg-white">
      <Container>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div
            variants={revealVariants}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="text-[#C17C53] text-sm font-semibold uppercase tracking-wider">
                Today's Harvest
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#3A4A3F] mt-1">
                {title}
              </h2>
            </div>
            <Link to="/marketplace">
              <Button variant="outline">
                View All Products
              </Button>
            </Link>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
