"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Drone = {
  id: string;
  name: string;
  type: string;
  location: string;
  coordinates: string;
  mission: string;
  battery: number;
  altitude: string;
  speed: string;
  payload: string;
  signal: number; // percentage
  status: "AIRBORNE" | "STANDBY" | "RETURNING";
  icon: string;
};

const initialDrones: Drone[] = [
  {
    id: "DRN-012",
    name: "Rescue Hawk 012",
    type: "Heavy Thermal Recon UAV",
    location: "Haridwar Ridge, UK",
    coordinates: "29.9457° N, 78.1642° E",
    mission: "Flood & Riverbank Surveillance",
    battery: 82,
    altitude: "420 m",
    speed: "68 km/h",
    payload: "FLIR Thermal Optic + Life-Vest Dropper",
    signal: 98,
    status: "AIRBORNE",
    icon: "🚁",
  },
  {
    id: "DRN-024",
    name: "Guardian 024",
    type: "Disaster Perimeter Sentinel",
    location: "Ghaziabad Industrial Zone, UP",
    coordinates: "28.6692° N, 77.4538° E",
    mission: "Chemical Fire Perimeter Scan",
    battery: 67,
    altitude: "310 m",
    speed: "54 km/h",
    payload: "Multi-Gas Toxic Sensor + 4K Zoom",
    signal: 94,
    status: "AIRBORNE",
    icon: "🚁",
  },
  {
    id: "DRN-031",
    name: "Eye in Sky 031",
    type: "Autonomous Aerial Sentry",
    location: "Delhi NCR Green Corridor",
    coordinates: "28.6139° N, 77.2090° E",
    mission: "Ambulance Route Clearance",
    battery: 94,
    altitude: "520 m",
    speed: "0 km/h (Hover)",
    payload: "AI Traffic Flow Matrix Scanner",
    signal: 99,
    status: "STANDBY",
    icon: "🛸",
  },
  {
    id: "DRN-047",
    name: "Rescue Scout 047",
    type: "High-Speed Cargo Carrier",
    location: "Noida Expressway, UP",
    coordinates: "28.5355° N, 77.3910° E",
    mission: "O-Negative Blood Unit Delivery",
    battery: 46,
    altitude: "280 m",
    speed: "82 km/h",
    payload: "Temperature-Controlled Medical Box",
    signal: 88,
    status: "RETURNING",
    icon: "🚁",
  },
  {
    id: "DRN-055",
    name: "Terrain Mapper 055",
    type: "LiDAR Topography Scanner",
    location: "Rishikesh Foothills, UK",
    coordinates: "30.0869° N, 78.2676° E",
    mission: "Post-Quake Landslide Risk Audit",
    battery: 73,
    altitude: "390 m",
    speed: "45 km/h",
    payload: "Dual LiDAR + 3D Mesh Generator",
    signal: 92,
    status: "AIRBORNE",
    icon: "🚁",
  },
  {
    id: "DRN-068",
    name: "Rapid Response 068",
    type: "Tactical First-In Drone",
    location: "Meerut Highway Base, UP",
    coordinates: "28.9845° N, 77.7064° E",
    mission: "Pre-deployment Pad Standby",
    battery: 100,
    altitude: "Base Pad",
    speed: "0 km/h",
    payload: "Emergency Sat-Phone Air-Drop Pod",
    signal: 100,
    status: "STANDBY",
    icon: "🛸",
  },
];

export default function DronesPage() {
  const [drones, setDrones] = useState<Drone[]>(initialDrones);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Live Camera Feed Modal State
  const [hudDrone, setHudDrone] = useState<Drone | null>(null);

  // Tactical Audio Effects
  const playAudioCue = (freq = 880, sweep = 1200) => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(sweep, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const airborneCount = drones.filter((d) => d.status === "AIRBORNE").length;
  const standbyCount = drones.filter((d) => d.status === "STANDBY").length;
  const returningCount = drones.filter((d) => d.status === "RETURNING").length;

  const filteredDrones = useMemo(() => {
    return drones.filter((d) => {
      const matchesFilter = filter === "ALL" || d.status === filter;
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.id.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase()) ||
        d.mission.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [drones, filter, search]);

  // Actions
  const handleLaunch = (id: string) => {
    setDrones((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "AIRBORNE",
              speed: "65 km/h",
              altitude: "350 m",
              mission: "Priority Disaster Recon",
            }
          : d
      )
    );
    playAudioCue(600, 1400);
    showToast(`🚀 ${id} Turbines Spooled Up: AIRBORNE!`);
  };

  const handleReturnToHome = (id: string) => {
    setDrones((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "RETURNING",
              speed: "75 km/h",
              mission: "Returning to Charging Pad",
            }
          : d
      )
    );
    playAudioCue(800, 400);
    showToast(`🏠 ${id} Auto-Pilot: Return To Home (RTH) Engaged.`);
  };

  const handlePayloadDrop = (drone: Drone) => {
    playAudioCue(1200, 600);
    showToast(`📦 PAYLOAD AIR-DROPPED by ${drone.id} at ${drone.coordinates}!`);
  };

  return (
    <main className="drones-root">
      {/* SCOPED CYBER STYLES */}
      <style>{`
        .drones-root {
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

        /* Top Header */
        .drone-header {
          height: 74px;
          padding: 0 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          background: rgba(10, 21, 41, 0.85);
          backdrop-filter: blur(14px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .drone-header::before {
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
          color: white;
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

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-links a {
          color: #94a3b8;
          text-decoration: none;
          padding: 8px 13px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .nav-links a:hover {
          background: rgba(59, 130, 246, 0.15);
          color: #38bdf8;
        }

        /* Container */
        .container {
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

        h1 {
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

        .live-status-pill {
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

        /* 4 Clickable Stat Cards */
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

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          margin-top: 4px;
          font-variant-numeric: tabular-nums;
        }

        .c-cyan { color: #06b6d4; }
        .c-emerald { color: #10b981; }
        .c-blue { color: #38bdf8; }
        .c-amber { color: #f59e0b; }

        /* Controls Search & Filter */
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 22px;
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
          background: rgba(10, 21, 41, 0.85);
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

        .filters {
          display: flex;
          gap: 5px;
          padding: 4px;
          border-radius: 10px;
          background: rgba(10, 21, 41, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.25);
        }

        .filters button {
          border: 0;
          background: transparent;
          color: #94a3b8;
          padding: 8px 14px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          transition: all 0.2s;
        }

        .filters button.active {
          color: white;
          background: #3b82f6;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
        }

        /* Drone Card Grid */
        .drone-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 18px;
        }

        .drone-card {
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

        .drone-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
        }

        .card-airborne { border-top: 3px solid #10b981; }
        .card-standby { border-top: 3px solid #38bdf8; }
        .card-returning { border-top: 3px solid #f59e0b; }

        .drone-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .drone-icon-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .drone-icon {
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

        .drone-name {
          font-size: 16px;
          font-weight: 800;
          color: #f8fafc;
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

        .status-AIRBORNE {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .status-AIRBORNE i { background: #34d399; }

        .status-STANDBY {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .status-STANDBY i { background: #38bdf8; }

        .status-RETURNING {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .status-RETURNING i { background: #fbbf24; }

        .drone-type {
          font-size: 11px;
          color: #06b6d4;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 12px;
        }

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

        .label { color: #64748b; }
        .value { color: #cbd5e1; font-weight: 600; text-align: right; }

        /* Telemetry Bar (Battery & Signal) */
        .battery-telemetry {
          margin-top: 6px;
        }

        .battery-header {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          margin-bottom: 4px;
        }

        .battery-bar {
          height: 6px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .battery-fill {
          height: 100%;
          border-radius: inherit;
          transition: width 0.4s ease;
        }

        .fill-high { background: linear-gradient(90deg, #10b981, #34d399); }
        .fill-mid { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .fill-low { background: linear-gradient(90deg, #ef4444, #f87171); }

        .tele-strip {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
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
        .actions-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          margin-top: auto;
        }

        .btn-launch {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #10b981;
          background: linear-gradient(135deg, #059669, #10b981);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-launch:hover {
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.45);
          transform: translateY(-1px);
        }

        .btn-rth {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #f59e0b;
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-rth:hover {
          background: #f59e0b;
          color: #020713;
        }

        .btn-view-hud {
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: #38bdf8;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view-hud:hover {
          background: #06b6d4;
          color: #020713;
        }

        /* Cockpit Live HUD Modal */
        .hud-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 7, 19, 0.92);
          backdrop-filter: blur(12px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .hud-terminal-box {
          background: #040d1a;
          border: 1px solid #06b6d4;
          border-radius: 16px;
          width: 100%;
          maxWidth: 620px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(6, 182, 212, 0.35);
          overflow: hidden;
          font-family: monospace;
          position: relative;
        }

        .hud-screen {
          background: 
            radial-gradient(circle at center, rgba(6, 182, 212, 0.1) 0%, transparent 70%),
            repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 2px, transparent 2px, transparent 4px),
            #020b16;
          padding: 24px;
          position: relative;
          color: #38bdf8;
        }

        .hud-reticle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 140px;
          height: 140px;
          border: 1px dashed rgba(6, 182, 212, 0.4);
          border-radius: 50%;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hud-reticle::before {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          border-top: 2px solid #ef4444;
          border-left: 2px solid #ef4444;
        }

        .hud-badge-alert {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          color: #f87171;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          display: inline-block;
          margin-bottom: 12px;
          animation: blink 1.2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hud-footer-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: rgba(6, 14, 29, 0.9);
          border-top: 1px solid rgba(59, 130, 246, 0.3);
        }

        .btn-drop-payload {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: 1px solid #f59e0b;
          color: #020713;
          padding: 8px 14px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
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
          .nav-links a { display: none; }
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
      <header className="drone-header">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <div className="brand-title">DIGITAL INDIA RES-Q</div>
            <div className="brand-subtitle">NATIONAL AUTONOMOUS DRONE & UAV SURVEILLANCE FLEET</div>
          </div>
        </div>

        <nav className="nav-links">
          <Link href="/dashboard">Command Center</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/hospitals">Hospitals</Link>
          <Link href="/connectivity">Connectivity</Link>
        </nav>
      </header>

      <div className="container">
        {/* HERO INTRO */}
        <section className="intro">
          <div>
            <div className="eyebrow">HIGH-ALTITUDE RECONNAISSANCE & PAYLOAD DELIVERY</div>
            <h1>Autonomous Drone Operations</h1>
            <p>
              Real-time telemetry, thermal search-and-rescue cameras, emergency medicine airdrop,
              and LiDAR terrain assessment across disaster strike zones.
            </p>
          </div>

          <div className="live-status-pill">
            <span className="live-dot" />
            UAV FLEET TELEMETRY ONLINE
          </div>
        </section>

        {/* 4 CLICKABLE STAT CARDS */}
        <section className="stats">
          <div
            className={`stat-card ${filter === "ALL" ? "active-stat" : ""}`}
            onClick={() => setFilter("ALL")}
          >
            <div className="stat-label">Total Drone Fleet</div>
            <div className="stat-value c-cyan">{drones.length}</div>
          </div>

          <div
            className={`stat-card ${filter === "AIRBORNE" ? "active-stat" : ""}`}
            onClick={() => setFilter("AIRBORNE")}
          >
            <div className="stat-label">Airborne On Mission</div>
            <div className="stat-value c-emerald">{airborneCount}</div>
          </div>

          <div
            className={`stat-card ${filter === "STANDBY" ? "active-stat" : ""}`}
            onClick={() => setFilter("STANDBY")}
          >
            <div className="stat-label">Standby On Launchpad</div>
            <div className="stat-value c-blue">{standbyCount}</div>
          </div>

          <div
            className={`stat-card ${filter === "RETURNING" ? "active-stat" : ""}`}
            onClick={() => setFilter("RETURNING")}
          >
            <div className="stat-label">Returning to Base (RTH)</div>
            <div className="stat-value c-amber">{returningCount}</div>
          </div>
        </section>

        {/* SEARCH & FILTERS */}
        <section className="controls">
          <div className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drone by ID (DRN-012), mission, or sector (Haridwar, Delhi)..."
            />
          </div>

          <div className="filters">
            {["ALL", "AIRBORNE", "STANDBY", "RETURNING"].map((item) => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* DRONE GRID */}
        <section className="drone-grid">
          {filteredDrones.map((drone) => {
            const batteryClass =
              drone.battery > 70 ? "fill-high" : drone.battery > 40 ? "fill-mid" : "fill-low";

            return (
              <article
                className={`drone-card card-${drone.status.toLowerCase()}`}
                key={drone.id}
              >
                <div className="drone-top">
                  <div className="drone-icon-wrap">
                    <div className="drone-icon">{drone.icon}</div>
                    <div>
                      <span className="unit-code">{drone.id}</span>
                      <div className="drone-name">{drone.name}</div>
                    </div>
                  </div>

                  <span className={`status-badge status-${drone.status}`}>
                    <i />
                    {drone.status}
                  </span>
                </div>

                <div className="drone-type">{drone.type}</div>

                <div className="details">
                  <div className="detail-row">
                    <span className="label">Sector Target:</span>
                    <span className="value">📍 {drone.location}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Active Mission:</span>
                    <span className="value" style={{ color: "#38bdf8" }}>
                      {drone.mission}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Altitude / Speed:</span>
                    <span className="value">
                      {drone.altitude} • {drone.speed}
                    </span>
                  </div>

                  {/* BATTERY TELEMETRY */}
                  <div className="battery-telemetry">
                    <div className="battery-header">
                      <span className="label">Battery Reserve:</span>
                      <strong style={{ color: "#f8fafc" }}>{drone.battery}%</strong>
                    </div>
                    <div className="battery-bar">
                      <div
                        className={`battery-fill ${batteryClass}`}
                        style={{ width: `${drone.battery}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* SENSOR STRIP */}
                <div className="tele-strip">
                  <div className="tele-box">
                    <span>PAYLOAD GEAR</span>
                    <strong style={{ fontSize: "10px" }}>{drone.payload}</strong>
                  </div>
                  <div className="tele-box">
                    <span>SATCOM LINK</span>
                    <strong style={{ color: "#10b981" }}>{drone.signal}% Nominal</strong>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="actions-row">
                  {drone.status === "STANDBY" ? (
                    <button className="btn-launch" onClick={() => handleLaunch(drone.id)}>
                      🚀 LAUNCH UAV
                    </button>
                  ) : drone.status === "AIRBORNE" ? (
                    <button className="btn-rth" onClick={() => handleReturnToHome(drone.id)}>
                      🏠 RETURN TO BASE (RTH)
                    </button>
                  ) : (
                    <button
                      className="btn-launch"
                      onClick={() => handleLaunch(drone.id)}
                      style={{ background: "#3b82f6", borderColor: "#3b82f6" }}
                    >
                      ⚡ RE-DEPLOY UAV
                    </button>
                  )}

                  <button className="btn-view-hud" onClick={() => setHudDrone(drone)}>
                    📹 LIVE HUD
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* COCKPIT LIVE HUD THERMAL CAMERA OVERLAY MODAL */}
        {hudDrone && (
          <div className="hud-modal-overlay" onClick={() => setHudDrone(null)}>
            <div className="hud-terminal-box" onClick={(e) => e.stopPropagation()}>
              <div className="hud-screen">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span>[REC] LIVE FLIR OPTIC • SATELLITE CH-04</span>
                  <span style={{ color: "#10b981" }}>FEED: SECURE 60FPS</span>
                </div>

                <div className="hud-badge-alert">
                  ⚠️ TARGET LOCK: {hudDrone.name} ({hudDrone.id})
                </div>

                <div className="hud-reticle">
                  <span style={{ fontSize: "10px", color: "#38bdf8", marginTop: "34px" }}>
                    LOCK-ON
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "11px", marginTop: "60px" }}>
                  <div>
                    <div>SECTOR: {hudDrone.location}</div>
                    <div>COORDS: {hudDrone.coordinates}</div>
                    <div>ALTITUDE: {hudDrone.altitude} MSL</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>AIRSPEED: {hudDrone.speed}</div>
                    <div>BATTERY: {hudDrone.battery}%</div>
                    <div>SURVIVOR RECON: ACTIVE</div>
                  </div>
                </div>
              </div>

              <div className="hud-footer-controls">
                <button
                  className="btn-drop-payload"
                  onClick={() => handlePayloadDrop(hudDrone)}
                >
                  📦 AIR-DROP EMERGENCY PAYLOAD
                </button>

                <button
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#cbd5e1",
                    padding: "7px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "11px",
                  }}
                  onClick={() => setHudDrone(null)}
                >
                  CLOSE FEED ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <span>Digital India RES-Q • Autonomous Aerial Defense & Triage Layer</span>
          <span style={{ color: "#10b981", fontWeight: 700 }}>● ALL UAV TRANSPONDERS ENCRYPTED</span>
        </footer>
      </div>
    </main>
  );
}