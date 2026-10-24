import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, Plus, X } from "lucide-react";

export const DeveloperManagement = () => {
  const { apiFetch } = useAuth();
  const [developers, setDevelopers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", companyId: "" });
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [devRes, compRes] = await Promise.all([
        apiFetch("/api/admin/developers"),
        apiFetch("/api/admin/companies"),
      ]);
      if (devRes.ok) setDevelopers(await devRes.json());
      if (compRes.ok) {
        const allCompanies = await compRes.json();
        // Only show companies without a developer assigned
        setCompanies(allCompanies.filter((c) => !c.developer));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await apiFetch("/api/admin/developers", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setShowForm(false);
    setForm({ name: "", email: "", password: "", companyId: "" });
    fetchData();
  };

  const deactivateDev = async (id) => {
    await apiFetch(`/api/admin/developers/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <div className="loading-spinner">Loading developers...</div>;

  return (
    <div className="management-page">
      <div className="page-header">
        <div>
          <span className="page-label">PLATFORM ADMINISTRATION</span>
          <h1>Developer Management</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Developer</>}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Create Developer Account</h3>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value.replace(/,([a-zA-Z]+)$/, '.$1') })}
                  onBlur={(e) => setForm({ ...form, email: e.target.value.replace(/,/g, '.') })}
                  required
                  placeholder="dev@company.com"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>Assign to Company *</label>
                <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} required>
                  <option value="">Select a company...</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>{c.name} ({c.slug})</option>
                  ))}
                </select>
                {companies.length === 0 && <span className="form-hint">All companies already have developers assigned.</span>}
              </div>
            </div>
            <button type="submit" className="btn-primary">Create Developer</button>
          </form>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {developers.map((d) => (
              <tr key={d._id}>
                <td className="font-medium">{d.name}</td>
                <td>{d.email}</td>
                <td>{d.company?.name || "—"} <code className="slug-badge">{d.company?.slug}</code></td>
                <td><span className={`badge status-${d.status}`}>{d.status}</span></td>
                <td>
                  {d.status === "active" && (
                    <button className="btn-sm btn-danger" onClick={() => deactivateDev(d._id)}>Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
            {developers.length === 0 && (
              <tr><td colSpan="5" className="empty-state">No developers created yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
