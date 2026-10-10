import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

export const ResolveBotWidget = () => {
  const { tickets, switchTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "bot-init",
      sender: "bot",
      text: "Welcome to the <strong>Resolution Registry Concierge</strong>. You may provide a reference docket ID (e.g. <code>RES-2026-8812</code>) to check active proceedings, or ask about statutory refund policies.",
      time: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      time: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      let botResponse = "";
      const lower = text.toLowerCase();

      if (lower.includes("res-2026-") || lower.includes("ticket") || lower.includes("status") || lower.includes("docket")) {
        const match = text.match(/RES-2026-\d{4}/i);
        if (match) {
          const found = tickets.find((t) => t.id.toUpperCase() === match[0].toUpperCase());
          if (found) {
            botResponse = `Docket <strong>${found.id}</strong> is currently <strong>${found.status}</strong> under <strong>${found.priority}</strong> severity. Assigned officer: <em>${found.assignedOfficer}</em>.`;
          } else {
            botResponse = `Docket reference <code>${match[0]}</code> was not located in the active registry index.`;
          }
        } else {
          botResponse = `Please specify your official reference number like <code>RES-2026-8812</code> to retrieve the case record.`;
        }
      } else if (lower.includes("refund") || lower.includes("money") || lower.includes("charge")) {
        botResponse = `Billing restitution inquiries are processed under a statutory 2 to 5 business day settlement window once authorized by a case resolver.`;
      } else if (lower.includes("urgent") || lower.includes("complaint") || lower.includes("file")) {
        botResponse = `You can register a formal dispute immediately through our online grievance filing portal.`;
      } else {
        botResponse = `Your inquiry regarding "${text}" has been recorded. You may file a formal claim or consult our statutory knowledge base.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: botResponse,
          time: "Just now"
        }
      ]);
    }, 400);
  };

  return (
    <div className="chat-widget-wrap">
      {/* Trigger Button */}
      <button
        className="chat-trigger-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Open Registry Concierge"
      >
        <span>Registry Concierge</span>
        {!isOpen && <span className="chat-ping-badge"></span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-window-header">
            <div className="chat-header-user">
              <strong>Registry Concierge</strong>
              <span className="bot-status">
                <span className="pulse-dot"></span> Active Assistant
              </span>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="chat-messages-body">
            {messages.map((m) => (
              <div key={m.id} className={`chat-msg ${m.sender === "bot" ? "bot-msg" : "user-msg"}`}>
                <div
                  className="msg-bubble"
                  dangerouslySetInnerHTML={{ __html: m.text }}
                />
                <span className="msg-time">{m.time}</span>
              </div>
            ))}

            <div className="chat-quick-prompts">
              <button
                type="button"
                className="quick-chip"
                onClick={() => handleSendMessage("Check status of RES-2026-8812")}
              >
                Inquire on Docket RES-2026-8812
              </button>
              <button
                type="button"
                className="quick-chip"
                onClick={() => handleSendMessage("How long does a refund take?")}
              >
                Refund Settlement Timeline
              </button>
              <button
                type="button"
                className="quick-chip"
                onClick={() => {
                  setIsOpen(false);
                  switchTab("submit");
                }}
              >
                Lodge Formal Grievance
              </button>
            </div>
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="chat-input-bar"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Inquire on docket or statutory policy..."
              autoComplete="off"
            />
            <button type="submit" className="chat-send-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
