"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import EmergencyMap from "@/components/EmergencyMap";

export type Emergency = {
  id: string;
  type: string;
  location: string;
  severity: "Critical" | "High" | "Medium";
  status: "Active" | "Dispatched" | "Resolved";
  people: number;
  response: string;
  timeReported: string;
};

const initialEmergencies: Emergency[] = [
  {
    id: "RESQ-2026-4821",
    type: "Fire Outbreak",
    location: "Ghaziabad, UP",
    severity: "Critical",
    status: "Dispatched",
    people: 12,
    response: "04 min",
    timeReported: "10:42 PM",
  },
  {
    id: "RESQ-2026-7314",
    type: "Medical Trauma",
    location: "Connaught Place, Delhi",
    severity: "High",
    status: "Active",
    people: 3,
    response: "07 min",
    timeReported: "10:48 PM",
  },
  {
    id: "RESQ-2026-2198",
    type: "Road Collision",
    location: "Meerut Highway, UP",
    severity: "High",
    status: "Active",
    people: 5,
    response: "09 min",
    timeReported: "10:51 PM",
  },
  {
    id: "RESQ-2026-9052",
    type: "River Flash Flood",
    location: "Haridwar Ghat, UK",
    severity: "Medium",
    status: "Resolved",
    people: 28,
    response: "18 min",
    timeReported: "09:30 PM",
  },
];

const demoScenarios = [
  {
    type: "Chemical Leak",
    location: "Okhla Industrial Area, Delhi",
    severity: "Critical" as const,
    people: 15,
  },
  {
    type: "Expressway Pileup",
    location: "Yamuna Expressway, UP",
    severity: "High" as const,
    people: 9,
  },
  {
    type: "Tunnel Landslide",
    location: "Rishikesh-Haridwar Corridor",
    severity: "Critical" as const,
    people: 22,
  },
];

function playCommandCenterAlert() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      440,
      audioContext.currentTime + 0.25
    );

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.15,
      audioContext.currentTime + 0.02
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.3
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch {
    // Audio is optional.
  }
}

export default function DashboardPage() {
  const [emergencies, setEmergencies] =
    useState<Emergency[]>(initialEmergencies);

  const [filter, setFilter] = useState<
    "All" | "Active" | "Dispatched" | "Resolved"
  >("All");

  const [searchQuery, setSearchQuery] = useState("");
  const [demoRunning, setDemoRunning] = useState(false);
  const [recentAlert, setRecentAlert] = useState<Emergency | null>(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredEmergencies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return emergencies.filter((emergency) => {
      const matchesFilter =
        filter === "All" || emergency.status === filter;

      const matchesSearch =
        !query ||
        emergency.id.toLowerCase().includes(query) ||
        emergency.type.toLowerCase().includes(query) ||
        emergency.location.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [emergencies, filter, searchQuery]);

  const activeCount = emergencies.filter(
    (item) => item.status === "Active"
  ).length;

  const dispatchedCount = emergencies.filter(
    (item) => item.status === "Dispatched"
  ).length;

  const criticalCount = emergencies.filter(
    (item) => item.severity === "Critical" && item.status !== "Resolved"
  ).length;

  const resolvedCount = emergencies.filter(
    (item) => item.status === "Resolved"
  ).length;

  const simulateEmergency = () => {
    if (demoRunning) return;

    setDemoRunning(true);
    playCommandCenterAlert();

    const scenario =
      demoScenarios[Math.floor(Math.random() * demoScenarios.length)];

    const id = `RESQ-2026-${Math.floor(
      1000 + Math.random() * 8999
    )}`;

    const emergency: Emergency = {
      id,
      type: scenario.type,
      location: scenario.location,
      severity: scenario.severity,
      status: "Active",
      people: scenario.people,
      response: "02 min",
      timeReported: new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date()),
    };

    setEmergencies((current) => [emergency, ...current]);
    setRecentAlert(emergency);

    setTimeout(() => {
      setEmergencies((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "Dispatched",
                response: "03 min",
              }
            : item
        )
      );
    }, 2500);

    setTimeout(() => {
      setDemoRunning(false);
    }, 3200);

    setTimeout(() => {
      setRecentAlert(null);
    }, 7000);
  };

  const handleQuickStatusChange = (id: string) => {
    setEmergencies((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const nextStatus: Emergency["status"] =
          item.status === "Active"
            ? "Dispatched"
            : item.status === "Dispatched"
              ? "Resolved"
              : "Active";

        return {
          ...item,
          status: nextStatus,
        };
      })
    );
  };

  return (
    <main className="dashboard-page">
      {/* =========================
          ALERT TOAST
      ========================== */}
      {recentAlert && (
        <div className="dashboard-alert-toast">
          <div className="dashboard-alert-icon">🚨</div>

          <div>
            <strong>NEW EMERGENCY DETECTED</strong>

            <p>
              {recentAlert.type} • {recentAlert.location}
            </p>

            <small>{recentAlert.id}</small>
          </div>
        </div>
      )}

      {/* =========================
          HEADER
      ========================== */}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-brand-mark">911</div>

          <div>
            <div className="dashboard-brand-title">
              DIGITAL INDIA RES-Q
            </div>

            <div className="dashboard-brand-subtitle">
              NATIONAL EMERGENCY COMMAND CENTER
            </div>
          </div>
        </div>

        <div className="dashboard-header-actions">
          <div className="dashboard-core-status">
            <span className="dashboard-status-dot" />
            SYSTEM CORE ACTIVE
          </div>

          <button
            className={`dashboard-simulate-btn ${
              demoRunning ? "running" : ""
            }`}
            onClick={simulateEmergency}
            disabled={demoRunning}
          >
            <span>⚡</span>

            {demoRunning
              ? "SIMULATION RUNNING..."
              : "SIMULATE EMERGENCY"}
          </button>

          <Link href="/" className="dashboard-home-btn">
            HOME
          </Link>
        </div>
      </header>

      {/* =========================
          INTRO
      ========================== */}
      <section className="dashboard-intro">
        <div>
          <span className="dashboard-eyebrow">
            COMMAND CENTER / LIVE OPERATIONS
          </span>

          <h1>Emergency Response Dashboard</h1>

          <p>
            Monitor incidents, coordinate response units and maintain
            real-time operational awareness across the national
            emergency network.
          </p>
        </div>

        <div className="dashboard-clock">
          <span>INDIA STANDARD TIME</span>
          <strong>{currentTime || "--:--:--"}</strong>
          <small>LIVE COMMAND FEED</small>
        </div>
      </section>

      {/* =========================
          STATS
      ========================== */}
      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">🚨</div>

          <div>
            <span>ACTIVE INCIDENTS</span>
            <strong>{activeCount}</strong>
            <small>Awaiting resolution</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">🚑</div>

          <div>
            <span>UNITS DEPLOYED</span>
            <strong>{dispatchedCount}</strong>
            <small>Response in progress</small>
          </div>
        </div>

        <div className="dashboard-stat-card critical">
          <div className="dashboard-stat-icon">⚠️</div>

          <div>
            <span>CRITICAL THREATS</span>
            <strong>{criticalCount}</strong>
            <small>Priority response required</small>
          </div>
        </div>

        <div className="dashboard-stat-card resolved">
          <div className="dashboard-stat-icon">✓</div>

          <div>
            <span>RESOLVED TODAY</span>
            <strong>{resolvedCount}</strong>
            <small>Successfully closed</small>
          </div>
        </div>
      </section>

      {/* =========================
          NATIONAL EMERGENCY RADAR
      ========================== */}
      <section className="dashboard-radar-section">
        <EmergencyMap />
      </section>

      {/* =========================
          RESPONSE NETWORK
      ========================== */}
      <section className="dashboard-network-panel">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">
              RESOURCE COORDINATION
            </span>

            <h2>Emergency Response Network</h2>

            <p>
              Live deployment status across connected response
              resources.
            </p>
          </div>

          <span className="network-live">
            <i />
            NETWORK ONLINE
          </span>
        </div>

        <div className="network-grid">
          <div className="network-resource">
            <div className="resource-icon">🚑</div>

            <div className="resource-info">
              <strong>AMBULANCE UNITS</strong>
              <span>Medical response fleet</span>
            </div>

            <div className="resource-count">
              <strong>24</strong>
              <span>ACTIVE</span>
            </div>
          </div>

          <div className="network-resource">
            <div className="resource-icon">🚒</div>

            <div className="resource-info">
              <strong>FIRE RESPONSE</strong>
              <span>Fire & Hazmat units</span>
            </div>

            <div className="resource-count">
              <strong>18</strong>
              <span>ACTIVE</span>
            </div>
          </div>

          <div className="network-resource">
            <div className="resource-icon">🚓</div>

            <div className="resource-info">
              <strong>POLICE UNITS</strong>
              <span>Law enforcement network</span>
            </div>

            <div className="resource-count">
              <strong>31</strong>
              <span>ACTIVE</span>
            </div>
          </div>

          <div className="network-resource">
            <div className="resource-icon">🛸</div>

            <div className="resource-info">
              <strong>DRONE SURVEILLANCE</strong>
              <span>Aerial monitoring network</span>
            </div>

            <div className="resource-count">
              <strong>12</strong>
              <span>ONLINE</span>
            </div>
          </div>

          <div className="network-resource ai-resource">
            <div className="resource-icon">🧠</div>

            <div className="resource-info">
              <strong>AI DECISION SUPPORT</strong>
              <span>Incident analysis engine</span>
            </div>

            <div className="resource-count">
              <strong>24/7</strong>
              <span>READY</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          INCIDENT MANAGEMENT
      ========================== */}
      <section className="dashboard-incidents">
        <div className="panel-heading incidents-heading">
          <div>
            <span className="panel-kicker">
              INCIDENT MANAGEMENT
            </span>

            <h2>Emergency Registry</h2>

            <p>
              Track and manage all registered emergency events.
            </p>
          </div>

          <div className="incident-tools">
            <div className="incident-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search ID, location or incident..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
              />
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value as
                    | "All"
                    | "Active"
                    | "Dispatched"
                    | "Resolved"
                )
              }
              className="incident-filter"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="incident-table-wrapper">
          <table className="incident-table">
            <thead>
              <tr>
                <th>INCIDENT</th>
                <th>LOCATION</th>
                <th>SEVERITY</th>
                <th>STATUS</th>
                <th>PEOPLE</th>
                <th>RESPONSE</th>
                <th>REPORTED</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmergencies.map((emergency) => (
                <tr key={emergency.id}>
                  <td>
                    <div className="incident-name">
                      <strong>{emergency.type}</strong>
                      <span>{emergency.id}</span>
                    </div>
                  </td>

                  <td>
                    <span className="incident-location">
                      📍 {emergency.location}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`severity-pill ${emergency.severity.toLowerCase()}`}
                    >
                      {emergency.severity}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-pill ${emergency.status.toLowerCase()}`}
                    >
                      <i />
                      {emergency.status}
                    </span>
                  </td>

                  <td>
                    <strong>{emergency.people}</strong>
                  </td>

                  <td>{emergency.response}</td>

                  <td>{emergency.timeReported}</td>

                  <td>
                    <div className="incident-actions">
                      <Link
                        href={`/emergencies/${emergency.id}`}
                        className="table-view-btn"
                      >
                        VIEW
                      </Link>

                      <button
                        className="table-status-btn"
                        onClick={() =>
                          handleQuickStatusChange(emergency.id)
                        }
                        title="Change emergency status"
                      >
                        ↻
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEmergencies.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-incidents">
                      <span>📡</span>
                      <strong>No incidents found</strong>
                      <p>
                        Try changing your search or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================
          SYSTEM FOOTER
      ========================== */}
      <footer className="dashboard-footer">
        <div className="footer-status">
          <span className="footer-live-dot" />
          ALL SYSTEMS OPERATIONAL
        </div>

        <div className="footer-items">
          <span>☁ SECURE CLOUD LINK</span>
          <span>◈ GPS TELEMETRY SYNC</span>
          <span>◉ AI ENGINE READY</span>
          <span>↗ LIVE DATA STREAM</span>
        </div>
      </footer>
    </main>
  );
}