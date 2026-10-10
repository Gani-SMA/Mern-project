import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export const TicketDetailModal = () => {
  const { 
    activeTicketId, 
    setActiveTicketId, 
    tickets, 
    currentRole, 
    updateTicket, 
    addMessage, 
    escalateTicket, 
    submitCsat, 
    showToast 
  } = useApp();

  const [replyText, setReplyText] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [csatComment, setCsatComment] = useState("");

  const ticket = tickets.find((t) => t.id === activeTicketId);
  if (!ticket) return null;

  const isAgent = currentRole === "agent";
  const messages = (ticket.messages || []).filter((m) => isAgent || !m.isInternal);

  const getPriorityClass = (priority) => {
    if (priority === "Critical") return "priority-critical";
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  };

  const getStatusClass = (status) => {
    if (status === "Open") return "status-open";
    if (status === "Under Investigation") return "status-investigating";
    if (status === "Escalated") return "status-escalated";
    if (status === "Resolved") return "status-resolved";
    return "status-closed";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addMessage(ticket.id, {
      sender: isAgent ? "agent" : "customer",
      author: isAgent ? "Support Officer" : ticket.customer.name,
      text: replyText.trim(),
      isInternal: isAgent && isInternal
    });

    setReplyText("");
    setIsInternal(false);
  };

  const handleCannedSelect = (e) => {
    const val = e.target.value;
    if (!val) return;
    const textMap = {
      investigating: "We are currently auditing the merchant settlement logs and evidentiary records.",
      refund_approved: "Your full financial refund has been officially authorized and executed.",
      reshipment: "A priority replacement unit has been packed and dispatched via Express Airway.",
      apology: "We have conducted a formal internal inquiry into this service breakdown."
    };
    if (textMap[val]) {
      setReplyText(textMap[val]);
    }
  };

  const handleAgentStatusSave = (e) => {
    e.preventDefault();
    const form = e.target;
    updateTicket(ticket.id, {
      status: form.status.value,
      assignedOfficer: form.officer.value,
      priority: form.priority.value
    });
    showToast("Case File Updated", `Dossier status updated.`, "success");
  };

  const handleCustomerEscalate = () => {
    escalateTicket(ticket.id, "Customer escalated directly to Executive Ombudsman under statutory clause.");
  };

  const handleCustomerAccept = () => {
    updateTicket(ticket.id, { status: "Resolved" });
    showToast("Case Settled", "Thank you for confirming resolution.", "success");
  };

  const handleCsatSubmit = (e) => {
    e.preventDefault();
    if (selectedStars === 0) {
      showToast("Select Rating", "Please select a 1-5 rating score.", "error");
      return;
    }
    submitCsat(ticket.id, selectedStars, csatComment);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="modal-backdrop active" onClick={() => setActiveTicketId(null)}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-badge-group">
              <span className="ticket-id-tag">{ticket.id}</span>
              <span className={`badge ${getPriorityClass(ticket.priority)}`}>{ticket.priority}</span>
              <span className={`badge ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
            </div>
            <h2 className="modal-title">{ticket.title}</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setActiveTicketId(null)}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="modal-body modal-grid-layout">
          
          {/* Main Column */}
          <div className="modal-main-col">
            
            {/* Meta Banner */}
            <div className="complaint-meta-banner">
              <div className="meta-item">
                <span className="meta-lbl">Complainant:</span>
                <strong>{ticket.customer.name}</strong> ({ticket.customer.email})
              </div>
              <div className="meta-item">
                <span className="meta-lbl">Category:</span>
                <span className="badge badge-secondary">{ticket.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-lbl">Order / Ref:</span>
                <strong>{ticket.customer.orderRef}</strong>
              </div>
              <div className="meta-item">
                <span className="meta-lbl">Filing Date:</span>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="section-box">
              <h4 className="box-title">Factual Narrative</h4>
              <div className="complaint-body-text">{ticket.description}</div>

              {ticket.attachments && ticket.attachments.length > 0 && (
                <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                  {ticket.attachments.map((f, i) => (
                    <span key={i} className="file-pill">
                      {f.name} ({f.size})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline Milestones */}
            <div className="section-box">
              <h4 className="box-title">Procedural Milestones & Audit Trail</h4>
              <div className="timeline-stepper">
                {ticket.timeline.map((node, i) => (
                  <div
                    key={i}
                    className={`timeline-node ${
                      i === ticket.timeline.length - 1 ? "active" : "completed"
                    }`}
                  >
                    <div className="node-icon">
                      {i + 1}
                    </div>
                    <div className="node-content">
                      <div className="node-header">
                        <strong className="node-title">{node.step}</strong>
                        <span className="node-time">{node.time}</span>
                      </div>
                      <p className="node-desc">{node.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="section-box">
              <div className="box-header-row">
                <h4 className="box-title">Communications Transcript</h4>
                <span className="badge badge-pill badge-primary">
                  {messages.length} Entries
                </span>
              </div>

              <div className="conversation-thread">
                {messages.length > 0 ? (
                  messages.map((m) => {
                    let msgClass = m.sender === "agent" ? "msg-agent" : "msg-customer";
                    if (m.isInternal) msgClass = "msg-internal";

                    return (
                      <div key={m.id} className={`message-item ${msgClass}`}>
                        <div className="msg-header">
                          <span>
                            <strong>{m.author}</strong>{" "}
                            {m.isInternal && "[INTERNAL NOTE]"}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {m.timestamp}
                          </span>
                        </div>
                        <div>{m.text}</div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>
                    No recorded communications yet. Use the message dispatch below to update the case record.
                  </p>
                )}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendMessage} className="reply-box">
                <div className="reply-header">
                  <span className="reply-sender-tag">
                    Dispatching as:{" "}
                    {isAgent ? (
                      <strong>Support Officer</strong>
                    ) : (
                      <strong>{ticket.customer.name}</strong>
                    )}
                  </span>

                  {isAgent && (
                    <div className="agent-canned-responses">
                      <select onChange={handleCannedSelect} className="canned-select">
                        <option value="">Insert Standard Template...</option>
                        <option value="investigating">Auditing evidentiary records...</option>
                        <option value="refund_approved">Full financial refund executed...</option>
                        <option value="reshipment">Replacement unit dispatched...</option>
                        <option value="apology">Formal apology & internal review...</option>
                      </select>
                    </div>
                  )}
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Record formal reply, additional evidence, or status update..."
                  required
                />

                <div className="reply-actions">
                  <div className="reply-options">
                    {isAgent && (
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={isInternal}
                          onChange={(e) => setIsInternal(e.target.checked)}
                        />
                        <span>Mark as Confidential Internal Note</span>
                      </label>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Post to Case Record
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="modal-sidebar-col">
            
            {/* Status Box */}
            <div className="action-card">
              <h4 className="card-title">Case Controls</h4>

              <div className="sla-clock-box">
                <span className="sla-lbl">Statutory Window:</span>
                <div className="sla-time-display">{ticket.slaHours}h Guaranteed</div>
                <div className="sla-progress">
                  <div className="sla-progress-fill" style={{ width: "65%" }}></div>
                </div>
              </div>

              {/* Agent Controls */}
              {isAgent ? (
                <form onSubmit={handleAgentStatusSave} className="agent-controls">
                  <div className="form-control-wrap">
                    <label className="form-label">Docket Status:</label>
                    <select name="status" defaultValue={ticket.status} className="form-select">
                      <option value="Open">Open</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Escalated">Escalated to Ombudsman</option>
                      <option value="Resolved">Settled / Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="form-control-wrap">
                    <label className="form-label">Assigned Resolver:</label>
                    <select name="officer" defaultValue={ticket.assignedOfficer} className="form-select">
                      <option value="Marcus Vance (Billing Lead)">Marcus Vance (Billing)</option>
                      <option value="Elena Rostova (Logistics Escalations)">Elena Rostova (Logistics)</option>
                      <option value="Devon Price (Tech Tier 3)">Devon Price (Tech Tier 3)</option>
                      <option value="Priya Patel (Consumer Ombudsman)">Priya Patel (Ombudsman)</option>
                    </select>
                  </div>

                  <div className="form-control-wrap">
                    <label className="form-label">Severity Level:</label>
                    <select name="priority" defaultValue={ticket.priority} className="form-select">
                      <option value="Low">Low (48h)</option>
                      <option value="Medium">Medium (24h)</option>
                      <option value="High">High (12h)</option>
                      <option value="Critical">Critical (6h)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-indigo btn-block">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="customer-actions-box">
                  <button
                    type="button"
                    className="btn btn-danger-outline btn-block"
                    onClick={handleCustomerEscalate}
                  >
                    Escalate to Ombudsman
                  </button>
                  <button
                    type="button"
                    className="btn btn-emerald-outline btn-block"
                    onClick={handleCustomerAccept}
                  >
                    Accept Settlement & Close
                  </button>
                </div>
              )}
            </div>

            {/* CSAT Rating Widget */}
            {(ticket.status === "Resolved" || ticket.status === "Closed") && (
              <div className="action-card">
                <h4 className="card-title">Settlement Verification</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.5rem 0 1rem" }}>
                  Please confirm your satisfaction with this resolution.
                </p>

                {ticket.csat ? (
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", fontSize: "1.2rem" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ color: star <= ticket.csat.stars ? "#8a6c4c" : "#ccc" }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.88rem", fontStyle: "italic", marginTop: 8 }}>
                      "{ticket.csat.feedback}"
                    </p>
                    <span className="badge badge-emerald mt-2">Verified ✓</span>
                  </div>
                ) : (
                  <form onSubmit={handleCsatSubmit}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", fontSize: "1.5rem", cursor: "pointer" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="star-btn"
                          onClick={() => setSelectedStars(star)}
                          style={{ color: star <= selectedStars ? "#8a6c4c" : "var(--text-dim)", fontSize: "1.6rem" }}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={csatComment}
                      onChange={(e) => setCsatComment(e.target.value)}
                      placeholder="Optional feedback..."
                      className="form-input mt-2"
                    />

                    <button type="submit" className="btn btn-primary btn-sm btn-block mt-2">
                      Submit Rating
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Audit Metadata */}
            <div className="action-card">
              <h4 className="card-title">Audit Metadata</h4>
              <div className="audit-item">
                <span>Cryptographic Digest:</span>
                <code>{ticket.securityHash}</code>
              </div>
              <div className="audit-item">
                <span>Registry Docket:</span>
                <strong>DSP-{ticket.id.slice(-4)}</strong>
              </div>
              <div className="audit-item">
                <span>Claimed Remedy:</span>
                <span>{ticket.desiredResolution}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
