import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './AppLayout.css';

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const adminNavItems = [
    {
      section: "Main",
      items: [
        {
          path: '/admin',
          label: 'Dashboard',
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          path: '/admin/facilities',
          label: 'Facilities',
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
      ]
    },
    {
      section: "Bookings",
      items: [
        {
          path: '/admin/bookings',
          label: 'Booking Management',
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
        },
      ]
    }
  ];

  const userNavItems = [
    {
      section: "Main",
      items: [
        {
          path: '/dashboard',
          label: 'Dashboard',
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          path: '/dashboard/facilities',
          label: 'Facilities',
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
      ]
    },
    {
      section: "Bookings",
      items: [
        {
          path: '/dashboard/bookings/new',
          label: 'New Booking',
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v16m8-8H4" />
            </svg>
          ),
        },
        {
          path: '/dashboard/bookings',
          label: 'My Bookings',
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
      ]
    }
  ];

  const navItems = user?.role === 'ADMIN' ? adminNavItems : userNavItems;

  // Get current page label for breadcrumb
  const getCurrentLabel = () => {
    const allItems = navItems.flatMap(s => s.items);
    return allItems.find(i => i.path === location.pathname)?.label || 'Dashboard';
  };

  const getInitials = (name: string) => {
    return name ? name.slice(0, 2).toUpperCase() : 'U';
  };

  return (
    <div className="app-layout">

      {/* ── Sidebar ── */}
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <h2>Smart Campus</h2>
              <span>Operations Hub</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section}>
              {!collapsed && (
                <div className="nav-section-label">{section.section}</div>
              )}
              {section.items.map((item) => (
                <div
                  key={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className="nav-item-icon">{item.icon}</div>
                  {!collapsed && (
                    <span className="nav-item-text">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Role badge */}
        {!collapsed && (
          <div className="nav-role-badge">
            <div className={`role-dot ${user?.role === 'ADMIN' ? 'admin' : 'user'}`} />
            <span className="role-text">
              {user?.role === 'ADMIN' ? 'Administrator' : 'Standard User'}
            </span>
          </div>
        )}

        {/* Footer user */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {getInitials(user?.username || 'U')}
            </div>
            {!collapsed && (
              <div className="user-info-text">
                <div className="user-name">{user?.username || 'User'}</div>
                <div className="user-role-label">{user?.role || 'USER'}</div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Main area ── */}
      <div className="main-area">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {collapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h8M4 18h16" />
                )}
              </svg>
            </button>
            <div className="breadcrumb">
              <span>Smart Campus</span>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">{getCurrentLabel()}</span>
            </div>
          </div>

          <div className="topbar-right">
            <span className="topbar-greeting">
              Welcome, <strong>{user?.username || 'User'}</strong>
            </span>
            <span className={`topbar-role-badge ${user?.role === 'ADMIN' ? 'admin' : 'user'}`}>
              {user?.role || 'USER'}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="main-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AppLayout;