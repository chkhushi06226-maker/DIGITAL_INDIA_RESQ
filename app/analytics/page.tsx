"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type DataPoint = {
  label: string;
  total: number;
  critical: number;
  resolved: number;
};

const periodDatasets: Record<"24H" | "7D" | "30D", DataPoint[]> = {
  "24H": [
    { label: "00:00", total: 12, critical: 2, resolved: 10 },
    { label: "04:00", total: 8, critical: 1, resolved: 7 },
    { label: "08:00", total: 24, critical: 5, resolved: 19 },
    { label: "12:00", total: 38, critical: 9, resolved: 29 },
    { label: "16:00", total: 31, critical: 7, resolved: 24 },
    { label: "20:00", total: 45, critical: 11, resolved: 34 },
  ],
  "7D": [
    { label: "Mon", total: 42, critical: 9, resolved: 34 },
    { label: "Tue", total: 56, critical: 13, resolved: 45 },
    { label: "Wed", total: 49, critical: 11, resolved: 41 },
    { label: "Thu", total: 68, critical: 17, resolved: 54 },
    { label: "Fri", total: 61, critical: 14, resolved: 51 },
    { label: "Sat", total: 74, critical: 19, resolved: 63 },
    { label: "Sun", total: 52, critical: 10, resolved: 46 },
  ],
  "30D": [
    { label: "Wk 1", total: 284, critical: 64, resolved: 232 },
    { label: "Wk 2", total: 342, critical: 81, resolved: 279 },
    { label: "Wk 3", total: 310, critical: 72, resolved: 254 },
    { label: "Wk 4", total: 395, critical: 94, resolved: 320 },
  ],
};

const incidentTypes = [
  { name: "Medical Trauma", value: 34, icon: "✚", count: "142", trend: "+4%" },
  { name: "Fire Outbreak", value: 24, icon: "🔥", count: "98", trend: "-2%" },
  { name: "Road Collision", value: 18, icon: "🚗", count: "74", trend: "+7%" },
  { name: "Flood & Monsoon", value: 12, icon: "🌊", count: "48", trend: "-5%" },
  { name: "Structural Collapse", value: 7, icon: "🏗️", count: "29", trend: "0%" },
  { name: "Industrial Hazmat", value: 5, icon: "☢️", count: "21", trend: "-1%" },
];

const initialRegions = [
  { name: "Delhi NCR", incidents: 128, response: "04:12", responseSec: 252, coverage: 96, status: "Optimal" },
  { name: "Uttar Pradesh", incidents: 214, response: "06:28", responseSec: 388, coverage: 91, status: "Stable" },
  { name: "Uttarakhand", incidents: 87, response: "08:44", responseSec: 524, coverage: 78, status: "High Alert" },
  { name: "Maharashtra", incidents: 176, response: "05:16", responseSec: 316, coverage: 95, status: "Optimal" },
  { name: "Karnataka", incidents: 143, response: "04:58", responseSec: 298, coverage: 93, status: "Optimal" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"24H" | "7D" | "30D">("7D");
  const [hoveredBar, setHoveredBar] = useState<DataPoint | null>(null);
  const [sortField, setSortField] = useState<"incidents" | "response" | "coverage">("incidents");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentData = periodDatasets[period];
  const maxValue = Math.max(...currentData.map((item) => item.total));

  const totalIncidents = useMemo(
    () => currentData.reduce((sum, item) => sum + item.total, 0),
    [currentData]
  );

  const totalCritical = useMemo(
    () => currentData.reduce((sum, item) => sum + item.critical, 0),
    [currentData]
  );

  const avgResolutionRate = useMemo(() => {
    const resolved = currentData.reduce((sum, item) => sum + item.resolved, 0);
    return Math.round((resolved / totalIncidents) * 100);
  }, [currentData, totalIncidents]);

  const sortedRegions = useMemo(() => {
    return [...initialRegions].sort((a, b) => {
      if (sortField === "incidents") return b.incidents - a.incidents;
      if (sortField === "response") return a.responseSec - b.responseSec;
      if (sortField === "coverage") return b.coverage - a.coverage;
      return 0;
    });
  }, [sortField]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <main className="analytics-root">
      {/* SCOPED CYBER COMMAND CENTER STYLES */}
      <style>{`
        .analytics-root {
          min-height: 100vh;
          background: #020713;
          background-image: 
            radial-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
            radial-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px);
          background-size: 32px 32px, 16px 16px;
          color: #f8fafc;
          font-family: system-ui, -apple-system, sans-serif;
          padding-bottom: 60px;
          box-sizing: border-box;
        }

        /* Sticky Header */
        .analytics-header {
          height: 74px;
          padding: 0 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          background: rgba(10, 21, 41, 0.85);
          backdrop-filter: blur(14px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .analytics-header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%);
        }

        .analytics-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          font-weight: 900;
          background: linear-gradient(135deg, #06b6d4, #2563eb);
          color: white;
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.45);
        }

        .brand-title {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #f8fafc;
        }

        .brand-subtitle {
          font-size: 10px;
          color: #38bdf8;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-link {
          color: #94a3b8;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .header-link:hover {
          background: rgba(59, 130, 246, 0.15);
          color: #38bdf8;
        }

        .btn-export {
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: #38bdf8;
          padding: 7px 13px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-export:hover {
          background: #06b6d4;
          color: #020713;
          box-shadow: 0 0 14px rgba(6, 182, 212, 0.4);
        }

        .live-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 700;
          color: #10b981;
          padding: 6px 12px;
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.1);
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.75); opacity: 0.4; }
        }

        /* Container */
        .analytics-container {
          width: min(1360px, 92%);
          margin: 0 auto;
          padding-top: 36px;
        }

        .analytics-intro {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .eyebrow {
          color: #06b6d4;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .analytics-intro h1 {
          margin: 0;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .analytics-intro p {
          margin: 8px 0 0;
          max-width: 650px;
          color: #94a3b8;
          line-height: 1.5;
          font-size: 14px;
        }

        /* Period Switcher */
        .period-switcher {
          display: flex;
          gap: 4px;
          padding: 4px;
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 10px;
          background: rgba(10, 21, 41, 0.8);
        }

        .period-switcher button {
          border: 0;
          background: transparent;
          color: #94a3b8;
          padding: 8px 16px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.05em;
          transition: all 0.2s;
        }

        .period-switcher button.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
        }

        /* 4-Stat Metric Cards */
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .metric-card {
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 14px;
          background: rgba(10, 21, 41, 0.75);
          padding: 20px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.45);
        }

        .metric-label {
          color: #94a3b8;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 700;
        }

        .metric-value {
          margin-top: 6px;
          font-size: 32px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          color: #f8fafc;
        }

        .metric-change {
          margin-top: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .c-emerald { color: #10b981; }
        .c-cyan { color: #06b6d4; }
        .c-amber { color: #f59e0b; }
        .c-rose { color: #f43f5e; }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }

        .panel {
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          background: rgba(10, 21, 41, 0.75);
          backdrop-filter: blur(12px);
          overflow: hidden;
        }

        .panel-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(59, 130, 246, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-title {
          font-size: 14px;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: 0.02em;
        }

        .panel-subtitle {
          color: #64748b;
          font-size: 11px;
          margin-top: 2px;
        }

        /* Interactive Bar Chart */
        .chart-wrapper {
          position: relative;
        }

        .chart {
          height: 310px;
          padding: 30px 25px 20px;
          display: flex;
          align-items: flex-end;
          gap: 16px;
        }

        .bar-column {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .bar-value {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .bar-track {
          width: 100%;
          max-width: 52px;
          height: 220px;
          display: flex;
          align-items: flex-end;
          border-radius: 8px 8px 4px 4px;
          background: rgba(255, 255, 255, 0.03);
          overflow: hidden;
          transition: background 0.2s;
        }

        .bar-column:hover .bar-track {
          background: rgba(59, 130, 246, 0.1);
        }

        .bar {
          width: 100%;
          border-radius: 7px 7px 3px 3px;
          background: linear-gradient(to top, #1d4ed8, #06b6d4);
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.25);
          transition: height 0.4s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .bar-critical {
          width: 100%;
          background: #ef4444;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
          border-radius: 7px 7px 0 0;
        }

        .bar-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .bar-column:hover .bar-label {
          color: #38bdf8;
        }

        /* Hover Tooltip Overlay */
        .chart-hud-tooltip {
          position: absolute;
          top: 15px;
          right: 25px;
          background: #0f1f38;
          border: 1px solid #38bdf8;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 11px;
          display: flex;
          gap: 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 14px rgba(56, 189, 248, 0.3);
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 0 20px 14px;
          font-size: 11px;
          color: #94a3b8;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .legend-dot { width: 8px; height: 8px; border-radius: 2px; }

        /* Incident Types */
        .type-list {
          padding: 10px 20px 20px;
        }

        .type-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .type-row:last-child { border-bottom: 0; }

        .type-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.25);
          font-size: 14px;
        }

        .type-name {
          width: 125px;
          font-size: 12px;
          color: #cbd5e1;
          font-weight: 600;
        }

        .type-progress {
          flex: 1;
          height: 6px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .type-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #2563eb, #06b6d4);
        }

        .type-percent {
          width: 40px;
          text-align: right;
          font-size: 11px;
          color: #38bdf8;
          font-weight: 700;
        }

        /* Bottom Grid */
        .bottom-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 18px;
        }

        /* Regional Table */
        .region-table {
          width: 100%;
          border-collapse: collapse;
        }

        .region-table th {
          text-align: left;
          padding: 12px 18px;
          color: #64748b;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid rgba(59, 130, 246, 0.15);
          cursor: pointer;
          user-select: none;
        }

        .region-table th:hover { color: #38bdf8; }

        .region-table td {
          padding: 14px 18px;
          font-size: 12px;
          color: #cbd5e1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .region-name {
          color: #f8fafc !important;
          font-weight: 700;
        }

        .coverage-cell { min-width: 130px; }

        .coverage-bar {
          height: 5px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 99px;
          overflow: hidden;
          margin-top: 5px;
        }

        .coverage-bar span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #06b6d4, #10b981);
          border-radius: inherit;
        }

        .status-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
        }
        .status-optimal { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .status-stable { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .status-alert { background: rgba(239, 68, 68, 0.15); color: #f87171; }

        /* Response Readiness Panel */
        .response-stat {
          padding: 15px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .response-stat:last-child { border-bottom: 0; }

        .response-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .response-name {
          font-size: 12px;
          color: #cbd5e1;
          font-weight: 600;
        }

        .response-number {
          font-weight: 800;
          font-size: 13px;
          color: #38bdf8;
        }

        .response-meter {
          height: 6px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 99px;
          margin-top: 8px;
          overflow: hidden;
        }

        .response-meter span {
          display: block;
          height: 100%;
          border-radius: inherit;
        }

        .meter-high { background: linear-gradient(90deg, #10b981, #34d399); }
        .meter-mid { background: linear-gradient(90deg, #3b82f6, #06b6d4); }
        .meter-low { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

        /* Toast */
        .analytics-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0f1f38;
          border: 1px solid #10b981;
          color: #f8fafc;
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(16, 185, 129, 0.35);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 100;
        }

        /* Footer */
        .analytics-footer {
          margin-top: 24px;
          padding: 14px 20px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          background: rgba(10, 21, 41, 0.6);
          color: #64748b;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .footer-live {
          color: #10b981;
          font-weight: 800;
        }

        @media (max-width: 1024px) {
          .metric-grid { grid-template-columns: repeat(2, 1fr); }
          .dashboard-grid, .bottom-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 650px) {
          .analytics-header { padding: 0 4%; }
          .header-link { display: none; }
          .chart { gap: 8px; padding-left: 10px; padding-right: 10px; }
          .region-table { min-width: 540px; }
          .panel { overflow-x: auto; }
        }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="analytics-toast">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="analytics-header">
        <div className="analytics-brand">
          <div className="brand-mark">R</div>
          <div>
            <div className="brand-title">DIGITAL INDIA RES-Q</div>
            <div className="brand-subtitle">NATIONAL RESPONSE INTELLIGENCE & ANALYTICS</div>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="btn-export"
            onClick={() => showToast("SITREP Intelligence PDF report compiled and exported!")}
          >
            📥 Export SITREP
          </button>

          <div className="live-pill">
            <span className="live-dot" />
            ANALYTICS LIVE
          </div>

          <Link href="/dashboard" className="header-link">
            Command Center
          </Link>
        </div>
      </header>

      <div className="analytics-container">
        {/* INTRO */}
        <section className="analytics-intro">
          <div>
            <div className="eyebrow">COMMAND TELEMETRY / REAL-TIME METRICS</div>
            <h1>National Incident Intelligence</h1>
            <p>
              Aggregate statistical analysis of multi-hazard emergency dispatches, rescue SLA
              response performance, and nationwide hospital/fleet readiness.
            </p>
          </div>

          <div className="period-switcher">
            {(["24H", "7D", "30D"] as const).map((item) => (
              <button
                key={item}
                className={period === item ? "active" : ""}
                onClick={() => setPeriod(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* 4 TOP METRIC CARDS */}
        <section className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Total Incidents ({period})</div>
            <div className="metric-value c-cyan">{totalIncidents}</div>
            <div className="metric-change c-emerald">↑ 8.4% recorded trend</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Critical Threat Level</div>
            <div className="metric-value c-rose">{totalCritical}</div>
            <div className="metric-change c-amber">● Immediate priority dispatches</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Resolution Rate</div>
            <div className="metric-value c-emerald">{avgResolutionRate}%</div>
            <div className="metric-change c-emerald">↑ 4.2% efficiency gain</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Network Readiness</div>
            <div className="metric-value c-cyan">92.4%</div>
            <div className="metric-change c-emerald">● 5/5 Backbones Online</div>
          </div>
        </section>

        {/* MAIN CHART + INCIDENT BREAKDOWN */}
        <section className="dashboard-grid">
          <div className="panel chart-wrapper">
            <div className="panel-header">
              <div>
                <div className="panel-title">Incident Velocity & Severity Breakdown</div>
                <div className="panel-subtitle">
                  Showing volume across selected {period} timeline window
                </div>
              </div>
              <span className="live-pill">● {period} ACTIVE</span>
            </div>

            {/* LIVE HUD TOOLTIP ON HOVER */}
            {hoveredBar && (
              <div className="chart-hud-tooltip">
                <div>
                  <strong>{hoveredBar.label}</strong>
                </div>
                <div>
                  Total: <span style={{ color: "#38bdf8", fontWeight: 700 }}>{hoveredBar.total}</span>
                </div>
                <div>
                  Critical: <span style={{ color: "#f87171", fontWeight: 700 }}>{hoveredBar.critical}</span>
                </div>
                <div>
                  Resolved: <span style={{ color: "#34d399", fontWeight: 700 }}>{hoveredBar.resolved}</span>
                </div>
              </div>
            )}

            <div className="chart">
              {currentData.map((item) => {
                const heightPercent = Math.round((item.total / maxValue) * 100);
                const criticalPercent = Math.round((item.critical / item.total) * 100);

                return (
                  <div
                    className="bar-column"
                    key={item.label}
                    onMouseEnter={() => setHoveredBar(item)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div className="bar-value">{item.total}</div>

                    <div className="bar-track">
                      <div className="bar" style={{ height: `${heightPercent}%` }}>
                        <div
                          className="bar-critical"
                          style={{ height: `${criticalPercent}%` }}
                          title={`Critical: ${item.critical}`}
                        />
                      </div>
                    </div>

                    <div className="bar-label">{item.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#ef4444" }} />
                <span>Critical Incidents</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#06b6d4" }} />
                <span>Standard Emergency Load</span>
              </div>
            </div>
          </div>

          {/* INCIDENT CLASSIFICATION */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Incident Classification</div>
                <div className="panel-subtitle">Share of multi-hazard callouts</div>
              </div>
            </div>

            <div className="type-list">
              {incidentTypes.map((item) => (
                <div className="type-row" key={item.name}>
                  <div className="type-icon">{item.icon}</div>

                  <div className="type-name">{item.name}</div>

                  <div className="type-progress">
                    <span style={{ width: `${item.value}%` }} />
                  </div>

                  <div className="type-percent">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REGIONAL MATRIX + RESOURCE READINESS */}
        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Regional Response Matrix</div>
                <div className="panel-subtitle">
                  Click column header to sort performance metrics
                </div>
              </div>
            </div>

            <table className="region-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th onClick={() => setSortField("incidents")}>
                    Incidents {sortField === "incidents" ? "▼" : ""}
                  </th>
                  <th onClick={() => setSortField("response")}>
                    Avg Response {sortField === "response" ? "▲" : ""}
                  </th>
                  <th onClick={() => setSortField("coverage")}>
                    Coverage {sortField === "coverage" ? "▼" : ""}
                  </th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {sortedRegions.map((region) => (
                  <tr key={region.name}>
                    <td className="region-name">{region.name}</td>
                    <td>
                      <strong>{region.incidents}</strong>
                    </td>
                    <td>
                      <code style={{ color: "#38bdf8", fontWeight: 700 }}>
                        {region.response}
                      </code>
                    </td>
                    <td className="coverage-cell">
                      <span>{region.coverage}%</span>
                      <div className="coverage-bar">
                        <span style={{ width: `${region.coverage}%` }} />
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          region.status === "Optimal"
                            ? "status-optimal"
                            : region.status === "Stable"
                            ? "status-stable"
                            : "status-alert"
                        }`}
                      >
                        {region.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RESPONSE READINESS */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Resource Deployment Readiness</div>
                <div className="panel-subtitle">Live availability across national units</div>
              </div>
            </div>

            <div className="response-stat">
              <div className="response-top">
                <span className="response-name">🚑 ALS & BLS Ambulance Fleet</span>
                <span className="response-number">84% Deployed</span>
              </div>
              <div className="response-meter">
                <span className="meter-high" style={{ width: "84%" }} />
              </div>
            </div>

            <div className="response-stat">
              <div className="response-top">
                <span className="response-name">🚒 Fire & Hazmat Rescue Squads</span>
                <span className="response-number">76% Ready</span>
              </div>
              <div className="response-meter">
                <span className="meter-mid" style={{ width: "76%" }} />
              </div>
            </div>

            <div className="response-stat">
              <div className="response-top">
                <span className="response-name">🚓 Highway Patrol & Quick Response</span>
                <span className="response-number">91% Active</span>
              </div>
              <div className="response-meter">
                <span className="meter-high" style={{ width: "91%" }} />
              </div>
            </div>

            <div className="response-stat">
              <div className="response-top">
                <span className="response-name">🏥 Connected ICU & Trauma Capacity</span>
                <span className="response-number" style={{ color: "#fbbf24" }}>
                  68% Reserved
                </span>
              </div>
              <div className="response-meter">
                <span className="meter-low" style={{ width: "68%" }} />
              </div>
            </div>

            <div className="response-stat">
              <div className="response-top">
                <span className="response-name">🛸 Autonomous Drone Surveillance Mesh</span>
                <span className="response-number">88% Airborne</span>
              </div>
              <div className="response-meter">
                <span className="meter-high" style={{ width: "88%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="analytics-footer">
          <span>
            DIGITAL INDIA RES-Q • Operational telemetry aggregated across 112/108 emergency nodes.
          </span>
          <span className="footer-live">● TELEMETRY STREAM ENCRYPTED</span>
        </div>
      </div>
    </main>
  );
}