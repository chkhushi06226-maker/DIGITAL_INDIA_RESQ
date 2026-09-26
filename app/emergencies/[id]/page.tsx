"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type EmergencyData = {
  id: string;
  type: string;
  location: string;
  peopleAffected?: string | number;
  description: string;
  severity?: "Critical" | "High" | "Medium";
  status: "Active" | "Dispatched" | "Resolved";
  createdAt?: string;
  responseETA?: string;
};

// Known mock registry for fallback
const mockRegistry: Record<string, EmergencyData> = {
  "RESQ-2026-4821": {
    id: "RESQ-2026-4821",
    type: "Fire Outbreak",
    location: "Ghaziabad, Uttar Pradesh",
    peopleAffected: "12",
    severity: "Critical",
    description: "Major structural fire reported in a residential complex. Evacuation in progress by local rescue teams.",
    status: "Dispatched",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    responseETA: "03 min",
  },
  "RESQ-2026-7314": {
    id: "RESQ-2026-7314",
    type: "Medical Trauma",
    location: "Connaught Place, Delhi",
    peopleAffected: "3",
    severity: "High",
    description: "Multiple casualty road collision requiring critical paramedic care and ICU ambulance dispatch.",
    status: "Active",
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    responseETA: "06 min",
  },
  "RESQ-2026-9052": {
    id: "RESQ-2026-9052",
    type: "Flash Flood",
    location: "Haridwar Ghat, Uttarakhand",
    peopleAffected: "28",
    severity: "Medium",
    description: "Sudden rise in river water levels. SDRF boat teams successfully deployed and civilians moved to relief shelter.",
    status: "Resolved",
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    responseETA: "Resolved",
  },
};

const responseSteps = [
  { title: "Emergency Reported", description: "Incident logged into RES-Q Central Network" },
  { title: "Location Verified", description: "ISRO NavIC / GPS coordinates locked" },
  { title: "AI Assessment", description: "Severity & resource prioritization computed" },
  { title: "Response Assigned", description: "Nearest field units tagged & notified" },
  { title: "Units En Route", description: "Emergency vehicles navigating with siren priority" },
  { title: "Hospital Alerted", description: "Trauma beds & burn units kept on standby" },
  { title: "Incident Resolved", description: "Victims secured & area cleared by commanders" },
];

export default function EmergencyDetails() {
  const params = useParams();
  const rawId = typeof params?.id === "string" ? params.id : "";
  const emergencyId = decodeURIComponent(rawId);

  const [emergency, setEmergency] = useState<EmergencyData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!emergencyId) return;

    // Check localStorage first (if created via Report/Simulate)
    const stored = localStorage.getItem(emergencyId);
    if (stored) {
      try {
        setEmergency(JSON.parse(stored));
        return;
      } catch {
        // Fallback below
      }
    }

    // Check registry or generate tailored fallback
    if (mockRegistry[emergencyId]) {
      setEmergency(mockRegistry[emergencyId]);
    } else {
      setEmergency({
        id: emergencyId,
        type: emergencyId.includes("FIRE") ? "Fire Outbreak" : "Medical Emergency",
        location: "National Capital Region (NCR), India",
        peopleAffected: "8",
        severity: "Critical",
        description: "Emergency dispatch initiated via RES-Q Command Center. Real-time satellite tracking and units assigned.",
        status: "Dispatched",
        createdAt: new Date().toISOString(),
        responseETA: "04 min",
      });
    }
  }, [emergencyId]);

  // Helper: Dynamic Emoji
  function getEmergencyIcon(type: string) {
    const t = type.toLowerCase();
    if (t.includes("fire")) return "🔥";
    if (t.includes("med") || t.includes("trauma") || t.includes("accident")) return "🚑";
    if (t.includes("flood") || t.includes("water") || t.includes("rain")) return "🌊";
    if (t.includes("earthquake") || t.includes("collapse")) return "🏚️";
    if (t.includes("gas") || t.includes("chemical")) return "☣️";
    return "🚨";
  }

  // Dynamic Timeline Step Tracker
  function getActiveStepIndex(status?: string) {
    if (status === "Resolved") return 7;
    if (status === "Dispatched") return 5;
    return 3; // "Active"
  }

  // Copy tracking URL
  function copyTrackingLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (!emergency) {
    return (
      <main className="details-page">
        <div className="details-loading">
          <div className="loading-spinner" />
          <span>Synchronizing Telemetry with RES-Q Satellites...</span>
        </div>
      </main>
    );
  }

  const activeStep = getActiveStepIndex(emergency.status);

  return (
    <main className="details-page">
      {/* HEADER */}
      <header className="details-header">
        <Link href="/" className="details-brand">
          <span className="details-brand-mark">911</span>
          <span>
            <strong>DIGITAL INDIA RES-Q</strong>
            <small>National Response Registry</small>
          </span>
        </Link>

        <div className="details-header-actions">
          <Link href="/dashboard" className="details-dashboard-link">
            ← Command Center
          </Link>

          <button onClick={copyTrackingLink} className="details-copy-btn">
            {copied ? "✓ Link Copied!" : "🔗 Share Status"}
          </button>

          <Link href="/emergency/track" className="details-track-link">
            Live Radar →
          </Link>
        </div>
      </header>

      <section className="details-container">
        {/* TOP INCIDENT BAR */}
        <div className="details-top">
          <div>
            <span className="details-pill">
              <i></i> LIVE INCIDENT DOSSIER
            </span>

            <h1>
              Incident Response
              <br />
              <span>Operation Center.</span>
            </h1>

            <p>
              Telemetry data, AI threat matrix, and real-time field unit telemetry
              for Incident #{emergency.id}.
            </p>
          </div>

          <div className="incident-id-card">
            <span>OFFICIAL INCIDENT CODE</span>
            <strong>{emergency.id}</strong>
            <small>Encrypted Gov-ResQ Feed</small>
          </div>
        </div>

        {/* MAIN SPLIT GRID */}
        <div className="details-grid-main">
          {/* INCIDENT DETAILS */}
          <section className="incident-card">
            <div className="details-section-heading">
              <div>
                <span>TACTICAL TELEMETRY</span>
                <h2>Emergency Overview</h2>
              </div>

              <span className={`incident-status ${emergency.status.toLowerCase()}`}>
                ● {emergency.status}
              </span>
            </div>

            <div className="incident-info-grid">
              <div className="info-box">
                <span>Emergency Type</span>
                <strong>{getEmergencyIcon(emergency.type)} {emergency.type}</strong>
              </div>

              <div className="info-box">
                <span>Location</span>
                <strong>📍 {emergency.location}</strong>
              </div>

              <div className="info-box">
                <span>People Affected</span>
                <strong>👥 {emergency.peopleAffected || "Under Assessment"}</strong>
              </div>

              <div className="info-box">
                <span>Reported Timestamp</span>
                <strong>
                  ⏱️ {emergency.createdAt ? new Date(emergency.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "Just now"}
                </strong>
              </div>
            </div>

            <div className="description-box">
              <span>FIELD SITUATION REPORT</span>
              <p>{emergency.description}</p>
            </div>
          </section>

          {/* AI DECISION ENGINE */}
          <section className="assessment-card">
            <div className="details-section-heading">
              <div>
                <span>QUANTUM AI ENGINE</span>
                <h2>Threat Matrix</h2>
              </div>

              <span className="ai-active">● RE-EVALUATING</span>
            </div>

            <div className={`risk-level ${(emergency.severity || "Critical").toLowerCase()}`}>
              <span>ASSESSED RISK TIER</span>
              <strong>{emergency.severity || "CRITICAL"}</strong>
              <small>Automated priority dispatch authorized</small>
            </div>

            <div className="assessment-item">
              <span>Response ETA</span>
              <strong className="eta-badge">{emergency.responseETA || "04 min"}</strong>
            </div>

            <div className="assessment-item">
              <span>Recommended Fleet</span>
              <strong>
                {emergency.type.toLowerCase().includes("fire")
                  ? "2 Fire Tenders + 1 ALS Ambulance"
                  : "2 Trauma Ambulances + City Police"}
              </strong>
            </div>

            <div className="assessment-item">
              <span>Hospital Coordination</span>
              <strong className="text-green">Green Corridor Active</strong>
            </div>

            <div className="assessment-note">
              AI Risk Engine synchronizes every 30s with satellite traffic feeds and hospital ICU availability.
            </div>
          </section>
        </div>

        {/* CONNECTED RESPONSE FLEET */}
        <section className="response-network-card">
          <div className="details-section-heading">
            <div>
              <span>DEPLOYED ASSETS</span>
              <h2>Assigned Response Grid</h2>
            </div>

            <span className="network-live">
              <i /> ENCRYPTED CO-ORD
            </span>
          </div>

          <div className="response-resources">
            <div className="response-resource">
              <span className="resource-big-icon">🚒</span>
              <div>
                <strong>Fire & Hazmat Unit</strong>
                <small>Engine #09 & #14 (Heavy Rescue)</small>
              </div>
              <b className="status-enroute">EN ROUTE (ETA 2m)</b>
            </div>

            <div className="response-resource">
              <span className="resource-big-icon">🚑</span>
              <div>
                <strong>ALS Ambulance Unit</strong>
                <small>Paramedic Crew Delta-4</small>
              </div>
              <b className="status-assigned">ON SITE</b>
            </div>

            <div className="response-resource">
              <span className="resource-big-icon">🚓</span>
              <div>
                <strong>Traffic & Police Cordon</strong>
                <small>Intercept Patrol 22</small>
              </div>
              <b className="status-enroute">CORDON ACTIVE</b>
            </div>

            <div className="response-resource">
              <span className="resource-big-icon">🏥</span>
              <div>
                <strong>Apex Trauma Center</strong>
                <small>Emergency ICU Ward Resvd</small>
              </div>
              <b className="status-alerted">BEDS STANDBY</b>
            </div>
          </div>
        </section>

        {/* CHRONOLOGICAL TIMELINE */}
        <section className="details-timeline-card">
          <div className="details-section-heading">
            <div>
              <span>MISSION PROGRESS</span>
              <h2>Incident Lifecycle Audit</h2>
            </div>

            <span className="timeline-live">
              <i /> REAL-TIME STREAM
            </span>
          </div>

          <div className="details-timeline">
            {responseSteps.map((step, index) => {
              const isCompleted = index < activeStep;
              const isCurrent = index === activeStep - 1 && emergency.status !== "Resolved";

              return (
                <div
                  className={`details-timeline-item ${isCompleted ? "done" : ""} ${isCurrent ? "current" : ""}`}
                  key={step.title}
                >
                  <div className="timeline-number">
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  <div className="timeline-text">
                    <strong>{step.title}</strong>
                    <span>{step.description}</span>
                  </div>

                  <div className="timeline-status-tag">
                    {isCompleted ? (
                      <span className="tag-done">Completed</span>
                    ) : isCurrent ? (
                      <span className="tag-active">In Progress</span>
                    ) : (
                      <span className="tag-pending">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM ACTION BAR */}
        <div className="details-actions">
          <Link href="/dashboard" className="back-dashboard">
            ← Return to Command Center
          </Link>

          <Link href="/emergency/track" className="track-action">
            Open Real-Time Tracking Radar →
          </Link>
        </div>
      </section>
    </main>
  );
}