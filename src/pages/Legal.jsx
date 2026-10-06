import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import Container from "../components/layout/Container";

const content = {
  privacy: {
    title: "Privacy Policy",
    icon: ShieldCheck,
    updated: "Last updated 1 September 2026",
    intro:
      "FarmConnect is a demo application. This sample policy explains how a real version of the platform would treat your data.",
    sections: [
      {
        heading: "What we collect",
        body: "Your name, email address, delivery address, order history and the messages you send to farmers. Payment details would be handled by a licensed payment processor and never stored on our servers.",
      },
      {
        heading: "How we use it",
        body: "To fulfil orders, connect you with farmers, show you relevant produce, and send delivery updates. We never sell your personal data to third parties.",
      },
      {
        heading: "Farmers and your data",
        body: "The farmer you order from sees only what is needed to pack and deliver your order: your name, the items, and your delivery zone.",
      },
      {
        heading: "Your rights",
        body: "You can request a copy of your data, ask us to correct it, or delete your account entirely at any time by contacting hello@farmconnect.ng.",
      },
      {
        heading: "Cookies",
        body: "We use strictly necessary cookies to keep you signed in and to remember your basket. Analytics cookies would only be used with your consent.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    icon: FileText,
    updated: "Last updated 1 September 2026",
    intro:
      "These sample terms describe the agreement between you, the farmer, and FarmConnect when you use the platform.",
    sections: [
      {
        heading: "Using FarmConnect",
        body: "You agree to use the platform for lawful purchases of farm produce and to provide accurate delivery information. One account per person.",
      },
      {
        heading: "Orders and pricing",
        body: "Prices are set by farmers and locked for 60 minutes after you add an item to your basket. Because produce is seasonal, a farmer may substitute an item of equal or greater value if your order can't be fulfilled — you'll always be told first.",
      },
      {
        heading: "Delivery",
        body: "Standard delivery is within 18 hours of harvest. If your order arrives damaged or below the quality promised, report it within 24 hours for a full refund.",
      },
      {
        heading: "For farmers",
        body: "Farmers keep 100% of the listed price less the platform fee. Listings must be accurate: what you photograph is what you ship.",
      },
      {
        heading: "Demo notice",
        body: "This build is a front-end demonstration. No real orders are placed, no payments are taken, and all accounts and data exist only in your browser.",
      },
    ],
  },
};

export default function Legal({ doc = "privacy" }) {
  const page = content[doc] || content.privacy;
  const Icon = page.icon;
  const other = doc === "privacy" ? "terms" : "privacy";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-24 pb-20"
    >
      <div className="bg-[#3A4A3F] py-14 mb-14">
        <Container>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#F5F1E8]/60 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft size={15} /> Back to home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#87A878] rounded-2xl flex items-center justify-center">
              <Icon size={26} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F5F1E8]">
                {page.title}
              </h1>
              <p className="text-[#F5F1E8]/50 text-sm mt-1">{page.updated}</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-3xl">
        <p className="text-[#3A4A3F]/70 text-lg leading-relaxed mb-10">
          {page.intro}
        </p>

        <div className="space-y-7">
          {page.sections.map((s, i) => (
            <motion.section
              key={s.heading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="bg-white rounded-3xl border border-[#87A878]/10 p-7"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-lg bg-[#87A878]/12 text-[#87A878] text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h2 className="font-display text-xl font-bold text-[#3A4A3F]">
                  {s.heading}
                </h2>
              </div>
              <p className="text-[#3A4A3F]/65 text-sm leading-relaxed">{s.body}</p>
            </motion.section>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 flex-wrap bg-[#87A878]/10 rounded-3xl p-6 border border-[#87A878]/20">
          <p className="text-sm text-[#3A4A3F]/70">
            Questions about {page.title.toLowerCase()}?
          </p>
          <div className="flex gap-3">
            <Link to={`/${other}`} className="text-sm font-semibold text-[#87A878] hover:underline">
              Read the {other === "privacy" ? "Privacy Policy" : "Terms"}
            </Link>
            <Link to="/contact" className="text-sm font-semibold text-[#C17C53] hover:underline">
              Contact us →
            </Link>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
