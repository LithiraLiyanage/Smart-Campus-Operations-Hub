import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout (wraps UpdateProfile — uses landing Navbar/Footer)
import MainLayout from "./layouts/MainLayout";

// Pages — standalone landing
import Home from "./pages/Home";

// Pages — standalone with DashboardNavbar+Footer
import Dashboard from "./pages/Dashboard";

// ── User module pages (src/modules/user/pages/) ────────────────────────────
import UserProfile from "./modules/user/pages/UserProfile";
import UpdateProfile from "./modules/user/pages/UpdateProfile";
import Register from "./modules/user/pages/Register";
import Login from "./modules/user/pages/Login";

// ── Facilities Resource Management Pages ───────────────────────────────────
import ResourceCataloguePage from "./pages/ResourceCataloguePage";
import ResourceDetailsPage from "./pages/ResourceDetailsPage";
import AddResourcePage from "./pages/AddResourcePage";

import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
      <Routes>
        {/* ── Landing page (standalone landing Navbar) ───────────────── */}
        <Route path="/" element={<Home />} />

        {/* ── App pages (standalone — use DashboardNavbar + DashboardFooter) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userProfile" element={<UserProfile />} />

        {/* ── Inner page still in MainLayout (landing Navbar) ───────── */}
        <Route element={<MainLayout />}>
          <Route path="/updateProfile/:id" element={<UpdateProfile />} />
        </Route>

        {/* ── Auth routes (full-screen standalone) ──────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Facilities Resource Management routes (standalone) ────── */}
        <Route path="/resources" element={<ResourceCataloguePage />} />
        <Route path="/resources/:id" element={<ResourceDetailsPage />} />
        <Route path="/add-resource" element={<AddResourcePage />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;