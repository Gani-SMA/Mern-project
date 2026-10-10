import React from "react";
import { ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Footer = () => {
  const { switchTab } = useApp();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="brand-logo sm">
            <ShieldCheck size={16} />
          </div>
          <span>ResolveIT Institutional Dispute Settlement & Consumer Redressal Platform</span>
        </div>
        <div className="footer-links">
          <span>&copy; 2026 ResolveIT Systems Inc.</span>
          <button type="button" onClick={() => switchTab("analytics")}>
            Audit Compliance
          </button>
          <button type="button" onClick={() => switchTab("kb")}>
            Ombudsman Charter
          </button>
          <button type="button" onClick={() => switchTab("kb")}>
            Help Center
          </button>
          <a href="#terms" onClick={(e) => { e.preventDefault(); switchTab("kb"); }}>
            Privacy & Terms
          </a>
        </div>
      </div>
    </footer>
  );
};
