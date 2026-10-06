import { Link } from "react-router-dom";
import { Leaf, Globe, MessageSquare, Share2, Heart, ArrowUpRight, Mail } from "lucide-react";
import Container from "./Container";
import { useStore } from "../../context/StoreContext";

const footerLinks = {
  Platform: [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Our Farmers", href: "/farmers" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Become a Seller", href: "/contact" },
  ],
  "For Buyers": [
    { label: "Households", href: "/marketplace" },
    { label: "Restaurants", href: "/marketplace" },
    { label: "Bulk Orders", href: "/marketplace?cat=all" },
    { label: "Subscriptions", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Impact Report", href: "/about" },
    { label: "Blog", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  const { notify } = useStore();

  const shareSite = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "FarmConnect",
          text: "Fresh produce straight from Nigerian farmers.",
          url: window.location.origin,
        });
        return;
      }
      await navigator.clipboard.writeText(window.location.origin);
      notify("FarmConnect link copied to clipboard", "info");
    } catch {
      notify("Sharing was cancelled", "info");
    }
  };

  const socials = [
    { icon: Globe, label: "Home", to: "/" },
    { icon: Mail, label: "Email us", href: "mailto:hello@farmconnect.ng" },
    { icon: MessageSquare, label: "Chat", to: "/dashboard?tab=messages" },
    { icon: Share2, label: "Share", onClick: shareSite },
  ];

  return (
    <footer className="bg-[#3A4A3F] text-[#F5F1E8]">
      {/* Wave divider */}
      <div className="overflow-hidden leading-none -mb-px">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="fill-[#F5F1E8] w-full">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <Container className="pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-[#87A878] rounded-xl flex items-center justify-center">
                <Leaf size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-2xl">
                Farm<span className="text-[#87A878]">Connect</span>
              </span>
            </Link>
            <p className="text-[#F5F1E8]/70 text-sm leading-relaxed max-w-xs">
              Bridging the gap between Nigeria's hardworking small-scale farmers
              and the communities who need their freshest produce. Farm to table,
              with love.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {socials.map(({ icon: Icon, label, to, href, onClick }) => {
                const className =
                  "w-10 h-10 rounded-full bg-white/10 hover:bg-[#87A878] flex items-center justify-center transition-colors duration-200";
                if (onClick) {
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      aria-label={label}
                      title={label}
                      className={className}
                    >
                      <Icon size={16} />
                    </button>
                  );
                }
                if (to) {
                  return (
                    <Link key={label} to={to} aria-label={label} title={label} className={className}>
                      <Icon size={16} />
                    </Link>
                  );
                }
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    className={className}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              {["🌱 100% Natural", "🤝 Trusted Community", "⚡ 24hr Fresh"].map((b) => (
                <span
                  key={b}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-[#F5F1E8]/80"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-[#87A878] mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#F5F1E8]/60 hover:text-[#F5F1E8] transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5F1E8]/40">
          <p>© 2026 FarmConnect Nigeria. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-[#C17C53]" fill="#C17C53" /> for Nigerian farmers
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-[#F5F1E8] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#F5F1E8] transition-colors">Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
