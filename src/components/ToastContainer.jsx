import React from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ToastContainer = () => {
  const { toasts } = useApp();

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let IconComponent = Info;
        if (toast.type === "success") IconComponent = CheckCircle;
        if (toast.type === "error") IconComponent = AlertCircle;

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <IconComponent className="toast-icon" size={20} />
            <div className="toast-content">
              <h5>{toast.title}</h5>
              <p>{toast.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
