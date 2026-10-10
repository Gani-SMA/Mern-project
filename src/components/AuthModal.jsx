import React, { useState } from "react";
import { Lock, UserPlus, LogIn, AlertCircle, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    loginUser, 
    registerUser, 
    authModalMessage 
  } = useApp();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("customer");
  const [regPhone, setRegPhone] = useState("");

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const res = await loginUser(loginEmail, loginPassword);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Invalid credentials. Please verify your email and password.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg("Please fill in all mandatory fields.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    const res = await registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      phone: regPhone.trim(),
    });
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Registration failed. Email might already be registered.");
    }
  };

  return (
    <div className="modal-backdrop active" onClick={closeAuthModal}>
      <div 
        className="modal-dialog auth-modal-box" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480 }}
      >
        <div className="modal-header auth-modal-header">
          <div className="auth-header-title">
            <div className="auth-lock-icon">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: "1.35rem" }}>
                {mode === "login" ? "Account Sign In" : "Register Credentials"}
              </h2>
              <span className="auth-subtitle">
                Verified Access & Dispute Redressal Portal
              </span>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={closeAuthModal}
            title="Return to Dashboard"
          >
            ×
          </button>
        </div>

        <div className="modal-body auth-modal-body">
          {authModalMessage && (
            <div className="auth-notice-banner">
              <ShieldCheck size={16} />
              <span>{authModalMessage}</span>
            </div>
          )}

          {/* Clean Tab Switch */}
          <div className="auth-tab-switch">
            <button
              type="button"
              className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => { setMode("login"); setErrorMsg(""); }}
            >
              <LogIn size={14} /> Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === "register" ? "active" : ""}`}
              onClick={() => { setMode("register"); setErrorMsg(""); }}
            >
              <UserPlus size={14} /> Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="auth-error-box">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-control-wrap">
                <label className="form-label">Email Address <span className="req">*</span></label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your registered email address"
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              <div className="form-control-wrap">
                <label className="form-label">Password <span className="req">*</span></label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your confidential password"
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block btn-lg" 
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In & Proceed"}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="form-control-wrap">
                <label className="form-label">Full Legal Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Jordan Sterling"
                  className="form-input"
                />
              </div>

              <div className="form-control-wrap">
                <label className="form-label">Email Address <span className="req">*</span></label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. jordan.sterling@example.com"
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              <div className="grid-2-cols" style={{ gap: "1rem" }}>
                <div className="form-control-wrap">
                  <label className="form-label">Password <span className="req">*</span></label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="form-input"
                    autoComplete="new-password"
                  />
                </div>

                <div className="form-control-wrap">
                  <label className="form-label">Account Role <span className="req">*</span></label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="form-select"
                  >
                    <option value="customer">Complainant / Citizen</option>
                    <option value="agent">Support Officer / Resolver</option>
                  </select>
                </div>
              </div>

              <div className="form-control-wrap">
                <label className="form-label">Contact Phone (Optional)</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="form-input"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block btn-lg" 
                disabled={loading}
              >
                {loading ? "Registering in Database..." : "Register Account & Authenticate"}
              </button>
            </form>
          )}

          <div className="auth-footer-note">
            <span>🔒 Verified through MongoDB Atlas with encrypted session tokens.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
