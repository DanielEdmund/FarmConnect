import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Heart, Users, TrendingUp, Globe, ArrowRight, Star, MapPin } from "lucide-react";
import { impactStats, farmers } from "../data/mockData";
import { containerVariants, revealVariants, useScrollAnimation } from "../hooks/useScrollAnimation";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";

const values = [
  {
    icon: Leaf,
    title: "Organic First",
    description:
      "We champion natural, chemical-free farming practices. What's good for the earth is good for our families.",
    color: "#87A878",
  },
  {
    icon: Heart,
    title: "Community Care",
    description:
      "Every purchase directly supports a Nigerian family farm. We believe in fair prices, farmer dignity, and community bonds.",
    color: "#C17C53",
  },
  {
    icon: Users,
    title: "Human Connection",
    description:
      "Food is more than nutrition — it's a relationship. We make it personal. You know your farmer, your farmer knows you.",
    color: "#D4A373",
  },
  {
    icon: TrendingUp,
    title: "Farmer Prosperity",
    description:
      "By cutting out middlemen, farmers earn 40–60% more per crop. Better income means better farming and better food for all.",
    color: "#3A4A3F",
  },
];

const teamMembers = [
  {
    name: "Chidi Onyekwere",
    role: "Co-Founder & CEO",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    bio: "Former agricultural economist. Spent 8 years studying Nigeria's food supply chain before building the solution.",
  },
  {
    name: "Amara Okafor",
    role: "Co-Founder & Head of Farmers",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=face",
    bio: "Daughter of a Benue farmer. Built the trust network of 1,200+ verified farmers across 22 states.",
  },
  {
    name: "Tobi Adeyemi",
    role: "Head of Technology",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
    bio: "Built logistics infrastructure that keeps produce moving from farm to doorstep in under 24 hours.",
  },
];

export default function About() {
  const [ref1, inView1] = useScrollAnimation();
  const [ref2, inView2] = useScrollAnimation();
  const [ref3, inView3] = useScrollAnimation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen"
    >
      {/* Hero */}
      <div className="relative pt-32 pb-24 bg-[#3A4A3F] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&h=800&fit=crop"
            alt="Nigerian farm"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#87A878]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4A373]/15 rounded-full blur-3xl" />
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 text-[#87A878] text-sm font-semibold uppercase tracking-wider mb-4">
              <Leaf size={14} /> Our Mission
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#F5F1E8] mb-6 leading-tight">
              Feeding Nigeria, <br />
              <span className="text-[#87A878]">Together.</span>
            </h1>
            <p className="text-[#F5F1E8]/65 text-lg max-w-2xl mx-auto leading-relaxed">
              FarmConnect was born from a simple belief: that Nigerian farmers deserve better,
              and Nigerian families deserve fresher. We're the bridge between those two truths.
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Impact stats */}
      <div className="bg-[#87A878] py-14">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="font-display font-bold text-3xl text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* Values */}
      <section className="py-24 bg-[#F5F1E8]">
        <Container>
          <motion.div
            ref={ref1}
            variants={containerVariants}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
          >
            <motion.div variants={revealVariants} className="text-center mb-16">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#3A4A3F] mb-4">
                What We Stand For
              </h2>
              <p className="text-[#3A4A3F]/55 max-w-xl mx-auto">
                Four values guide every decision we make, every farmer we onboard, and every
                order we fulfill.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    variants={revealVariants}
                    custom={i}
                    className="bg-white rounded-3xl p-7 border border-[#87A878]/10 card-lift"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: `${v.color}18` }}
                    >
                      <Icon size={22} style={{ color: v.color }} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#3A4A3F] mb-2">
                      {v.title}
                    </h3>
                    <p className="text-[#3A4A3F]/60 text-sm leading-relaxed">{v.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              ref={ref2}
              initial={{ opacity: 0, x: -40 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="text-[#C17C53] text-sm font-semibold uppercase tracking-wider mb-3 block">
                Our Story
              </span>
              <h2 className="font-display text-4xl font-bold text-[#3A4A3F] mb-6 leading-tight">
                Started in a Lagos Market, <br />
                Now Feeding a Nation.
              </h2>
              <div className="space-y-4 text-[#3A4A3F]/65 leading-relaxed">
                <p>
                  In 2021, Chidi Onyekwere watched his elderly mother drive 3 hours to a farm in
                  Benue State just to get tomatoes she could trust. That same week, he spoke to a
                  farmer who was throwing away 40% of his harvest because he had no buyers.
                </p>
                <p>
                  The problem wasn't supply. It wasn't demand. It was connection. FarmConnect
                  was built to solve that — one farmer, one family at a time.
                </p>
                <p>
                  Today, we're in 22 states, with over 1,200 verified farmer partners and 48,000
                  fulfilled orders. But we still operate with the same spirit: every transaction
                  is a relationship, not just a receipt.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/marketplace">
                  <Button variant="primary" iconRight={<ArrowRight size={16} />}>
                    Join the Movement
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=1000&fit=crop"
                  alt="Nigerian farmer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl">
                <div className="text-3xl font-display font-bold text-[#3A4A3F]">40–60%</div>
                <div className="text-sm text-[#3A4A3F]/55 mt-0.5">More income for farmers</div>
              </div>
              <div className="absolute top-6 -right-6 bg-[#87A878] rounded-2xl p-5 shadow-xl">
                <Globe size={24} className="text-white mb-1" />
                <div className="text-white font-semibold text-sm">22 States</div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-24 bg-[#F5F1E8]">
        <Container>
          <motion.div
            ref={ref3}
            variants={containerVariants}
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
          >
            <motion.div variants={revealVariants} className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-[#3A4A3F] mb-3">
                The People Behind the Platform
              </h2>
              <p className="text-[#3A4A3F]/55">
                We're Nigerians who love food, farmers, and building things that matter.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.name}
                  variants={revealVariants}
                  custom={i}
                  className="bg-white rounded-3xl p-7 text-center card-lift border border-[#87A878]/10"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 border-2 border-[#87A878]/20"
                  />
                  <h3 className="font-semibold text-[#3A4A3F] text-base">{member.name}</h3>
                  <p className="text-[#87A878] text-xs font-medium mb-3">{member.role}</p>
                  <p className="text-[#3A4A3F]/55 text-xs leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>
    </motion.div>
  );
}
