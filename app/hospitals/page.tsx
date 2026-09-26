"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Hospital = {
  id: number;
  name: string;
  city: string;
  distance: string;
  distanceKm: number;
  status: "AVAILABLE" | "BUSY" | "CRITICAL";
  beds: number;
  totalBeds: number;
  icu: number;
  totalIcu: number;
  blood: number;
  oxygenLevel: number; // percentage
  emergency: boolean;
  specialty: string;
  phone: string;
  ambulanceBays: number;
};

const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Yashoda Super Speciality Hospital",
    city: "Ghaziabad",
    distance: "4.2 km",
    distanceKm: 4.2,
    status: "AVAILABLE",
    beds: 42,
    totalBeds: 80,
    icu: 8,
    totalIcu: 18,
    blood: 34,
    oxygenLevel: 94,
    emergency: true,
    specialty: "Trauma & Emergency",
    phone: "+91-120-4188500",
    ambulanceBays: 4,
  },
  {
    id: 2,
    name: "Max Super Speciality Hospital",
    city: "New Delhi",
    distance: "18.6 km",
    distanceKm: 18.6,
    status: "BUSY",
    beds: 18,
    totalBeds: 65,
    icu: 3,
    totalIcu: 20,
    blood: 21,
    oxygenLevel: 82,
    emergency: true,
    specialty: "Cardiac & Trauma",
    phone: "+91-11-26515050",
    ambulanceBays: 2,
  },
  {
    id: 3,
    name: "Fortis Hospital",
    city: "Noida",
    distance: "12.8 km",
    distanceKm: 12.8,
    status: "AVAILABLE",
    beds: 56,
    totalBeds: 100,
    icu: 12,
    totalIcu: 24,
    blood: 47,
    oxygenLevel: 98,
    emergency: true,
    specialty: "Multi-Speciality",
    phone: "+91-120-6277000",
    ambulanceBays: 6,
  },
  {
    id: 4,
    name: "AIIMS Trauma Centre",
    city: "New Delhi",
    distance: "22.4 km",
    distanceKm: 22.4,
    status: "CRITICAL",
    beds: 7,
    totalBeds: 90,
    icu: 1,
    totalIcu: 25,
    blood: 12,
    oxygenLevel: 68,
    emergency: true,
    specialty: "Advanced Level-1 Trauma",
    phone: "+91-11-26593456",
    ambulanceBays: 1,
  },
  {
    id: 5,
    name: "Columbia Asia Hospital",
    city: "Meerut",
    distance: "48.1 km",
    distanceKm: 48.1,
    status: "AVAILABLE",
    beds: 31,
    totalBeds: 55,
    icu: 6,
    totalIcu: 14,
    blood: 29,
    oxygenLevel: 91,
    emergency: true,
    specialty: "Emergency & Critical Care",
    phone: "+91-121-6622000",
    ambulanceBays: 3,
  },
  {
    id: 6,
    name: "Government District Hospital",
    city: "Haridwar",
    distance: "143 km",
    distanceKm: 143.0,
    status: "BUSY",
    beds: 14,
    totalBeds: 50,
    icu: 2,
    totalIcu: 8,
    blood: 18,
    oxygenLevel: 75,
    emergency: true,
    specialty: "General Emergency",
    phone: "+91-1334-226060",
    ambulanceBays: 2,
  },
];

export default function HospitalsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState<"distance" | "beds" | "icu">("distance");
  
  // Interactive Modals State
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [dispatchHospital, setDispatchHospital] = useState<Hospital | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredHospitals = useMemo(() => {
    return hospitals
      .filter((hospital) => {
        const matchesSearch =
          hospital.name.toLowerCase().includes(search.toLowerCase()) ||
          hospital.city.toLowerCase().includes(search.toLowerCase()) ||
          hospital.specialty.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          status === "ALL" || hospital.status === status;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "distance") return a.distanceKm - b.distanceKm;
        if (sortBy === "beds") return b.beds - a.beds;
        if (sortBy === "icu") return b.icu - a.icu;
        return 0;
      });
  }, [search, status, sortBy]);

  const totalBeds = hospitals.reduce((sum, h) => sum + h.beds, 0);
  const totalIcu = hospitals.reduce((sum, h) => sum + h.icu, 0);
  const totalBlood = hospitals.reduce((sum, h) => sum + h.blood, 0);
  const available = hospitals.filter((h) => h.status === "AVAILABLE").length;

  return (
    <main className="hospital-page">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="resq-toast">
          <span className="toast-icon">⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="hospital-header">
        <div className="hospital-brand">
          <Link href="/dashboard" className="hospital-back" title="Back to Command Center">
            ←
          </Link>

          <div className="hospital-brand-mark">+</div>

          <div>
            <strong>DIGITAL INDIA RES-Q</strong>
            <span>HOSPITAL RESPONSE NETWORK</span>
          </div>
        </div>

        <div className="hospital-header-status">
          <i />
          <span>TELEMETRY ONLINE • IST SYNCED</span>
        </div>
      </header>

      {/* INTRO */}
      <section className="hospital-intro">
        <div>
          <span className="hospital-kicker">
            COMMAND CENTER / MEDICAL RESPONSE
          </span>

          <h1>National Hospital Triage Network</h1>

          <p>
            Real-time monitoring of ICU capacity, Liquid Medical Oxygen (LMO), and
            instant Green Corridor ambulance dispatch.
          </p>
        </div>

        <Link href="/dashboard" className="hospital-dashboard-btn">
          COMMAND CENTER →
        </Link>
      </section>

      {/* STATS */}
      <section className="hospital-stats">
        <div className="hospital-stat">
          <span>AVAILABLE HOSPITALS</span>
          <strong className="text-emerald">{available}</strong>
          <small>Ready for emergency intake</small>
        </div>

        <div className="hospital-stat">
          <span>AVAILABLE BEDS</span>
          <strong className="text-cyan">{totalBeds}</strong>
          <small>Across monitored network</small>
        </div>

        <div className="hospital-stat">
          <span>ICU CAPACITY</span>
          <strong className="text-amber">{totalIcu}</strong>
          <small>Critical-care beds ready</small>
        </div>

        <div className="hospital-stat">
          <span>BLOOD UNITS</span>
          <strong className="text-rose">{totalBlood}</strong>
          <small>Reported network inventory</small>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="hospital-controls">
        <div className="hospital-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospital, city, or specialty (e.g. Trauma, Ghaziabad)..."
          />
          {search && (
            <button className="search-clear-btn" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <div className="hospital-filters">
          <div className="filter-group">
            <span className="filter-label">STATUS:</span>
            {["ALL", "AVAILABLE", "BUSY", "CRITICAL"].map((item) => (
              <button
                key={item}
                className={status === item ? "active" : ""}
                onClick={() => setStatus(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="sort-group">
            <span className="filter-label">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="hospital-sort-select"
            >
              <option value="distance">📍 Nearest Distance</option>
              <option value="beds">🛏️ Most Available Beds</option>
              <option value="icu">🩺 Highest ICU Capacity</option>
            </select>
          </div>
        </div>
      </section>

      {/* HOSPITAL GRID */}
      <section className="hospital-grid">
        {filteredHospitals.map((hospital) => {
          const bedPercent = Math.round((hospital.beds / hospital.totalBeds) * 100);
          const barColorClass =
            bedPercent > 40
              ? "bar-high"
              : bedPercent > 15
              ? "bar-mid"
              : "bar-critical";

          return (
            <article
              className={`hospital-card card-status-${hospital.status.toLowerCase()}`}
              key={hospital.id}
            >
              <div className="hospital-card-top">
                <div className="hospital-icon-wrapper">
                  <span className="hospital-icon">🏥</span>
                  <div className="hosp-code">HOSP-0{hospital.id}</div>
                </div>

                <span className={`hospital-status ${hospital.status.toLowerCase()}`}>
                  <i />
                  {hospital.status}
                </span>
              </div>

              <h2>{hospital.name}</h2>

              <div className="hospital-location">
                <span>📍 {hospital.city}</span>
                <span className="distance-badge">• {hospital.distance}</span>
                {hospital.ambulanceBays > 0 && (
                  <span className="bay-badge">⚡ {hospital.ambulanceBays} Bays Free</span>
                )}
              </div>

              <div className="hospital-specialty">
                <span className="specialty-tag">{hospital.specialty}</span>
              </div>

              <div className="capacity-title">
                <span>BED AVAILABILITY</span>
                <span className="pulse-text">{bedPercent}% FREE</span>
              </div>

              {/* DYNAMIC COLORED PROGRESS BAR */}
              <div className="capacity-bar">
                <div
                  className={`capacity-fill ${barColorClass}`}
                  style={{ width: `${Math.max(bedPercent, 6)}%` }}
                />
              </div>

              <div className="capacity-footer">
                <span>
                  Beds: <strong>{hospital.beds}</strong> / {hospital.totalBeds}
                </span>
                <span>
                  ICU: <strong>{hospital.icu}</strong> / {hospital.totalIcu}
                </span>
              </div>

              <div className="capacity-grid">
                <div className="cap-cell">
                  <strong>{hospital.beds}</strong>
                  <span>GENERAL BEDS</span>
                </div>

                <div className="cap-cell">
                  <strong className={hospital.icu <= 2 ? "text-danger" : "text-amber"}>
                    {hospital.icu}
                  </strong>
                  <span>ICU UNITS</span>
                </div>

                <div className="cap-cell">
                  <strong>{hospital.blood}</strong>
                  <span>BLOOD UNITS</span>
                </div>

                <div className="cap-cell">
                  <strong className="text-cyan">{hospital.oxygenLevel}%</strong>
                  <span>O₂ RESERVE</span>
                </div>
              </div>

              <div className="hospital-actions">
                <button
                  className="btn-assign"
                  onClick={() => setDispatchHospital(hospital)}
                >
                  🚑 ASSIGN EMERGENCY
                </button>

                <button
                  className="hospital-details-btn"
                  onClick={() => setSelectedHospital(hospital)}
                >
                  DETAILS ↗
                </button>
              </div>
            </article>
          );
        })}

        {filteredHospitals.length === 0 && (
          <div className="hospital-empty">
            <span>🏥</span>
            <strong>No Hospitals Found</strong>
            <p>Try searching another city (Delhi, Ghaziabad, Noida) or clear your filter.</p>
            <button
              className="btn-reset"
              onClick={() => {
                setSearch("");
                setStatus("ALL");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* DISPATCH ACTION MODAL */}
      {dispatchHospital && (
        <div className="modal-backdrop" onClick={() => setDispatchHospital(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span className="pulse-icon">🚨</span>
                <div>
                  <h3>Initiate Emergency Corridor Dispatch</h3>
                  <small>{dispatchHospital.name} ({dispatchHospital.city})</small>
                </div>
              </div>
              <button className="modal-close" onClick={() => setDispatchHospital(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="dispatch-info-grid">
                <div>
                  <label>HOSPITAL STATUS</label>
                  <strong className={`status-${dispatchHospital.status.toLowerCase()}`}>
                    {dispatchHospital.status}
                  </strong>
                </div>
                <div>
                  <label>DISTANCE / ETA</label>
                  <strong>{dispatchHospital.distance} (~12 mins)</strong>
                </div>
                <div>
                  <label>AVAILABLE ICU</label>
                  <strong>{dispatchHospital.icu} Units</strong>
                </div>
                <div>
                  <label>OXYGEN SUPPLY</label>
                  <strong>{dispatchHospital.oxygenLevel}% Nominal</strong>
                </div>
              </div>

              <div className="dispatch-alert-box">
                <p>
                  Green corridor traffic signals will be auto-cleared along the route.
                  Emergency Triage bay at <strong>{dispatchHospital.name}</strong> will be pre-alerted.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDispatchHospital(null)}>
                Cancel
              </button>
              <button
                className="btn-confirm-dispatch"
                onClick={() => {
                  const name = dispatchHospital.name;
                  setDispatchHospital(null);
                  showToast(`Green Corridor Activated! Route locked to ${name}`);
                }}
              >
                CONFIRM & DISPATCH AMBULANCE →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOSPITAL DETAILS DOSSIER MODAL */}
      {selectedHospital && (
        <div className="modal-backdrop" onClick={() => setSelectedHospital(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span>🏥</span>
                <div>
                  <h3>{selectedHospital.name}</h3>
                  <small>{selectedHospital.specialty} • {selectedHospital.city}</small>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedHospital(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="dossier-stats">
                <div className="dossier-stat-box">
                  <span className="label">GENERAL BEDS</span>
                  <span className="value">{selectedHospital.beds}/{selectedHospital.totalBeds}</span>
                </div>
                <div className="dossier-stat-box">
                  <span className="label">ICU / VENTILATOR</span>
                  <span className="value">{selectedHospital.icu}/{selectedHospital.totalIcu}</span>
                </div>
                <div className="dossier-stat-box">
                  <span className="label">BLOOD UNITS (O/A/B)</span>
                  <span className="value">{selectedHospital.blood} units</span>
                </div>
                <div className="dossier-stat-box">
                  <span className="label">AMBULANCE BAYS</span>
                  <span className="value">{selectedHospital.ambulanceBays} Active</span>
                </div>
              </div>

              <div className="dossier-contact">
                <h4>DIRECT EMERGENCY CONTACT</h4>
                <div className="contact-row">
                  <span>📞 Emergency Desk:</span>
                  <a href={`tel:${selectedHospital.phone}`} className="phone-link">
                    {selectedHospital.phone}
                  </a>
                </div>
                <div className="contact-row">
                  <span>📍 Coordinates:</span>
                  <code>{selectedHospital.city}, India (RES-Q Zone North)</code>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedHospital(null)}>
                Close
              </button>
              <button
                className="btn-confirm-dispatch"
                onClick={() => {
                  const h = selectedHospital;
                  setSelectedHospital(null);
                  setDispatchHospital(h);
                }}
              >
                ASSIGN TO THIS HOSPITAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="hospital-footer">
        <span>
          <i />
          MEDICAL NETWORK OPERATIONAL
        </span>

        <div>
          <small>BED TELEMETRY SYNC</small>
          <small>ICU CAPACITY MONITORING</small>
          <small>BLOOD INVENTORY FEED</small>
        </div>
      </footer>
    </main>
  );
}