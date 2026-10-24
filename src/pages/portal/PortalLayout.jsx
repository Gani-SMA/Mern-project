import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, TicketCheck, Users, Palette, LogOut, Moon, Sun, Menu, X, ChevronRight,
} from "lucide-react";

export const PortalLayout = () => {
  const { user, logoutUser, theme, toggleTheme, currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const basePath = `/portal/${slug}`;

  const navItems = [
    { path: basePath, label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: `${basePath}/tickets`, label: "Tickets", icon: TicketCheck },
    // Developer-only items
    ...(currentRole === "developer"
      ? [
          { path: `${basePath}/employees`, label: "Employees", icon: Users },
          { path: `${basePath}/customize`, label: "Customize", icon: Palette },
        ]
      : []),
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar portal-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-text">RESOLVEIT</span>
            <span className="brand-sub">COMPANY PORTAL</span>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`sidebar-nav-item ${isActive(item) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && isActive(item) && <ChevronRight size={14} className="nav-arrow" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            {sidebarOpen && (
              <>
                <span className="user-name">{user?.name}</span>
                <span className="user-role-badge">{currentRole}</span>
              </>
            )}
          </div>
          <button className="sidebar-nav-item" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {sidebarOpen && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button className="sidebar-nav-item logout" onClick={handleLogout}>
            <LogOut size={18} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h2 className="topbar-title">{slug}</h2>
            <span className="topbar-subtitle">Company Portal</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-user">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{currentRole}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
