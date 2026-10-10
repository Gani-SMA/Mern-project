import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export const TrackSection = () => {
  const { tickets, setActiveTicketId, showToast } = useApp();
  const [ticketInput, setTicketInput] = useState("");
  const [trackedTicket, setTrackedTicket] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (idToSearch) => {
    const query = (idToSearch || ticketInput).trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);
    const found = tickets.find((t) => t.id.toUpperCase() === query);
    if (found) {
      setTrackedTicket(found);
      setTicketInput(found.id);
    } else {
      setTrackedTicket(null);
      showToast("Docket Not Found", `No grievance matching ${query} exists in the active registry.`, "error");
    }
  };

  const getStatusClass = (status) => {
    if (status === "Open") return "status-open";
    if (status === "Under Investigation") return "status-investigating";
    if (status === "Escalated") return "status-escalated";
    if (status === "Resolved") return "status-resolved";
    return "status-closed";
  };

  const getPriorityClass = (priority) => {
    if (priority === "Critical") return "priority-critical";
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  };

  return (
    <section className="page-section active">
      <div className="page-header">
        <div>
          <span className="section-tag">Verification Portal</span>
          <h2 className="page-title">Docket Milestone & Audit Verification</h2>
          <p className="page-subtitle">
            Verify official investigation notes, procedural timeline milestones, evidentiary findings, and formal settlement terms.
          </p>
        </div>
      </div>

      {/* Lookup Card */}
      <div className="track-lookup-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="track-lookup-form"
        >
          <div className="track-input-group">
            <label>Formal Docket Reference ID:</label>
            <div className="input-with-btn">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="e.g. RES-2026-8812"
                required
              />
              <button type="submit" className="btn btn-primary">
                Lookup Docket
              </button>
            </div>
          </div>
          <div className="sample-tickets-list">
            <span>Sample reference dockets:</span>
            <button
              type="button"
              className="sample-id-link"
              onClick={() => handleSearch("RES-2026-8812")}
            >
              RES-2026-8812 (Escalated to Ombudsman)
            </button>
            <button
              type="button"
              className="sample-id-link"
              onClick={() => handleSearch("RES-2026-4402")}
            >
              RES-2026-4402 (Settled & Closed)
            </button>
            <button
              type="button"
              className="sample-id-link"
              onClick={() => handleSearch("RES-2026-1094")}
            >
              RES-2026-1094 (In Investigation)
            </button>
          </div>
        </form>
      </div>

      {/* Tracked Ticket View */}
      {trackedTicket ? (
        <div className="panel">
          <div className="panel-header">
            <div>
              <div style={{ display: "flex", gap: "0.65rem", marginBottom: "0.5rem" }}>
                <span className="ticket-id-tag">{trackedTicket.id}</span>
                <span className={`badge ${getPriorityClass(trackedTicket.priority)}`}>
                  {trackedTicket.priority} Severity
                </span>
                <span className={`badge ${getStatusClass(trackedTicket.status)}`}>
                  {trackedTicket.status}
                </span>
              </div>
              <h3 className="panel-title">{trackedTicket.title}</h3>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTicketId(trackedTicket.id)}
            >
              Open Full Case File
            </button>
          </div>
          <div className="panel-body">
            <div className="complaint-meta-banner">
              <div className="meta-item">
                <span className="meta-lbl">Assigned Resolver:</span> <strong>{trackedTicket.assignedOfficer}</strong>
              </div>
              <div className="meta-item">
                <span className="meta-lbl">Classification:</span> <span>{trackedTicket.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-lbl">Ref Order:</span> <code>{trackedTicket.customer.orderRef}</code>
              </div>
              <div className="meta-item">
                <span className="meta-lbl">Binding SLA:</span> <strong>{trackedTicket.slaHours} Hours</strong>
              </div>
            </div>

            <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Procedural Milestone Timeline
            </h4>
            <div className="timeline-stepper">
              {trackedTicket.timeline.map((node, i) => (
                <div
                  key={i}
                  className={`timeline-node ${
                    i === trackedTicket.timeline.length - 1 ? "active" : "completed"
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

            {trackedTicket.status === "Resolved" && !trackedTicket.csat && (
              <div
                className="emergency-box"
                style={{
                  marginTop: "2rem",
                  background: "var(--sage-light)",
                  borderColor: "var(--sage)",
                  color: "var(--sage)"
                }}
              >
                <strong>Case Settlement Complete</strong>
                <p>Please open the full case file above to submit your formal settlement rating.</p>
              </div>
            )}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="emergency-box">
          <strong>Docket Identifier Not Located</strong>
          <p>Please double-check the reference code provided in your official intake receipt.</p>
        </div>
      ) : null}
    </section>
  );
};
