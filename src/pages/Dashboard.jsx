import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Package,
  Heart,
  Send,
  ThumbsUp,
  Sparkles,
  LogOut,
  ArrowRight,
  ShoppingBag,
  Store,
  UserPlus,
  Check,
  Search,
  Trash2,
} from "lucide-react";
import {
  farmers,
  communityPosts,
  communityGroups,
} from "../data/mockData";
import { useStore, getProduct } from "../context/StoreContext";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "community", label: "Community", icon: Users },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
];

const statusStyle = {
  Delivered: "bg-[#87A878]/15 text-[#5a8a4a]",
  "In Transit": "bg-[#D4A373]/20 text-[#a07840]",
  Processing: "bg-[#C17C53]/15 text-[#C17C53]",
};

/* ─── Shared bits ─────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#87A878]/10">
      <div className="w-10 h-10 bg-[#87A878]/10 rounded-2xl flex items-center justify-center mb-3">
        <Icon size={18} className="text-[#87A878]" />
      </div>
      <div className="font-display font-bold text-2xl text-[#3A4A3F]">{value}</div>
      <div className="text-xs text-[#3A4A3F]/50 mt-0.5">{label}</div>
      {hint && <div className="text-[10px] text-[#C17C53] mt-1">{hint}</div>}
    </div>
  );
}

function ConnectButton({ farmer }) {
  const { connections, toggleConnect } = useStore();
  const connected = connections.includes(farmer.id);
  return (
    <button
      onClick={() => toggleConnect(farmer.id, farmer.name)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        connected
          ? "bg-[#87A878] text-white"
          : "bg-[#3A4A3F] text-white hover:bg-[#87A878]"
      }`}
    >
      {connected ? <Check size={13} /> : <UserPlus size={13} />}
      {connected ? "Connected" : "Connect"}
    </button>
  );
}

function OrderRow({ order }) {
  const { addToCart } = useStore();
  const items = order.items
    .map((i) => ({ ...i, product: getProduct(i.productId) }))
    .filter((i) => i.product);

  const reorder = () => {
    items.forEach((i) => addToCart(i.product, i.qty));
  };

  return (
    <div className="bg-white rounded-3xl border border-[#87A878]/10 p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <div className="font-semibold text-[#3A4A3F]">{order.id}</div>
          <div className="text-xs text-[#3A4A3F]/45">
            {new Date(order.date).toLocaleDateString("en-NG", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            · {order.farmer}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              statusStyle[order.status] || "bg-[#F5F1E8] text-[#3A4A3F]"
            }`}
          >
            {order.status}
          </span>
          <span className="font-display font-bold text-[#3A4A3F]">
            ₦{order.total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {items.map(({ product, qty }) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="flex items-center gap-2 bg-[#F5F1E8] rounded-xl pr-3 py-1.5 hover:bg-[#87A878]/10 transition-colors"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-xs text-[#3A4A3F] font-medium">
              {product.name} ×{qty}
            </span>
          </Link>
        ))}
        <button
          onClick={reorder}
          className="ml-auto text-xs font-semibold text-[#87A878] hover:underline"
        >
          Reorder →
        </button>
      </div>
    </div>
  );
}

/* ─── Community feed ──────────────────────────────────────────────── */
function CommunityFeed() {
  const { likedPosts, toggleLike, getComments, addComment, user, notify } =
    useStore();
  const [posts, setPosts] = useState(communityPosts);
  const [draft, setDraft] = useState("");
  const [openComments, setOpenComments] = useState({});
  const [commentDraft, setCommentDraft] = useState({});

  const publish = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setPosts((list) => [
      {
        id: Date.now(),
        authorId: 0,
        name: user?.name || "You",
        avatar:
          "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=120&h=120&fit=crop&crop=face",
        role: `${user?.role || "Buyer"} · FarmConnect`,
        time: "Just now",
        text: draft.trim(),
        likes: 0,
        tags: ["Community"],
        comments: [],
      },
      ...list,
    ]);
    setDraft("");
    notify("Your update is live in the community feed");
  };

  return (
    <div className="space-y-6">
      {/* Composer */}
      <form
        onSubmit={publish}
        className="bg-white rounded-3xl border border-[#87A878]/10 p-5"
      >
        <div className="flex gap-3">
          <img
            src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face"
            alt="You"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              placeholder="Share a harvest update, ask a question, tip a fellow farmer…"
              className="w-full px-4 py-3 rounded-2xl bg-[#F5F1E8] text-sm text-[#3A4A3F] placeholder:text-[#3A4A3F]/40 outline-none border-2 border-transparent focus:border-[#87A878] transition-colors resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button type="submit" size="sm" variant="primary" icon={<Send size={13} />}>
                Post Update
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Posts */}
      <AnimatePresence initial={false}>
        {posts.map((post) => {
          const liked = likedPosts.includes(post.id);
          const comments = getComments(post);
          const isOpen = openComments[post.id];
          return (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-[#87A878]/10 p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.avatar}
                  alt={post.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#87A878]/20"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-[#3A4A3F] text-sm">
                    {post.name}
                  </div>
                  <div className="text-xs text-[#3A4A3F]/45 truncate">
                    {post.role} · {post.time}
                  </div>
                </div>
                <div className="ml-auto">
                  {post.authorId > 0 && <ConnectButton farmer={farmers.find((f) => f.id === post.authorId)} />}
                </div>
              </div>

              <p className="text-[#3A4A3F]/75 text-sm leading-relaxed whitespace-pre-line">
                {post.text}
              </p>

              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-56 object-cover rounded-2xl mt-4"
                />
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#87A878]/10 text-[#5a8a4a]"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-5 mt-5 pt-4 border-t border-[#87A878]/10 text-xs text-[#3A4A3F]/55">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${
                    liked ? "text-[#87A878]" : "hover:text-[#87A878]"
                  }`}
                >
                  <ThumbsUp size={14} fill={liked ? "#87A878" : "none"} />
                  {post.likes + (liked ? 1 : 0)}
                </button>
                <button
                  onClick={() =>
                    setOpenComments((o) => ({ ...o, [post.id]: !o[post.id] }))
                  }
                  className="flex items-center gap-1.5 font-medium hover:text-[#87A878] transition-colors"
                >
                  <MessageCircle size={14} />
                  {comments.length} {comments.length === 1 ? "reply" : "replies"}
                </button>
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} /> Fresh
                </span>
              </div>

              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="bg-[#F5F1E8] rounded-2xl px-4 py-2.5 flex-1">
                          <div className="text-xs font-semibold text-[#3A4A3F]">
                            {c.name}{" "}
                            <span className="font-normal text-[#3A4A3F]/40">
                              · {c.time}
                            </span>
                          </div>
                          <p className="text-xs text-[#3A4A3F]/70 mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-xs text-[#3A4A3F]/40">
                        No replies yet — be the first.
                      </p>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addComment(post.id, commentDraft[post.id] || "");
                        setCommentDraft((d) => ({ ...d, [post.id]: "" }));
                      }}
                      className="flex gap-2"
                    >
                      <input
                        value={commentDraft[post.id] || ""}
                        onChange={(e) =>
                          setCommentDraft((d) => ({ ...d, [post.id]: e.target.value }))
                        }
                        placeholder="Write a reply…"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F1E8] text-xs text-[#3A4A3F] placeholder:text-[#3A4A3F]/40 outline-none border-2 border-transparent focus:border-[#87A878] transition-colors"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-[#87A878] text-white text-xs font-semibold hover:bg-[#6d8a61] transition-colors"
                      >
                        Reply
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </motion.article>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ─── Messages ────────────────────────────────────────────────────── */
function MessagesPanel({ initialThread }) {
  const { threads, sendMessage } = useStore();
  const [activeId, setActiveId] = useState(
    Number(initialThread) || threads[0]?.id
  );
  const [draft, setDraft] = useState("");
  const active = threads.find((t) => t.id === activeId) || threads[0];

  const submit = (e) => {
    e.preventDefault();
    sendMessage(active.id, draft);
    setDraft("");
  };

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {/* Thread list */}
      <div className="bg-white rounded-3xl border border-[#87A878]/10 p-3 h-fit">
        <div className="px-3 py-2 text-xs font-semibold text-[#3A4A3F]/45 uppercase tracking-wider">
          Conversations
        </div>
        {threads.map((t) => {
          const last = t.messages[t.messages.length - 1];
          const isActive = t.id === active.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors ${
                isActive ? "bg-[#87A878]/12" : "hover:bg-[#F5F1E8]"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                {t.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#87A878] border-2 border-white rounded-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[#3A4A3F] truncate">
                  {t.name}
                </div>
                <div className="text-xs text-[#3A4A3F]/45 truncate">{last?.text}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chat */}
      <div className="md:col-span-2 bg-white rounded-3xl border border-[#87A878]/10 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-[#87A878]/10">
          <img src={active.avatar} alt={active.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-[#3A4A3F] text-sm">{active.name}</div>
            <div className="text-xs text-[#87A878]">
              {active.online ? "Online now" : "Last seen today"}
            </div>
          </div>
          <Link
            to={`/farmer/${active.farmerId}`}
            className="ml-auto text-xs font-semibold text-[#87A878] hover:underline"
          >
            View profile
          </Link>
        </div>

        <div className="flex-1 p-5 space-y-3 max-h-[420px] overflow-y-auto bg-[#F5F1E8]/40">
          {active.messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  m.from === "me"
                    ? "bg-[#87A878] text-white rounded-br-md"
                    : "bg-white text-[#3A4A3F] border border-[#87A878]/10 rounded-bl-md"
                }`}
              >
                <p className="leading-snug">{m.text}</p>
                <div
                  className={`text-[10px] mt-1 ${
                    m.from === "me" ? "text-white/60" : "text-[#3A4A3F]/40"
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={submit} className="flex gap-2 p-4 border-t border-[#87A878]/10">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${active.name.split(" ")[0]}…`}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#F5F1E8] text-sm text-[#3A4A3F] placeholder:text-[#3A4A3F]/40 outline-none border-2 border-transparent focus:border-[#87A878] transition-colors"
          />
          <button
            type="submit"
            className="px-5 rounded-2xl bg-[#87A878] text-white hover:bg-[#6d8a61] transition-colors"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Main dashboard ──────────────────────────────────────────────── */
export default function Dashboard() {
  const {
    user,
    signOut,
    orders,
    cartCount,
    wishlist,
    toggleWishlist,
    connections,
    joinedGroups,
    toggleGroup,
    threads,
    notify,
  } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "overview");
  const [farmerSearch, setFarmerSearch] = useState("");

  useEffect(() => {
    if (user) return;
    // Delay so a sign-out's own navigate("/") wins the race instead of
    // bouncing straight back to the sign-in screen.
    const timer = setTimeout(() => {
      const back = `${location.pathname}${location.search}`;
      navigate(`/signin?redirect=${encodeURIComponent(back)}`, { replace: true });
    }, 0);
    return () => clearTimeout(timer);
  }, [user, navigate, location]);

  useEffect(() => {
    setSearchParams(tab === "overview" ? {} : { tab }, { replace: true });
  }, [tab, setSearchParams]);

  const stats = useMemo(() => {
    const spent = orders.reduce((s, o) => s + o.total, 0);
    const active = orders.filter((o) => o.status !== "Delivered").length;
    return [
      { icon: Package, label: "Total Spent", value: `₦${spent.toLocaleString()}` },
      { icon: ShoppingBag, label: "Active Orders", value: active, hint: "Live" },
      { icon: Users, label: "Farmers Connected", value: connections.length },
      { icon: Heart, label: "Saved Items", value: wishlist.length },
    ];
  }, [orders, connections.length, wishlist.length]);

  if (!user) return null;

  const suggested = farmers.filter(
    (f) =>
      !connections.includes(f.id) &&
      f.name.toLowerCase().includes(farmerSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="bg-[#3A4A3F] pt-28 pb-10">
        <Container>
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#87A878]">
                <img
                  src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=160&h=160&fit=crop&crop=face"
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-[#87A878] text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={12} /> {user.role} Dashboard
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F5F1E8]">
                  Hello, {user.name.split(" ")[0]}
                </h1>
                <p className="text-[#F5F1E8]/50 text-sm">
                  {threads.length} conversations · {connections.length} farmers
                  connected
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/marketplace">
                <Button variant="primary" size="sm" icon={<Store size={14} />}>
                  Marketplace
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-white border border-white/20 hover:bg-white/10"
                icon={<LogOut size={14} />}
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-8 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-[#87A878] text-white shadow-lg shadow-[#87A878]/30"
                      : "bg-white/10 text-[#F5F1E8]/70 hover:bg-white/20"
                  }`}
                >
                  <Icon size={15} />
                  {t.label}
                  {t.id === "messages" && threads.length > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        active ? "bg-white/25" : "bg-[#C17C53] text-white"
                      }`}
                    >
                      {threads.length}
                    </span>
                  )}
                  {t.id === "wishlist" && wishlist.length > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        active ? "bg-white/25" : "bg-white/20"
                      }`}
                    >
                      {wishlist.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── Overview ─────────────────────────────────────── */}
            {tab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Recent orders */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-2xl font-bold text-[#3A4A3F]">
                        Recent Orders
                      </h2>
                      <button
                        onClick={() => setTab("orders")}
                        className="text-sm font-semibold text-[#87A878] hover:underline"
                      >
                        View all →
                      </button>
                    </div>
                    {orders.slice(0, 3).map((o) => (
                      <OrderRow key={o.id} order={o} />
                    ))}
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-4">
                    <div className="bg-[#3A4A3F] rounded-3xl p-6 text-white">
                      <h3 className="font-display font-bold text-lg mb-4">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate("/marketplace")}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-sm text-white/80 hover:text-white"
                        >
                          <ShoppingBag size={16} className="text-[#87A878]" />
                          Browse fresh produce
                          <ArrowRight size={14} className="ml-auto" />
                        </button>
                        <button
                          onClick={() => setTab("community")}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-sm text-white/80 hover:text-white"
                        >
                          <Users size={16} className="text-[#87A878]" />
                          Open community feed
                          <ArrowRight size={14} className="ml-auto" />
                        </button>
                        <button
                          onClick={() =>
                            cartCount > 0
                              ? navigate("/cart")
                              : notify("Your basket is empty — add something fresh!", "info")
                          }
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-sm text-white/80 hover:text-white"
                        >
                          <ShoppingBag size={16} className="text-[#C17C53]" />
                          View cart ({cartCount})
                          <ArrowRight size={14} className="ml-auto" />
                        </button>
                      </div>
                    </div>

                    {/* Suggested connections */}
                    <div className="bg-white rounded-3xl p-6 border border-[#87A878]/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-[#3A4A3F]">
                          Farmers to Connect
                        </h3>
                        <button
                          onClick={() => setTab("community")}
                          className="text-xs font-semibold text-[#87A878] hover:underline"
                        >
                          See all
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Search size={14} className="text-[#3A4A3F]/40" />
                        <input
                          value={farmerSearch}
                          onChange={(e) => setFarmerSearch(e.target.value)}
                          placeholder="Search farmers…"
                          className="flex-1 text-sm bg-transparent outline-none text-[#3A4A3F] placeholder:text-[#3A4A3F]/40"
                        />
                      </div>
                      <div className="space-y-3">
                        {suggested.slice(0, 3).map((f) => (
                          <div key={f.id} className="flex items-center gap-3">
                            <img
                              src={f.avatar}
                              alt={f.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <Link
                                to={`/farmer/${f.id}`}
                                className="text-sm font-semibold text-[#3A4A3F] hover:text-[#87A878] block truncate"
                              >
                                {f.name}
                              </Link>
                              <div className="text-xs text-[#3A4A3F]/45 truncate">
                                {f.farm}
                              </div>
                            </div>
                            <ConnectButton farmer={f} />
                          </div>
                        ))}
                        {suggested.length === 0 && (
                          <p className="text-xs text-[#3A4A3F]/45">
                            You're connected with everyone matching. 🎉
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Community ────────────────────────────────────── */}
            {tab === "community" && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="font-display text-2xl font-bold text-[#3A4A3F] mb-4">
                    Community Feed
                  </h2>
                  <CommunityFeed />
                </div>

                <div className="space-y-5">
                  {/* Connect with farmers */}
                  <div className="bg-white rounded-3xl p-5 border border-[#87A878]/10">
                    <h3 className="font-display font-bold text-[#3A4A3F] mb-4">
                      Farmers on FarmConnect
                    </h3>
                    <div className="space-y-3">
                      {farmers.map((f) => (
                        <div key={f.id} className="flex items-center gap-3">
                          <Link to={`/farmer/${f.id}`}>
                            <img
                              src={f.avatar}
                              alt={f.name}
                              className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-[#87A878] transition-all"
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/farmer/${f.id}`}
                              className="text-sm font-semibold text-[#3A4A3F] hover:text-[#87A878] block truncate"
                            >
                              {f.name}
                            </Link>
                            <div className="text-xs text-[#3A4A3F]/45 truncate">
                              {f.location}
                            </div>
                          </div>
                          <ConnectButton farmer={f} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Groups */}
                  <div className="bg-white rounded-3xl p-5 border border-[#87A878]/10">
                    <h3 className="font-display font-bold text-[#3A4A3F] mb-4">
                      Growers' Groups
                    </h3>
                    <div className="space-y-3">
                      {communityGroups.map((g) => {
                        const joined = joinedGroups.includes(g.id);
                        return (
                          <div
                            key={g.id}
                            className="p-3 rounded-2xl bg-[#F5F1E8] flex items-start gap-3"
                          >
                            <span className="text-2xl">{g.icon}</span>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-[#3A4A3F]">
                                {g.name}
                              </div>
                              <div className="text-xs text-[#3A4A3F]/50">
                                {g.members.toLocaleString()} members
                              </div>
                              <p className="text-xs text-[#3A4A3F]/55 mt-1">
                                {g.description}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleGroup(g.id, g.name)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex-shrink-0 ${
                                joined
                                  ? "bg-[#87A878] text-white"
                                  : "bg-[#3A4A3F] text-white hover:bg-[#87A878]"
                              }`}
                            >
                              {joined ? "Joined ✓" : "Join"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Messages ─────────────────────────────────────── */}
            {tab === "messages" && (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h2 className="font-display text-2xl font-bold text-[#3A4A3F]">
                    Messages
                  </h2>
                  <p className="text-sm text-[#3A4A3F]/50">
                    Chat directly with farmers — no middlemen.
                  </p>
                </div>
                <MessagesPanel initialThread={searchParams.get("thread")} />
              </div>
            )}

            {/* ── Orders ───────────────────────────────────────── */}
            {tab === "orders" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="font-display text-2xl font-bold text-[#3A4A3F]">
                    Your Orders
                  </h2>
                  <Badge type="fresh" label={`${orders.length} orders`} />
                </div>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#87A878]/10 p-12 text-center">
                    <Package size={40} className="text-[#87A878] mx-auto mb-4" />
                    <p className="text-[#3A4A3F]/55">
                      No orders yet. Your first basket is one click away.
                    </p>
                    <Link to="/marketplace" className="inline-block mt-5">
                      <Button variant="primary">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  orders.map((o) => <OrderRow key={o.id} order={o} />)
                )}
              </div>
            )}

            {/* ── Wishlist ─────────────────────────────────────── */}
            {tab === "wishlist" && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-[#3A4A3F]">
                  Saved Produce
                </h2>
                {wishlist.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#87A878]/10 p-12 text-center">
                    <Heart size={40} className="text-[#C17C53] mx-auto mb-4" />
                    <p className="text-[#3A4A3F]/55 mb-5">
                      Tap the heart on any product to save it here.
                    </p>
                    <Link to="/marketplace">
                      <Button variant="primary" iconRight={<ArrowRight size={15} />}>
                        Find Something Fresh
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlist.map((id) => {
                      const p = getProduct(id);
                      if (!p) return null;
                      return (
                        <motion.div
                          key={id}
                          layout
                          className="bg-white rounded-3xl overflow-hidden border border-[#87A878]/10"
                        >
                          <Link to={`/product/${p.id}`}>
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </Link>
                          <div className="p-4">
                            <Link
                              to={`/product/${p.id}`}
                              className="font-semibold text-sm text-[#3A4A3F] hover:text-[#87A878]"
                            >
                              {p.name}
                            </Link>
                            <div className="text-xs text-[#3A4A3F]/45 mb-3">
                              by {p.farmerName}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-display font-bold text-[#3A4A3F]">
                                ₦{p.price.toLocaleString()}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleWishlist(p.id)}
                                  aria-label={`Remove ${p.name} from wishlist`}
                                  className="p-2 rounded-xl text-[#3A4A3F]/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={15} />
                                </button>
                                <AddToCartButton product={p} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </motion.div>
  );
}

function AddToCartButton({ product }) {
  const { addToCart } = useStore();
  return (
    <button
      onClick={() => addToCart(product)}
      disabled={!product.inStock}
      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
        product.inStock
          ? "bg-[#87A878] text-white hover:bg-[#6d8a61]"
          : "bg-[#87A878]/20 text-[#87A878]/40 cursor-not-allowed"
      }`}
    >
      {product.inStock ? "Add to Cart" : "Sold out"}
    </button>
  );
}
