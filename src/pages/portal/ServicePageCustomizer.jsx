import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Palette, Plus, X, Eye, EyeOff, GripVertical, Trash2, Save } from "lucide-react";

export const ServicePageCustomizer = () => {
  const { slug } = useParams();
  const { apiFetch } = useAuth();
  const [company, setCompany] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Branding form
  const [branding, setBranding] = useState({ primaryColor: "", accentColor: "", welcomeMessage: "", tagline: "" });

  // FAQ form
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "General" });

  // Category form
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", description: "" });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAll = async () => {
    try {
      const [compRes, faqRes, catRes] = await Promise.all([
        apiFetch(`/api/companies/${slug}/public`),
        apiFetch(`/api/companies/${slug}/faqs`),
        apiFetch(`/api/companies/${slug}/categories`),
      ]);
      if (compRes.ok) {
        const data = await compRes.json();
        setCompany(data.company);
        setBranding(data.company.branding || {});
      }
      if (faqRes.ok) setFaqs(await faqRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [slug]);

  const saveBranding = async () => {
    setError(""); setSuccess("");
    const res = await apiFetch(`/api/companies/${slug}/branding`, { method: "PUT", body: JSON.stringify({ branding }) });
    if (res.ok) { setSuccess("Branding updated!"); fetchAll(); }
    else { const d = await res.json(); setError(d.error); }
  };

  const addFaq = async (e) => {
    e.preventDefault();
    const res = await apiFetch(`/api/companies/${slug}/faqs`, { method: "POST", body: JSON.stringify(faqForm) });
    if (res.ok) { setShowFaqForm(false); setFaqForm({ question: "", answer: "", category: "General" }); fetchAll(); }
  };

  const deleteFaq = async (id) => {
    await apiFetch(`/api/companies/${slug}/faqs/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const toggleFaqVisibility = async (faq) => {
    await apiFetch(`/api/companies/${slug}/faqs/${faq._id}`, { method: "PUT", body: JSON.stringify({ isVisible: !faq.isVisible }) });
    fetchAll();
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const res = await apiFetch(`/api/companies/${slug}/categories`, { method: "POST", body: JSON.stringify(catForm) });
    if (res.ok) { setShowCatForm(false); setCatForm({ name: "", description: "" }); fetchAll(); }
  };

  const deleteCategory = async (id) => {
    await apiFetch(`/api/companies/${slug}/categories/${id}`, { method: "DELETE" });
    fetchAll();
  };

  if (loading) return <div className="loading-spinner">Loading customizer...</div>;

  return (
    <div className="customizer-page">
      <div className="page-header">
        <div><span className="page-label">SERVICE PAGE CONFIGURATION</span><h1>Customize Service Page</h1></div>
        <a href={`/s/${slug}`} target="_blank" rel="noreferrer" className="btn-primary"><Eye size={14} /> Preview Service Page</a>
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      {/* Branding Section */}
      <div className="customizer-section">
        <h2 className="section-title"><Palette size={16} /> BRANDING</h2>
        <div className="form-card">
          <div className="form-row">
            <div className="form-group"><label>Welcome Message</label><input value={branding.welcomeMessage || ""} onChange={(e) => setBranding({ ...branding, welcomeMessage: e.target.value })} /></div>
            <div className="form-group"><label>Tagline</label><input value={branding.tagline || ""} onChange={(e) => setBranding({ ...branding, tagline: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Primary Color</label><div className="color-input"><input type="color" value={branding.primaryColor || "#25221f"} onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })} /><span>{branding.primaryColor}</span></div></div>
            <div className="form-group"><label>Accent Color</label><div className="color-input"><input type="color" value={branding.accentColor || "#8c6a46"} onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })} /><span>{branding.accentColor}</span></div></div>
          </div>
          <button className="btn-primary" onClick={saveBranding}><Save size={14} /> Save Branding</button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="customizer-section">
        <div className="section-header-row">
          <h2 className="section-title">FREQUENTLY ASKED QUESTIONS ({faqs.length})</h2>
          <button className="btn-primary btn-sm" onClick={() => setShowFaqForm(!showFaqForm)}>{showFaqForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add FAQ</>}</button>
        </div>

        {showFaqForm && (
          <form className="form-card" onSubmit={addFaq}>
            <div className="form-group"><label>Question *</label><input value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} required /></div>
            <div className="form-group"><label>Answer *</label><textarea value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} required rows={3} /></div>
            <div className="form-group"><label>Category</label><input value={faqForm.category} onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })} placeholder="General" /></div>
            <button type="submit" className="btn-primary">Add FAQ</button>
          </form>
        )}

        <div className="faq-list">
          {faqs.map((faq) => (
            <div key={faq._id} className={`faq-item ${faq.isVisible ? "" : "faq-hidden"}`}>
              <div className="faq-content">
                <strong>{faq.question}</strong>
                <p>{faq.answer}</p>
                <span className="faq-category">{faq.category}</span>
              </div>
              <div className="faq-actions">
                <button className="btn-icon" onClick={() => toggleFaqVisibility(faq)} title={faq.isVisible ? "Hide" : "Show"}>{faq.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                <button className="btn-icon btn-danger-icon" onClick={() => deleteFaq(faq._id)} title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="customizer-section">
        <div className="section-header-row">
          <h2 className="section-title">COMPLAINT CATEGORIES ({categories.length})</h2>
          <button className="btn-primary btn-sm" onClick={() => setShowCatForm(!showCatForm)}>{showCatForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Category</>}</button>
        </div>

        {showCatForm && (
          <form className="form-card" onSubmit={addCategory}>
            <div className="form-row">
              <div className="form-group"><label>Name *</label><input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required /></div>
              <div className="form-group"><label>Description</label><input value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} /></div>
            </div>
            <button type="submit" className="btn-primary">Add Category</button>
          </form>
        )}

        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat._id} className="category-chip">
              <span>{cat.name}</span>
              <button className="btn-icon btn-danger-icon" onClick={() => deleteCategory(cat._id)}><X size={12} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
