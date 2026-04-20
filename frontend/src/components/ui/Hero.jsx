import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Floating badge card component
const FloatingCard = ({ icon, title, subtitle, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className={`glass-panel rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[180px] bg-surface/40 backdrop-blur-3xl border border-white/10 ${className}`}
    style={{
      animation: `float ${4 + delay}s ease-in-out ${delay * 0.5}s infinite`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)"
    }}
  >
    <div className="w-10 h-10 rounded-[14px] bg-brand-gradient flex items-center justify-center flex-shrink-0 shadow-glow-blue">
      <span className="text-xl">{icon}</span>
    </div>
    <div>
      <p className="text-[13px] font-bold text-white leading-tight">{title}</p>
      <p className="text-[11px] text-on-surface/50 mt-0.5 font-medium">{subtitle}</p>
    </div>
    <div className="ml-auto">
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
    </div>
  </motion.div>
);

// Dashboard mockup cards
const DashboardCard = ({ label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/[0.03] rounded-2xl p-4 flex-1 border border-white/5 hover:border-white/10 transition-colors shadow-lg"
  >
    <div className={`w-2.5 h-2.5 rounded-full mb-3 shadow-[0_0_8px_currentColor] ${color}`} />
    <p className="text-xs text-on-surface/50 font-medium">{label}</p>
    <p className="text-lg font-bold font-headline text-white mt-1">{value}</p>
  </motion.div>
);

const Hero = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const visualRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 80, damping: 20, mass: 0.5 });
  const px = useTransform(sx, (v) => v * 15);
  const py = useTransform(sy, (v) => v * 15);
  const p2x = useTransform(sx, (v) => v * -25);
  const p2y = useTransform(sy, (v) => v * -25);

  const onMove = (e) => {
    const el = visualRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mx.set(x);
    my.set(y);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative min-h-screen bg-surface overflow-hidden pt-32 pb-20">
      {/* Background decorative blobs */}
      <div
        className="absolute top-0 right-[-10%] w-[800px] h-[800px] rounded-full opacity-25 pointer-events-none mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.8) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute inset-0 bg-noise" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-8rem)]">
          {/* Left: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                V2 Operations Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-sans text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-8"
            >
              Smart Campus <br />
              <motion.span
                className="gradient-text inline-block"
              >
                Operations
              </motion.span>{" "}
              <br />
              <span className="text-white/40">Re-engineered.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-on-surface/60 leading-relaxed mb-10 max-w-lg font-medium"
            >
              The unified orchestration engine for elite institutions. 
              Book resources, resolve issues, and scale operations instantly.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-5"
            >
              <Link
                to="/register"
                className="group relative inline-flex items-center gap-2 px-7 py-4 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-brand-gradient" />
                <div className="absolute inset-0 bg-gradient-to-r from-tertiary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 shadow-glow-blue opacity-80" />
                <span className="relative z-10 flex items-center gap-2" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                  Start Building
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-semibold text-base hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Stat pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-10 mt-16 pt-8 border-t border-white/5"
            >
              {[
                { value: "10K+", label: "Daily Active Users" },
                { value: "500+", label: "Managed Resources" },
                { value: "99.99%", label: "Uptime SLA" },
              ].map((stat, i) => (
                <div key={stat.label} className="relative">
                  <p className="font-sans text-3xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-primary mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Visual */}
          <div
            ref={visualRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="relative flex items-center justify-center lg:justify-end h-full"
          >
            {/* Main dashboard card */}
            <motion.div
              initial={{ opacity: 0, x: 80, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 1000 }}
              className="relative w-full max-w-[520px]"
            >
              <motion.div
                aria-hidden="true"
                className="absolute -inset-10 rounded-[3rem] opacity-50 mix-blend-screen"
                style={{
                  background:
                    "radial-gradient(circle at 20% 0%, rgba(59,130,246,0.5), transparent 40%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.4), transparent 50%)",
                  filter: "blur(24px)",
                }}
              />
              {/* Dashboard mockup */}
              <motion.div
                style={{ x: px, y: py, rotateX: useTransform(py, [-300, 300], [5, -5]), rotateY: useTransform(px, [-300, 300], [-5, 5]) }}
                className="glass-panel border border-white/10 rounded-3xl p-6 relative overflow-hidden bg-surface-container-low/80 backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                {/* Header Window Dots */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <div className="flex-1" />
                  <div className="h-6 w-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                  </div>
                </div>

                {/* Charts mockup */}
                <div className="bg-surface/50 border border-white/5 rounded-2xl p-5 mb-5 overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white">System Throughput</p>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-end gap-2 h-32 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-t border-white/10 w-full" />
                      <div className="border-t border-white/10 w-full" />
                      <div className="border-t border-white/10 w-full" />
                    </div>
                    {/* Bars */}
                    {[40, 65, 50, 80, 60, 95, 75, 88, 55, 78].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.7, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                        style={{
                          height: `${h}%`,
                          originY: 1,
                          background:
                            i === 5 
                              ? "linear-gradient(180deg, #8b5cf6, rgba(139,92,246,0.3))"
                              : "linear-gradient(180deg, #3b82f6, rgba(59,130,246,0.2))",
                          boxShadow: i === 5 ? "0 0 20px rgba(139,92,246,0.4)" : "none"
                        }}
                        className="flex-1 rounded-t-md min-w-0 relative group"
                      >
                         <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stat cards row */}
                <div className="flex gap-4">
                  <DashboardCard label="Active Sessions" value="2,401" color="text-primary bg-primary shadow-glow-blue" delay={0.9} />
                  <DashboardCard label="Event Rate" value="842/s" color="text-tertiary bg-tertiary shadow-glow-purple" delay={1.0} />
                  <DashboardCard label="Error Rate" value="0.01%" color="text-emerald-400 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" delay={1.1} />
                </div>

                {/* Log Stream Mockup */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-5 bg-surface/50 border border-white/5 rounded-2xl h-20 flex flex-col justify-center px-5 gap-2 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-50" />
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-primary/80 font-mono">14:02:11</span>
                    <div className="h-2 bg-white/20 rounded w-2/3" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-primary/80 font-mono">14:02:10</span>
                    <div className="h-2 bg-white/10 rounded w-1/2" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating badge cards */}
              <motion.div style={{ x: p2x, y: p2y }}>
                <FloatingCard
                  icon="⚡"
                  title="Compute Scaling"
                  subtitle="Node #42 added"
                  delay={0.6}
                  className="absolute -left-16 top-10 hidden sm:flex z-20"
                />
                <FloatingCard
                  icon="🔐"
                  title="Policy Updated"
                  subtitle="Global Access Control"
                  delay={0.9}
                  className="absolute -right-12 bottom-28 hidden sm:flex z-20"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
