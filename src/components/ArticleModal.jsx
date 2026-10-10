import React from "react";
import { useApp } from "../context/AppContext";
import { KB_ARTICLES } from "../data/initialData";

export const ArticleModal = () => {
  const { activeArticleId, setActiveArticleId, switchTab, showToast } = useApp();

  const article = KB_ARTICLES.find((a) => a.id === activeArticleId);
  if (!article) return null;

  return (
    <div className="modal-backdrop active" onClick={() => setActiveArticleId(null)}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="badge badge-primary">{article.category}</span>
            <h2 className="modal-title" style={{ marginTop: "0.4rem" }}>{article.title}</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setActiveArticleId(null)}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div
          className="modal-body article-content"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        <div className="modal-footer">
          <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Did this statutory guide address your inquiry?
          </span>
          <div style={{ display: "flex", gap: "0.65rem" }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                showToast("Feedback Recorded", "Thank you for confirming resolution.", "success");
                setActiveArticleId(null);
              }}
            >
              Affirmative, Resolved
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setActiveArticleId(null);
                switchTab("submit");
                showToast("Escalation Transfer", "Redirecting to formal grievance dossier filing.", "info");
              }}
            >
              Initiate Formal Dispute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
