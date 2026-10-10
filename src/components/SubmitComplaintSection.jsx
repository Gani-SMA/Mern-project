import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { AI_POLISH_TEMPLATES } from "../data/initialData";

export const SubmitComplaintSection = () => {
  const { createTicket, showToast } = useApp();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    custName: "",
    custEmail: "",
    custPhone: "",
    orderRef: "",
    category: "",
    priority: "Medium",
    title: "",
    description: "",
    incidentDate: "",
    desiredResolution: "Full Refund"
  });

  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Linguistic analysis
  const combinedText = `${formData.title} ${formData.description}`.toLowerCase();
  
  let detectedCategory = "Awaiting narrative...";
  if (combinedText.trim().length > 0) {
    if (combinedText.includes("bill") || combinedText.includes("charge") || combinedText.includes("refund") || combinedText.includes("invoice") || combinedText.includes("$")) {
      detectedCategory = "Billing & Financial Reconciliation";
    } else if (combinedText.includes("ship") || combinedText.includes("deliver") || combinedText.includes("package") || combinedText.includes("porch") || combinedText.includes("tracking")) {
      detectedCategory = "Logistics & Freight Transit";
    } else if (combinedText.includes("damage") || combinedText.includes("broken") || combinedText.includes("defect") || combinedText.includes("screen") || combinedText.includes("quality")) {
      detectedCategory = "Product Quality & Hardware Inspection";
    } else if (combinedText.includes("login") || combinedText.includes("bug") || combinedText.includes("sso") || combinedText.includes("error") || combinedText.includes("glitch")) {
      detectedCategory = "Technical Operations & Systems";
    } else {
      detectedCategory = "General Commercial Dispute";
    }
  }

  let clarityScore = 20;
  if (combinedText.length > 40) clarityScore += 30;
  if (combinedText.length > 120) clarityScore += 30;
  if (/\d+/.test(combinedText)) clarityScore += 20;
  if (clarityScore > 100) clarityScore = 100;

  let clarityText = "Preliminary";
  if (clarityScore >= 80) clarityText = "Thorough & Actionable";
  else if (clarityScore >= 50) clarityText = "Moderate Detail";
  else if (combinedText.length > 0) clarityText = "Needs Particulars";

  let guaranteedSLA = "24 Hours Standard";
  if (formData.priority === "Critical") guaranteedSLA = "6 Hours Guaranteed";
  else if (formData.priority === "High") guaranteedSLA = "12 Hours Expedited";
  else if (formData.priority === "Low") guaranteedSLA = "48 Hours";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePolishWithAI = () => {
    const randomTemplate = AI_POLISH_TEMPLATES[Math.floor(Math.random() * AI_POLISH_TEMPLATES.length)];
    setFormData((prev) => ({
      ...prev,
      description: randomTemplate,
      category: prev.category || (detectedCategory.includes("Billing") ? "Billing & Payments" : "Billing & Payments")
    }));
    showToast("Dossier Structured", "Grievance structured in accordance with arbitration standards.", "info");
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((f) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + " KB"
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.custName.trim()) newErrors.custName = "Please enter your full legal name.";
    if (!formData.custEmail.trim() || !formData.custEmail.includes("@")) newErrors.custEmail = "A valid contact email is required.";
    if (!formData.category) newErrors.category = "Please select a grievance classification.";
    if (!formData.title.trim()) newErrors.title = "A concise dispute subject is required.";
    if (!formData.description.trim() || formData.description.length < 15) {
      newErrors.description = "Please provide at least 15 characters of factual detail.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Submission Incomplete", "Please complete all mandatory docket fields.", "error");
      return;
    }

    createTicket({
      ...formData,
      attachments: uploadedFiles
    });

    setFormData({
      custName: "",
      custEmail: "",
      custPhone: "",
      orderRef: "",
      category: "",
      priority: "Medium",
      title: "",
      description: "",
      incidentDate: "",
      desiredResolution: "Full Refund"
    });
    setUploadedFiles([]);
    setErrors({});
  };

  return (
    <section className="page-section active">
      <div className="page-header">
        <div>
          <span className="section-tag">Formal Grievance Filing</span>
          <h2 className="page-title">Register an Official Dispute Dossier</h2>
          <p className="page-subtitle">
            Provide formal particulars to commence statutory investigation under our binding resolution charter.
          </p>
        </div>
      </div>

      <div className="form-layout-grid">
        {/* Form Panel */}
        <div className="panel">
          <form onSubmit={handleSubmit} noValidate>
            
            {/* Section 1 */}
            <div className="form-group-section">
              <h4 className="form-section-title">1. Complainant Identity</h4>
              <div className="grid-2-cols">
                <div className="form-control-wrap">
                  <label className="form-label">Full Legal Name <span className="req">*</span></label>
                  <input
                    type="text"
                    name="custName"
                    value={formData.custName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Alexandra Wright"
                  />
                  {errors.custName && <span className="field-error">{errors.custName}</span>}
                </div>
                <div className="form-control-wrap">
                  <label className="form-label">Contact Email Address <span className="req">*</span></label>
                  <input
                    type="email"
                    name="custEmail"
                    value={formData.custEmail}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., alexandra.w@example.com"
                  />
                  {errors.custEmail && <span className="field-error">{errors.custEmail}</span>}
                </div>
              </div>

              <div className="grid-2-cols">
                <div className="form-control-wrap">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="custPhone"
                    value={formData.custPhone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>
                <div className="form-control-wrap">
                  <label className="form-label">Invoice / Order / Transaction Reference</label>
                  <input
                    type="text"
                    name="orderRef"
                    value={formData.orderRef}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., INV-94829 or ACC-4421"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="form-group-section">
              <h4 className="form-section-title">2. Jurisdictional Classification & Severity</h4>
              <div className="grid-2-cols">
                <div className="form-control-wrap">
                  <label className="form-label">Dispute Category <span className="req">*</span></label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Department Jurisdiction...</option>
                    <option value="Billing & Payments">Billing, Invoicing & Overcharge</option>
                    <option value="Product Quality & Defect">Product Quality & Technical Defect</option>
                    <option value="Shipping & Delivery">Shipping, Delivery & Transit Loss</option>
                    <option value="Technical Support & Software">Software Malfunction & Enterprise Service</option>
                    <option value="Customer Service Conduct">Service Conduct & Breach of Policy</option>
                    <option value="Security & Account Privacy">Security, Fraud & Data Privacy</option>
                    <option value="Cancellation & Refund">Contract Cancellation & Restitution</option>
                    <option value="Other Inquiries">Other Grievances</option>
                  </select>
                  {errors.category && <span className="field-error">{errors.category}</span>}
                </div>

                <div className="form-control-wrap">
                  <label className="form-label">Severity & Statutory Window <span className="req">*</span></label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Low">Low (General clarification - 48 Hour Window)</option>
                    <option value="Medium">Medium (Standard commercial issue - 24 Hour Window)</option>
                    <option value="High">High (Direct financial or service impact - 12 Hour Window)</option>
                    <option value="Critical">Critical (Total outage or ongoing financial fraud - 6 Hour Window)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="form-group-section">
              <h4 className="form-section-title">3. Factual Statement & Desired Relief</h4>
              <div className="form-control-wrap">
                <label className="form-label">Subject / Summary of Claim <span className="req">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Summary of grievance..."
                  maxLength={120}
                />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>

              <div className="form-control-wrap">
                <div className="label-with-tool">
                  <label className="form-label">Narrative Particulars <span className="req">*</span></label>
                  <button
                    type="button"
                    className="tool-btn"
                    onClick={handlePolishWithAI}
                    title="Structure narrative format"
                  >
                    Format Narrative
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="form-textarea"
                  placeholder="Set out chronological facts, dates, amounts in dispute, previous communications, and requested redress..."
                />
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>

              <div className="grid-2-cols">
                <div className="form-control-wrap">
                  <label className="form-label">Date of Incident</label>
                  <input
                    type="date"
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-control-wrap">
                  <label className="form-label">Requested Redress / Remedy</label>
                  <select
                    name="desiredResolution"
                    value={formData.desiredResolution}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Full Refund">Full Refund & Charge Reversal</option>
                    <option value="Product Replacement">Hardware / Unit Replacement</option>
                    <option value="Technical Fix / Bug Patch">Engineering Remediation & Patch</option>
                    <option value="Service Credit & Compensation">Account Credit & Restitution</option>
                    <option value="Formal Apology & Process Review">Formal Written Explanation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="form-group-section">
              <h4 className="form-section-title">4. Supporting Documentation (Invoices, Logs, Receipts)</h4>
              <div
                className={`drop-zone ${isDragOver ? "dragover" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
                }}
              >
                <p className="drop-zone-text">
                  Drop evidentiary documents here, or <span className="browse-link">select files from storage</span>
                </p>
                <span className="drop-zone-sub">Accepted: PDF, PNG, JPG, TXT (Maximum 15MB)</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.txt"
                  className="file-input-hidden"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="attached-files-list">
                  {uploadedFiles.map((f, idx) => (
                    <div className="file-pill" key={idx}>
                      <span>{f.name} ({f.size})</span>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => removeFile(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setFormData({
                    custName: "",
                    custEmail: "",
                    custPhone: "",
                    orderRef: "",
                    category: "",
                    priority: "Medium",
                    title: "",
                    description: "",
                    incidentDate: "",
                    desiredResolution: "Full Refund"
                  });
                  setUploadedFiles([]);
                  setErrors({});
                }}
              >
                Clear
              </button>
              <button type="submit" className="btn btn-primary btn-lg">
                Submit Formal Dossier
              </button>
            </div>

          </form>
        </div>

        {/* Sidebar Info */}
        <div className="form-sidebar">
          <div className="card">
            <div className="card-header">
              <div className="ai-badge">Dossier Diagnostics</div>
              <span className="badge badge-emerald">Ready</span>
            </div>
            <div className="card-body">
              <p className="ai-helper-desc">
                Automated intake checks to ensure mandatory particulars are satisfied before docket creation.
              </p>

              <div className="ai-metric-item">
                <span className="label">Jurisdiction:</span>
                <strong>{detectedCategory}</strong>
              </div>

              <div className="ai-metric-item">
                <span className="label">Clarity Assessment:</span>
                <span className="clarity-text">{clarityText}</span>
              </div>

              <div className="ai-metric-item">
                <span className="label">Guaranteed Window:</span>
                <strong>{guaranteedSLA}</strong>
              </div>

              <div className="ai-tips-box">
                <strong>Submission Best Practices:</strong>
                <ul>
                  <li>State precise transaction identifiers.</li>
                  <li>Include chronological sequence of events.</li>
                  <li>Attach proof of prior communication.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Consumer Charter Rights</h4>
            </div>
            <div className="card-body">
              <ul className="trust-list">
                <li>
                  <strong>Mandatory Resolver Assignment:</strong> Every filed docket is assigned an accredited case officer within the statutory timeline.
                </li>
                <li>
                  <strong>Direct Ombudsman Appeal:</strong> In the event of unsatisfactory resolution, customers retain automatic right of executive appeal.
                </li>
                <li>
                  <strong>Verifiable Audit Registry:</strong> Every case action is permanently recorded in the immutable arbitration ledger.
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
