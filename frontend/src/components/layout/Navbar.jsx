import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isHash = typeof to === "string" && to.startsWith("/#");
  const targetHash = isHash ? to.replace("/", "") : "";
  const isActive = isHash
    ? location.pathname === "/" && location.hash === targetHash
    : location.pathname === to;

  const handleClick = (e) => {
    if (isHash) {
      e.preventDefault();
      const id = targetHash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", targetHash);
      if (onClick) onClick();
      return;
    }
    if (onClick) onClick();
  };
  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`relative text-sm font-medium transition-colors duration-200 group ${
        isActive ? "text-primary" : "text-on-surface/70 hover:text-primary"
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-gradient-to-r from-primary to-tertiary transition-all duration-300 ${
          isActive ? "w-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" : "w-0 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        }`}
      />
    </Link>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const setRipple = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--rx", `${x}%`);
    el.style.setProperty("--ry", `${y}%`);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/#stats", label: "Stats" },
    { to: "/#features", label: "Features" },
    { to: "/#resources", label: "Resources" },
    { to: "/#how-it-works", label: "How It Works" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/50 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3L1 9l11 6 11-6-11-6zM1 17l11 6 11-6M1 13l11 6 11-6"
                />
              </svg>
            </div>
            <span className="font-headline font-bold text-lg text-on-surface tracking-tight">
              Campus<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/userProfile"
                  className="text-sm font-medium text-primary hover:text-primary-container transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  onPointerDown={setRipple}
                  className="btn-ripple text-sm font-medium px-4 py-2 rounded-xl border border-primary/20 text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors duration-200 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-ripple relative text-sm font-semibold px-6 py-2.5 rounded-xl text-white overflow-hidden group transition-all duration-300 hover:scale-105"
                  onPointerDown={setRipple}
                >
                  <span className="absolute inset-0 bg-brand-gradient" />
                  <span className="absolute inset-0 bg-gradient-to-r from-tertiary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute inset-0 shadow-glow-blue opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-1.5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                    Get Started
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-surface-container-low transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-on-surface rounded-full transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-on-surface rounded-full transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-on-surface rounded-full transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-3 space-y-1 border-t border-surface-container-highest mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-on-surface/70 hover:text-primary hover:bg-surface-container-low rounded-xl transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 flex flex-col gap-2 px-4">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-center text-sm font-medium py-2.5 rounded-xl border border-surface-container-highest hover:border-primary/30 text-on-surface/70 hover:text-primary transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-center text-sm font-semibold py-2.5 rounded-xl bg-brand-gradient text-white shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
