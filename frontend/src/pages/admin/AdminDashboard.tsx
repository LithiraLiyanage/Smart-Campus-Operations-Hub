import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const cards = [
    {
      title: "Booking Management",
      description: "Review, approve or reject booking requests",
      count: null,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "#2563eb",
      bg: "#eff6ff",
      path: "/admin/bookings",
    },
    {
      title: "Facilities",
      description: "Manage campus facilities and resources",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "#7c3aed",
      bg: "#f5f3ff",
      path: "/admin/facilities",
    },
  ];

  return (
    <div className="admin-dashboard">

      {/* Welcome banner */}
      <div className="dashboard-banner">
        <div className="banner-text">
          <h1>Welcome back, <span>{user?.username}</span> 👋</h1>
          <p>Here's what's happening in Smart Campus today.</p>
        </div>
        <div className="banner-role">
          <span className="role-pill admin">🔧 Administrator</span>
        </div>
      </div>

      {/* Quick access cards */}
      <div className="dashboard-section-title">Quick Access</div>
      <div className="dashboard-cards">
        {cards.map((card) => (
          <div
            key={card.title}
            className="dashboard-card"
            onClick={() => navigate(card.path)}
          >
            <div className="card-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="card-body">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            <div className="card-arrow" style={{ color: card.color }}>→</div>
          </div>
        ))}
      </div>

      {/* Info section */}
      <div className="dashboard-section-title" style={{ marginTop: 32 }}>System Info</div>
      <div className="info-grid">
        <div className="info-card">
          <div className="info-icon" style={{ background: "#f0fdf4", color: "#059669" }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="info-title">System Status</div>
            <div className="info-value" style={{ color: "#059669" }}>All systems operational</div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="info-title">Logged in as</div>
            <div className="info-value">{user?.username}</div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="info-title">Access Level</div>
            <div className="info-value" style={{ color: "#d97706" }}>Administrator</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;