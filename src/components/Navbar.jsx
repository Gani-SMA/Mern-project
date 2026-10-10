import React from "react";
import { Sun, Moon, Lock, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Navbar = () => {
  const { 
    activeTab, 
    switchTab, 
    user,
    isAuthenticated, 
    openAuthModal, 
    logoutUser, 
    theme, 
    toggleTheme, 
    tickets,
    dbHealth
  } = useApp();

  const openTicketsCount = tickets.filter(
    (t) => t.status === "Open" || t.status === "Under Investigation" || t.status === "Escalated"
  ).length;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "";

  return (
    <header className="navbar">
      <div className="nav-container">
        <button className="nav-brand" onClick={() => switchTab("analytics")}>
          <div className="brand-text">
            <span className="brand-title">
              Resolve<span className="brand-highlight">IT</span>
            </span>
            <span className="brand-badge">Dispute & Redressal</span>
          </div>
        </button>

        <nav className="nav-links">
          {/* Dashboard is first and public */}
          <button
            className={`nav-link ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => switchTab("analytics")}
          >
            Dashboard
          </button>

          <button
            className={`nav-link ${activeTab === "home" ? "active" : ""}`}
            onClick={() => switchTab("home")}
          >
            Overview
            {!isAuthenticated && <Lock size={12} className="tab-lock-icon" />}
          </button>

          <button
            className={`nav-link ${activeTab === "submit" ? "active" : ""}`}
            onClick={() => switchTab("submit")}
          >
            File Grievance
            {!isAuthenticated && <Lock size={12} className="tab-lock-icon" />}
          </button>

          <button
            className={`nav-link ${activeTab === "tickets" ? "active" : ""}`}
            onClick={() => switchTab("tickets")}
          >
            Ticket Ledger
            <span className="pill-count" style={{ marginLeft: 6 }}>{openTicketsCount}</span>
            {!isAuthenticated && <Lock size={12} className="tab-lock-icon" />}
          </button>

          <button
            className={`nav-link ${activeTab === "track" ? "active" : ""}`}
            onClick={() => switchTab("track")}
          >
            Track Status
            {!isAuthenticated && <Lock size={12} className="tab-lock-icon" />}
          </button>

          <button
            className={`nav-link ${activeTab === "kb" ? "active" : ""}`}
            onClick={() => switchTab("kb")}
          >
            Knowledge Base
            {!isAuthenticated && <Lock size={12} className="tab-lock-icon" />}
          </button>
        </nav>

        <div className="nav-actions">
          <button
            onClick={toggleTheme}
            className="icon-btn"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Authentication Controls */}
          {isAuthenticated ? (
            <div className="user-profile-badge">
              <span className="user-avatar-tag" title={user.name}>
                {initials || <UserIcon size={14} />}
              </span>
              <div className="user-info-text">
                <span className="user-name-line">{user.name}</span>
                <span className="user-role-line">
                  {user.role === "agent" ? "Support Officer" : "Complainant"}
                </span>
              </div>
              <button 
                type="button" 
                className="btn-logout-icon" 
                onClick={logoutUser}
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="btn btn-primary btn-sm" 
              onClick={() => openAuthModal("Please sign in or create an account to proceed.")}
            >
              <LogIn size={14} /> Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
