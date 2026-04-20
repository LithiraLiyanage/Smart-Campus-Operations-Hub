import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ThemeToggle from "../ui/ThemeToggle";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread] = useState(3);

  // Fetch logged-in user name from backend
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:8080/users/${userId}`)
        .then((res) => setUserName(res.data.name || "User"))
        .catch(() => setUserName("User"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberMe");
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Home" },
    { to: "/dashboard#bookings", label: "Bookings" },
    { to: "/dashboard#tickets", label: "Tickets" },
    { to: "/userProfile", label: "Profile" },
  ];

  const isActive = (to) => location.pathname === to.split("#")[0];

  const firstName = userName.split(" ")[0] || "User";

  return (
    <header className="sticky top-0 z-50 bg-surface-container-low/80 backdrop-blur-md border-b border-surface-container-highest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L1 9l11 6 11-6-11-6zM1 17l11 6 11-6M1 13l11 6 11-6" />
              </svg>
            </div>
            <span className="font-headline font-extrabold text-base text-on-surface tracking-tight">
              Campus<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-primary bg-primary/20"
                    : "text-on-surface/60 hover:text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="dash-nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Hello + Bell + Avatar + Logout */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Greeting */}
            <span className="hidden sm:block text-sm text-on-surface/60">
              Hello,{" "}
              <span className="editorial-text text-primary text-base font-medium">
                {firstName}!
              </span>
            </span>

            {/* Theme Toggle */}
            <ThemeToggle className="mr-1" />

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container-highest flex items-center justify-center text-on-surface/50 hover:text-primary transition-all duration-200"
                aria-label="Notifications"
              >
                <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tertiary text-white text-[9px] font-bold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-11 w-72 bg-surface-container-highest rounded-2xl shadow-card-hover border border-surface-container-highest p-3 z-50"
                  >
                    <p className="text-xs font-bold text-on-surface/40 uppercase tracking-widest px-2 mb-2">Notifications</p>
                    {[
                      { icon: "✅", text: "Booking approved — Lab A", time: "10m ago", color: "bg-primary/8" },
                      { icon: "🎫", text: "Ticket #CF-8921 updated", time: "2h ago", color: "bg-secondary/8" },
                      { icon: "🔔", text: "Campus Alert — South Wing", time: "Yesterday", color: "bg-tertiary/8" },
                    ].map((n, i) => (
                      <div key={i} className={`flex items-start gap-2.5 px-2 py-2 rounded-xl ${n.color} mb-1`}>
                        <span className="text-base leading-none mt-0.5">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-on-surface leading-snug">{n.text}</p>
                          <p className="text-[10px] text-on-surface/40 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="w-full text-center text-xs text-on-surface/40 hover:text-primary transition-colors mt-1 py-1"
                    >
                      Clear All
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <Link to="/userProfile">
              <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-sm font-bold shadow-sm hover:scale-110 transition-transform">
                {firstName.charAt(0).toUpperCase()}
              </div>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden sm:block text-xs font-bold tracking-widest text-tertiary hover:text-red-500 uppercase transition-colors duration-200 px-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
