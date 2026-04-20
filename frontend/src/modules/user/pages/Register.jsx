import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// ─── Animated input field ─────────────────────────────────────────────────────
const FormInput = ({ id, label, type, name, value, onChange, placeholder, icon, required }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-on-surface/70 mb-1.5">
        {label}
      </label>
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 3px rgba(91,60,221,0.22)"
            : "0 0 0 0px rgba(91,60,221,0)",
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-full"
      >
        {/* Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/35 pointer-events-none z-10">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          autoComplete={
            type === "password" ? "new-password" : type === "email" ? "email" : "username"
          }
          className="w-full bg-surface-container-highest/80 rounded-full py-3.5 pl-11 pr-5 text-sm text-on-surface placeholder:text-on-surface/30 outline-none border border-transparent transition-all duration-200 focus:bg-surface-container-highest focus:border-primary/15"
        />
      </motion.div>
    </div>
  );
};

// ─── Avatar stack ─────────────────────────────────────────────────────────────
const avatarUrls = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80",
];

// ─── Main Register Component ──────────────────────────────────────────────────
function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { name, email, password } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ── Backend call — identical logic to original ────────────────────────────
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/users", user);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #0ea5e9 100%)",
      }}
    >
      {/* ── Decorative background blobs ─────────────────────────────────── */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.08)", filter: "blur(60px)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-100px] right-[-80px] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgba(161,46,112,0.25)", filter: "blur(70px)" }}
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-[10%] w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.05)", filter: "blur(40px)" }}
      />

      {/* ── Main card ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: "rgba(15, 23, 42, 0.82)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          boxShadow:
            "0 32px 80px rgba(37,99,235,0.35), 0 8px 24px rgba(37,99,235,0.18), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div className="px-8 pt-10 pb-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="flex items-center justify-center gap-2 mb-7"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <span className="font-headline font-extrabold text-xl text-on-surface tracking-tight">
              CampusFlow
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-center mb-7"
          >
            <h1 className="font-headline text-[2rem] font-extrabold text-on-surface tracking-tight leading-tight mb-2">
              Create Account
            </h1>
            <p className="text-sm text-on-surface/55">
              Join the{" "}
              <span className="editorial-text text-primary text-[15px]">
                academic futurist
              </span>{" "}
              community
            </p>
          </motion.div>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 bg-red-900/20 border border-red-900/50 rounded-2xl px-4 py-3">
                  <svg
                    className="w-4 h-4 text-red-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-red-400 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={onSubmit}
            noValidate
            className="space-y-4"
          >
            {/* Username */}
            <FormInput
              id="name"
              label="Username"
              type="text"
              name="name"
              value={name}
              onChange={onInputChange}
              placeholder="Choose a unique handle"
              required
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />

            {/* Email */}
            <FormInput
              id="email"
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={onInputChange}
              placeholder="Your institutional email"
              required
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              }
            />

            {/* Password */}
            <FormInput
              id="password"
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={onInputChange}
              placeholder="At least 8 characters"
              required
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />

            {/* Register button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group w-full mt-2 py-3.5 rounded-full bg-brand-gradient text-white font-semibold text-sm shadow-card hover:shadow-card-hover transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Creating Account…
                </>
              ) : (
                <>
                  Register
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    animate={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-on-surface/55 mt-6 mb-5"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:text-primary-container hover:underline transition-all duration-200"
            >
              Log In
            </Link>
          </motion.p>

          {/* Footer links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-5"
          >
            {["Privacy Policy", "Terms of Service"].map((link) => (
              <Link
                key={link}
                to="#"
                className="text-[11px] text-on-surface/35 hover:text-primary transition-colors duration-200"
              >
                {link}
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom social proof bar ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.55 }}
        className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-8 sm:px-12"
      >
        {/* Avatar stack */}
        <div className="flex items-center">
          {avatarUrls.map((url, i) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.08 }}
              className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden -ml-2 first:ml-0 shadow-md"
              style={{ zIndex: avatarUrls.length - i }}
            >
              <img
                src={url}
                alt={`Educator ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Social proof text */}
        <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
          Join 40,000+ Educators
        </p>
      </motion.div>
    </div>
  );
}

export default Register;