import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
// import ProtectedRoute from './components/auth/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FacilitiesModule from './pages/admin/FacilitiesModule';
import UserDashboard from './pages/user/UserDashboard';
import Error403 from './pages/Error403';

// Module B — Booking
import BookingFormPage from './pages/user/BookingFormPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<Error403 />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          // <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout />
          // </ProtectedRoute>
        }
      >
        <Route index element={<div>Admin Dashboard Home. Navigate to Facilities.</div>} />
        <Route path="facilities" element={<FacilitiesModule />} />
        {/* Module B — Admin Bookings */}
        <Route path="bookings" element={<AdminBookingsPage />} />
      </Route>

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          // <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
            <AppLayout />
          // </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="facilities" element={<FacilitiesModule viewOnly />} />
        {/* Module B — User Bookings */}
        <Route path="bookings/new" element={<BookingFormPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="bookings/user/:userId" element={<MyBookingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;