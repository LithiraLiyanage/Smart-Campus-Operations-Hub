import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Network, X } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const LandingNavbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = useMemo(
    () => [
      { label: 'Home', href: '#home' },
      { label: 'About Us', href: '#about' },
      { label: 'Contact Us', href: '#contact' },
    ],
    []
  );

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 transition-all duration-300 bg-campus-navy/70 backdrop-blur-lg border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Network className="h-8 w-8 text-campus-electric mr-3" />
            <span className="text-white font-bold text-2xl tracking-wide">
              Smart <span className="text-campus-electric">Campus</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-campus-lavender hover:text-white transition-colors duration-200 font-medium tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onLoginClick}
              className="hidden sm:inline-flex px-5 py-2.5 text-campus-lavender hover:text-white font-semibold transition-colors duration-200"
            >
              Login
            </button>
            <button 
              onClick={onSignUpClick}
              className="hidden sm:inline-flex px-6 py-2.5 rounded-full bg-gradient-to-r from-campus-electric to-campus-purple text-white font-semibold shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300"
            >
              Sign Up
            </button>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="sm:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <motion.div
        initial={false}
        animate={mobileOpen ? 'open' : 'closed'}
        variants={{
          open: { height: 'auto', opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="sm:hidden overflow-hidden border-t border-white/10 bg-campus-navy/80 backdrop-blur-lg"
      >
        <div className="px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl text-campus-lavender hover:text-white hover:bg-white/5 transition"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onLoginClick();
              }}
              className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onSignUpClick();
              }}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-campus-electric to-campus-purple text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default LandingNavbar;
