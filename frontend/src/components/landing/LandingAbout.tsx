import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, Sparkles } from 'lucide-react';

const LandingAbout: React.FC = () => {
  return (
    <section id="about" className="relative py-28 bg-campus-dark overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-campus-purple/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 right-0 w-[700px] h-[700px] bg-campus-electric/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Sparkles size={16} className="text-campus-electric" />
              <span className="text-xs tracking-[0.22em] font-semibold text-campus-lavender uppercase">
                Enterprise-grade campus platform
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              Built for clarity, control, and operational excellence.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-campus-lavender/90 leading-relaxed max-w-2xl"
            >
              Smart Campus Operations Hub unifies resource governance, booking workflows, and maintenance oversight into a single
              intelligent interface—designed to help universities operate faster, safer, and smarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              <div className="rounded-3xl bg-campus-navy/40 border border-white/10 backdrop-blur-xl p-6 shadow-2xl">
                <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Building2 size={18} className="text-campus-electric" />
                </div>
                <div className="mt-4">
                  <p className="text-white font-semibold tracking-wide">Operational visibility</p>
                  <p className="mt-2 text-sm text-campus-lavender/85 leading-relaxed">
                    Monitor and coordinate campus operations with consistent workflows, permissions, and auditable actions.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-campus-navy/40 border border-white/10 backdrop-blur-xl p-6 shadow-2xl">
                <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-fuchsia-300" />
                </div>
                <div className="mt-4">
                  <p className="text-white font-semibold tracking-wide">Premium UX by design</p>
                  <p className="mt-2 text-sm text-campus-lavender/85 leading-relaxed">
                    Clean layouts, elegant motion, and accessibility-first forms—ideal for demos, clients, and production.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div id="contact" className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-[2rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <p className="text-sm font-semibold tracking-[0.18em] uppercase text-campus-lavender/90">
                  Contact us
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white tracking-tight">
                  Ready to modernize campus operations?
                </h3>
                <p className="mt-3 text-sm text-campus-lavender/85 leading-relaxed">
                  For project demos, stakeholder walkthroughs, or technical support, reach out and we’ll respond quickly.
                </p>

                <div className="mt-7 space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <Mail size={16} className="text-campus-electric" />
                    <span className="text-sm text-white/90">support@smartcampus.local</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <Phone size={16} className="text-fuchsia-300" />
                    <span className="text-sm text-white/90">+94 11 000 0000</span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="mailto:support@smartcampus.local"
                    className="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-white text-campus-navy font-bold shadow-[0_0_24px_rgba(255,255,255,0.22)] hover:shadow-[0_0_34px_rgba(255,255,255,0.32)] hover:scale-[1.02] transition"
                  >
                    Email Us
                  </a>
                  <a
                    href="#home"
                    className="inline-flex items-center justify-center rounded-2xl px-5 py-3 border border-white/15 bg-white/5 text-white font-semibold hover:bg-white/10 hover:scale-[1.02] transition"
                  >
                    Back to top
                  </a>
                </div>
              </div>

              <div className="h-1.5 bg-gradient-to-r from-campus-electric via-fuchsia-400/70 to-campus-purple opacity-70" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAbout;

