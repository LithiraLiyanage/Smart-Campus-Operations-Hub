import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import DashboardFooter from "../components/layout/DashboardFooter";

// ─── Mock data (replace with real API calls as backend evolves) ───────────────
const STATS = [
  {
    id: "active",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    value: 3,
    label: "Active Bookings",
    sub: "Next: Lab 402 @ 2PM",
    color: "text-primary bg-primary/10",
  },
  {
    id: "pending",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    value: 1,
    label: "Pending Bookings",
    sub: "Awaiting approval",
    color: "text-amber-600 bg-amber-50",
  },
  {
    id: "open",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    value: 2,
    label: "Open Tickets",
    sub: "Issues in progress",
    color: "text-tertiary bg-tertiary/10",
  },
  {
    id: "resolved",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    value: 5,
    label: "Resolved Tickets",
    sub: "Resolved this month",
    color: "text-emerald-600 bg-emerald-50",
  },
];

const BOOKINGS = [
  { id: 1, resource: "Advanced Robotics Lab", datetime: "Oct 24, 2:00 PM", status: "APPROVED" },
  { id: 2, resource: "Study Room 201", datetime: "Oct 25, 10:00 AM", status: "PENDING" },
  { id: 3, resource: "Main Auditorium", datetime: "Oct 28, 4:30 PM", status: "APPROVED" },
];

const TICKETS = [
  { id: "#CF-8921", resource: "3D Printer B-02", status: "In Progress", statusColor: "bg-blue-500", technician: "John Smith", techInitials: "JS", techColor: "bg-secondary" },
  { id: "#CF-8944", resource: "Room 102 Projector", status: "Open", statusColor: "bg-red-500", technician: null, techInitials: null, techColor: null },
];

const ACTIVITY = [
  {
    icon: "✅",
    title: "Booking approved",
    body: "Your lab session for Tomorrow is confirmed.",
    time: "10 MINS AGO",
    bg: "bg-primary/5",
    iconBg: "bg-primary/15 text-primary",
  },
  {
    icon: "🔄",
    title: "Ticket updated",
    body: "Technician John Smith is on his way to help with 3D Printer B-02.",
    time: "2 HOURS AGO",
    bg: "bg-secondary/5",
    iconBg: "bg-secondary/15 text-secondary",
  },
  {
    icon: "🔔",
    title: "Campus Alert",
    body: "South Wing cafeteria will be closed for maintenance at 5 PM.",
    time: "YESTERDAY",
    bg: "bg-tertiary/5",
    iconBg: "bg-tertiary/15 text-tertiary",
  },
];

const QUICK_ACTIONS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    label: "Book a Resource",
    sub: "Reserve labs or rooms",
    bg: "bg-brand-gradient",
    to: "/dashboard#bookings",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Report an Issue",
    sub: "Technical or facility tickets",
    bg: "bg-gradient-to-br from-tertiary to-secondary",
    to: "/dashboard#tickets",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    label: "View All Bookings",
    sub: "Manage your history",
    bg: "bg-gradient-to-br from-primary to-primary-container",
    to: "/dashboard#bookings",
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    APPROVED: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    CANCELLED: "bg-red-100 text-red-600",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${styles[status] || "bg-surface-container-highest text-on-surface/60"}`}>
      {status}
    </span>
  );
};

// ─── Section wrapper with fade-in ────────────────────────────────────────────
const Section = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Glass card ──────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = "", hover = false }) => (
  <div
    className={`glass-panel rounded-2xl ${hover ? "hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 cursor-default" : ""} ${className}`}
  >
    {children}
  </div>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────
const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface relative overflow-x-hidden">
      {/* Ambient background radial glows */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #5b3cdd 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #a12e70 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <DashboardNavbar />

      {/* ── Page body ──────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        {/* ── Hero Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-1.5">
            Dashboard
          </h1>
          <p className="text-sm text-on-surface/55">
            Manage your campus resources and track active requests in real-time.
          </p>
        </motion.div>

        {/* ── Stats Row ────────────────────────────────────────────────── */}
        <Section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(91,60,221,0.13)" }}
              className="glass-panel rounded-2xl p-5 transition-all duration-300 cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="font-headline font-extrabold text-3xl text-on-surface leading-none">
                  {stat.value}
                </span>
              </div>
              <p className="font-headline font-bold text-sm text-on-surface mb-0.5">{stat.label}</p>
              <p className="text-[11px] text-on-surface/45">{stat.sub}</p>
            </motion.div>
          ))}
        </Section>

        {/* ── Main 2-Column Layout ──────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">

          {/* Left: Upcoming Bookings (2/3 width) */}
          <Section className="lg:col-span-2" id="bookings">
            <GlassCard className="p-0 overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-surface-container-highest/60">
                <h2 className="font-headline font-bold text-base text-on-surface">Upcoming Bookings</h2>
                <Link
                  to="/dashboard"
                  className="text-xs font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-1"
                >
                  See full calendar
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="text-left text-[10px] font-bold tracking-widest text-on-surface/40 uppercase px-6 py-3">Resource Name</th>
                      <th className="text-left text-[10px] font-bold tracking-widest text-on-surface/40 uppercase px-4 py-3">Date & Time</th>
                      <th className="text-left text-[10px] font-bold tracking-widest text-on-surface/40 uppercase px-4 py-3">Status</th>
                      <th className="text-right text-[10px] font-bold tracking-widest text-on-surface/40 uppercase px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest/40">
                    {BOOKINGS.map((b, i) => (
                      <motion.tr
                        key={b.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        className="hover:bg-surface-container-low/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-on-surface">{b.resource}</td>
                        <td className="px-4 py-4 text-sm text-on-surface/60">{b.datetime}</td>
                        <td className="px-4 py-4"><StatusBadge status={b.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button className="text-xs font-semibold text-primary hover:text-primary-container transition-colors">Details</button>
                            <button className="text-xs font-semibold text-tertiary hover:text-red-500 transition-colors">Cancel</button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </Section>

          {/* Right: Quick Actions + Image Card (1/3 width) */}
          <Section className="flex flex-col gap-4">
            <GlassCard className="p-5">
              <h2 className="font-headline font-bold text-base text-on-surface mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {QUICK_ACTIONS.map((action) => (
                  <Link to={action.to} key={action.label}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-surface-container-low transition-all duration-200 group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-200`}>
                        {action.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{action.label}</p>
                        <p className="text-[11px] text-on-surface/45">{action.sub}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </GlassCard>

            {/* Decorative image card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-2xl aspect-[4/3] flex-shrink-0"
            >
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80"
                alt="Campus library"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="editorial-text text-white text-sm leading-snug">
                  Empowering your academic journey through seamless operations.
                </p>
              </div>
            </motion.div>
          </Section>
        </div>

        {/* ── Secondary 2-Column Layout ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: Recent Tickets (2/3) */}
          <Section className="lg:col-span-2" id="tickets">
            <GlassCard className="p-0 overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-surface-container-highest/60">
                <h2 className="font-headline font-bold text-base text-on-surface">Recent Tickets</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="text-left text-[10px] font-bold tracking-widest text-on-surface/40 uppercase px-6 py-3">Ticket ID</th>
                      <th className="text-left text-[10px] font-bold tracking-widest text-on-surface/40 uppercase px-4 py-3">Resource</th>
                      <th className="text-left text-[10px] font-bold tracking-widest text-on-surface/40 uppercase px-4 py-3">Status</th>
                      <th className="text-left text-[10px] font-bold tracking-widest text-on-surface/40 uppercase px-6 py-3">Technician</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest/40">
                    {TICKETS.map((t, i) => (
                      <motion.tr
                        key={t.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.07 }}
                        className="hover:bg-surface-container-low/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-mono font-semibold text-on-surface/70">{t.id}</td>
                        <td className="px-4 py-4 text-sm font-medium text-on-surface">{t.resource}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${t.statusColor} animate-pulse`} />
                            <span className="text-sm text-on-surface/70">{t.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {t.technician ? (
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg ${t.techColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                                {t.techInitials}
                              </div>
                              <span className="text-sm text-on-surface/70">{t.technician}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-on-surface/35 italic">Unassigned</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </Section>

          {/* Right: Activity Feed (1/3) */}
          <Section>
            <GlassCard className="p-5 flex flex-col h-full">
              <h2 className="font-headline font-bold text-base text-on-surface mb-4">Activity</h2>
              <div className="space-y-3 flex-1">
                {ACTIVITY.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className={`flex items-start gap-3 p-3 rounded-xl ${item.bg}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-on-surface leading-snug">{item.title}</p>
                      <p className="text-[11px] text-on-surface/55 leading-snug mt-0.5">{item.body}</p>
                      <p className="text-[9px] font-bold tracking-widest text-on-surface/30 mt-1.5 uppercase">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full text-xs font-semibold text-on-surface/40 hover:text-primary border border-surface-container-highest rounded-xl py-2.5 transition-all duration-200 hover:bg-primary/5"
              >
                Clear All Notifications
              </motion.button>
            </GlassCard>
          </Section>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
