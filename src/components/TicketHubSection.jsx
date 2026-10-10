import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export const TicketHubSection = () => {
  const { tickets, switchTab, setActiveTicketId, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      t.id.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.customer.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.customer.orderRef.toLowerCase().includes(q);

    const matchStatus = filterStatus === "ALL" || t.status.toLowerCase() === filterStatus.toLowerCase();
    const matchCategory = filterCategory === "ALL" || t.category === filterCategory;
    const matchPriority = filterPriority === "ALL" || t.priority === filterPriority;

    return matchQuery && matchStatus && matchCategory && matchPriority;
  });

  const countAll = tickets.length;
  const countOpen = tickets.filter((t) => t.status === "Open").length;
  const countInvestigating = tickets.filter((t) => t.status === "Under Investigation").length;
  const countEscalated = tickets.filter((t) => t.status === "Escalated").length;
  const countResolved = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;

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

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tickets, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Registry_Docket_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Export Complete", "Case registry exported as formal JSON ledger.", "success");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterStatus("ALL");
    setFilterCategory("ALL");
    setFilterPriority("ALL");
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section className="page-section active">
      <div className="page-header">
        <div>
          <span className="section-tag">Case Docket & Registry</span>
          <h2 className="page-title">Arbitration Docket Ledger</h2>
          <p className="page-subtitle">
            Comprehensive audit registry of active complaints, assigned resolvers, evidentiary status, and binding milestones.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleExport} title="Download Registry as JSON">
            Export Ledger
          </button>
          <button className="btn btn-primary" onClick={() => switchTab("submit")}>
            New Dispute Filing
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="hub-toolbar">
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Docket ID, Complainant, Subject, or Invoice..."
          />
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select filter-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open / Pending</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Escalated">Escalated to Ombudsman</option>
            <option value="Resolved">Settled / Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="form-select filter-select"
          >
            <option value="ALL">All Categories</option>
            <option value="Billing & Payments">Billing & Payments</option>
            <option value="Product Quality & Defect">Product Quality</option>
            <option value="Shipping & Delivery">Shipping & Delivery</option>
            <option value="Technical Support & Software">Technical Support</option>
            <option value="Customer Service Conduct">Service Conduct</option>
            <option value="Security & Account Privacy">Security & Privacy</option>
            <option value="Cancellation & Refund">Cancellation & Refund</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="form-select filter-select"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical (6h)</option>
            <option value="High">High (12h)</option>
            <option value="Medium">Medium (24h)</option>
            <option value="Low">Low (48h)</option>
          </select>
        </div>
      </div>

      {/* Status Pill Filters */}
      <div className="status-pills-row">
        <button
          className={`pill-btn ${filterStatus === "ALL" ? "active" : ""}`}
          onClick={() => setFilterStatus("ALL")}
        >
          All Filings <span className="pill-count">{countAll}</span>
        </button>
        <button
          className={`pill-btn ${filterStatus === "Open" ? "active" : ""}`}
          onClick={() => setFilterStatus("Open")}
        >
          <span className="dot dot-blue"></span> Open <span className="pill-count">{countOpen}</span>
        </button>
        <button
          className={`pill-btn ${filterStatus === "Under Investigation" ? "active" : ""}`}
          onClick={() => setFilterStatus("Under Investigation")}
        >
          <span className="dot dot-amber"></span> In Investigation <span className="pill-count">{countInvestigating}</span>
        </button>
        <button
          className={`pill-btn ${filterStatus === "Escalated" ? "active" : ""}`}
          onClick={() => setFilterStatus("Escalated")}
        >
          <span className="dot dot-rose"></span> Escalated <span className="pill-count">{countEscalated}</span>
        </button>
        <button
          className={`pill-btn ${filterStatus === "Resolved" ? "active" : ""}`}
          onClick={() => setFilterStatus("Resolved")}
        >
          <span className="dot dot-emerald"></span> Settled <span className="pill-count">{countResolved}</span>
        </button>
      </div>

      {/* Docket Cards Grid */}
      {filteredTickets.length > 0 ? (
        <div className="tickets-grid">
          {filteredTickets.map((t) => {
            const initials = t.customer.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <div
                key={t.id}
                className="ticket-item-card"
                onClick={() => setActiveTicketId(t.id)}
              >
                <div>
                  <div className="ticket-card-top">
                    <span className="ticket-id-tag">{t.id}</span>
                    <span className={`badge ${getPriorityClass(t.priority)}`}>{t.priority}</span>
                  </div>
                  <h3 className="ticket-card-title">{t.title}</h3>
                  <p className="ticket-card-desc">{t.description}</p>
                </div>

                <div>
                  <div style={{ marginBottom: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`badge ${getStatusClass(t.status)}`}>{t.status}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{t.category}</span>
                  </div>

                  <div className="ticket-card-meta">
                    <div className="ticket-user-info">
                      <span className="avatar-sm">{initials}</span>
                      <span>{t.customer.name}</span>
                    </div>
                    <span>{formatDate(t.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching dockets in registry</h3>
          <p>Try adjusting your search terms or filter criteria.</p>
          <button className="btn btn-outline" onClick={handleResetFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
};
