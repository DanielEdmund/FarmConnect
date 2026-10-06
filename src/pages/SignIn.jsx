import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  ShoppingBasket,
  Tractor,
  UtensilsCrossed,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const roles = [
  { id: "Buyer", label: "Buyer", icon: ShoppingBasket, sub: "Households & chefs" },
  { id: "Farmer", label: "Farmer", icon: Tractor, sub: "Sell your harvest" },
  { id: "Restaurant", label: "Restaurant", icon: UtensilsCrossed, sub: "Bulk sourcing" },
];

const perks = [
  "Track every order from harvest to doorstep",
  "Connect directly with 1,240+ verified farmers",
  "Save produce to your wishlist & reorder in one tap",
  "Join community groups and growers' circles",
];

export default function SignIn() {
  const { user, signIn } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const intent = searchParams.get("intent");

  const [mode, setMode] = useState("signin"); // signin | signup
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("Buyer");
  const [error, setError] = useState("");

  // Already signed in? Skip straight to the dashboard
  useEffect(() => {
    if (user) navigate(redirect, { replace: true });
  }, [user, redirect, navigate]);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (form.password.length < 4) {
      setError("Password must be at least 4 characters (it's a demo, be kind).");
      return;
    }
    if (mode === "signup" && !form.name.trim()) {
      setError("Please tell us your name.");
      return;
    }
    setError("");
    signIn({
      name: form.name || form.email.split("@")[0].replace(/[._]/g, " "),
      email: form.email,
      role,
    });
    navigate(redirect, { replace: true });
  };

  const demoSignIn = () => {
    signIn({ name: "Amara Okafor", email: "amara@farmconnect.ng", role });
    navigate(redirect, { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-28 pb-20"
    >
      <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto px-6">
        {/* ── Left: form ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-[2rem] border border-[#87A878]/10 p-8 sm:p-10 shadow-xl shadow-[#3A4A3F]/5"
        >
          <Link to="/" className="flex items-center gap-2 mb-8 w-fit group">
            <div className="w-9 h-9 bg-[#87A878] rounded-xl flex items-center justify-center">
              <Leaf size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-[#3A4A3F] text-xl">
              Farm<span className="text-[#87A878]">Connect</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3A4A3F] mb-2">
            {mode === "signin" ? "Welcome back" : "Join the community"}
          </h1>
          <p className="text-[#3A4A3F]/55 text-sm mb-7">
            {intent === "checkout"
              ? "Sign in to finish checking out your basket."
              : mode === "signin"
                ? "Sign in to see your orders, messages and fellow farmers."
                : "Create a demo account — no card, no verification, all mock."}
          </p>

          {/* Mode toggle */}
          <div className="flex bg-[#F5F1E8] rounded-2xl p-1 mb-6">
            {["signin", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-white text-[#3A4A3F] shadow-sm"
                    : "text-[#3A4A3F]/50 hover:text-[#3A4A3F]"
                }`}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Role picker */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-[#3A4A3F]/50 uppercase tracking-wider mb-2">
              I am a
            </div>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-center transition-all ${
                      active
                        ? "border-[#87A878] bg-[#87A878]/10"
                        : "border-transparent bg-[#F5F1E8] hover:border-[#87A878]/30"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={active ? "text-[#87A878]" : "text-[#3A4A3F]/50"}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        active ? "text-[#3A4A3F]" : "text-[#3A4A3F]/60"
                      }`}
                    >
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <Input
                label="Full Name"
                placeholder="Amara Okafor"
                value={form.name}
                onChange={update("name")}
                icon={<User size={16} />}
              />
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={update("email")}
              icon={<Mail size={16} />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={update("password")}
              icon={<Lock size={16} />}
              error={error || undefined}
              hint={error ? undefined : "Demo only — any password works."}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              iconRight={<ArrowRight size={16} />}
            >
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#87A878]/15" />
            <span className="text-xs text-[#3A4A3F]/40">or</span>
            <div className="flex-1 h-px bg-[#87A878]/15" />
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full justify-center"
            onClick={demoSignIn}
          >
            Continue with demo account
          </Button>

          <p className="text-xs text-center text-[#3A4A3F]/40 mt-6">
            By continuing you agree to our{" "}
            <Link to="/terms" className="text-[#87A878] hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-[#87A878] hover:underline">
              Privacy Policy
            </Link>
            . This is a demo — nothing is sent anywhere.
          </p>
        </motion.div>

        {/* ── Right: benefits ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-[2rem] overflow-hidden min-h-[420px] hidden lg:flex flex-col justify-end p-10"
        >
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1000&h=1200&fit=crop"
            alt="Farmer in a Nigerian field"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A4A3F] via-[#3A4A3F]/70 to-[#3A4A3F]/20" />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white rounded-full px-3 py-1.5 text-xs font-semibold mb-5">
                  <Leaf size={12} className="text-[#87A878]" />
                  Your farm dashboard awaits
                </span>
                <h2 className="font-display text-4xl font-bold text-white mb-5 leading-tight">
                  {mode === "signin"
                    ? "Pick up right where the harvest left off."
                    : "One account. Every farmer. Endless fresh food."}
                </h2>
                <ul className="space-y-3">
                  {perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 text-white/85 text-sm"
                    >
                      <CheckCircle size={16} className="text-[#87A878] mt-0.5 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
