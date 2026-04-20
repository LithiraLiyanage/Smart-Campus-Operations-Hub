import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Sign Up",
    description:
      "Create your profile using your university email and student credentials.",
    color: "from-primary to-primary-container",
    shadow: "shadow-primary/20",
  },
  {
    step: "02",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Choose Resource",
    description:
      "Browse available rooms, labs, or equipment and filter by availability.",
    color: "from-secondary to-primary",
    shadow: "shadow-secondary/20",
  },
  {
    step: "03",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Book or Report",
    description:
      "Instantly reserve your spot or submit a maintenance issue in real-time.",
    color: "from-tertiary to-secondary",
    shadow: "shadow-tertiary/20",
  },
  {
    step: "04",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "Get Updates",
    description:
      "Receive instant confirmation and status updates directly in your dashboard.",
    color: "from-emerald-500 to-primary",
    shadow: "shadow-emerald-500/20",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-24 bg-surface-container-lowest relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(91,60,221,0.04) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(116,89,247,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-4">
            How{" "}
            <span className="editorial-text gradient-text">CampusFlow</span>{" "}
            Works
          </h2>
          <p className="text-sm text-on-surface/50 max-w-md mx-auto">
            Get from idea to execution in four simple steps.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-surface-container-highest z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.15, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Icon circle */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg ${step.shadow} flex items-center justify-center text-white mb-5`}
              >
                {step.icon}
              </motion.div>

              {/* Step number */}
              <span className="text-xs font-bold text-on-surface/30 tracking-widest mb-2">
                STEP {step.step}
              </span>

              <h3 className="font-headline font-bold text-base text-on-surface mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-on-surface/55 leading-relaxed max-w-[180px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
