import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// ─── BACKGROUND FX ────────────────────────────────────────────────────────────

const NoiseTexture = () => (
  <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const FloatingShape = ({ delay, duration, color, size, top, left }) => (
  <motion.div
    initial={{ y: 0, x: 0, opacity: 0.4 }}
    animate={{
      y: [0, -60, 0, 60, 0],
      x: [0, 40, 0, -40, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.15, 1],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    className="absolute rounded-full blur-[90px] opacity-60 pointer-events-none"
    style={{ backgroundColor: color, width: size, height: size, top, left, zIndex: 0 }}
  />
);

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

const ModernSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
      checked ? "bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]" : "bg-white/10 hover:bg-white/20"
    }`}
  >
    <motion.span
      layout
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-4 shadow-sm" : "translate-x-0.5"
      }`}
    />
  </button>
);

const FloatingInput = ({ id, type, label, value, onChange, error, icon, rightSlot, required }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative w-full mb-5">
      <motion.div
        animate={{
          boxShadow: focused
            ? error
              ? "0 0 0 2px rgba(239, 68, 68, 0.4)"
              : "0 0 0 2px rgba(168, 85, 247, 0.5), 0 4px 20px rgba(168, 85, 247, 0.15)"
            : "0 0 0 0px rgba(0, 0, 0, 0)",
        }}
        className={`relative flex items-center bg-white/[0.04] border ${
          error ? "border-red-500/40" : "border-white/10"
        } rounded-2xl transition-colors duration-300 hover:bg-white/[0.06]`}
      >
        <div
          className={`pl-4 pr-3 ${
            error ? "text-red-400" : focused ? "text-purple-400" : "text-white/40"
          } transition-colors`}
        >
          {icon}
        </div>
        <div className="relative w-full h-[56px] flex items-center">
          <motion.label
            htmlFor={id}
            initial={false}
            animate={{
              y: active ? -14 : 0,
              scale: active ? 0.75 : 1,
              color: error ? "#f87171" : active ? "#c084fc" : "rgba(255,255,255,0.4)",
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`absolute left-0 transform origin-left pointer-events-none z-10 font-medium ${
               !active ? "top-1/2 -translate-y-1/2" : "top-[18px]"
            }`}
          >
            {label} {required && "*"}
          </motion.label>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required={required}
            className="absolute inset-0 w-full h-full bg-transparent text-white pt-5 pb-1 px-0 outline-none text-sm font-medium"
            autoComplete={type === "password" ? "current-password" : "email"}
          />
        </div>
        {rightSlot && <div className="pr-4 pl-2 text-white/50">{rightSlot}</div>}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            className="text-[11px] font-medium text-red-400 mt-1.5 ml-2 tracking-wide"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── MAIN LOGIN PAGE ──────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passScore, setPassScore] = useState(0); // 0-3
  const [showPassword, setShowPassword] = useState(false);
  
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastError, setToastError] = useState("");

  // Validation Effects
  useEffect(() => {
    if (email) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setEmailError(isValid ? "" : "Please enter a valid email format");
    } else {
      setEmailError("");
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      let score = 0;
      if (password.length >= 6) score += 1;
      if (/[A-Z]/.test(password) || /[a-z]/.test(password)) score += 1;
      if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
      
      const isWeak = password.length < 6;
      setPassScore(isWeak ? 1 : score);
      setPassError(isWeak ? "Password must be at least 6 characters" : "");
    } else {
      setPassScore(0);
      setPassError("");
    }
  }, [password]);

  const isFormValid = email && password && !emailError && !passError;

  const getStrengthLabel = () => {
    if (!password) return "";
    if (passScore === 1) return "Weak";
    if (passScore === 2) return "Fair";
    return "Strong";
  };

  const getStrengthColor = (level) => {
    if (!password) return "bg-white/5";
    if (passScore >= level) {
      if (passScore === 1) return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
      if (passScore === 2) return "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]";
      return "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]";
    }
    return "bg-white/10";
  };

  // Submit Handler
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    
    setToastError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/login", { email, password });

      if (response.data?.id) {
        setSuccess(true);
        localStorage.setItem("userId", response.data.id);
        if (rememberMe) localStorage.setItem("rememberMe", "true");
        
        // Wait for success animation before navigating
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setToastError("Authentication failed. Please verify your credentials.");
        setLoading(false);
      }
    } catch (err) {
      setToastError(err.response?.data?.message || "Server Error. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-surface overflow-hidden sm:px-6 transition-colors duration-300">
      
      <NoiseTexture />
      
      {/* Background Neon Orbs */}
      <FloatingShape color="#3b82f6" size="400px" top="-5%" left="-5%" delay={0} duration={20} />
      <FloatingShape color="#a855f7" size="500px" top="40%" left="60%" delay={2} duration={25} />
      <FloatingShape color="#ec4899" size="300px" top="80%" left="15%" delay={4} duration={18} />
      <FloatingShape color="#06b6d4" size="350px" top="15%" left="80%" delay={1} duration={22} />

      {/* Grid pattern overlay for tech feel */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Error Toast */}
      <AnimatePresence>
        {toastError && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-6 right-6 lg:right-10 z-50 flex items-center gap-3 bg-red-950/40 backdrop-blur-xl border border-red-500/30 text-red-200 px-5 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(220,38,38,0.25)] max-w-sm"
          >
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-medium leading-snug">{toastError}</span>
            <button onClick={() => setToastError("")} className="ml-auto text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px] perspective-[1200px]"
      >
        <motion.div 
          whileHover={{ rotateX: 2, rotateY: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative bg-black/[0.02] dark:bg-white/[0.04] backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.08] p-8 sm:p-10 rounded-[2.5rem] shadow-[0_24px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_24px_40px_-10px_rgba(0,0,0,0.6)]"
          style={{ transformStyle: "preserve-3d", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.15)" }}
        >
          {/* Subtle top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Heading */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 rounded-2xl flex items-center justify-center mb-5 shadow-lg backdrop-blur-md"
            >
              <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-on-surface to-on-surface/60 dark:from-white dark:to-white/60 tracking-tight mb-2">
              Enter the Portal
            </h1>
            <p className="text-sm text-on-surface/50 dark:text-white/50 font-medium">Access your intelligent campus dashboard</p>
          </div>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-1">
            
            <FloatingInput
              id="email"
              type="email"
              label="Email Address"
              value={email}
              error={emailError}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />

            <div className="mb-2">
              <FloatingInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                error={passError}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                rightSlot={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-white transition-colors focus:outline-none p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                }
              />

              {/* Password Strength */}
              <AnimatePresence>
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between mt-1 px-1"
                  >
                    <div className="flex gap-1.5 w-full max-w-[60%]">
                      <div className={`h-1 flex-1 rounded-full transition-all duration-500 ease-out ${getStrengthColor(1)}`} />
                      <div className={`h-1 flex-1 rounded-full transition-all duration-500 ease-out ${getStrengthColor(2)}`} />
                      <div className={`h-1 flex-1 rounded-full transition-all duration-500 ease-out ${getStrengthColor(3)}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      {getStrengthLabel()}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between mb-8 mt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <ModernSwitch checked={rememberMe} onChange={setRememberMe} />
                <span className="text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Recover access
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={isFormValid && !loading && !success ? { scale: 1.02 } : {}}
              whileTap={isFormValid && !loading && !success ? { scale: 0.98 } : {}}
              disabled={!isFormValid || loading || success}
              className={`relative w-full py-4 rounded-2xl font-bold text-sm tracking-wide overflow-hidden transition-all duration-300 ${
                isFormValid 
                  ? "text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]" 
                  : "text-on-surface/30 dark:text-white/30 bg-black/5 dark:bg-white/5 cursor-not-allowed border border-black/10 dark:border-white/10"
              }`}
            >
              {isFormValid && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-90 layer-gradient" />
              )}
              {isFormValid && (
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 opacity-0 mix-blend-overlay"
                />
              )}
              
              <div className="relative z-10 flex items-center justify-center gap-2">
                {success ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Authorized
                  </motion.div>
                ) : loading ? (
                  <div className="flex items-center gap-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" />
                    Authenticating...
                  </div>
                ) : (
                  "Initialize Session"
                )}
              </div>
            </motion.button>

          </form>

          {/* Footer Area */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-white/40">
              New to the ecosystem?{" "}
              <Link to="/register" className="text-white hover:text-purple-400 transition-colors ml-1 border-b border-transparent hover:border-purple-400 pb-0.5">
                Create identity
              </Link>
            </p>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}