import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #172554 100%)",
        }}
      >
        {/* Background shimmer blobs */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #fff 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #172554 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 py-16 px-8 sm:px-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-white/70 text-sm font-medium tracking-widest uppercase mb-4"
          >
            Join thousands of students and staff
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.65 }}
            className="font-headline text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4"
          >
            Start Managing Your{" "}
            <span className="editorial-text opacity-90">Campus Experience</span>{" "}
            Today
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-white/65 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Join thousands of students and staff already streamlining campus life
            with CampusFlow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-surface-container-highest text-primary font-bold text-sm shadow-glass border border-surface-container-highest hover:shadow-card-hover hover:scale-105 hover:bg-surface hover:text-primary transition-all duration-300"
            >
              Create Your Account
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-6 mt-10 text-white/50 text-xs"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free for students
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Setup in minutes
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
