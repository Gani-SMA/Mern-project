import React from "react";
import { ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Footer = () => {
  const { resetData, switchTab } = useApp();

  const handleReset = (e) => {
    e.preventDefault();
    if (window.confirm("Reset all grievance records back to the default sample database?")) {
      resetData();
    }
  };

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="brand-logo sm">
            <ShieldCheck size={16} />
          </div>
          <span>ResolveIT Enterprise Support & Dispute Settlement Platform</span>
        </div>
        <div className="footer-links">
          <span>&copy; 2026 ResolveIT Systems Inc.</span>
          <button type="button" onClick={handleReset}>
            Reset Demo Data
          </button>
          <button type="button" onClick={() => switchTab("kb")}>
            Help Center
          </button>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); switchTab("kb"); }}>
            Privacy & Terms
          </a>
        </div>
      </div>
    </footer>
  );
};
