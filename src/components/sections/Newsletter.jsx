import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Leaf, CheckCircle } from "lucide-react";
import { useScrollAnimation, revealVariants } from "../../hooks/useScrollAnimation";
import Container from "../layout/Container";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [ref, inView] = useScrollAnimation();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-white">
      <Container>
        <motion.div
          ref={ref}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
          }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative overflow-hidden rounded-[2.5rem] bg-[#3A4A3F] px-8 py-16 sm:px-16 text-center"
        >
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#87A878]/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#D4A373]/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-8 right-1/4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-2 border-[#87A878]/20 rounded-full flex items-center justify-center"
            >
              <Leaf size={20} className="text-[#87A878]/40" />
            </motion.div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 bg-[#87A878] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Mail size={28} className="text-white" />
            </motion.div>

            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#F5F1E8] mb-4">
              Stay Fresh. Stay Connected.
            </h2>
            <p className="text-[#F5F1E8]/60 text-base mb-10 max-w-xl mx-auto">
              Get weekly harvest updates, seasonal produce alerts, and
              exclusive discounts from your favorite farmers — straight to your inbox.
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <motion.div
                    animate={{
                      boxShadow: focused
                        ? "0 0 0 3px rgba(135,168,120,0.4)"
                        : "0 0 0 0px rgba(135,168,120,0)",
                    }}
                    className="flex-1 flex items-center bg-white/10 border border-white/15 rounded-2xl overflow-hidden px-4 gap-3"
                  >
                    <Mail size={16} className="text-[#87A878] flex-shrink-0" />
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 bg-transparent text-[#F5F1E8] placeholder:text-[#F5F1E8]/30 text-sm py-3.5 outline-none"
                    />
                  </motion.div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 bg-[#87A878] hover:bg-[#6d8a61] text-white font-semibold px-6 py-3.5 rounded-2xl transition-colors text-sm cursor-pointer"
                  >
                    <Send size={15} />
                    Subscribe
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <CheckCircle size={52} className="text-[#87A878]" />
                  </motion.div>
                  <p className="text-[#F5F1E8] font-semibold text-xl">You're in the harvest family! 🌾</p>
                  <p className="text-[#F5F1E8]/50 text-sm">Check your inbox for your welcome gift.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!submitted && (
              <p className="text-[#F5F1E8]/30 text-xs mt-4">
                No spam. Unsubscribe anytime. Only the freshest updates.
              </p>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
