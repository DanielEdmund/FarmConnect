import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, MessageCircle, Truck, ArrowRight } from "lucide-react";
import { howItWorks } from "../../data/mockData";
import {
  useScrollAnimation,
  containerVariants,
  revealVariants,
} from "../../hooks/useScrollAnimation";
import Container from "../layout/Container";

const icons = { Search, MessageCircle, Truck };

const ConnectorLine = () => (
  <div className="hidden lg:flex items-center justify-center flex-1 px-4">
    <div className="relative w-full">
      <div className="h-px bg-[#87A878]/20 w-full" />
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="absolute top-0 left-0 h-px bg-[#87A878]"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ArrowRight size={16} className="text-[#87A878]" />
      </div>
    </div>
  </div>
);

export default function HowItWorks() {
  const [ref, inView] = useScrollAnimation(0.15);

  return (
    <section id="how-it-works" className="py-24 bg-[#3A4A3F] relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#87A878]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4A373]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <Container className="relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={revealVariants} className="text-center mb-20">
            <span className="text-[#87A878] text-sm font-semibold uppercase tracking-wider mb-3 block">
              Simple Process
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#F5F1E8] mb-4">
              How FarmConnect Works
            </h2>
            <p className="text-[#F5F1E8]/55 max-w-xl mx-auto">
              Getting farm-fresh food has never been this simple. Three steps
              from field to your family.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-0">
            {howItWorks.map((step, i) => {
              const Icon = icons[step.icon];
              return (
                <div key={step.step} className="flex lg:flex-col items-center flex-1 gap-0">
                  <motion.div
                    variants={revealVariants}
                    custom={i}
                    className="flex-1 flex flex-col items-center text-center p-8"
                  >
                    {/* Step number */}
                    <div className="relative mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.15,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl"
                        style={{ backgroundColor: step.color }}
                      >
                        {Icon && <Icon size={32} className="text-white" strokeWidth={1.8} />}
                      </motion.div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#F5F1E8] rounded-full flex items-center justify-center text-xs font-bold text-[#3A4A3F] shadow-md">
                        {step.step}
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#F5F1E8] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#F5F1E8]/55 text-sm leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Connector (between steps) */}
                  {i < howItWorks.length - 1 && <ConnectorLine />}
                </div>
              );
            })}
          </div>

          {/* CTA strip */}
          <motion.div
            variants={revealVariants}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-6 py-4">
              <span className="text-[#F5F1E8]/70 text-sm">Ready to start?</span>
              <Link
                to="/marketplace"
                className="flex items-center gap-2 text-[#87A878] font-semibold text-sm hover:text-[#a5c496] transition-colors"
              >
                Browse the marketplace <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
