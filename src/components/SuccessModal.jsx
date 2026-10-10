import React from "react";
import { useApp } from "../context/AppContext";

export const SuccessModal = () => {
  const { 
    successModalTicketId, 
    setSuccessModalTicketId, 
    switchTab, 
    setActiveTicketId, 
    showToast 
  } = useApp();

  if (!successModalTicketId) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(successModalTicketId);
    showToast("Copied", `Docket Reference ${successModalTicketId} copied to clipboard.`, "success");
  };

  const handleTrack = () => {
    const id = successModalTicketId;
    setSuccessModalTicketId(null);
    setActiveTicketId(id);
  };

  const handleDone = () => {
    setSuccessModalTicketId(null);
    switchTab("tickets");
  };

  return (
    <div className="modal-backdrop active" onClick={() => setSuccessModalTicketId(null)}>
      <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
        <h2 className="modal-title" style={{ marginTop: "1rem" }}>
          Docket Successfully Registered
        </h2>
        <p className="modal-desc">
          Your formal grievance has been officially entered into the arbitration registry with guaranteed statutory oversight.
        </p>

        <div className="ticket-ref-box">
          <span className="ref-label">Official Docket Identifier:</span>
          <div className="ref-id-row">
            <strong>{successModalTicketId}</strong>
            <button className="copy-btn" onClick={handleCopy} title="Copy reference code">
              Copy
            </button>
          </div>
        </div>

        <div className="success-features-list">
          <div>
            Statutory Target: <strong>Resolver assigned within guaranteed window</strong>
          </div>
          <div>
            Confirmation receipt and verification digest dispatched to your email
          </div>
        </div>

        <div className="modal-actions-row">
          <button className="btn btn-outline" onClick={handleTrack}>
            Open Case Record
          </button>
          <button className="btn btn-primary" onClick={handleDone}>
            Proceed to Docket Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
