import React from "react";
import { 
  RotateCw, 
  Printer, 
  FolderArchive, 
  Clock, 
  AlertOctagon, 
  CheckCheck, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  PieChart as PieIcon, 
  BarChart2, 
  Flame, 
  Eye 
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useApp } from "../context/AppContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const OperationsHubSection = () => {
  const { 
    tickets, 
    getAnalytics, 
    setActiveTicketId, 
    theme, 
    showToast,
    isAuthenticated,
    openAuthModal 
  } = useApp();
  const analytics = getAnalytics();

  const handleAuditClick = (ticketId) => {
    if (!isAuthenticated) {
      openAuthModal("Authentication is mandatory to inspect docket files.", "analytics");
      return;
    }
    setActiveTicketId(ticketId);
  };

  const isDark = theme === "dark";
  const textColor = isDark ? "#a69f92" : "#5a5854";
  const gridColor = isDark ? "#383531" : "#ded7cb";
  const cardBg = isDark ? "#23211f" : "#ffffff";

  // Classic Beige & Grey Doughnut Chart Palette
  const categoryLabels = Object.keys(analytics.categoryCounts);
  const categoryValues = Object.values(analytics.categoryCounts);

  const doughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: [
          "#34312e", // Charcoal
          "#8f6e4a", // Antique Bronze
          "#4f6859", // Sage
          "#6e6b65", // Taupe
          "#8c3b3b", // Brick Burgundy
          "#946927", // Amber
          "#5c6b73"  // Slate
        ],
        borderWidth: 2,
        borderColor: cardBg
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { 
          color: textColor, 
          boxWidth: 12,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 }
        }
      }
    }
  };

  // Classic Bar Chart Data
  const barData = {
    labels: ["Open", "In Investigation", "Escalated", "Resolved"],
    datasets: [
      {
        label: "Complaints Count",
        data: [
          analytics.open,
          analytics.investigating,
          analytics.escalated,
          analytics.resolved
        ],
        backgroundColor: [
          "#6e6b65", // Taupe (Open)
          "#946927", // Amber (Investigating)
          "#8c3b3b", // Brick (Escalated)
          "#4f6859"  // Sage (Resolved)
        ],
        borderRadius: 4
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { 
          color: textColor, 
          stepSize: 1,
          font: { family: "'Plus Jakarta Sans', sans-serif" }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          color: textColor,
          font: { family: "'Plus Jakarta Sans', sans-serif" }
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  const criticalTickets = tickets.filter(
    (t) => t.priority === "Critical" || t.priority === "High"
  );

  const getPriorityClass = (priority) => {
    if (priority === "Critical") return "priority-critical";
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  };

  const getStatusClass = (status) => {
    if (status === "Open") return "status-open";
    if (status === "Under Investigation") return "status-investigating";
    if (status === "Escalated") return "status-escalated";
    if (status === "Resolved") return "status-resolved";
    return "status-closed";
  };

  return (
    <section className="page-section active">
      <div className="page-header">
        <div>
          <span className="section-tag">Executive Oversight & SLAs</span>
          <h2 className="page-title">Operations & Audit Dashboard</h2>
          <p className="page-subtitle">
            Formal ledger metrics on dispute intake, team SLAs, resolution bottlenecks, and CSAT scores.
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-outline"
            onClick={() => showToast("Metrics Synchronized", "Real-time analytics updated.", "info")}
          >
            <RotateCw size={15} /> Live Refresh
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={15} /> Print Audit Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Disputes</span>
            <FolderArchive className="kpi-icon text-muted" size={18} />
          </div>
          <div className="kpi-num">{analytics.total}</div>
          <div className="kpi-trend text-emerald">
            <TrendingUp size={14} /> +12% this cycle
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">In Investigation</span>
            <Clock className="kpi-icon text-amber" size={18} />
          </div>
          <div className="kpi-num">{analytics.active}</div>
          <div className="kpi-trend text-muted">Awaiting resolver resolution</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Escalated Cases</span>
            <AlertOctagon className="kpi-icon text-rose" size={18} />
          </div>
          <div className="kpi-num text-rose">{analytics.escalated}</div>
          <div className="kpi-trend text-rose">
            <AlertTriangle size={14} /> Requires Executive Review
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Resolution Rate</span>
            <CheckCheck className="kpi-icon text-emerald" size={18} />
          </div>
          <div className="kpi-num text-emerald">{analytics.resolvedRate}%</div>
          <div className="kpi-trend text-emerald">
            <Award size={14} /> Above 90% SLA Target
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="analytics-charts-grid">
        <div className="panel chart-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <PieIcon size={16} /> Grievances by Category
            </h3>
          </div>
          <div className="panel-body chart-body">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <BarChart2 size={16} /> Status Distribution & Escalations
            </h3>
          </div>
          <div className="panel-body chart-body">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* SLA Watch Table */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <Flame size={16} className="text-rose" /> Critical & High Priority Escalation Watch
            </h3>
            <p className="panel-subtitle">Cases demanding immediate settlement to maintain statutory SLA compliance</p>
          </div>
        </div>
        <div className="panel-body">
          <div className="tickets-table-wrap">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Complainant</th>
                  <th>Dispute Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Officer</th>
                  <th>SLA Window</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {criticalTickets.length > 0 ? (
                  criticalTickets.map((t) => (
                    <tr key={t.id}>
                      <td><span className="ticket-id-tag">{t.id}</span></td>
                      <td><strong>{t.customer.name}</strong></td>
                      <td>{t.title}</td>
                      <td><span className={`badge ${getPriorityClass(t.priority)}`}>{t.priority}</span></td>
                      <td><span className={`badge ${getStatusClass(t.status)}`}>{t.status}</span></td>
                      <td>{t.assignedOfficer}</td>
                      <td><strong className="text-rose">SLA {t.slaHours}h</strong></td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleAuditClick(t.id)}
                        >
                          <Eye size={13} /> Audit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                      No critical priority escalations currently pending.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
