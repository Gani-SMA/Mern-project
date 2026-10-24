import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Search, Filter } from "lucide-react";

export const TicketList = () => {
  const { slug } = useParams();
  const { apiFetch } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (priorityFilter) params.set("priority", priorityFilter);

      const res = await apiFetch(`/api/companies/${slug}/tickets?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        setTotal(data.total || 0);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, [slug, statusFilter, priorityFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <div>
          <span className="page-label">TICKET LEDGER</span>
          <h1>All Tickets ({total})</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <form onSubmit={handleSearch} className="search-form">
          <Search size={16} />
          <input placeholder="Search by ID, subject, customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading tickets...</div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>SLA</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.ticketId} className="clickable-row" onClick={() => navigate(`/portal/${slug}/tickets/${t.ticketId}`)}>
                  <td><code className="ticket-id">{t.ticketId}</code></td>
                  <td className="font-medium">{t.customer?.name}</td>
                  <td>{t.subject}</td>
                  <td>{t.category}</td>
                  <td><span className={`badge priority-${t.priority.toLowerCase()}`}>{t.priority}</span></td>
                  <td><span className={`badge status-${t.status.toLowerCase().replace(/\s+/g, "-")}`}>{t.status}</span></td>
                  <td>{t.slaHours}h</td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr><td colSpan="8" className="empty-state">No tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
