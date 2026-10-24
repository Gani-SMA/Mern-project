import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Route guard that checks authentication and role.
 * Usage: <ProtectedRoute roles={["superadmin"]}><AdminLayout /></ProtectedRoute>
 */
export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, currentRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to landing with return URL
    return <Navigate to={`/?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (roles.length > 0 && !roles.includes(currentRole)) {
    // User is logged in but doesn't have the right role
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <p className="role-info">
            Your role: <strong>{currentRole}</strong> | Required: <strong>{roles.join(" or ")}</strong>
          </p>
          <a href="/" className="btn-primary">Return Home</a>
        </div>
      </div>
    );
  }

  return children;
};
