import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { TicketCheck, TrendingUp, Clock, AlertTriangle, Users } from "lucide-react";

export const PortalDashboard = () => {
  const { slug } = useParams();
  const { apiFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await apiFetch(`/api/companies/${slug}/dashboard`);
        if (res.ok) setData(await res.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [slug, apiFetch]);

  if (loading) return <div className="loading-spinner">Loading dashboard...</div>;
  if (!data) return <div className="error-message">Failed to load dashboard.</div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <span className="page-label">OPERATIONS & SLA OVERSIGHT</span>
        <h1>Company Dashboard</h1>
        <p>Metrics on dispute intake, resolution bottlenecks, and CSAT scores.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-header"><span className="stat-label">TOTAL TICKETS</span><TicketCheck size={18} /></div>
          <div className="stat-value">{data.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header"><span className="stat-label">RESOLUTION RATE</span><TrendingUp size={18} /></div>
          <div className="stat-value">{data.resolutionRate}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-header"><span className="stat-label">SLA COMPLIANCE</span><Clock size={18} /></div>
          <div className="stat-value">{data.slaCompliance}%</div>
          <div className="stat-footer">{data.slaBreached} breached</div>
        </div>
        <div className="stat-card">
          <div className="stat-header"><span className="stat-label">AVG CSAT</span><TrendingUp size={18} /></div>
          <div className="stat-value">{data.avgCsat}</div>
          <div className="stat-footer">out of 5.0</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="dashboard-section">
        <h2 className="section-title">STATUS DISTRIBUTION</h2>
        <div className="status-pills">
          {Object.entries(data.byStatus || {}).map(([status, count]) => (
            <div key={status} className={`status-pill status-${status.toLowerCase().replace(/\s+/g, "-")}`}>
              <span className="pill-count">{count}</span>
              <span className="pill-label">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Watch */}
      {data.escalationWatch && data.escalationWatch.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title"><AlertTriangle size={16} /> ESCALATION WATCH</h2>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr><th>Ticket ID</th><th>Subject</th><th>Priority</th><th>Status</th><th>SLA</th></tr>
              </thead>
              <tbody>
                {data.escalationWatch.map((t) => (
                  <tr key={t.ticketId}>
                    <td><code className="ticket-id">{t.ticketId}</code></td>
                    <td className="font-medium">{t.subject}</td>
                    <td><span className={`badge priority-${t.priority.toLowerCase()}`}>{t.priority}</span></td>
                    <td><span className={`badge status-${t.status.toLowerCase().replace(/\s+/g, "-")}`}>{t.status}</span></td>
                    <td>{t.slaHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
