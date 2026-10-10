import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { KB_ARTICLES } from "../data/initialData";

export const KnowledgeBaseSection = () => {
  const { switchTab, setActiveArticleId } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredArticles = KB_ARTICLES.filter((art) => {
    const q = searchQuery.toLowerCase().trim();
    const matchCat = activeCategory === "ALL" || art.category.toLowerCase() === activeCategory.toLowerCase();
    const matchQuery =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.snippet.toLowerCase().includes(q) ||
      art.body.toLowerCase().includes(q);

    return matchCat && matchQuery;
  });

  return (
    <section className="page-section active">
      <div className="page-header">
        <div>
          <span className="section-tag">Statutory Knowledge Base</span>
          <h2 className="page-title">Redressal Guides & Precedents</h2>
          <p className="page-subtitle">
            Authoritative documentation on dispute settlement standards, refund timelines, freight claims, and consumer protection regulations.
          </p>
        </div>
        <div className="search-bar kb-search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search regulations, refund clauses, warranty terms..."
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="kb-categories">
        <button
          className={`kb-cat-btn ${activeCategory === "ALL" ? "active" : ""}`}
          onClick={() => setActiveCategory("ALL")}
        >
          All Guides
        </button>
        <button
          className={`kb-cat-btn ${activeCategory === "Billing" ? "active" : ""}`}
          onClick={() => setActiveCategory("Billing")}
        >
          Billing & Invoicing
        </button>
        <button
          className={`kb-cat-btn ${activeCategory === "Delivery" ? "active" : ""}`}
          onClick={() => setActiveCategory("Delivery")}
        >
          Transit & Logistics
        </button>
        <button
          className={`kb-cat-btn ${activeCategory === "Technical" ? "active" : ""}`}
          onClick={() => setActiveCategory("Technical")}
        >
          Systems & Authentication
        </button>
        <button
          className={`kb-cat-btn ${activeCategory === "Warranty" ? "active" : ""}`}
          onClick={() => setActiveCategory("Warranty")}
        >
          Warranty & Restitution
        </button>
      </div>

      {/* Articles Grid */}
      <div className="kb-grid">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="kb-card"
            onClick={() => setActiveArticleId(art.id)}
          >
            <div>
              <div className="kb-card-header">
                <span className="badge badge-primary">{art.category}</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  {art.readTime}
                </span>
              </div>
              <h3 className="kb-card-title">{art.title}</h3>
              <p className="kb-card-snippet">{art.snippet}</p>
            </div>
            <div className="kb-card-footer">
              <span>{art.likes} verified citations</span>
              <span style={{ color: "var(--bronze)", fontWeight: 600 }}>Review Document →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Need Help Banner */}
      <div className="need-help-banner">
        <div>
          <h3>Require Specific Dispute Arbitration?</h3>
          <p>Our designated resolution officers and legal intake officers are on duty around the clock.</p>
        </div>
        <button className="btn btn-primary" onClick={() => switchTab("submit")}>
          Lodge Formal Grievance
        </button>
      </div>
    </section>
  );
};
