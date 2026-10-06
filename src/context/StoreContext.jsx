import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, ShoppingBag, X } from "lucide-react";
import {
  products,
  messageThreads as seedThreads,
  mockOrders,
} from "../data/mockData";

const StoreContext = createContext(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
};

/* ── localStorage helpers ─────────────────────────────────────────────── */
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — state still works in-memory */
  }
};

export const getProduct = (id) => products.find((p) => p.id === Number(id));

/* ── Provider ─────────────────────────────────────────────────────────── */
export default function StoreProvider({ children }) {
  // Cart & wishlist
  const [cart, setCart] = useState(() => load("fc.cart", []));
  const [wishlist, setWishlist] = useState(() => load("fc.wishlist", []));

  // Auth
  const [user, setUser] = useState(() => load("fc.user", null));

  // Community
  const [connections, setConnections] = useState(() => load("fc.connections", []));
  const [joinedGroups, setJoinedGroups] = useState(() => load("fc.groups", []));
  const [likedPosts, setLikedPosts] = useState(() => load("fc.likes", []));
  const [extraComments, setExtraComments] = useState(() => load("fc.comments", {}));
  const [threads, setThreads] = useState(seedThreads);
  const [orders, setOrders] = useState(mockOrders);

  // Toasts
  const [toasts, setToasts] = useState([]);

  useEffect(() => save("fc.cart", cart), [cart]);
  useEffect(() => save("fc.wishlist", wishlist), [wishlist]);
  useEffect(() => save("fc.user", user), [user]);
  useEffect(() => save("fc.connections", connections), [connections]);
  useEffect(() => save("fc.groups", joinedGroups), [joinedGroups]);
  useEffect(() => save("fc.likes", likedPosts), [likedPosts]);
  useEffect(() => save("fc.comments", extraComments), [extraComments]);

  /* ── Toasts ────────────────────────────────────────────────────────── */
  const notify = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  /* ── Cart ──────────────────────────────────────────────────────────── */
  const addToCart = useCallback(
    (product, qty = 1) => {
      const p = typeof product === "number" ? getProduct(product) : product;
      if (!p || !p.inStock) return;
      setCart((c) => {
        const found = c.find((i) => i.id === p.id);
        if (found) {
          return c.map((i) =>
            i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, 20) } : i
          );
        }
        return [...c, { id: p.id, qty }];
      });
      notify(`${p.name} added to your cart`);
    },
    [notify]
  );

  const setQty = useCallback((id, qty) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((i) => i.id !== id)
        : c.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 20) } : i))
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((c) => c.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartDetails = useMemo(
    () =>
      cart
        .map((item) => ({ ...item, product: getProduct(item.id) }))
        .filter((i) => i.product),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cartDetails.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    [cartDetails]
  );

  /* ── Wishlist ──────────────────────────────────────────────────────── */
  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((w) => {
        const on = w.includes(id);
        notify(
          on ? "Removed from wishlist" : "Saved to your wishlist",
          "info"
        );
        return on ? w.filter((x) => x !== id) : [...w, id];
      });
    },
    [notify]
  );

  /* ── Auth ──────────────────────────────────────────────────────────── */
  const signIn = useCallback(
    ({ name, email, role = "Buyer" }) => {
      const next = {
        name: name?.trim() || "Amara Okafor",
        email: email?.trim() || "amara@farmconnect.ng",
        role,
        joined: new Date().toISOString(),
      };
      setUser(next);
      notify(`Welcome back, ${next.name.split(" ")[0]}! 🌾`);
      return next;
    },
    [notify]
  );

  const signOut = useCallback(() => {
    setUser(null);
    notify("You've been signed out", "info");
  }, [notify]);

  /* ── Community ─────────────────────────────────────────────────────── */
  const toggleConnect = useCallback(
    (farmerId, name = "Farmer") => {
      setConnections((list) => {
        const on = list.includes(farmerId);
        notify(
          on ? `You unfollowed ${name}` : `You're now connected with ${name}`,
          "info"
        );
        return on ? list.filter((x) => x !== farmerId) : [...list, farmerId];
      });
    },
    [notify]
  );

  const toggleGroup = useCallback(
    (groupId, name = "group") => {
      setJoinedGroups((list) => {
        const on = list.includes(groupId);
        notify(on ? `Left ${name}` : `Joined ${name}`, "info");
        return on ? list.filter((x) => x !== groupId) : [...list, groupId];
      });
    },
    [notify]
  );

  const toggleLike = useCallback((postId) => {
    setLikedPosts((list) =>
      list.includes(postId) ? list.filter((x) => x !== postId) : [...list, postId]
    );
  }, []);

  const addComment = useCallback(
    (postId, text) => {
      if (!text.trim()) return;
      const comment = {
        id: Date.now(),
        name: user?.name || "You",
        avatar:
          "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face",
        text: text.trim(),
        time: "Just now",
      };
      setExtraComments((all) => ({
        ...all,
        [postId]: [...(all[postId] || []), comment],
      }));
    },
    [user]
  );

  const getComments = useCallback(
    (post) => [...(post.comments || []), ...(extraComments[post.id] || [])],
    [extraComments]
  );

  /* ── Messages ──────────────────────────────────────────────────────── */
  const sendMessage = useCallback(
    (threadId, text) => {
      if (!text.trim()) return;
      const outbound = {
        id: Date.now(),
        from: "me",
        text: text.trim(),
        time: "Just now",
      };
      setThreads((list) =>
        list.map((t) =>
          t.id === threadId ? { ...t, messages: [...t.messages, outbound] } : t
        )
      );

      // Simulated farmer reply so the chat feels alive (mock data only)
      const replies = [
        "Noted! I'll confirm that within the hour 🌾",
        "Sure, I can sort that out for you.",
        "Let me check the harvest schedule and get back to you.",
        "Absolutely — I'll add it to your next delivery.",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setTimeout(() => {
        setThreads((list) =>
          list.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  messages: [
                    ...t.messages,
                    {
                      id: Date.now() + 1,
                      from: "them",
                      text: reply,
                      time: "Just now",
                    },
                  ],
                }
              : t
          )
        );
      }, 1200);
    },
    []
  );

  const openThreadWith = useCallback((farmerId) => {
    const existing = seedThreads.find((t) => t.farmerId === farmerId);
    return existing ? existing.id : seedThreads[0].id;
  }, []);

  /* ── Orders ────────────────────────────────────────────────────────── */
  const placeOrder = useCallback(() => {
    const items = cartDetails.map((i) => ({ productId: i.id, qty: i.qty }));
    const total = cartSubtotal + (cartSubtotal > 25000 || cartSubtotal === 0 ? 0 : 1500);
    const order = {
      id: `FC-${Math.floor(10600 + Math.random() * 300)}`,
      date: new Date().toISOString().slice(0, 10),
      items,
      total,
      status: "Processing",
      farmer: cartDetails[0]?.product.farmerName || "Mixed farmers",
    };
    setOrders((list) => [order, ...list]);
    setCart([]);
    return order;
  }, [cartDetails, cartSubtotal]);

  const value = {
    cart: cartDetails,
    cartCount,
    cartSubtotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    wishlist,
    toggleWishlist,
    user,
    signIn,
    signOut,
    connections,
    toggleConnect,
    joinedGroups,
    toggleGroup,
    likedPosts,
    toggleLike,
    addComment,
    getComments,
    threads,
    sendMessage,
    openThreadWith,
    orders,
    placeOrder,
    notify,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} dismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </StoreContext.Provider>
  );
}

/* ── Toast UI ────────────────────────────────────────────────────────── */
function ToastHost({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 bg-[#3A4A3F] text-[#F5F1E8] pl-4 pr-3 py-3 rounded-2xl shadow-2xl max-w-xs border border-white/10"
          >
            <span className="w-7 h-7 rounded-full bg-[#87A878] flex items-center justify-center flex-shrink-0">
              {t.type === "info" ? (
                <Info size={15} className="text-white" />
              ) : t.type === "cart" ? (
                <ShoppingBag size={15} className="text-white" />
              ) : (
                <CheckCircle size={15} className="text-white" />
              )}
            </span>
            <span className="text-sm font-medium leading-snug">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
