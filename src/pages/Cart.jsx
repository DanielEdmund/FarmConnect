import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle,
  Leaf,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";

const DELIVERY_FEE = 1500;
const FREE_DELIVERY_AT = 25000;

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-[#87A878]/10 p-12 text-center"
    >
      <div className="w-20 h-20 bg-[#87A878]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={32} className="text-[#87A878]" />
      </div>
      <h2 className="font-display text-3xl font-bold text-[#3A4A3F] mb-3">
        Your basket is empty
      </h2>
      <p className="text-[#3A4A3F]/55 max-w-sm mx-auto mb-8">
        Fresh tomatoes, greens, yams and more are waiting for you at the
        marketplace — harvested as recently as this morning.
      </p>
      <Link to="/marketplace">
        <Button size="lg" variant="primary" iconRight={<ArrowRight size={16} />}>
          Browse Fresh Produce
        </Button>
      </Link>
    </motion.div>
  );
}

export default function Cart() {
  const {
    cart,
    cartSubtotal,
    setQty,
    removeFromCart,
    toggleWishlist,
    wishlist,
    user,
    placeOrder,
    notify,
  } = useStore();
  const navigate = useNavigate();

  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const discount = appliedPromo ? Math.round(cartSubtotal * appliedPromo.percent) : 0;
  const discounted = cartSubtotal - discount;
  const delivery =
    cart.length === 0 || discounted >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
  const total = discounted + delivery;

  const applyPromo = () => {
    const codes = { FRESH10: 0.1, HARVEST15: 0.15 };
    const code = promo.trim().toUpperCase();
    if (codes[code]) {
      setAppliedPromo({ code, percent: codes[code] });
      setPromoError("");
      notify(`${code} applied — you saved ${codes[code] * 100}%`);
    } else {
      setAppliedPromo(null);
      setPromoError("That code isn't valid. Try FRESH10.");
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/signin?redirect=/cart&intent=checkout");
      return;
    }
    const order = placeOrder();
    setPlacedOrder(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Order confirmed ─────────────────────────────────────────────── */
  if (placedOrder) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen pt-24 pb-16"
      >
        <Container className="max-w-2xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white rounded-[2rem] border border-[#87A878]/10 p-10 text-center shadow-xl shadow-[#3A4A3F]/5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
              className="w-20 h-20 bg-[#87A878] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={40} className="text-white" />
            </motion.div>
            <h1 className="font-display text-4xl font-bold text-[#3A4A3F] mb-3">
              Order Confirmed! 🌾
            </h1>
            <p className="text-[#3A4A3F]/60 mb-2">
              Order <span className="font-semibold text-[#3A4A3F]">{placedOrder.id}</span>{" "}
              has been sent to {placedOrder.farmer}.
            </p>
            <p className="text-[#3A4A3F]/50 text-sm mb-8">
              Farm-to-table delivery typically takes 18 hours. You'll get updates
              as your produce moves.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              <div className="bg-[#F5F1E8] rounded-2xl p-4">
                <div className="font-display font-bold text-[#3A4A3F] text-lg">
                  ₦{placedOrder.total.toLocaleString()}
                </div>
                <div className="text-xs text-[#3A4A3F]/50 mt-0.5">Total Paid</div>
              </div>
              <div className="bg-[#F5F1E8] rounded-2xl p-4">
                <div className="font-display font-bold text-[#3A4A3F] text-lg">
                  {placedOrder.items.reduce((s, i) => s + i.qty, 0)}
                </div>
                <div className="text-xs text-[#3A4A3F]/50 mt-0.5">Items</div>
              </div>
              <div className="bg-[#F5F1E8] rounded-2xl p-4">
                <div className="font-display font-bold text-[#3A4A3F] text-lg">
                  18 hrs
                </div>
                <div className="text-xs text-[#3A4A3F]/50 mt-0.5">To Your Door</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard?tab=orders">
                <Button variant="primary" className="justify-center w-full sm:w-auto">
                  Track in Dashboard
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className="justify-center w-full sm:w-auto">
                  Keep Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </motion.div>
    );
  }

  /* ── Cart ────────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-24 pb-16"
    >
      {/* Header */}
      <div className="bg-[#3A4A3F] py-14 mb-12">
        <Container>
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-2 text-[#87A878] text-sm font-semibold uppercase tracking-wider mb-2">
                <ShoppingBag size={14} /> Your Basket
              </span>
              <h1 className="font-display text-5xl font-bold text-[#F5F1E8]">
                Cart ({cart.length})
              </h1>
            </div>
            <p className="text-[#F5F1E8]/55 text-sm max-w-xs">
              {cart.length > 0
                ? "Prices are locked for 60 minutes — farmers confirm harvest right after checkout."
                : "Nothing here yet. Let's fix that."}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence initial={false}>
                {cart.map(({ product, qty }) => {
                  const saved = wishlist.includes(product.id);
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                      className="bg-white rounded-3xl border border-[#87A878]/10 p-4 sm:p-5 flex gap-4 items-center"
                    >
                      <Link
                        to={`/product/${product.id}`}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              to={`/product/${product.id}`}
                              className="font-semibold text-[#3A4A3F] hover:text-[#87A878] transition-colors leading-tight block truncate"
                            >
                              {product.name}
                            </Link>
                            <Link
                              to={`/farmer/${product.farmerId}`}
                              className="text-xs text-[#3A4A3F]/50 hover:text-[#87A878] transition-colors"
                            >
                              by {product.farmerName} · {product.origin}
                            </Link>
                          </div>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            aria-label={`Remove ${product.name} from cart`}
                            className="p-2 rounded-xl text-[#3A4A3F]/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-end justify-between gap-3 mt-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-[#F5F1E8] rounded-xl px-2.5 py-1.5">
                              <button
                                onClick={() => setQty(product.id, qty - 1)}
                                aria-label="Decrease quantity"
                                className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#3A4A3F] font-bold text-sm shadow-sm hover:bg-[#87A878] hover:text-white transition-colors"
                              >
                                −
                              </button>
                              <span className="font-bold text-[#3A4A3F] text-sm w-5 text-center">
                                {qty}
                              </span>
                              <button
                                onClick={() => setQty(product.id, qty + 1)}
                                aria-label="Increase quantity"
                                className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#3A4A3F] font-bold text-sm shadow-sm hover:bg-[#87A878] hover:text-white transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              className="flex items-center gap-1.5 text-xs text-[#3A4A3F]/50 hover:text-[#C17C53] transition-colors"
                            >
                              <Heart
                                size={14}
                                fill={saved ? "#C17C53" : "none"}
                                className={saved ? "text-[#C17C53]" : ""}
                              />
                              {saved ? "Saved" : "Save for later"}
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-display font-bold text-lg text-[#3A4A3F]">
                              ₦{(product.price * qty).toLocaleString()}
                            </div>
                            <div className="text-xs text-[#3A4A3F]/40">
                              ₦{product.price.toLocaleString()} {product.unit}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                <Link
                  to="/marketplace"
                  className="text-sm text-[#87A878] font-semibold hover:underline"
                >
                  ← Continue shopping
                </Link>
                <Link
                  to="/dashboard?tab=wishlist"
                  className="text-sm text-[#C17C53] font-semibold hover:underline"
                >
                  View wishlist ({wishlist.length})
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl border border-[#87A878]/10 p-6 sticky top-28"
              >
                <h2 className="font-display text-xl font-bold text-[#3A4A3F] mb-5">
                  Order Summary
                </h2>

                {/* Promo */}
                <div className="mb-5">
                  <div className="flex gap-2">
                    <input
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-[#F5F1E8] border-2 border-transparent focus:border-[#87A878] outline-none text-sm text-[#3A4A3F] placeholder:text-[#3A4A3F]/40 transition-colors"
                    />
                    <button
                      onClick={applyPromo}
                      className="px-4 py-2.5 rounded-xl bg-[#3A4A3F] text-white text-sm font-semibold hover:bg-[#87A878] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-xs text-[#87A878] font-medium mt-2 flex items-center gap-1">
                      <Tag size={12} /> {appliedPromo.code} applied —{" "}
                      {appliedPromo.percent * 100}% off
                    </p>
                  )}
                  {promoError && (
                    <p className="text-xs text-red-500 mt-2">{promoError}</p>
                  )}
                </div>

                <div className="space-y-3 text-sm border-t border-[#87A878]/10 pt-4">
                  <div className="flex justify-between text-[#3A4A3F]/65">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#3A4A3F]">
                      ₦{cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#87A878]">
                      <span>Discount</span>
                      <span className="font-semibold">
                        −₦{discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#3A4A3F]/65">
                    <span className="flex items-center gap-1.5">
                      <Truck size={13} /> Delivery
                    </span>
                    <span className="font-semibold text-[#3A4A3F]">
                      {delivery === 0 ? "Free" : `₦${delivery.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#87A878]/10">
                    <span className="font-semibold text-[#3A4A3F]">Total</span>
                    <span className="font-display font-bold text-xl text-[#3A4A3F]">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {delivery > 0 && (
                  <div className="mt-4 bg-[#87A878]/10 rounded-xl p-3 text-xs text-[#3A4A3F]/70">
                    Add{" "}
                    <span className="font-semibold text-[#87A878]">
                      ₦{(FREE_DELIVERY_AT - discounted).toLocaleString()}
                    </span>{" "}
                    more for free delivery.
                  </div>
                )}

                <div className="mt-5">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                    iconRight={<ArrowRight size={16} />}
                    onClick={handleCheckout}
                  >
                    {user ? "Checkout" : "Sign In to Checkout"}
                  </Button>
                </div>

                {!user && (
                  <p className="text-xs text-[#3A4A3F]/45 text-center mt-3">
                    New here? Sign in takes 10 seconds — all mock, no card needed.
                  </p>
                )}

                <div className="mt-5 pt-4 border-t border-[#87A878]/10 space-y-2 text-xs text-[#3A4A3F]/55">
                  <div className="flex items-center gap-2">
                    <Truck size={13} className="text-[#87A878]" /> Delivered within
                    18 hrs of harvest
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className="text-[#87A878]" /> Quality
                    guaranteed or full refund
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf size={13} className="text-[#87A878]" /> 100% of the price
                    goes to the farmer
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </Container>
    </motion.div>
  );
}
