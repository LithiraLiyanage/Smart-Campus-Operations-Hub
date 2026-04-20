import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function useCountUp({ target, durationMs, start }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (!start) return;
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [durationMs, start, target]);

  return value;
}

const StatIcon = ({ children }) => (
  <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-white/5 flex items-center justify-center text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(59,130,246,0.15)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_30px_rgba(59,130,246,0.4)] transition-shadow duration-300">
    {children}
  </div>
);

const Stats = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const items = useMemo(
    () => [
      { k: "active", label: "Active Connections", value: 12480, suffix: "+", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H2v-2a4 4 0 014-4h1m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 10-8 0 4 4 0 008 0z" />
        </svg>
      ) },
      { k: "uptime", label: "Network Uptime", value: 999, suffix: "‰", display: "99.99%", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) },
      { k: "tickets", label: "Operations Resolved", value: 7320, suffix: "+", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7 7h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
        </svg>
      ) },
      { k: "resources", label: "Entities Tracked", value: 1640, suffix: "k", display: "1.64M", icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M7 3v4m10-4v4M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ) },
    ],
    []
  );

  const v0 = useCountUp({ target: items[0].value, durationMs: 900, start: inView });
  const v2 = useCountUp({ target: items[2].value, durationMs: 950, start: inView });
  // const v3 = useCountUp({ target: items[3].value, durationMs: 850, start: inView });

  return (
    <section className="relative py-20 sm:py-24 bg-surface border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full opacity-20 pointer-events-none mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-3">
              Built for Scale
            </p>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Uncompromising <span className="text-white/40">Performance</span>
            </h2>
          </div>
          <p className="text-base text-on-surface/50 max-w-md leading-relaxed font-medium">
             Engineered specifically for high-velocity environments where milliseconds matter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((s, i) => {
            const computed =
              s.k === "active" ? `${v0.toLocaleString()}${s.suffix}` :
              s.k === "uptime" ? s.display :
              s.k === "tickets" ? `${v2.toLocaleString()}${s.suffix}` :
              s.display;

            return (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
                className="group relative bg-[#060913] rounded-2xl p-7 transition-all duration-300 border border-white/5 hover:border-white/10"
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                {/* Glow border effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-tertiary/10 transition-colors duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <StatIcon>{s.icon}</StatIcon>
                </div>
                <div className="relative z-10 mt-8">
                  <p className="text-sm font-medium text-on-surface/50">{s.label}</p>
                  <p className="mt-2 font-sans text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    {computed}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
