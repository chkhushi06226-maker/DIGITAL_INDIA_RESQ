"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Resource = {
  id: string;
  name: string;
  category: "Medical" | "Fire" | "Police" | "Drone" | "NDRF";
  type: string;
  icon: string;
  location: string;
  status: "AVAILABLE" | "DISPATCHED" | "BUSY";
  eta: string;
  team: string;
  fuel: number; // percentage
  crew: number;
  radioChannel: string;
  assignedIncident?: string;
};

const initialResources: Resource[] = [
  {
    id: "AMB-042",
    name: "ALS Ambulance 042",
    category: "Medical",
    type: "Advanced Life Support Unit",
    icon: "🚑",
    location: "Ghaziabad, UP",
    status: "AVAILABLE",
    eta: "04 min",
    team: "Trauma Unit Alpha",
    fuel: 94,
    crew: 3,
    radioChannel: "TAC-MED-01",
  },
  {
    id: "FIR-019",
    name: "Heavy Foam Tender 019",
    category: "Fire",
    type: "Fire Suppression & Hazmat",
    icon: "🚒",
    location: "Noida Sector 62, UP",
    status: "DISPATCHED",
    eta: "06 min",
    team: "Fire Response Bravo",
    fuel: 82,
    crew: 6,
    radioChannel: "TAC-FIRE-04",
    assignedIncident: "RESQ-2026-4821 (Fire Outbreak)",
  },
  {
    id: "POL-087",
    name: "Interceptor Patrol 087",
    category: "Police",
    type: "Highway Rapid Clearance",
    icon: "🚓",
    location: "Connaught Place, Delhi",
    status: "AVAILABLE",
    eta: "03 min",
    team: "Rapid Response Unit",
    fuel: 89,
    crew: 2,
    radioChannel: "TAC-POL-09",
  },
  {
    id: "DRN-012",
    name: "Thermal Recon Drone 012",
    category: "Drone",
    type: "Autonomous Aerial Search",
    icon: "🛸",
    location: "Haridwar Ridge, UK",
    status: "AVAILABLE",
    eta: "08 min",
    team: "Aerial Recon Alpha",
    fuel: 78,
    crew: 1,
    radioChannel: "UAV-DATA-02",
  },
  {
    id: "NDR-008",
    name: "NDRF Rescue Squad 08",
    category: "NDRF",
    type: "Heavy Collapsed Structure SAR",
    icon: "🛟",
    location: "Meerut Cantt, UP",
    status: "BUSY",
    eta: "12 min",
    team: "Heavy Rescue Unit 8",
    fuel: 91,
    crew: 12,
    radioChannel: "NDRF-SPEC-08",
    assignedIncident: "RESQ-2026-2198 (Highway Trauma)",
  },
  {
    id: "MED-031",
    name: "Mobile Trauma Bay 031",
    category: "Medical",
    type: "Critical Care Resuscitation",
    icon: "🏥",
    location: "AIIMS Corridor, Delhi",
    status: "AVAILABLE",
    eta: "07 min",
    team: "Critical Care Team",
    fuel: 96,
    crew: 4,
    radioChannel: "TAC-MED-03",
  },
];

const activeIncidents = [
  { id: "RESQ-2026-4821", name: "Fire Outbreak", location: "Ghaziabad, UP", priority: "CRITICAL" },
  { id: "RESQ-2026-7314", name: "Multi-Vehicle Collision", location: "Delhi NCR", priority: "HIGH" },
  { id: "RESQ-2026-9052", name: "Flash Flood Surge", location: "Haridwar, UK", priority: "MEDIUM" },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tactical Dispatch Modal State
  const [dispatchTargetResource, setDispatchTargetResource] = useState<Resource | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState(activeIncidents[0].id);

  // Tactical radio chirp sound
  const playRadioChirp = (frequency = 920) => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Audio fallback
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const availableCount = resources.filter((r) => r.status === "AVAILABLE").length;
  const dispatchedCount = resources.filter((r) => r.status === "DISPATCHED").length;
  const busyCount = resources.filter((r) => r.status === "BUSY").length;

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
      const matchesCategory = categoryFilter === "ALL" || r.category === categoryFilter;
      const matchesSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase()) ||
        r.team.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [resources, statusFilter, categoryFilter, search]);

  // Execute Dispatch Action
  const handleConfirmDispatch = () => {
    if (!dispatchTargetResource) return;

    const incident = activeIncidents.find((i) => i.id === selectedIncidentId);
    const incidentName = incident ? `${incident.id} (${incident.name})` : "General Emergency";

    setResources((prev) =>
      prev.map((r) =>
        r.id === dispatchTargetResource.id
          ? { ...r, status: "DISPATCHED", assignedIncident: incidentName }
          : r
      )
    );

    playRadioChirp(840);
    showToast(`⚡ ${dispatchTargetResource.id} Dispatched to ${incidentName}!`);
    setDispatchTargetResource(null);
  };

  // Recall to Base Action
  const handleRecallResource = (resourceId: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? { ...r, status: "AVAILABLE", assignedIncident: undefined }
          : r
      )
    );
    playRadioChirp(600);
    showToast(`🔄 Unit ${resourceId} recalled. Status set to AVAILABLE.`);
  };

  return (
    <main className="res-root">
      {/* SCOPED SELF-CONTAINED CYBER STYLES */}
      <style>{`
        .res-root {
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

        /* Top Bar */
        .res-header {
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

        .res-header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%);
        }

        .brand {
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
          background: linear-gradient(135deg, #06b6d4, #2563eb);
          color: #fff;
          font-weight: 900;
          font-size: 1.1rem;
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

        .header-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-links a {
          color: #94a3b8;
          text-decoration: none;
          padding: 8px 13px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .header-links a:hover {
          background: rgba(59, 130, 246, 0.15);
          color: #38bdf8;
        }

        /* Container */
        .res-container {
          width: min(1360px, 92%);
          margin: 0 auto;
          padding-top: 36px;
        }

        .intro {
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

        .intro h1 {
          margin: 0;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .intro p {
          margin: 8px 0 0;
          max-width: 650px;
          color: #94a3b8;
          line-height: 1.5;
          font-size: 14px;
        }

        .live-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 999px;
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.1);
          font-size: 11px;
          font-weight: 800;
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

        /* 4 Clickable Metric Cards */
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          padding: 18px 20px;
          border-radius: 14px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          background: rgba(10, 21, 41, 0.75);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.45);
        }

        .stat-card.active-stat {
          border-color: #38bdf8;
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.25);
        }

        .stat-label {
          color: #94a3b8;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 700;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 800;
          margin-top: 4px;
          font-variant-numeric: tabular-nums;
        }

        .c-cyan { color: #06b6d4; }
        .c-emerald { color: #10b981; }
        .c-blue { color: #38bdf8; }
        .c-amber { color: #f59e0b; }

        /* Filter Controls */
        .controls-panel {
          background: rgba(10, 21, 41, 0.65);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 14px;
          padding: 14px 18px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .controls-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 280px;
        }

        .search-box span {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 14px;
        }

        .search-box input {
          width: 100%;
          background: rgba(6, 14, 29, 0.85);
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 8px;
          padding: 8px 14px 8px 34px;
          color: #f8fafc;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
        }

        .search-box input:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
        }

        .category-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .category-chip {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #94a3b8;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-chip:hover {
          color: #f8fafc;
          border-color: rgba(59, 130, 246, 0.5);
        }

        .category-chip.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: #fff;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
        }

        .status-filters {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .status-filter-btn {
          border: 0;
          background: transparent;
          color: #64748b;
          padding: 5px 11px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .status-filter-btn.active {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
        }

        /* 3-Column Tactical Resource Grid */
        .resource-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 18px;
        }

        .resource-card {
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          background: rgba(10, 21, 41, 0.8);
          backdrop-filter: blur(12px);
          padding: 20px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.25s ease;
        }

        .resource-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
        }

        .card-status-available { border-top: 3px solid #10b981; }
        .card-status-dispatched { border-top: 3px solid #38bdf8; }
        .card-status-busy { border-top: 3px solid #f59e0b; }

        .resource-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .resource-icon-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .resource-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.25);
          display: grid;
          place-items: center;
          font-size: 24px;
        }

        .unit-code {
          font-size: 11px;
          font-family: monospace;
          color: #38bdf8;
          font-weight: 700;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .status-badge i { width: 6px; height: 6px; border-radius: 50%; }

        .status-AVAILABLE {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .status-AVAILABLE i { background: #34d399; }

        .status-DISPATCHED {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .status-DISPATCHED i { background: #38bdf8; }

        .status-BUSY {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .status-BUSY i { background: #fbbf24; }

        .resource-name {
          font-size: 16px;
          font-weight: 800;
          color: #f8fafc;
          margin-bottom: 2px;
        }

        .resource-type {
          font-size: 11px;
          color: #06b6d4;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        /* Incident link info */
        .incident-link-box {
          background: rgba(56, 189, 248, 0.1);
          border-left: 3px solid #38bdf8;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 11px;
          color: #cbd5e1;
          margin-bottom: 12px;
        }

        /* Detail rows */
        .details {
          display: grid;
          gap: 8px;
          background: rgba(6, 14, 29, 0.65);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 14px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }

        .detail-label { color: #64748b; }
        .detail-value { color: #cbd5e1; font-weight: 600; text-align: right; }

        /* Telemetry Bar */
        .tele-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
          font-size: 10px;
        }

        .tele-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 6px 8px;
          border-radius: 6px;
        }

        .tele-box span { color: #64748b; display: block; }
        .tele-box strong { color: #f8fafc; font-size: 11px; margin-top: 2px; display: block; }

        /* Action Buttons */
        .btn-action-assign {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #10b981;
          background: linear-gradient(135deg, #059669, #10b981);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.3);
        }

        .btn-action-assign:hover {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
          transform: translateY(-1px);
        }

        .btn-action-recall {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action-recall:hover {
          background: #38bdf8;
          color: #020713;
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
        }

        .btn-action-busy {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.08);
          color: #fbbf24;
          font-size: 11px;
          font-weight: 700;
          cursor: not-allowed;
          opacity: 0.8;
        }

        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 7, 19, 0.88);
          backdrop-filter: blur(10px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-box {
          background: #0a1529;
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: 16px;
          width: 100%;
          maxWidth: 520px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.8), 0 0 30px rgba(59, 130, 246, 0.25);
          overflow: hidden;
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .modal-head h3 { margin: 0; font-size: 16px; color: #f8fafc; }

        .modal-close {
          background: transparent;
          border: 0;
          color: #94a3b8;
          font-size: 18px;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .incident-select {
          width: 100%;
          background: rgba(6, 14, 29, 0.9);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #f8fafc;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          margin-top: 6px;
          outline: none;
        }

        .modal-foot {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 20px;
          background: rgba(6, 14, 29, 0.8);
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .btn-cancel {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #cbd5e1;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-confirm-dispatch {
          background: linear-gradient(135deg, #10b981, #059669);
          border: 1px solid #10b981;
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.4);
        }

        /* Toast */
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 100;
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid #10b981;
          background: #0f1f38;
          color: #34d399;
          box-shadow: 0 12px 35px rgba(0,0,0,0.6), 0 0 20px rgba(16, 185, 129, 0.3);
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Footer */
        .footer {
          margin-top: 28px;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          background: rgba(10, 21, 41, 0.6);
          color: #64748b;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        @media (max-width: 900px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
          .header-links a { display: none; }
        }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="toast">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="res-header">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <div className="brand-title">DIGITAL INDIA RES-Q</div>
            <div className="brand-subtitle">NATIONAL DEFENCE & EMERGENCY FLEET DISPATCH</div>
          </div>
        </div>

        <div className="header-links">
          <Link href="/dashboard">Command Center</Link>
          <Link href="/hospitals">Hospitals</Link>
          <Link href="/connectivity">Connectivity</Link>
          <Link href="/analytics">Analytics</Link>
        </div>
      </header>

      <div className="res-container">
        {/* HERO INTRO */}
        <section className="intro">
          <div>
            <div className="eyebrow">FIELD RESOURCE ORCHESTRATION</div>
            <h1>Emergency Response Fleet</h1>
            <p>
              Live GPS and UHF radio coordination for Advanced Life Support (ALS) ambulances, heavy
              fire tenders, NDRF flood rescue boats, and autonomous reconnaissance drones.
            </p>
          </div>

          <div className="live-status">
            <span className="live-dot" />
            FLEET TELEMETRY ONLINE
          </div>
        </section>

        {/* 4 CLICKABLE STAT CARDS */}
        <section className="stats">
          <div
            className={`stat-card ${statusFilter === "ALL" ? "active-stat" : ""}`}
            onClick={() => setStatusFilter("ALL")}
          >
            <div className="stat-label">Total Fleet Units</div>
            <div className="stat-number c-cyan">{resources.length}</div>
          </div>

          <div
            className={`stat-card ${statusFilter === "AVAILABLE" ? "active-stat" : ""}`}
            onClick={() => setStatusFilter("AVAILABLE")}
          >
            <div className="stat-label">Available to Deploy</div>
            <div className="stat-number c-emerald">{availableCount}</div>
          </div>

          <div
            className={`stat-card ${statusFilter === "DISPATCHED" ? "active-stat" : ""}`}
            onClick={() => setStatusFilter("DISPATCHED")}
          >
            <div className="stat-label">En Route / Dispatched</div>
            <div className="stat-number c-blue">{dispatchedCount}</div>
          </div>

          <div
            className={`stat-card ${statusFilter === "BUSY" ? "active-stat" : ""}`}
            onClick={() => setStatusFilter("BUSY")}
          >
            <div className="stat-label">On-Scene (Busy)</div>
            <div className="stat-number c-amber">{busyCount}</div>
          </div>
        </section>

        {/* SEARCH & FILTERS PANEL */}
        <section className="controls-panel">
          <div className="controls-top">
            <div className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search unit by ID (AMB-042), location, or squad name..."
              />
            </div>

            <div className="category-chips">
              {(["ALL", "Medical", "Fire", "Police", "Drone", "NDRF"] as const).map((cat) => (
                <button
                  key={cat}
                  className={`category-chip ${categoryFilter === cat ? "active" : ""}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === "ALL" ? "All Units" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="status-filters">
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 700 }}>STATUS:</span>
            {["ALL", "AVAILABLE", "DISPATCHED", "BUSY"].map((st) => (
              <button
                key={st}
                className={`status-filter-btn ${statusFilter === st ? "active" : ""}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </section>

        {/* 3-COLUMN TACTICAL RESOURCE GRID */}
        <section className="resource-grid">
          {filteredResources.map((resource) => (
            <article
              className={`resource-card card-status-${resource.status.toLowerCase()}`}
              key={resource.id}
            >
              <div className="resource-top">
                <div className="resource-icon-wrap">
                  <div className="resource-icon">{resource.icon}</div>
                  <div>
                    <span className="unit-code">{resource.id}</span>
                    <div className="resource-name">{resource.name}</div>
                  </div>
                </div>

                <span className={`status-badge status-${resource.status}`}>
                  <i />
                  {resource.status}
                </span>
              </div>

              <div className="resource-type">{resource.type}</div>

              {resource.assignedIncident && (
                <div className="incident-link-box">
                  📍 Dispatched to: <strong>{resource.assignedIncident}</strong>
                </div>
              )}

              <div className="details">
                <div className="detail-row">
                  <span className="detail-label">Staging Base:</span>
                  <span className="detail-value">📍 {resource.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Response ETA:</span>
                  <span className="detail-value" style={{ color: "#38bdf8" }}>
                    ⚡ {resource.eta}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Assigned Crew:</span>
                  <span className="detail-value">{resource.team}</span>
                </div>
              </div>

              {/* TELEMETRY */}
              <div className="tele-row">
                <div className="tele-box">
                  <span>FUEL / BATT</span>
                  <strong style={{ color: resource.fuel > 80 ? "#10b981" : "#f59e0b" }}>
                    {resource.fuel}% Nominal
                  </strong>
                </div>
                <div className="tele-box">
                  <span>RADIO COMMS</span>
                  <strong style={{ color: "#06b6d4" }}>{resource.radioChannel}</strong>
                </div>
              </div>

              {/* DYNAMIC ACTIONS */}
              {resource.status === "AVAILABLE" && (
                <button
                  className="btn-action-assign"
                  onClick={() => setDispatchTargetResource(resource)}
                >
                  ⚡ DISPATCH TO INCIDENT
                </button>
              )}

              {resource.status === "DISPATCHED" && (
                <button
                  className="btn-action-recall"
                  onClick={() => handleRecallResource(resource.id)}
                >
                  🔄 RECALL TO BASE (STANDBY)
                </button>
              )}

              {resource.status === "BUSY" && (
                <button
                  className="btn-action-busy"
                  onClick={() => handleRecallResource(resource.id)}
                  title="Click to force-release unit"
                >
                  ⚠️ ENGAGED ON-SCENE (CLICK TO RELEASE)
                </button>
              )}
            </article>
          ))}
        </section>

        {/* TACTICAL DISPATCH MODAL */}
        {dispatchTargetResource && (
          <div className="modal-overlay" onClick={() => setDispatchTargetResource(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>🚨</span>
                  <h3>Authorize Immediate Dispatch</h3>
                </div>
                <button className="modal-close" onClick={() => setDispatchTargetResource(null)}>
                  ✕
                </button>
              </div>

              <div className="modal-content">
                <p style={{ margin: "0 0 12px", color: "#94a3b8", fontSize: "13px" }}>
                  Routing <strong>{dispatchTargetResource.name} ({dispatchTargetResource.id})</strong>{" "}
                  under emergency protocol. Green corridor clear signals will be broadcasted.
                </p>

                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: 700 }}>
                  ASSIGN TO ACTIVE INCIDENT:
                </label>
                <select
                  className="incident-select"
                  value={selectedIncidentId}
                  onChange={(e) => setSelectedIncidentId(e.target.value)}
                >
                  {activeIncidents.map((inc) => (
                    <option key={inc.id} value={inc.id}>
                      [{inc.priority}] {inc.id} — {inc.name} ({inc.location})
                    </option>
                  ))}
                </select>

                <div
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "8px",
                    padding: "10px",
                    marginTop: "14px",
                    fontSize: "11px",
                    color: "#cbd5e1",
                  }}
                >
                  <div>
                    📻 Radio Handshake: <code>{dispatchTargetResource.radioChannel}</code>
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    ⏱️ Target Arrival: ~{dispatchTargetResource.eta} via Express Clearance
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button className="btn-cancel" onClick={() => setDispatchTargetResource(null)}>
                  Cancel
                </button>
                <button className="btn-confirm-dispatch" onClick={handleConfirmDispatch}>
                  CONFIRM & ENGAGE DISPATCH →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <span>Digital India RES-Q • National Integrated Emergency Response System (112/108)</span>
          <span style={{ color: "#10b981", fontWeight: 700 }}>● ALL SQUAD SENSORS ENCRYPTED</span>
        </footer>
      </div>
    </main>
  );
}