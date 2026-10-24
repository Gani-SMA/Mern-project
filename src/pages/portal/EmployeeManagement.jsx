import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, Plus, X } from "lucide-react";

export const EmployeeManagement = () => {
  const { slug } = useParams();
  const { apiFetch } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await apiFetch(`/api/companies/${slug}/employees`);
      if (res.ok) setEmployees(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await apiFetch(`/api/companies/${slug}/employees`, { method: "POST", body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setShowForm(false);
    setForm({ name: "", email: "", password: "", department: "" });
    fetchEmployees();
  };

  const dismissEmployee = async (id) => {
    if (!confirm("Are you sure you want to dismiss this employee?")) return;
    await apiFetch(`/api/companies/${slug}/employees/${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  const reinstateEmployee = async (id) => {
    await apiFetch(`/api/companies/${slug}/employees/${id}`, { method: "PUT", body: JSON.stringify({ status: "active" }) });
    fetchEmployees();
  };

  if (loading) return <div className="loading-spinner">Loading employees...</div>;

  return (
    <div className="management-page">
      <div className="page-header">
        <div><span className="page-label">TEAM MANAGEMENT</span><h1>Employees</h1></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Employee</>}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Add New Employee</h3>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label>Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value.replace(/,([a-zA-Z]+)$/, '.$1') })}
                  onBlur={(e) => setForm({ ...form, email: e.target.value.replace(/,/g, '.') })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Password *</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
              <div className="form-group"><label>Department</label><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g., Technical Support" /></div>
            </div>
            <button type="submit" className="btn-primary">Add Employee</button>
          </form>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Tickets</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e._id}>
                <td className="font-medium">{e.name}</td>
                <td>{e.email}</td>
                <td>{e.department || "—"}</td>
                <td>{e.assignedTickets || 0}</td>
                <td><span className={`badge status-${e.status}`}>{e.status}</span></td>
                <td>
                  {e.status === "active" ? (
                    <button className="btn-sm btn-danger" onClick={() => dismissEmployee(e._id)}>Dismiss</button>
                  ) : (
                    <button className="btn-sm btn-success" onClick={() => reinstateEmployee(e._id)}>Reinstate</button>
                  )}
                </td>
              </tr>
            ))}
            {employees.length === 0 && <tr><td colSpan="6" className="empty-state">No employees yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
