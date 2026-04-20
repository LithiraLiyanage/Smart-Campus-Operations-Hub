import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import DashboardNavbar from "../../../components/layout/DashboardNavbar";
import DashboardFooter from "../../../components/layout/DashboardFooter";

// ─── Reusable profile input field ────────────────────────────────────────────
const ProfileField = ({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  readOnly,
  rightSlot,
  hint,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold tracking-[0.14em] text-on-surface/40 uppercase"
      >
        {label}
      </label>
      <motion.div
        animate={{
          boxShadow: focused && !readOnly
            ? "0 0 0 3px rgba(91,60,221,0.18)"
            : "0 0 0 0px rgba(91,60,221,0)",
        }}
        transition={{ duration: 0.18 }}
        className={`relative rounded-xl overflow-hidden transition-colors duration-200 ${
          readOnly ? "bg-surface" : "bg-surface-container-highest"
        }`}
      >
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          readOnly={readOnly}
          autoComplete={
            type === "password" ? "new-password" : type === "email" ? "email" : "name"
          }
          className={`w-full py-3.5 pl-4 pr-11 text-sm outline-none transition-all duration-200 bg-transparent ${
            readOnly
              ? "text-on-surface cursor-default select-none"
              : "text-on-surface placeholder:text-on-surface/30 cursor-text"
          }`}
        />
        {/* Right slot (lock / eye toggle) */}
        {rightSlot && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface/30">
            {rightSlot}
          </div>
        )}
      </motion.div>
      {hint && (
        <p className="text-[11px] text-on-surface/40 leading-snug">{hint}</p>
      )}
    </div>
  );
};

// ─── Main UserProfile Component ───────────────────────────────────────────────
function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState("synced"); // synced | saving | saved | error
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const deleteRef = useRef(null);

  const userId = localStorage.getItem("userId");

  // ── Fetch user data on mount ────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    axios
      .get(`http://localhost:8080/users/${userId}`)
      .then((res) => {
        setUser({ name: res.data.name || "", email: res.data.email || "", password: "" });
        setLoading(false);
      })
      .catch(() => {
        setFetchError("Failed to load profile data. Please try again.");
        setLoading(false);
      });
  }, [userId, navigate]);

  // Close delete confirm on outside click
  useEffect(() => {
    const handler = (e) => {
      if (deleteRef.current && !deleteRef.current.contains(e.target)) {
        setDeleteConfirm(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (saveStatus !== "saving") setSaveStatus("unsaved");
  };

  // ── Edit / Save toggle ──────────────────────────────────────────────────
  const handleEditSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      setSaveStatus("editing");
      return;
    }

    setSaveStatus("saving");
    const payload = { name: user.name, email: user.email };
    if (user.password.trim()) payload.password = user.password;

    try {
      await axios.put(`http://localhost:8080/users/${userId}`, payload);
      setSaveStatus("synced");
      setIsEditing(false);
      setUser((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setSaveStatus("error");
    }
  };

  // ── Cancel editing ──────────────────────────────────────────────────────
  const handleCancel = () => {
    setIsEditing(false);
    setSaveStatus("synced");
    // Optionally re-fetch to reset to server values
    axios.get(`http://localhost:8080/users/${userId}`).then((res) => {
      setUser({ name: res.data.name || "", email: res.data.email || "", password: "" });
    });
  };

  // ── Delete account ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/users/${userId}`);
      localStorage.removeItem("userId");
      localStorage.removeItem("rememberMe");
      navigate("/register");
    } catch {
      alert("Failed to delete account. Please try again.");
    }
  };

  // ─── Status badge on the right of the actions row ─────────────────────
  const StatusIndicator = () => {
    const configs = {
      synced: { icon: "↻", text: "All changes synced", color: "text-primary" },
      saved:  { icon: "✓", text: "Changes saved", color: "text-emerald-600" },
      saving: { icon: "↻", text: "Saving…", color: "text-on-surface/40" },
      error:  { icon: "!", text: "Save failed", color: "text-red-500" },
      editing:{ icon: "✎", text: "Editing…", color: "text-amber-500" },
      unsaved:{ icon: "●", text: "Unsaved changes", color: "text-amber-500" },
    };
    const cfg = configs[saveStatus] || configs.synced;
    return (
      <motion.div
        key={saveStatus}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}
      >
        <span
          className={`text-sm ${saveStatus === "saving" ? "animate-spin inline-block" : ""}`}
        >
          {cfg.icon}
        </span>
        <span>{cfg.text}</span>
      </motion.div>
    );
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <DashboardNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full"
              style={{ borderWidth: 3 }}
            />
            <p className="text-sm text-on-surface/40">Loading your profile…</p>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface relative overflow-x-hidden">
      {/* ── Ambient background radial glows ──────────────────────────── */}
      <div
        className="fixed top-[-100px] right-[-80px] w-[480px] h-[480px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #1e40af 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="fixed bottom-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full pointer-events-none opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #1e1b4b 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[480px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(ellipse, #2563eb 0%, transparent 65%)", filter: "blur(100px)" }}
      />

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <DashboardNavbar />

      {/* ── Page body ────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl"
        >
          {/* ── Main glass card ─────────────────────────────────────── */}
          <div
            className="rounded-3xl px-10 py-12 border border-surface-container-highest"
            style={{
              background: "rgba(15, 23, 42, 0.82)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              boxShadow:
                "0 24px 64px rgba(37,99,235,0.10), 0 4px 16px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Heading */}
            <div className="text-center mb-10">
              <h1 className="font-headline font-extrabold text-[2.4rem] text-on-surface tracking-tight leading-none mb-2">
                My Profile
              </h1>
              <p className="editorial-text text-primary text-lg">
                Curating your academic journey
              </p>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {fetchError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-red-600 font-medium">{fetchError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form fields ─────────────────────────────────────── */}
            <div className="space-y-6">
              {/* Row 1: Full Name + Email (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ProfileField
                  id="name"
                  label="Full Name"
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInput}
                  placeholder="Your full name"
                  readOnly={!isEditing}
                  rightSlot={
                    !isEditing ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : null
                  }
                />
                <ProfileField
                  id="email"
                  label="Email Address"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInput}
                  placeholder="your@email.com"
                  readOnly={!isEditing}
                  rightSlot={
                    !isEditing ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : null
                  }
                />
              </div>

              {/* Row 2: Update Password (full width) */}
              <ProfileField
                id="password"
                label="Update Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleInput}
                placeholder="Leave blank to keep current"
                readOnly={!isEditing}
                hint="Must be at least 12 characters with one symbol."
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="hover:text-primary transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                }
              />
            </div>

            {/* ── Action Row ──────────────────────────────────────── */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-3">
                {/* Primary action: Edit / Save */}
                <motion.button
                  onClick={handleEditSave}
                  disabled={saveStatus === "saving"}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gradient text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saveStatus === "saving" ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Saving…
                    </>
                  ) : isEditing ? (
                    <>
                      Save Changes
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Edit Profile
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </>
                  )}
                </motion.button>

                {/* Cancel button (only in edit mode) */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.button
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      onClick={handleCancel}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-on-surface/60 hover:text-on-surface bg-surface-container-low hover:bg-surface-container-highest transition-all duration-200"
                    >
                      Cancel
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Status indicator */}
              <StatusIndicator />
            </div>

            {/* ── Divider ─────────────────────────────────────────── */}
            <div className="my-8 h-px bg-surface-container-highest/60" />

            {/* ── Danger Zone ─────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-headline font-bold text-sm text-on-surface mb-0.5">
                  Danger Zone
                </h3>
                <p className="text-xs text-on-surface/45 max-w-sm">
                  Permanently delete your account and all associated data.
                </p>
              </div>

              {/* Delete button / confirm */}
              <div ref={deleteRef} className="relative">
                <AnimatePresence mode="wait">
                  {deleteConfirm ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-2"
                    >
                      <p className="text-xs font-medium text-on-surface/60">Are you sure?</p>
                      <motion.button
                        onClick={handleDelete}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Yes, Delete
                      </motion.button>
                      <motion.button
                        onClick={() => setDeleteConfirm(false)}
                        whileHover={{ scale: 1.02 }}
                        className="px-4 py-2.5 rounded-xl text-xs font-medium text-on-surface/60 bg-surface-container-low hover:bg-surface-container-highest transition-all duration-200"
                      >
                        Cancel
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="delete-btn"
                      onClick={() => setDeleteConfirm(true)}
                      whileHover={{ scale: 1.03, backgroundColor: "rgba(161,46,112,0.12)" }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-tertiary bg-tertiary/8 hover:bg-tertiary/12 transition-all duration-300"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Account
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <DashboardFooter />
    </div>
  );
}

export default UserProfile;