import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, CheckCircle, Leaf,
  MessageCircle, Clock, Building2
} from "lucide-react";
import { containerVariants, revealVariants, useScrollAnimation } from "../hooks/useScrollAnimation";
import Container from "../components/layout/Container";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@farmconnect.ng",
    sub: "We respond within 2 hours",
    color: "#87A878",
    href: "mailto:hello@farmconnect.ng?subject=Hello%20FarmConnect",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+234 800 FARM CONNECT",
    sub: "Mon – Sat, 7am – 7pm",
    color: "#C17C53",
    href: "tel:+234800327626638",
  },
  {
    icon: MapPin,
    label: "Headquartered in",
    value: "Lagos, Nigeria",
    sub: "With satellite offices in Abuja & Kano",
    color: "#D4A373",
    href: "https://www.google.com/maps/place/Lagos,Nigeria",
  },
];

const inquiryTypes = [
  { value: "buyer", label: "🛒 Buying produce" },
  { value: "farmer", label: "🌾 Becoming a seller" },
  { value: "restaurant", label: "🍽️ Restaurant partnership" },
  { value: "bulk", label: "📦 Bulk orders" },
  { value: "media", label: "📰 Media inquiry" },
  { value: "other", label: "💬 Other" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [ref, inView] = useScrollAnimation();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  };

  const quickActions = [
    {
      icon: Building2,
      color: "text-[#87A878]",
      label: "Restaurant partnership kit",
      type: "restaurant",
      message:
        "Please send me the restaurant partnership kit — we run a 40-cover bistro in Lagos.",
    },
    {
      icon: Leaf,
      color: "text-[#C17C53]",
      label: "Farmer onboarding guide",
      type: "farmer",
      message:
        "I'd like the farmer onboarding guide. I farm yam and cassava in Kogi State.",
    },
    {
      icon: Clock,
      color: "text-[#D4A373]",
      label: "Delivery schedule info",
      type: "other",
      message: "Could you share your delivery schedule and coverage for my area?",
    },
    {
      icon: MessageCircle,
      color: "text-[#87A878]",
      label: "Live chat (7am–7pm)",
      chat: true,
    },
  ];

  function startInquiry(type, message) {
    setSubmitted(false);
    setForm((f) => ({ ...f, type, message }));
    setTimeout(() => {
      document
        .getElementById("contact-form")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-24 pb-16"
    >
      {/* Page header */}
      <div className="bg-harvest py-16 mb-16">
        <Container>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-[#87A878] text-sm font-semibold uppercase tracking-wider mb-3">
              <Leaf size={14} /> Get in Touch
            </span>
            <h1 className="font-display text-5xl font-bold text-[#3A4A3F] mb-4">
              We'd Love to Hear From You
            </h1>
            <p className="text-[#3A4A3F]/55 max-w-xl mx-auto">
              Whether you're a hungry household, a restaurant chef, a bulk buyer,
              or a farmer ready to join — we're here.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info panel */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="lg:col-span-2 space-y-5"
          >
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel={info.href.startsWith("http") ? "noreferrer" : undefined}
                  variants={revealVariants}
                  custom={i}
                  className="block bg-white rounded-3xl p-6 border border-[#87A878]/10 card-lift hover:border-[#87A878]/40 transition-colors"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${info.color}18` }}
                  >
                    <Icon size={20} style={{ color: info.color }} />
                  </div>
                  <div className="text-xs font-semibold text-[#3A4A3F]/45 uppercase tracking-wider mb-1">
                    {info.label}
                  </div>
                  <div className="font-semibold text-[#3A4A3F] text-sm">{info.value}</div>
                  <div className="text-xs text-[#3A4A3F]/45 mt-0.5">{info.sub}</div>
                </motion.a>
              );
            })}

            {/* Quick actions */}
            <motion.div
              variants={revealVariants}
              className="bg-[#3A4A3F] rounded-3xl p-6"
            >
              <h3 className="font-display font-bold text-[#F5F1E8] text-lg mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() =>
                        a.chat
                          ? navigate("/dashboard?tab=messages")
                          : startInquiry(a.type, a.message)
                      }
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-[#F5F1E8]/70 hover:text-[#F5F1E8] text-sm text-left"
                    >
                      <Icon size={16} className={a.color} /> {a.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div id="contact-form" className="bg-white rounded-3xl p-8 sm:p-10 border border-[#87A878]/10">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-5"
                  >
                    <h2 className="font-display text-2xl font-bold text-[#3A4A3F] mb-6">
                      Send us a message
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <Input
                        label="Your Name"
                        placeholder="Amara Okafor"
                        value={form.name}
                        onChange={update("name")}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={update("email")}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#3A4A3F] block mb-1.5">
                        What's this about?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {inquiryTypes.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all
                              ${form.type === t.value
                                ? "bg-[#87A878] text-white shadow-md"
                                : "bg-[#F5F1E8] text-[#3A4A3F] hover:bg-[#87A878]/10"}`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#3A4A3F] block mb-1.5">
                        Your Message
                      </label>
                      <textarea
                        value={form.message}
                        onChange={update("message")}
                        required
                        rows={5}
                        placeholder="Tell us how we can help..."
                        className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#87A878]/20 text-[#3A4A3F] text-sm placeholder:text-[#3A4A3F]/35 outline-none focus:border-[#87A878] focus:shadow-[0_0_0_3px_rgba(135,168,120,0.15)] transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      iconRight={<Send size={16} />}
                      className="w-full justify-center"
                    >
                      Send Message
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center justify-center gap-4 py-20 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    >
                      <CheckCircle size={64} className="text-[#87A878]" />
                    </motion.div>
                    <h3 className="font-display text-3xl font-bold text-[#3A4A3F]">
                      Message Sent! 🌱
                    </h3>
                    <p className="text-[#3A4A3F]/55 max-w-sm">
                      Thank you for reaching out. Our team will get back to you within 2 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", type: "", message: "" });
                      }}
                    >
                      Send Another
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </Container>
    </motion.div>
  );
}
