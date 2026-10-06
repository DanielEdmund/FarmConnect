import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Grid3X3, List, Star, Clock } from "lucide-react";
import { products, categories, farmers } from "../data/mockData";
import { useStore } from "../context/StoreContext";
import {
  containerVariants,
  revealVariants,
  useScrollAnimation,
} from "../hooks/useScrollAnimation";
import Container from "../components/layout/Container";
import Badge from "../components/ui/Badge";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingCart, Heart, MapPin } from "lucide-react";

function ProductCard({ product }) {
  const isNew =
    Date.now() - new Date(product.harvestDate).getTime() < 48 * 3600 * 1000;
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const saved = wishlist.includes(product.id);

  return (
    <motion.div
      layout
      variants={revealVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white rounded-3xl overflow-hidden border border-[#87A878]/10 card-lift"
    >
      <div className="relative h-48">
        <Link to={`/product/${product.id}`} className="absolute inset-0 overflow-hidden block">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && <Badge type="featured" />}
            {isNew && <Badge type="fresh" />}
            {product.tags.includes("Organic") && <Badge type="organic" />}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-[#3A4A3F]/60 flex items-center justify-center">
              <span className="bg-white text-[#3A4A3F] text-xs font-bold px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </Link>
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
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={product.farmerAvatar}
            alt={product.farmerName}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-xs text-[#3A4A3F]/50">{product.farmerName}</span>
          <span className="ml-auto flex items-center gap-0.5 text-xs text-[#3A4A3F]/40">
            <MapPin size={9} />{product.origin}
          </span>
        </div>
        <h3 className="font-semibold text-[#3A4A3F] text-sm mb-2">
          <Link to={`/product/${product.id}`} className="hover:text-[#87A878] transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star size={11} className="text-[#D4A373]" fill="#D4A373" />
            <span className="text-xs font-semibold text-[#3A4A3F]">{product.rating}</span>
          </div>
          <span className="text-xs text-[#3A4A3F]/35">·</span>
          <div className="flex items-center gap-1 text-xs text-[#87A878]">
            <Clock size={10} />
            {new Date(product.harvestDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-display font-bold text-lg text-[#3A4A3F]">
              ₦{product.price.toLocaleString()}
            </div>
            <div className="text-xs text-[#3A4A3F]/40">{product.unit}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            aria-label={product.inStock ? `Add ${product.name} to cart` : "Out of stock"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              product.inStock
                ? "bg-[#87A878] hover:bg-[#6d8a61] text-white cursor-pointer"
                : "bg-[#87A878]/20 text-[#87A878]/40 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={13} /> Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const paramCat = searchParams.get("cat") || "all";
  const paramFarmer = searchParams.get("farmer") || "all";
  const paramQ = searchParams.get("q") || "";

  const [selectedCat, setSelectedCat] = useState(paramCat);
  const [search, setSearch] = useState(paramQ);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(paramFarmer);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [ref, inView] = useScrollAnimation();

  // Re-sync when the URL changes (navbar search, farmer "Shop", dropdown links)
  useEffect(() => {
    setSelectedCat(paramCat);
    setSearch(paramQ);
    setSelectedFarmer(paramFarmer);
  }, [paramCat, paramQ, paramFarmer]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCat = selectedCat === "all" || p.category === selectedCat;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.farmerName.toLowerCase().includes(search.toLowerCase());
      const matchesFarmer =
        selectedFarmer === "all" || p.farmerId === Number(selectedFarmer);
      const matchesStock = !inStockOnly || p.inStock;
      return matchesCat && matchesSearch && matchesFarmer && matchesStock;
    });

    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") result = [...result].sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
    else result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return result;
  }, [selectedCat, search, sortBy, selectedFarmer, inStockOnly]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-24 pb-16"
    >
      {/* Page Header */}
      <div className="bg-[#3A4A3F] py-16 mb-12">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-5xl font-bold text-[#F5F1E8] mb-2">
                Fresh Marketplace
              </h1>
              <p className="text-[#F5F1E8]/60">
                {filtered.length} products from {farmers.length} verified farmers
              </p>
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-4 py-3 w-full sm:w-72">
              <Search size={16} className="text-[#87A878] flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search produce or farmer..."
                className="bg-transparent text-[#F5F1E8] placeholder:text-[#F5F1E8]/30 text-sm outline-none flex-1"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={14} className="text-[#F5F1E8]/50" />
                </button>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all
                ${selectedCat === cat.id
                  ? "bg-[#87A878] text-white shadow-lg shadow-[#87A878]/30"
                  : "bg-white text-[#3A4A3F] hover:bg-[#87A878]/10 border border-[#87A878]/10"}`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border
                ${showFilters ? "bg-[#87A878] text-white border-[#87A878]" : "bg-white text-[#3A4A3F] border-[#87A878]/15 hover:border-[#87A878]/40"}`}
            >
              <SlidersHorizontal size={14} /> Filters
            </motion.button>
            {(selectedFarmer !== "all" || inStockOnly) && (
              <button
                onClick={() => { setSelectedFarmer("all"); setInStockOnly(false); }}
                className="text-xs text-[#C17C53] underline"
              >
                Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#3A4A3F]/50">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm text-[#3A4A3F] bg-white border border-[#87A878]/15 rounded-xl px-3 py-2 outline-none focus:border-[#87A878]"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Harvest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-3xl p-6 border border-[#87A878]/10 flex flex-wrap gap-8">
                <div>
                  <div className="text-sm font-semibold text-[#3A4A3F] mb-3">Filter by Farmer</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedFarmer("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        selectedFarmer === "all" ? "bg-[#3A4A3F] text-white" : "bg-[#F5F1E8] text-[#3A4A3F] hover:bg-[#87A878]/10"}`}
                    >
                      All Farmers
                    </button>
                    {farmers.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFarmer(String(f.id))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          selectedFarmer === String(f.id) ? "bg-[#87A878] text-white" : "bg-[#F5F1E8] text-[#3A4A3F] hover:bg-[#87A878]/10"}`}
                      >
                        <img src={f.avatar} alt={f.name} className="w-4 h-4 rounded-full object-cover" />
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#3A4A3F] mb-3">Availability</div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setInStockOnly(!inStockOnly)}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        inStockOnly ? "bg-[#87A878]" : "bg-[#3A4A3F]/20"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          inStockOnly ? "translate-x-5" : "translate-x-0.5"}`}
                      />
                    </div>
                    <span className="text-sm text-[#3A4A3F]">In stock only</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="font-display text-2xl text-[#3A4A3F] mb-2">No produce found</h3>
            <p className="text-[#3A4A3F]/50 text-sm">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>
    </motion.div>
  );
}
