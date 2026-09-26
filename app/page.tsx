"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const emergencyTypes = [
  "Fire",
  "Medical Emergency",
  "Road Accident",
  "Flood",
  "Earthquake",
  "Building Collapse",
  "Landslide",
  "Industrial Accident",
  "Missing Person",
  "Other",
];

const MAX_FILE_SIZE_MB = 25;

export default function ReportEmergency() {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [peopleAffected, setPeopleAffected] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emergencyId, setEmergencyId] = useState("");

  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  const getLocation = () => {
    setLocationLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Location services aren't supported by this browser. Please enter the location manually.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        setLocation(`${lat}° N, ${lng}° E`);
        setLocationLoading(false);
      },
      () => {
        setError("Couldn't access your location. Please enter it manually below.");
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Please choose a file under ${MAX_FILE_SIZE_MB}MB.`);
      e.target.value = "";
      setEvidence(null);
      return;
    }
    setError("");
    setEvidence(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!type) {
      setError("Please select an emergency type.");
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!location.trim()) {
      setError("Please provide the emergency location.");
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!description.trim()) {
      setError("Please describe the emergency.");
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    // Simulated submission — swap for POST /api/emergencies once backend is ready
    setTimeout(() => {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      setEmergencyId(`RESQ-2026-${randomNumber}`);
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <main className="report-page">
        <div className="report-success" role="status">
          <div className="success-icon">✓</div>
          <div className="success-label">Emergency reported</div>
          <h1>Your emergency report has been received.</h1>
          <p>
            RES-Q has logged your emergency and generated a tracking ID.
            Keep this ID to follow the response.
          </p>

          <div className="emergency-id-card">
            <span>Emergency ID</span>
            <strong>{emergencyId}</strong>
          </div>

          <div className="success-status">
            <span className="status-indicator"></span>
            Report received · Response network notified
          </div>

          <div className="success-actions">
            <Link href={`/emergency/track?id=${emergencyId}`} className="primary-btn">
              Track this emergency
            </Link>
            <Link href="/" className="secondary-btn">
              Return to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="report-page">
      <header className="report-header">
        <Link href="/" className="report-brand">
          <div className="report-brand-mark">✦</div>
          <div>
            <div className="report-brand-name">RES-Q</div>
            <div className="report-brand-subtitle">Digital India</div>
          </div>
        </Link>
        <Link href="/" className="back-link">
          ← Back to home
        </Link>
      </header>

      <section className="report-container">
        <div className="report-intro">
          <div className="report-pill">
            <span></span>
            Emergency reporting
          </div>
          <h1>Report an emergency.</h1>
          <p>Share the details below — RES-Q uses this to coordinate the right response.</p>
        </div>

        <form className="report-form" onSubmit={handleSubmit} noValidate>
          {/* EMERGENCY TYPE */}
          <div className="form-section">
            <div className="section-number">01</div>
            <div className="section-content">
              <h2>What happened?</h2>
              <p>Select the type that best describes the emergency.</p>

              <div className="type-grid" role="radiogroup" aria-label="Emergency type">
                {emergencyTypes.map((item) => (
                  <button
                    type="button"
                    key={item}
                    role="radio"
                    aria-checked={type === item}
                    className={`type-option ${type === item ? "selected" : ""}`}
                    onClick={() => setType(item)}
                  >
                    {item}
                    {type === item && <span aria-hidden="true">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="form-section">
            <div className="section-number">02</div>
            <div className="section-content">
              <h2>Where is the emergency?</h2>
              <p>Accurate location helps responders reach you faster.</p>

              <div className="location-row">
                <label className="sr-only" htmlFor="location-input">
                  Emergency location
                </label>
                <input
                  id="location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location or coordinates"
                />
                <button
                  type="button"
                  className="location-btn"
                  onClick={getLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? "Locating…" : "⌖ Use my location"}
                </button>
              </div>

              <div className="location-note">
                <span aria-hidden="true">●</span>
                Location information is used only for emergency coordination.
              </div>
            </div>
          </div>

          {/* PEOPLE AFFECTED */}
          <div className="form-section">
            <div className="section-number">03</div>
            <div className="section-content">
              <h2>How many people are affected?</h2>
              <p>This helps RES-Q estimate the resources needed.</p>

              <label className="sr-only" htmlFor="people-input">
                Number of people affected
              </label>
              <input
                id="people-input"
                className="number-input"
                type="number"
                min="0"
                value={peopleAffected}
                onChange={(e) => setPeopleAffected(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="form-section">
            <div className="section-number">04</div>
            <div className="section-content">
              <h2>Tell us more.</h2>
              <p>Describe what's happening and any important details.</p>

              <label className="sr-only" htmlFor="description-input">
                Emergency description
              </label>
              <textarea
                id="description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: A fire has started near a residential building. Several people may be inside…"
                rows={5}
                maxLength={800}
              />
              <div className="char-count">{description.length}/800</div>
            </div>
          </div>

          {/* EVIDENCE */}
          <div className="form-section">
            <div className="section-number">05</div>
            <div className="section-content">
              <h2>Attach evidence.</h2>
              <p>Upload an image or video if it's safe to do so.</p>

              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <span className="upload-icon" aria-hidden="true">↑</span>
                <strong>{evidence ? evidence.name : "Upload image or video"}</strong>
                <small>
                  {evidence
                    ? "File selected successfully"
                    : `Optional · JPG, PNG, MP4 · up to ${MAX_FILE_SIZE_MB}MB`}
                </small>
              </label>
            </div>
          </div>

          {error && (
            <div className="form-error" role="alert" ref={errorRef}>
              <span aria-hidden="true">!</span>
              {error}
            </div>
          )}

          <div className="submit-area">
            <button type="submit" className="submit-emergency" disabled={submitting}>
              <span aria-hidden="true">🚨</span>
              {submitting ? "Submitting…" : "Submit emergency report"}
            </button>
            <p>By submitting, you confirm this information is accurate to the best of your knowledge.</p>
          </div>
        </form>
      </section>
    </main>
  );
}