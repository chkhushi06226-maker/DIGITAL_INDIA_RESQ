"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Network = {
  id: string;
  name: string;
  icon: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  uptime: string;
  latency: string;
  coverage: string;
  protocol: string;
  packetLoss: string;
  description: string;
};

const initialNetworks: Network[] = [
  {
    id: "net-inet",
    name: "Emergency Broadband Link",
    icon: "🌐",
    status: "ONLINE",
    uptime: "99.8%",
    latency: "22 ms",
    coverage: "94%",
    protocol: "Fiber / OFC Ring",
    packetLoss: "0.01%",
    description: "Primary terrestrial backbone channel for state control centers",
  },
  {
    id: "net-5g",
    name: "5G Priority Slicing",
    icon: "📶",
    status: "ONLINE",
    uptime: "98.9%",
    latency: "14 ms",
    coverage: "88%",
    protocol: "5G SA Emergency Band",
    packetLoss: "0.04%",
    description: "High-speed encrypted responder video & telemetry streaming",
  },
  {
    id: "net-mesh",
    name: "Tactical LoRaWAN Mesh",
    icon: "🔗",
    status: "ONLINE",
    uptime: "99.4%",
    latency: "32 ms",
    coverage: "92%",
    protocol: "868 MHz Ad-Hoc RF",
    packetLoss: "0.08%",
    description: "Decentralized device-to-device mesh independent of grid power",
  },
  {
    id: "net-sat",
    name: "ISRO GSAT Satcom Link",
    icon: "🛰️",
    status: "DEGRADED",
    uptime: "94.2%",
    latency: "146 ms",
    coverage: "76%",
    protocol: "Ku-Band Transponder",
    packetLoss: "3.42%",
    description: "Deep disaster zone orbital link & backup telecommunication",
  },
  {
    id: "net-iot",
    name: "Civil Defence IoT Sensor Grid",
    icon: "📡",
    status: "ONLINE",
    uptime: "99.1%",
    latency: "41 ms",
    coverage: "90%",
    protocol: "NB-IoT / Satellite Hyb",
    packetLoss: "0.02%",
    description: "Seismic, water level and flood warning early-telemetry nodes",
  },
];

const regions = [
  { name: "Delhi NCR", coverage: 96, latency: "18 ms", nodes: "1,420", status: "Optimal" },
  { name: "Uttar Pradesh", coverage: 91, latency: "28 ms", nodes: "3,890", status: "Stable" },
  { name: "Uttarakhand", coverage: 78, latency: "64 ms", nodes: "840", status: "Disaster Alert" },
  { name: "Rajasthan", coverage: 85, latency: "34 ms", nodes: "1,650", status: "Stable" },
  { name: "Maharashtra", coverage: 95, latency: "21 ms", nodes: "4,120", status: "Optimal" },
  { name: "Karnataka", coverage: 93, latency: "19 ms", nodes: "2,310", status: "Optimal" },
];

export default function ConnectivityPage() {
  const [networks, setNetworks] = useState<Network[]>(initialNetworks);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [lastChecked, setLastChecked] = useState("Just now");
  const [activeTab, setActiveTab] = useState<"ALL" | "ONLINE" | "DEGRADED">("ALL");

  // Web Audio Ping
  const playAlertTone = (freq = 880, duration = 0.15) => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const onlineCount = networks.filter((n) => n.status === "ONLINE").length;
  const avgLatency = Math.round(
    networks.reduce((acc, curr) => acc + parseInt(curr.latency), 0) / networks.length
  );

  // Self-Healing Diagnostic Sequence
  const runDiagnostic = () => {
    if (diagnosticRunning) return;
    setDiagnosticRunning(true);
    setDiagnosticLogs(["[DIAGNOSTIC] Initializing RES-Q RF & Satcom audit..."]);
    playAlertTone(700, 0.1);

    setTimeout(() => {
      setDiagnosticLogs((prev) => [
        ...prev,
        "📡 Probing ISRO GSAT Ku-Band orbital alignment...",
      ]);
    }, 450);

    setTimeout(() => {
      setDiagnosticLogs((prev) => [
        ...prev,
        "🔗 Switching tactical gateway to secondary transceiver...",
        "⚡ LoRaWAN Emergency Mesh auto-balancing complete.",
      ]);
      playAlertTone(850, 0.1);
    }, 1100);

    setTimeout(() => {
      setNetworks((current) =>
        current.map((network) => {
          if (network.status !== "ONLINE") {
            return {
              ...network,
              status: "ONLINE",
              latency: "34 ms",
              uptime: "99.9%",
              packetLoss: "0.02%",
            };
          }
          return network;
        })
      );
      setDiagnosticLogs((prev) => [
        ...prev,
        "✅ ALL 5 NETWORK LAYERS SYNCHRONIZED — 100% OPERATIONAL.",
      ]);
      setLastChecked("Just now");
      setDiagnosticRunning(false);
      playAlertTone(1100, 0.25);
    }, 1800);
  };

  // Demo: Simulate Network Disruption
  const simulateDisruption = () => {
    setNetworks((current) =>
      current.map((net) => {
        if (net.id === "net-sat") {
          return {
            ...net,
            status: "DEGRADED",
            latency: "158 ms",
            packetLoss: "4.8%",
          };
        }
        if (net.id === "net-5g") {
          return {
            ...net,
            status: "DEGRADED",
            latency: "84 ms",
            packetLoss: "1.9%",
          };
        }
        return net;
      })
    );
    setDiagnosticLogs([
      "⚠️ SIMULATION: Severe interference detected on Satcom & 5G layers.",
      "⚠️ Mesh failover routing recommended.",
    ]);
    playAlertTone(440, 0.3);
  };

  const filteredNetworks = networks.filter((n) => {
    if (activeTab === "ALL") return true;
    return n.status === activeTab;
  });

  return (
    <main className="conn-root">
      {/* SCOPED COMPONENT STYLES */}
      <style>{`
        .conn-root {
          min-height: 100vh;
          background: #020713;
          background-image: 
            radial-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
            radial-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px);
          background-size: 32px 32px, 16px 16px;
          color: #f8fafc;
          padding: 1.5rem 2rem 4rem;
          font-family: system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }

        /* Top Header */
        .conn-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1.35rem;
          background: rgba(10, 21, 41, 0.75);
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 14px;
          backdrop-filter: blur(12px);
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .conn-header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%);
        }

        .conn-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .conn-brand-mark {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: linear-gradient(135deg, #06b6d4, #2563eb);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.1rem;
          box-shadow: 0 0 14px rgba(6, 182, 212, 0.45);
        }

        .conn-brand strong { display: block; font-size: 0.95rem; letter-spacing: 0.08em; color: #f8fafc; }
        .conn-brand span { display: block; font-size: 0.72rem; letter-spacing: 0.05em; color: #38bdf8; font-weight: 600; }

        .conn-header-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .conn-live-pill {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
        }

        .conn-live-pill i {
          width: 7px;
          height: 7px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
          display: inline-block;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.8); opacity: 0.4; }
        }

        .conn-back-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.35);
          color: #38bdf8;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .conn-back-btn:hover {
          background: rgba(59, 130, 246, 0.25);
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.3);
        }

        /* Hero */
        .conn-hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .conn-eyebrow {
          font-size: 0.75rem;
          color: #06b6d4;
          letter-spacing: 0.1em;
          font-weight: 700;
          margin-bottom: 0.3rem;
        }

        .conn-hero h1 {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .conn-hero h1 span { color: #38bdf8; }

        .conn-hero p {
          color: #94a3b8;
          font-size: 0.95rem;
          max-width: 680px;
          margin: 0;
          line-height: 1.5;
        }

        .conn-hero-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .last-checked {
          font-size: 0.78rem;
          color: #64748b;
          background: rgba(10, 21, 41, 0.6);
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.15);
        }
        .last-checked strong { color: #cbd5e1; }

        .btn-disrupt {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #f87171;
          padding: 0.65rem 1rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-disrupt:hover {
          background: rgba(239, 68, 68, 0.25);
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
        }

        .diagnostic-btn {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          border: 1px solid #3b82f6;
          color: #ffffff;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.4);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .diagnostic-btn:hover {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          transform: translateY(-1px);
        }
        .diagnostic-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Top 4 Stat Cards */
        .conn-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .conn-stat-card {
          background: rgba(10, 21, 41, 0.7);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 14px;
          padding: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          backdrop-filter: blur(8px);
          transition: border-color 0.2s;
        }
        .conn-stat-card:hover { border-color: rgba(59, 130, 246, 0.45); }

        .conn-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .conn-stat-info span { display: block; font-size: 0.72rem; color: #94a3b8; font-weight: 700; }
        .conn-stat-info strong { display: block; font-size: 1.8rem; font-weight: 800; font-variant-numeric: tabular-nums; margin: 0.1rem 0; }
        .conn-stat-info small { font-size: 0.7rem; color: #64748b; }

        /* Terminal Console Logs */
        .conn-terminal {
          background: #050b18;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 2rem;
          font-family: monospace;
          font-size: 0.78rem;
          color: #38bdf8;
          line-height: 1.6;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.6);
        }
        .terminal-header {
          display: flex;
          justify-content: space-between;
          color: #64748b;
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 0.35rem;
        }

        /* Section Headings */
        .conn-section {
          margin-bottom: 2.5rem;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.15);
          padding-bottom: 0.75rem;
        }

        .section-kicker {
          font-size: 0.7rem;
          color: #06b6d4;
          letter-spacing: 0.1em;
          font-weight: 700;
          display: block;
        }

        .section-heading h2 {
          font-size: 1.35rem;
          font-weight: 700;
          margin: 0.2rem 0 0;
          color: #f8fafc;
        }

        .tab-group {
          display: flex;
          gap: 0.4rem;
        }

        .tab-btn {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #94a3b8;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
        }
        .tab-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: #fff;
        }

        /* Network Channels Grid */
        .network-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.25rem;
        }

        .network-card {
          background: rgba(10, 21, 41, 0.75);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 14px;
          padding: 1.35rem;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.25s ease;
        }
        .network-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.5);
        }
        .network-card.online { border-left: 3px solid #10b981; }
        .network-card.degraded { border-left: 3px solid #f59e0b; }
        .network-card.offline { border-left: 3px solid #ef4444; }

        .network-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
        }
        .network-icon { font-size: 1.5rem; }

        .network-status {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }
        .network-status i { width: 6px; height: 6px; border-radius: 50%; }

        .network-status.online {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .network-status.online i { background: #34d399; }

        .network-status.degraded {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .network-status.degraded i { background: #fbbf24; }

        .network-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 0.3rem;
        }
        .network-protocol {
          font-size: 0.7rem;
          color: #06b6d4;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: 0.5rem;
        }
        .network-card p {
          color: #94a3b8;
          font-size: 0.82rem;
          line-height: 1.45;
          margin: 0 0 1.15rem;
          flex-grow: 1;
        }

        .network-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background: rgba(6, 14, 29, 0.65);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 8px;
          padding: 0.65rem 0.5rem;
          text-align: center;
          margin-bottom: 0.85rem;
        }
        .network-metrics strong { display: block; font-size: 1rem; color: #f8fafc; font-variant-numeric: tabular-nums; }
        .network-metrics span { display: block; font-size: 0.65rem; color: #64748b; font-weight: 700; }

        .coverage-track {
          width: 100%;
          height: 5px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }
        .coverage-fill {
          height: 100%;
          background: linear-gradient(90deg, #06b6d4, #10b981);
          border-radius: 999px;
          transition: width 0.4s ease;
        }

        /* Regional Grid */
        .regional-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .region-card {
          background: rgba(10, 21, 41, 0.7);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 1.1rem;
        }
        .region-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.65rem;
        }
        .region-card-header strong { font-size: 0.95rem; color: #f8fafc; display: block; }
        .region-card-header span { font-size: 0.72rem; color: #10b981; font-weight: 600; }
        .region-card-header b { font-size: 1.15rem; color: #38bdf8; font-variant-numeric: tabular-nums; }

        .region-progress {
          width: 100%;
          height: 5px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 0.65rem;
        }
        .region-progress-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 999px;
        }

        .region-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #64748b;
        }

        /* High-Tech Radar Architecture Visualizer */
        .architecture-card {
          background: rgba(10, 21, 41, 0.75);
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 16px;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 2rem;
          align-items: center;
        }

        .arch-points {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 1.25rem;
        }
        .arch-point-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(6, 14, 29, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.15);
          padding: 0.65rem 1rem;
          border-radius: 8px;
        }
        .arch-point-item span {
          color: #06b6d4;
          font-weight: 800;
          font-size: 0.85rem;
          font-family: monospace;
        }
        .arch-point-item strong {
          color: #cbd5e1;
          font-size: 0.85rem;
        }

        /* Radar Visual Simulation */
        .architecture-visual {
          position: relative;
          width: 320px;
          height: 320px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .arch-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(59, 130, 246, 0.25);
        }
        .ring-1 { width: 130px; height: 130px; }
        .ring-2 { 
          width: 220px; 
          height: 220px; 
          animation: spin 30s linear infinite; 
          border: 1px dashed rgba(6, 182, 212, 0.3);
        }
        .ring-3 { width: 310px; height: 310px; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .architecture-center {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle, #1d4ed8, #0a1529);
          border: 2px solid #38bdf8;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.4);
          z-index: 10;
        }
        .architecture-center span { font-size: 0.65rem; color: #94a3b8; font-weight: 800; }
        .architecture-center strong { font-size: 0.85rem; color: #fff; }
        .architecture-center small { font-size: 0.6rem; color: #34d399; font-weight: 800; }

        .arch-node {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(10, 21, 41, 0.95);
          border: 1px solid rgba(59, 130, 246, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          box-shadow: 0 0 14px rgba(0,0,0,0.5);
          z-index: 5;
        }
        .node-top { top: 0; }
        .node-right { right: 0; }
        .node-bottom { bottom: 0; }
        .node-left { left: 0; }

        /* Alert Banner */
        .conn-alert {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-left: 4px solid #f59e0b;
          border-radius: 12px;
          padding: 1.1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .alert-icon { font-size: 1.8rem; }
        .conn-alert strong { display: block; color: #f8fafc; font-size: 0.95rem; margin-bottom: 0.2rem; }
        .conn-alert p { color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4; }

        /* Footer */
        .conn-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(59, 130, 246, 0.15);
          font-size: 0.75rem;
          color: #64748b;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .conn-footer strong { color: #cbd5e1; }

        @media (max-width: 900px) {
          .architecture-card { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HEADER */}
      <header className="conn-header">
        <div className="conn-brand">
          <div className="conn-brand-mark">R</div>
          <div>
            <strong>DIGITAL INDIA RES-Q</strong>
            <span>CONNECTIVITY COMMAND CENTER • ISRO & MESH FEDERATION</span>
          </div>
        </div>

        <div className="conn-header-actions">
          <div className="conn-live-pill">
            <i />
            <span>5/5 PROTOCOLS ACTIVE</span>
          </div>

          <Link href="/dashboard" className="conn-back-btn">
            ← Command Center
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="conn-hero">
        <div>
          <div className="conn-eyebrow">RESILIENT MULTI-LAYER COMMUNICATIONS</div>
          <h1>
            Emergency <span>Connectivity Infrastructure</span>
          </h1>
          <p>
            Autonomous multi-frequency failover network connecting disaster responders, field
            commanders, AI triage, and national hospitals even during total grid blackout.
          </p>
        </div>

        <div className="conn-hero-actions">
          <div className="last-checked">
            Sync: <strong>{lastChecked}</strong>
          </div>

          <button className="btn-disrupt" onClick={simulateDisruption}>
            ⚡ Simulate Blackout / Jamming
          </button>

          <button
            className="diagnostic-btn"
            onClick={runDiagnostic}
            disabled={diagnosticRunning}
          >
            {diagnosticRunning ? "Running AI Diagnostic..." : "⚙️ Run Self-Healing Audit"}
          </button>
        </div>
      </section>

      {/* TERMINAL CONSOLE LOGS */}
      {diagnosticLogs.length > 0 && (
        <div className="conn-terminal">
          <div className="terminal-header">
            <span>RES-Q SATCOM & RF AD-HOC TELEMETRY LOG</span>
            <span>SYSTEM MONITOR</span>
          </div>
          {diagnosticLogs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      )}

      {/* STATS OVERVIEW */}
      <section className="conn-stats">
        <div className="conn-stat-card">
          <div className="conn-stat-icon">📡</div>
          <div className="conn-stat-info">
            <span>ACTIVE BACKBONES</span>
            <strong style={{ color: "#10b981" }}>{onlineCount}/5</strong>
            <small>Redundant RF channels</small>
          </div>
        </div>

        <div className="conn-stat-card">
          <div className="conn-stat-icon">📶</div>
          <div className="conn-stat-info">
            <span>NATIONAL COVERAGE</span>
            <strong style={{ color: "#38bdf8" }}>92.4%</strong>
            <small>Urban & rugged terrain</small>
          </div>
        </div>

        <div className="conn-stat-card">
          <div className="conn-stat-icon">⚡</div>
          <div className="conn-stat-info">
            <span>AVG NETWORK LATENCY</span>
            <strong style={{ color: avgLatency > 50 ? "#f59e0b" : "#06b6d4" }}>
              {avgLatency} ms
            </strong>
            <small>Real-time packet transit</small>
          </div>
        </div>

        <div className="conn-stat-card">
          <div className="conn-stat-icon">🛡️</div>
          <div className="conn-stat-info">
            <span>PACKET RESILIENCE</span>
            <strong style={{ color: "#34d399" }}>99.98%</strong>
            <small>AES-256 encrypted slices</small>
          </div>
        </div>
      </section>

      {/* NETWORK CHANNELS */}
      <section className="conn-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">COMMUNICATION LAYERS</span>
            <h2>Connected Network Channels</h2>
          </div>

          <div className="tab-group">
            {(["ALL", "ONLINE", "DEGRADED"] as const).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="network-grid">
          {filteredNetworks.map((net) => (
            <article key={net.id} className={`network-card ${net.status.toLowerCase()}`}>
              <div className="network-card-top">
                <span className="network-icon">{net.icon}</span>
                <span className={`network-status ${net.status.toLowerCase()}`}>
                  <i />
                  {net.status}
                </span>
              </div>

              <h3>{net.name}</h3>
              <div className="network-protocol">{net.protocol}</div>
              <p>{net.description}</p>

              <div className="network-metrics">
                <div>
                  <span>Uptime</span>
                  <strong>{net.uptime}</strong>
                </div>
                <div>
                  <span>Latency</span>
                  <strong>{net.latency}</strong>
                </div>
                <div>
                  <span>Loss</span>
                  <strong>{net.packetLoss}</strong>
                </div>
              </div>

              <div className="coverage-track">
                <div className="coverage-fill" style={{ width: net.coverage }} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* REGIONAL COVERAGE */}
      <section className="conn-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">ZONE TELEMETRY</span>
            <h2>Regional Disaster Coverage Matrix</h2>
          </div>
        </div>

        <div className="regional-grid">
          {regions.map((region) => (
            <div className="region-card" key={region.name}>
              <div className="region-card-header">
                <div>
                  <strong>{region.name}</strong>
                  <span>{region.status}</span>
                </div>
                <b>{region.coverage}%</b>
              </div>

              <div className="region-progress">
                <div
                  className="region-progress-fill"
                  style={{ width: `${region.coverage}%` }}
                />
              </div>

              <div className="region-footer">
                <span>{region.nodes} Active Beacons</span>
                <span>Latency: {region.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE RADAR VISUALIZER */}
      <section className="architecture-card">
        <div>
          <span className="section-kicker">FAIL-SAFE ARCHITECTURE</span>
          <h2 style={{ fontSize: "1.6rem", margin: "0.25rem 0 0.75rem", color: "#f8fafc" }}>
            Decentralized Mesh Survives Infrastructure Collapse.
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>
            If conventional cell towers lose electrical grid power or fiber lines are cut during floods
            or quakes, RES-Q instantly shifts all voice and triage data to autonomous RF mesh and orbital
            Ku-Band links.
          </p>

          <div className="arch-points">
            <div className="arch-point-item">
              <span>01</span>
              <strong>Auto-detect carrier blackout within 400 milliseconds</strong>
            </div>
            <div className="arch-point-item">
              <span>02</span>
              <strong>Dynamic routing via nearby emergency vehicle transceivers</strong>
            </div>
            <div className="arch-point-item">
              <span>03</span>
              <strong>Continuous priority link to Central NDRF Command</strong>
            </div>
          </div>
        </div>

        <div className="architecture-visual">
          <div className="arch-ring ring-1" />
          <div className="arch-ring ring-2" />
          <div className="arch-ring ring-3" />

          <div className="architecture-center">
            <span>RES-Q</span>
            <strong>HUB</strong>
            <small>ONLINE</small>
          </div>

          <div className="arch-node node-top" title="ISRO Satcom Link">🛰️</div>
          <div className="arch-node node-right" title="5G Priority Slice">📶</div>
          <div className="arch-node node-bottom" title="Tactical Ambulance Mesh">🚑</div>
          <div className="arch-node node-left" title="Early Warning Sensors">📡</div>
        </div>
      </section>

      {/* ALERT FOOTER BANNER */}
      {networks.some((n) => n.status !== "ONLINE") && (
        <section className="conn-alert">
          <div className="alert-icon">⚠️</div>
          <div>
            <strong>Tactical Fallback Mode Engaged</strong>
            <p>
              ISRO Satcom or 5G slices are experiencing high jitter. Low-latency LoRaWAN Mesh is
              currently buffering all critical triage telemetry. Run Self-Healing Audit to re-align.
            </p>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="conn-footer">
        <div>
          <strong>DIGITAL INDIA RES-Q</strong> — National Disaster Communication Grid
        </div>
        <div>
          Demo & Tactical Training Environment • Connected to RES-Q Hub
        </div>
      </footer>
    </main>
  );
}