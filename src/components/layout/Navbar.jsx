import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  ShoppingBag,
  Menu,
  X,
  User,
  Search,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Container from "./Container";
import Button from "../ui/Button";
import { useStore } from "../../context/StoreContext";

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/marketplace",
    label: "Marketplace",
    sub: [
      { href: "/marketplace?cat=Vegetables", label: "🥦 Vegetables" },
      { href: "/marketplace?cat=Fruits", label: "🍌 Fruits" },
      { href: "/marketplace?cat=Grains", label: "🌾 Grains" },
      { href: "/marketplace?cat=Herbs", label: "🌱 Herbs" },
    ],
  },
  { href: "/farmers", label: "Our Farmers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cartCount, user, signOut } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu & panels on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/marketplace?q=${encodeURIComponent(q)}` : "/marketplace");
    setSearchOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed top-0 inset-x-0 z-50 transition-all duration-300 glass
          ${scrolled
            ? "shadow-lg shadow-[#3A4A3F]/5 py-3"
            : "py-5"}
        `}
      >
        <Container>
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-9 h-9 bg-[#87A878] rounded-xl flex items-center justify-center shadow-md"
              >
                <Leaf size={20} className="text-white" strokeWidth={2.5} />
              </motion.div>
              <span className="font-display font-bold text-[#3A4A3F] text-xl leading-none">
                Farm<span className="text-[#87A878]">Connect</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.sub && setActiveDropdown(link.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.href}
                    className={`
                      flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium
                      transition-colors duration-200
                      ${pathname === link.href
                        ? "bg-[#87A878]/15 text-[#87A878]"
                        : "text-[#3A4A3F] hover:bg-[#87A878]/10 hover:text-[#87A878]"}
                    `}
                  >
                    {link.label}
                    {link.sub && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${activeDropdown === link.href ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.sub && activeDropdown === link.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-48 glass rounded-2xl shadow-xl overflow-hidden py-2"
                      >
                        {link.sub.map((s) => (
                          <Link
                            key={s.href}
                            to={s.href}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3A4A3F] hover:bg-[#87A878]/10 transition-colors"
                          >
                            {s.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen((s) => !s)}
                aria-label="Search the marketplace"
                className={`p-2 rounded-full transition-colors ${
                  searchOpen
                    ? "bg-[#87A878] text-white"
                    : "text-[#3A4A3F] hover:bg-[#87A878]/10"
                }`}
              >
                <Search size={18} />
              </motion.button>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label={`Cart with ${cartCount} items`}
                className="relative p-2 rounded-full text-[#3A4A3F] hover:bg-[#87A878]/10 transition-colors"
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="block"
                >
                  <ShoppingBag size={18} />
                </motion.span>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-[#C17C53] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Account */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountOpen((o) => !o)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#87A878]/12 hover:bg-[#87A878]/20 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#87A878] text-white text-xs font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-[#3A4A3F] max-w-[90px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`text-[#3A4A3F]/60 transition-transform ${accountOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl shadow-xl overflow-hidden py-2"
                      >
                        <div className="px-4 py-3 border-b border-[#87A878]/10">
                          <div className="text-sm font-semibold text-[#3A4A3F] truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-[#3A4A3F]/50 truncate">
                            {user.email}
                          </div>
                          <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-[#87A878]/15 text-[#5a8a4a] px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        </div>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3A4A3F] hover:bg-[#87A878]/10 transition-colors"
                        >
                          <LayoutDashboard size={15} /> Dashboard
                        </Link>
                        <Link
                          to="/cart"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3A4A3F] hover:bg-[#87A878]/10 transition-colors"
                        >
                          <ShoppingBag size={15} /> Cart ({cartCount})
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#C17C53] hover:bg-[#C17C53]/10 transition-colors"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/signin">
                  <Button size="sm" variant="primary">
                    <User size={14} />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center gap-1">
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-[#3A4A3F] hover:bg-[#87A878]/10"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-0.5 bg-[#C17C53] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl text-[#3A4A3F] hover:bg-[#87A878]/10"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </nav>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                onSubmit={submitSearch}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden hidden md:block"
              >
                <div className="flex items-center gap-3 mt-4 mb-1 bg-white border border-[#87A878]/20 rounded-2xl px-4 py-3">
                  <Search size={16} className="text-[#87A878]" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tomatoes, yam, farmers…"
                    className="flex-1 bg-transparent outline-none text-sm text-[#3A4A3F] placeholder:text-[#3A4A3F]/40"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSearchOpen(false);
                    }}
                    className="text-[#3A4A3F]/40 hover:text-[#3A4A3F]"
                    aria-label="Close search"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Container>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-40 w-72 glass shadow-2xl flex flex-col pt-20 pb-8 px-6"
          >
            <form onSubmit={submitSearch} className="mb-4">
              <div className="flex items-center gap-2 bg-white border border-[#87A878]/20 rounded-2xl px-3 py-2.5">
                <Search size={15} className="text-[#87A878]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search produce…"
                  className="flex-1 bg-transparent outline-none text-sm text-[#3A4A3F] placeholder:text-[#3A4A3F]/40 min-w-0"
                />
              </div>
            </form>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-2xl font-medium text-sm transition-colors
                    ${pathname === link.href
                      ? "bg-[#87A878] text-white"
                      : "text-[#3A4A3F] hover:bg-[#87A878]/10"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Link to="/cart" className="w-full">
                <Button variant="outline" className="w-full justify-center">
                  <ShoppingBag size={16} /> Cart ({cartCount})
                </Button>
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="w-full">
                    <Button variant="primary" className="w-full justify-center">
                      <LayoutDashboard size={16} /> Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                      navigate("/");
                    }}
                    className="text-sm font-semibold text-[#C17C53] py-2"
                  >
                    Sign Out ({user.name.split(" ")[0]})
                  </button>
                </>
              ) : (
                <Link to="/signin" className="w-full">
                  <Button variant="primary" className="w-full justify-center">
                    <User size={16} /> Sign In
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
