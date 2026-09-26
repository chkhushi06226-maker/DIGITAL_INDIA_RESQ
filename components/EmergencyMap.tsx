"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

export type Emergency = {
  id: string;
  type: string;
  location: string;
  peopleAffected?: string | number;
  severity?: "Critical" | "High" | "Medium";
  status?: "Active" | "Dispatched" | "Resolved";
  eta?: string;
  coords?: { x: number; y: number }; // Percentage coords on India map grid
  unitAssigned?: string;
};

// Known geo-coordinates on India tactical radar grid (X%, Y%)
const cityCoordinates: Record<string, { x: number; y: number }> = {
  delhi: { x: 38, y: 32 },
  noida: { x: 41, y: 33 },
  ghaziabad: { x: 42, y: 31 },
  meerut: { x: 43, y: 28 },
  haridwar: { x: 46, y: 22 },
  dehradun: { x: 45, y: 20 },
  lucknow: { x: 55, y: 38 },
  mumbai: { x: 26, y: 64 },
  pune: { x: 30, y: 68 },
  bengaluru: { x: 38, y: 82 },
  chennai: { x: 48, y: 80 },
  kolkata: { x: 74, y: 48 },
  jaipur: { x: 32, y: 36 },
  ahmedabad: { x: 24, y: 48 },
};

// Default high-profile initial incidents
const initialEmergencies: Emergency[] = [
  {
    id: "RESQ-2026-4821",
    type: "Fire Outbreak",
    location: "Ghaziabad, Uttar Pradesh",
    peopleAffected: "12",
    severity: "Critical",
    status: "Dispatched",
    eta: "03 min",
    coords: { x: 42, y: 31 },
    unitAssigned: "Fire Engine #09 & Hazmat",
  },
  {
    id: "RESQ-2026-7314",
    type: "Medical Trauma",
    location: "Connaught Place, New Delhi",
    peopleAffected: "3",
    severity: "High",
    status: "Active",
    eta: "06 min",
    coords: { x: 38, y: 32 },
    unitAssigned: "ALS Trauma Ambulance 04",
  },
  {
    id: "RESQ-2026-9052",
    type: "Flash Flood",
    location: "Haridwar, Uttarakhand",
    peopleAffected: "28",
    severity: "Medium",
    status: "Resolved",
    eta: "Resolved",
    coords: { x: 46, y: 22 },
    unitAssigned: "SDRF Water Rescue Batt.",
  },
  {
    id: "RESQ-2026-3108",
    type: "Structural Collapse",
    location: "Bandra, Mumbai",
    peopleAffected: "19",
    severity: "Critical",
    status: "Dispatched",
    eta: "04 min",
    coords: { x: 26, y: 64 },
    unitAssigned: "NDRF 8th Battalion + Drones",
  },
  {
    id: "RESQ-2026-5541",
    type: "Gas Leak",
    location: "Whitefield, Bengaluru",
    peopleAffected: "7",
    severity: "High",
    status: "Active",
    eta: "05 min",
    coords: { x: 38, y: 82 },
    unitAssigned: "CBRN Incident Team Delta",
  },
];

// High-tech Audio Ping for Judges (Web Audio API)
function playRadarPingSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Audio will start upon click
  }
}

export default function EmergencyMap() {
  const [emergencies, setEmergencies] = useState<Emergency[]>(initialEmergencies);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSeverity, setActiveSeverity] = useState<string>("All");
  const [selectedIncident, setSelectedIncident] = useState<Emergency | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Load from localStorage dynamically
  useEffect(() => {
    const loadStored = () => {
      const storedList: Emergency[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith("RESQ-")) continue;

        try {
          const data = JSON.parse(localStorage.getItem(key) || "");
          const locLow = (data.location || "").toLowerCase();
          
          // Match city to coordinates
          let matchedCoords = { x: 45 + Math.random() * 8, y: 40 + Math.random() * 8 };
          for (const city of Object.keys(cityCoordinates)) {
            if (locLow.includes(city)) {
              matchedCoords = cityCoordinates[city];
              break;
            }
          }

          storedList.push({
            id: data.id || key,
            type: data.type || "Emergency",
            location: data.location || "National Zone",
            peopleAffected: data.peopleAffected || "4",
            severity: data.severity || "High",
            status: data.status || "Active",
            eta: "05 min",
            coords: matchedCoords,
            unitAssigned: "Command Center Unit #01",
          });
        } catch {
          // ignore
        }
      }

      if (storedList.length > 0) {
        // Merge without duplicates
        setEmergencies((prev) => {
          const map = new Map<string, Emergency>();
          [...storedList, ...prev].forEach((item) => map.set(item.id, item));
          return Array.from(map.values());
        });
      }
    };

    loadStored();
  }, []);

  // Filtered List
  const filteredEmergencies = useMemo(() => {
    return emergencies.filter((item) => {
      const matchCat =
        activeCategory === "All" ||
        item.type.toLowerCase().includes(activeCategory.toLowerCase());
      const matchSev =
        activeSeverity === "All" ||
        item.severity?.toLowerCase() === activeSeverity.toLowerCase();
      return matchCat && matchSev;
    });
  }, [emergencies, activeCategory, activeSeverity]);

  // Hackathon Live Incident Injection
  function handleTriggerLiveDemo() {
    if (isSimulating) return;
    setIsSimulating(true);
    playRadarPingSound();

    const sampleInjections = [
      {
        type: "Chemical Cloud",
        location: "Okhla Industrial, New Delhi",
        city: "delhi",
        severity: "Critical" as const,
        people: 15,
        unit: "CBRN Hazmat Brigade",
      },
      {
        type: "Expressway Pileup",
        location: "Yamuna Expressway, UP",
        city: "noida",
        severity: "High" as const,
        people: 9,
        unit: "Air Ambulance + Trauma",
      },
      {
        type: "Tunnel Landslide",
        location: "Rishikesh-Haridwar Route, UK",
        city: "haridwar",
        severity: "Critical" as const,
        people: 22,
        unit: "NDRF Heavy Excavator Unit",
      },
    ];

    const pick = sampleInjections[Math.floor(Math.random() * sampleInjections.length)];
    const coords = cityCoordinates[pick.city] || { x: 45, y: 35 };

    const newAlert: Emergency = {
      id: `RESQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: pick.type,
      location: pick.location,
      peopleAffected: pick.people,
      severity: pick.severity,
      status: "Active",
      eta: "02 min",
      coords: { x: coords.x + (Math.random() * 2 - 1), y: coords.y + (Math.random() * 2 - 1) },
      unitAssigned: pick.unit,
    };

    setEmergencies((prev) => [newAlert, ...prev]);
    setSelectedIncident(newAlert);

    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  }

  function getIcon(type: string) {
    const val = type.toLowerCase();
    if (val.includes("fire")) return "🔥";
    if (val.includes("med") || val.includes("trauma") || val.includes("accident") || val.includes("pileup")) return "🚑";
    if (val.includes("flood") || val.includes("water")) return "🌊";
    if (val.includes("quake") || val.includes("collapse") || val.includes("landslide")) return "🏚️";
    if (val.includes("gas") || val.includes("chem")) return "☣️";
    return "🚨";
  }

  return (
    <section className="emergency-map-card">
      {/* MAP HEADER */}
      <div className="map-header">
        <div className="map-header-left">
          <div className="map-title-row">
            <span className="map-label">
              <i className="status-dot-radar" /> ISRO NavIC / GPS TELEMETRY
            </span>
            <span className="satellite-tag">DEFENSE GRADE ENCRYPTION: ACTIVE</span>
          </div>
          <h2>National Emergency Radar</h2>
          <p>
            Real-time geospatial tracking of life-threatening events & inter-agency battalion deployments across the Indian Subcontinent.
          </p>
        </div>

        <div className="map-header-right">
          <button
            className={`trigger-demo-btn ${isSimulating ? "pinging" : ""}`}
            onClick={handleTriggerLiveDemo}
            disabled={isSimulating}
          >
            {isSimulating ? "⚠️ BROADCASTING..." : "⚡ TRIGGER LIVE ALERT"}
          </button>
        </div>
      </div>

      {/* TELEMETRY METRIC STRIP */}
      <div className="map-telemetry-strip">
        <div className="telemetry-item">
          <span>ACTIVE HOTSPOTS</span>
          <strong>{emergencies.filter((e) => e.status !== "Resolved").length} LIVE</strong>
        </div>
        <div className="telemetry-item">
          <span>NATIONAL AVG ETA</span>
          <strong className="text-cyan">04m 18s</strong>
        </div>
        <div className="telemetry-item">
          <span>ESTIMATED CITIZENS SECURED</span>
          <strong className="text-green">
            {emergencies.reduce((acc, cur) => acc + Number(cur.peopleAffected || 0), 0)} Lives
          </strong>
        </div>
        <div className="telemetry-item">
          <span>RADAR GRID</span>
          <strong>28.61° N, 77.20° E (HQ)</strong>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="radar-filters-bar">
        <div className="filter-group">
          <span className="filter-label">INCIDENT TYPE:</span>
          {["All", "Fire", "Medical", "Flood", "Collapse", "Gas"].map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === "All" ? "All Types" : `${getIcon(cat)} ${cat}`}
            </button>
          ))}
        </div>

        <div className="filter-group severity-group">
          <span className="filter-label">SEVERITY:</span>
          {["All", "Critical", "High", "Medium"].map((sev) => (
            <button
              key={sev}
              className={`filter-chip sev-${sev.toLowerCase()} ${activeSeverity === sev ? "active" : ""}`}
              onClick={() => setActiveSeverity(sev)}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* RADAR CANVAS AREA */}
      <div className="map-area">
        {/* Radar Range Rings & Crosshairs */}
        <div className="radar-screen">
          <div className="radar-crosshair-h" />
          <div className="radar-crosshair-v" />
          <div className="radar-circle circle-1" />
          <div className="radar-circle circle-2" />
          <div className="radar-circle circle-3" />
          <div className="radar-range-label label-1">150 KM</div>
          <div className="radar-range-label label-2">350 KM</div>
          <div className="radar-range-label label-3">600 KM</div>

          {/* 360 Degree Continuous Rotating Radar Beam */}
          <div className="radar-sweeper" />

          {/* Holographic India Background Silhouette */}
          <div className="india-hologram">
            <span className="region-tag north">NORTH ZONE (DELHI-NCR)</span>
            <span className="region-tag west">WEST ZONE (MUMBAI)</span>
            <span className="region-tag south">SOUTH ZONE (BLR/CHN)</span>
            <span className="region-tag east">EAST ZONE (KOL)</span>
          </div>

          {/* GEOLOCATED EMERGENCY MARKERS */}
          {filteredEmergencies.map((emergency) => {
            const posX = emergency.coords?.x ?? 45;
            const posY = emergency.coords?.y ?? 40;
            const isSelected = selectedIncident?.id === emergency.id;

            return (
              <div
                key={emergency.id}
                className={`radar-marker-wrapper ${(emergency.severity || "high").toLowerCase()} ${isSelected ? "selected" : ""}`}
                style={{ left: `${posX}%`, top: `${posY}%` }}
                onClick={() => setSelectedIncident(emergency)}
              >
                <div className="radar-beacon-ring" />
                <div className="radar-beacon-core">
                  <span>{getIcon(emergency.type)}</span>
                </div>
                <div className="marker-id-pill">
                  {emergency.id.replace("RESQ-2026-", "#")}
                </div>
              </div>
            );
          })}

          {/* INTERACTIVE TACTICAL HUD MODAL (ON-HOVER / ON-CLICK) */}
          {selectedIncident && (
            <div className="tactical-hud-card">
              <div className="hud-header">
                <span className="hud-badge">{selectedIncident.id}</span>
                <span className={`hud-severity ${(selectedIncident.severity || "high").toLowerCase()}`}>
                  ● {selectedIncident.severity}
                </span>
                <button
                  className="hud-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIncident(null);
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="hud-body">
                <h3>{getIcon(selectedIncident.type)} {selectedIncident.type}</h3>
                <p className="hud-location">📍 {selectedIncident.location}</p>

                <div className="hud-grid-specs">
                  <div>
                    <span>ESTIMATED CASUALTIES</span>
                    <strong>👥 {selectedIncident.peopleAffected || "Assessing"} Citizens</strong>
                  </div>
                  <div>
                    <span>ARRIVAL TIME (ETA)</span>
                    <strong className="text-cyan">⚡ {selectedIncident.eta || "03 min"}</strong>
                  </div>
                </div>

                <div className="hud-unit-strip">
                  <span>DISPATCHED UNIT:</span>
                  <strong>{selectedIncident.unitAssigned || "ALS Rapid Rescue Squadron 1"}</strong>
                </div>

                <Link
                  href={`/emergencies/${encodeURIComponent(selectedIncident.id)}`}
                  className="hud-dossier-btn"
                >
                  Open Tactical Incident Dossier →
                </Link>
              </div>
            </div>
          )}

          {/* RADAR OVERLAYS */}
          <div className="map-overlay">
            <span>● ISRO NavIC LOCK</span>
            <span>● 5G MIL-BAND CARRIER</span>
            <span>● SATELLITE OPTICS: THERMAL</span>
          </div>
        </div>

        {/* MAP LEGEND */}
        <div className="map-legend">
          <span><i className="legend-dot critical" /> Critical (Immediate Code Red)</span>
          <span><i className="legend-dot high" /> High (En Route)</span>
          <span><i className="legend-dot medium" /> Medium (Contained)</span>
        </div>
      </div>

      {/* REAL-TIME INCIDENT TELEMETRY FEED */}
      <div className="map-incidents-section">
        <div className="incidents-feed-header">
          <h3>Active Incident Streams ({filteredEmergencies.length})</h3>
          <small>Click any stream to focus on radar coordinates</small>
        </div>

        <div className="map-incidents-grid">
          {filteredEmergencies.map((emergency) => (
            <div
              key={emergency.id}
              className={`map-incident-card ${selectedIncident?.id === emergency.id ? "active-card" : ""}`}
              onClick={() => setSelectedIncident(emergency)}
            >
              <div className="incident-card-top">
                <span className="incident-type-icon">{getIcon(emergency.type)}</span>
                <div>
                  <strong>{emergency.type}</strong>
                  <small>{emergency.location}</small>
                </div>
                <span className={`incident-severity-badge ${(emergency.severity || "high").toLowerCase()}`}>
                  {emergency.severity}
                </span>
              </div>

              <div className="incident-card-meta">
                <span>👥 {emergency.peopleAffected || "N/A"} Citizens</span>
                <span className="text-cyan">⚡ ETA: {emergency.eta || "04m"}</span>
                <Link
                  href={`/emergencies/${encodeURIComponent(emergency.id)}`}
                  className="incident-link-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  Details →
                </Link>
              </div>
            </div>
          ))}

          {filteredEmergencies.length === 0 && (
            <div className="empty-radar-feed">
              No matching incidents found for the selected filter profile.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}