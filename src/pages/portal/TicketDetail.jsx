import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Send, AlertTriangle, Clock, User } from "lucide-react";

export const TicketDetail = () => {
  const { slug, ticketId } = useParams();
  const { apiFetch, user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchTicket = async () => {
    try {
      const res = await apiFetch(`/api/companies/${slug}/tickets/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
        setNewStatus(data.status);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTicket(); }, [slug, ticketId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await apiFetch(`/api/companies/${slug}/tickets/${ticketId}/messages`, {
      method: "POST",
      body: JSON.stringify({ text: message, isInternal }),
    });
    setMessage("");
    fetchTicket();
  };

  const updateStatus = async () => {
    if (newStatus === ticket.status) return;
    await apiFetch(`/api/companies/${slug}/tickets/${ticketId}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTicket();
  };

  const escalate = async () => {
    await apiFetch(`/api/companies/${slug}/tickets/${ticketId}/escalate`, {
      method: "POST",
      body: JSON.stringify({ reason: "Escalated by agent for immediate attention." }),
    });
    fetchTicket();
  };

  if (loading) return <div className="loading-spinner">Loading ticket...</div>;
  if (!ticket) return <div className="error-message">Ticket not found.</div>;

  return (
    <div className="ticket-detail-page">
      <button className="btn-ghost back-btn" onClick={() => navigate(`/portal/${slug}/tickets`)}>
        <ArrowLeft size={16} /> Back to Tickets
      </button>

      <div className="ticket-header">
        <div className="ticket-header-left">
          <code className="ticket-id-large">{ticket.ticketId}</code>
          <h1>{ticket.subject}</h1>
          <div className="ticket-meta">
            <span className={`badge priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
            <span className={`badge status-${ticket.status.toLowerCase().replace(/\s+/g, "-")}`}>{ticket.status}</span>
            <span className="meta-item"><Clock size={14} /> SLA: {ticket.slaHours}h</span>
            <span className="meta-item"><User size={14} /> {ticket.customer?.name}</span>
          </div>
        </div>
        <div className="ticket-actions">
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <button className="btn-primary" onClick={updateStatus} disabled={newStatus === ticket.status}>Update Status</button>
          {ticket.status !== "Escalated" && (
            <button className="btn-danger" onClick={escalate}><AlertTriangle size={14} /> Escalate</button>
          )}
        </div>
      </div>

      <div className="ticket-body-grid">
        {/* Description + Messages */}
        <div className="ticket-main-col">
          <div className="ticket-section">
            <h3 className="section-title">DESCRIPTION</h3>
            <p className="ticket-description">{ticket.description}</p>
          </div>

          <div className="ticket-section">
            <h3 className="section-title">MESSAGES ({(ticket.messages || []).length})</h3>
            <div className="messages-list">
              {(ticket.messages || []).map((m, i) => (
                <div key={i} className={`message-bubble ${m.senderRole} ${m.isInternal ? "internal" : ""}`}>
                  <div className="message-header">
                    <strong>{m.senderName}</strong>
                    <span className="message-role">{m.senderRole}</span>
                    {m.isInternal && <span className="internal-badge">Internal</span>}
                    <span className="message-time">{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <p>{m.text}</p>
                </div>
              ))}
              {(ticket.messages || []).length === 0 && <p className="text-muted">No messages yet.</p>}
            </div>

            <form className="message-form" onSubmit={sendMessage}>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a reply..." rows={3} />
              <div className="message-form-actions">
                <label className="internal-toggle">
                  <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
                  Internal note (hidden from customer)
                </label>
                <button type="submit" className="btn-primary"><Send size={14} /> Send</button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="ticket-sidebar-col">
          <div className="ticket-section">
            <h3 className="section-title">CUSTOMER INFO</h3>
            <div className="info-list">
              <div className="info-item"><span className="info-label">Name</span><span>{ticket.customer?.name}</span></div>
              <div className="info-item"><span className="info-label">Email</span><span>{ticket.customer?.email}</span></div>
              <div className="info-item"><span className="info-label">Phone</span><span>{ticket.customer?.phone || "N/A"}</span></div>
            </div>
          </div>

          <div className="ticket-section">
            <h3 className="section-title">TIMELINE</h3>
            <div className="timeline-list">
              {(ticket.timeline || []).map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <strong>{t.action}</strong>
                    <p>{t.details}</p>
                    <span className="timeline-time">{t.by} — {new Date(t.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
