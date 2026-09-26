"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type EmergencyData = {
  id: string;
  type: string;
  location: string;
  peopleAffected: string;
  description: string;
  status?: string;
  severity?: string;
  createdAt?: string;
};

const timeline = [
  { title: "Emergency Reported", key: "reported" },
  { title: "Location Verified", key: "verified" },
  { title: "AI Assessment", key: "assessment" },
  { title: "Response Assigned", key: "assigned" },
  { title: "Response Team En Route", key: "enroute" },
  { title: "Hospital Alerted", key: "hospital" },
  { title: "Emergency Resolved", key: "resolved" },
];

export default function TrackEmergency() {
  const [emergencyId, setEmergencyId] = useState("");
  const [emergency, setEmergency] = useState<EmergencyData | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setEmergencyId(id);
      findEmergency(id);
    }
  }, []);

  function findEmergency(id: string) {
    setLoading(true);
    setSearched(true);

    setTimeout(() => {
      try {
        // Matches the key format the report page actually saves under.
        const stored = localStorage.getItem(`resq-emergency-${id}`);
        setEmergency(stored ? JSON.parse(stored) : null);
      } catch {
        setEmergency(null);
      }
      setLoading(false);
    }, 500);
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!emergencyId.trim()) return;
    findEmergency(emergencyId.trim());
  }

  function getStatusIndex() {
    const status = emergency?.status?.toLowerCase();
    switch (status) {
      case "reported":
        return 0;
      case "verified":
        return 1;
      case "assessment":
        return 2;
      case "assigned":
        return 3;
      case "enroute":
      case "team en route":
        return 4;
      case "hospital":
      case "hospital alerted":
        return 5;
      case "resolved":
        return 6;
      default:
        return 0;
    }
  }

  const currentIndex = getStatusIndex();
  const isResolved = currentIndex === timeline.length - 1;

  return (
    <main className="track-page">
      <header className="track-header">
        <Link href="/" className="track-brand">
          <span className="track-brand-mark">✦</span>
          <span>
            <strong>RES-Q</strong>
            <small>Digital India</small>
          </span>
        </Link>

        <Link href="/emergency/report" className="report-link">
          Report Emergency
        </Link>
      </header>

      <section className="track-container">
        <div className="track-intro">
          <span className="track-pill">● Emergency tracking</span>
          <h1>
            Track your
            <br />
            <span>emergency response.</span>
          </h1>
          <p>
            Enter your RES-Q emergency ID to monitor the response status,
            location verification and emergency coordination.
          </p>
        </div>

        <form className="track-search" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <span aria-hidden="true">⌕</span>
            <label className="sr-only" htmlFor="track-id-input">
              Emergency ID
            </label>
            <input
              id="track-id-input"
              type="text"
              placeholder="Enter RESQ-2026-XXXX"
              value={emergencyId}
              onChange={(e) => setEmergencyId(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Track emergency"}
          </button>
        </form>

        <div aria-live="polite">
          {searched && !loading && !emergency && (
            <div className="not-found">
              <div className="not-found-icon" aria-hidden="true">!</div>
              <div>
                <h3>Emergency not found</h3>
                <p>
                  We couldn't find an emergency with ID{" "}
                  <strong>{emergencyId}</strong>. Double-check the ID from
                  your confirmation screen and try again.
                </p>
              </div>
            </div>
          )}

          {emergency && (
            <div className="emergency-result">
              <div className="result-header">
                <div>
                  <span className="result-label">Emergency ID</span>
                  <h2>{emergency.id}</h2>
                </div>

                <span className={`status-badge ${isResolved ? "resolved" : "active"}`}>
                  ● {emergency.status || "Reported"}
                </span>
              </div>

              <div className="details-grid">
                <div className="detail-card">
                  <span>Emergency type</span>
                  <strong>{emergency.type}</strong>
                </div>
                <div className="detail-card">
                  <span>Location</span>
                  <strong>{emergency.location}</strong>
                </div>
                <div className="detail-card">
                  <span>People affected</span>
                  <strong>{emergency.peopleAffected || "Not specified"}</strong>
                </div>
                <div className="detail-card">
                  <span>Reported</span>
                  <strong>
                    {emergency.createdAt
                      ? new Date(emergency.createdAt).toLocaleString()
                      : "Just now"}
                  </strong>
                </div>
              </div>

              <div className="description-card">
                <span>Description</span>
                <p>{emergency.description}</p>
              </div>

              <section className="timeline-section">
                <div className="section-heading">
                  <div>
                    <span className="result-label">Response progress</span>
                    <h3>Emergency response timeline</h3>
                  </div>
                  <span className="live-indicator">
                    <i aria-hidden="true" />
                    Live
                  </span>
                </div>

                <div className="timeline">
                  {timeline.map((item, index) => {
                    const completed = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div
                        key={item.key}
                        className={`timeline-item ${completed ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                      >
                        <div className="timeline-marker">
                          {completed ? "✓" : index + 1}
                        </div>
                        <div className="timeline-content">
                          <strong>{item.title}</strong>
                          <span>
                            {index < currentIndex
                              ? "Completed"
                              : isCurrent
                              ? "Currently processing"
                              : "Awaiting response"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <div className="track-actions">
                <button
                  type="button"
                  className="refresh-button"
                  onClick={() => findEmergency(emergency.id)}
                >
                  ↻ Refresh status
                </button>
                <Link href="/" className="home-button">
                  ← Back to home
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}