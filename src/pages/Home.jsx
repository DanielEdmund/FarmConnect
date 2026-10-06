import { motion } from "framer-motion";
import Hero from "../components/sections/Hero";
import FarmerSpotlight from "../components/sections/FarmerSpotlight";
import ProductGrid from "../components/sections/ProductGrid";
import HowItWorks from "../components/sections/HowItWorks";
import Testimonials from "../components/sections/Testimonials";
import Newsletter from "../components/sections/Newsletter";
import { impactStats } from "../data/mockData";
import { useScrollAnimation, containerVariants, revealVariants } from "../hooks/useScrollAnimation";
import Container from "../components/layout/Container";

function ImpactBanner() {
  const [ref, inView] = useScrollAnimation();

  return (
    <section className="py-16 bg-[#87A878]/10">
      <Container>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {impactStats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={revealVariants}
              className="text-center"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="font-display font-bold text-3xl text-[#3A4A3F] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#3A4A3F]/55">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Hero />
      <ImpactBanner />
      <ProductGrid limit={6} />
      <FarmerSpotlight />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </motion.div>
  );
}
