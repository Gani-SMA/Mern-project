import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export const HomeSection = () => {
  const { switchTab, tickets, setActiveTicketId } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const clean = searchQuery.trim().toUpperCase();
    const found = tickets.find((t) => t.id.toUpperCase() === clean);
    if (found) {
      setActiveTicketId(found.id);
    } else {
      switchTab("tickets");
    }
  };

  const handleQuickTag = (tag) => {
    setSearchQuery(tag);
    const found = tickets.find((t) => t.id.toUpperCase() === tag.toUpperCase());
    if (found) {
      setActiveTicketId(found.id);
    } else {
      switchTab("tickets");
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

  const recentTickets = tickets.slice(0, 5);

  return (
    <section className="page-section active">
      {/* Editorial Masthead Hero (Seamless & Prestigious) */}
      <div className="editorial-masthead">
        <div className="masthead-top-bar">
          <span>Office of Consumer Redressal & Binding Arbitration</span>
          <span>Official Public Registry — Vol. 2026.4</span>
        </div>

        <div className="masthead-headline-wrap">
          <h1 className="masthead-title">
            Equitable Dispute Resolution & Customer Redressal
          </h1>
          <p className="masthead-lead">
            An independent institutional framework to file verified claims, monitor milestone investigations, enforce statutory response timelines, and settle grievances transparently.
          </p>
        </div>

        {/* Search Bar (Blended & Dignified) */}
        <div className="masthead-search-row">
          <form onSubmit={handleTrackSubmit} className="masthead-search-form">
            <input
              type="text"
              className="masthead-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter formal Docket Reference ID (e.g., RES-2026-8812) or dispute keyword..."
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary">
              Lookup Docket
            </button>
          </form>
          <div className="masthead-tags-row">
            <span>Jurisdictions:</span>
            <button type="button" className="masthead-tag-btn" onClick={() => handleQuickTag("Billing")}>
              Billing & Charges
            </button>
            <button type="button" className="masthead-tag-btn" onClick={() => handleQuickTag("Delivery")}>
              Transit & Logistics
            </button>
            <button type="button" className="masthead-tag-btn" onClick={() => handleQuickTag("Technical")}>
              Software & Access
            </button>
            <button type="button" className="masthead-tag-btn" onClick={() => handleQuickTag("Quality")}>
              Quality & Warranty
            </button>
          </div>
        </div>

        {/* Masthead Tri-Stat Balance Ledger */}
        <div className="masthead-stats-bar">
          <div className="stat-item">
            <div className="stat-value">2.4h</div>
            <div className="stat-caption">Average Statutory Response Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">98.6%</div>
            <div className="stat-caption">Binding SLA Compliance Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4.9 / 5.0</div>
            <div className="stat-caption">Post-Arbitration Settlement Score</div>
          </div>
        </div>
      </div>

      {/* 3 Action Pillars */}
      <div className="grid-cards-3">
        <div className="feature-card" onClick={() => switchTab("submit")}>
          <div>
            <h3>Lodge a Formal Grievance</h3>
            <p>
              Submit verified claims with purchase references, proof of transaction, and formal relief expectations.
            </p>
          </div>
          <span className="card-link">Initiate Filing →</span>
        </div>

        <div className="feature-card" onClick={() => switchTab("tickets")}>
          <div>
            <h3>Audit Docket & Active Cases</h3>
            <p>
              Examine live investigator findings, formal case milestones, evidentiary exchanges, and settlement notices.
            </p>
          </div>
          <span className="card-link">Inspect Registry →</span>
        </div>

        <div className="feature-card" onClick={() => switchTab("kb")}>
          <div>
            <h3>Statutory Rights & Guides</h3>
            <p>
              Access binding consumer protection guidelines, warranty remedies, and refund settlement terms.
            </p>
          </div>
          <span className="card-link">Review Policies →</span>
        </div>
      </div>

      {/* Home Grid Layout */}
      <div className="home-grid-layout">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Recent Registry Filings</h3>
              <p className="panel-subtitle">Official status ledger across active categories</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => switchTab("tickets")}>
              View All Filings
            </button>
          </div>
          <div className="panel-body">
            <div className="tickets-table-wrap">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>Docket ID</th>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Window</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((t) => (
                    <tr key={t.id}>
                      <td><span className="ticket-id-tag">{t.id}</span></td>
                      <td>{t.category}</td>
                      <td><strong>{t.title}</strong></td>
                      <td><span className={`badge ${getPriorityClass(t.priority)}`}>{t.priority}</span></td>
                      <td><span className={`badge ${getStatusClass(t.status)}`}>{t.status}</span></td>
                      <td>{t.slaHours}h</td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setActiveTicketId(t.id)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Resolution Protocol Stepper */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Statutory Protocol</h3>
          </div>
          <div className="panel-body">
            <div className="sla-stepper">
              <div className="sla-step">
                <div className="step-badge">1</div>
                <div className="step-info">
                  <h4>Intake & Registration</h4>
                  <p>Immediate reference generation and statutory SLA clock activation.</p>
                </div>
              </div>
              <div className="sla-step">
                <div className="step-badge">2</div>
                <div className="step-info">
                  <h4>Resolver Assignment</h4>
                  <p>Jurisdictional allocation to specialized department within 30 minutes.</p>
                </div>
              </div>
              <div className="sla-step">
                <div className="step-badge">3</div>
                <div className="step-info">
                  <h4>Evidentiary Audit</h4>
                  <p>Formal verification of accounts, transit logs, or technical logs.</p>
                </div>
              </div>
              <div className="sla-step">
                <div className="step-badge">4</div>
                <div className="step-info">
                  <h4>Settlement Verification</h4>
                  <p>Remedy execution requiring explicit customer satisfaction confirmation.</p>
                </div>
              </div>
            </div>

            <div className="emergency-box">
              <strong>Direct Ombudsman Priority Line</strong>
              <p>For urgent regulatory or fraud matters: 1-800-RESOLVE-IT</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
