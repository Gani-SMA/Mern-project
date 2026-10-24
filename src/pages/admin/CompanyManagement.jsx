import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Building2, Plus, X, ExternalLink } from "lucide-react";

export const CompanyManagement = () => {
  const { apiFetch } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", industry: "" });
  const [error, setError] = useState("");

  const fetchCompanies = async () => {
    try {
      const res = await apiFetch("/api/admin/companies");
      if (res.ok) setCompanies(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await apiFetch("/api/admin/companies", {
      method: "POST",
      body: JSON.stringify({ ...form, slug: form.slug || autoSlug(form.name) }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setShowForm(false);
    setForm({ name: "", slug: "", industry: "" });
    fetchCompanies();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    await apiFetch(`/api/admin/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
    fetchCompanies();
  };

  if (loading) return <div className="loading-spinner">Loading companies...</div>;

  return (
    <div className="management-page">
      <div className="page-header">
        <div>
          <span className="page-label">PLATFORM ADMINISTRATION</span>
          <h1>Company Management</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Company</>}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Register New Company</h3>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })} required placeholder="e.g., Tata Motors" />
              </div>
              <div className="form-group">
                <label>URL Slug *</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="tata-motors" />
                <span className="form-hint">Service page: /s/{form.slug || "..."}</span>
              </div>
              <div className="form-group">
                <label>Industry</label>
                <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g., Automotive" />
              </div>
            </div>
            <button type="submit" className="btn-primary">Create Company</button>
          </form>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Slug</th>
              <th>Industry</th>
              <th>Developer</th>
              <th>Employees</th>
              <th>Tickets</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c._id}>
                <td className="font-medium">{c.name}</td>
                <td><code className="slug-badge">{c.slug}</code></td>
                <td>{c.industry}</td>
                <td>{c.developer?.name || <span className="text-muted">Not assigned</span>}</td>
                <td>{c.employeeCount || 0}</td>
                <td>{c.ticketCount || 0}</td>
                <td>
                  <span className={`badge status-${c.status}`}>{c.status}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <a href={`/s/${c.slug}`} target="_blank" rel="noreferrer" className="btn-icon" title="View Service Page">
                      <ExternalLink size={14} />
                    </a>
                    <button
                      className={`btn-sm ${c.status === "active" ? "btn-danger" : "btn-success"}`}
                      onClick={() => toggleStatus(c._id, c.status)}
                    >
                      {c.status === "active" ? "Suspend" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr><td colSpan="8" className="empty-state">No companies registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
