"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
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

export default function EmergencyReport() {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emergencyId, setEmergencyId] = useState("");

  const errorRef = useRef<HTMLDivElement>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Location services aren't supported by this browser. Please enter the location manually.");
      return;
    }

    setError("");
    setLocationLoading(true);

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Please choose a file under ${MAX_FILE_SIZE_MB}MB.`);
      event.target.value = "";
      setFileName("");
      return;
    }

    setError("");
    setFileName(file.name);
  };

  const generateEmergencyId = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `RESQ-2026-${randomNumber}`;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!type) {
      setError("Please select the type of emergency.");
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
      const id = generateEmergencyId();
      const record = {
        id,
        type,
        location,
        peopleAffected: people || "0",
        description,
        evidence: fileName || null,
        status: "Reported",
        severity: "Pending AI Assessment",
        createdAt: new Date().toISOString(),
      };

      try {
        // Keyed by ID so any report can be looked up on the track page,
        // not just the most recent one.
        localStorage.setItem(`resq-emergency-${id}`, JSON.stringify(record));
        localStorage.setItem("resq-last-emergency-id", id);
      } catch {
        // localStorage can fail in private browsing / storage-full cases;
        // the confirmation screen still shows the ID either way.
      }

      setEmergencyId(id);
      setSubmitting(false);
    }, 1200);
  };

  if (emergencyId) {
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

        <section className="report-success" role="status">
          <div className="success-icon">✓</div>
          <div className="success-label">Emergency reported</div>
          <h1>Your report has been received.</h1>
          <p>
            RES-Q has registered your emergency and added it to the response
            network. Keep your emergency ID safe for tracking.
          </p>

          <div className="emergency-id-card">
            <span>Your emergency ID</span>
            <strong>{emergencyId}</strong>
          </div>

          <div className="success-status">
            <span className="status-indicator"></span>
            Report received · Response assessment pending
          </div>

          <div className="success-actions">
            <Link href={`/emergency/track?id=${emergencyId}`} className="primary-btn">
              Track emergency
            </Link>
            <Link href="/" className="secondary-btn">
              Return home
            </Link>
          </div>
        </section>
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

      <div className="report-container">
        <section className="report-intro">
          <div className="report-pill">
            <span></span>
            Emergency reporting
          </div>
          <h1>Report an emergency.</h1>
          <p>
            Provide the details below. RES-Q will use this information to
            identify, verify and coordinate the appropriate response.
          </p>
        </section>

        <form className="report-form" onSubmit={handleSubmit} noValidate>
          {/* STEP 01 */}
          <section className="form-section">
            <div className="section-number">01</div>
            <div className="section-content">
              <h2>What happened?</h2>
              <p>Select the emergency type that best describes the situation.</p>

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
          </section>

          {/* STEP 02 */}
          <section className="form-section">
            <div className="section-number">02</div>
            <div className="section-content">
              <h2>Where is it happening?</h2>
              <p>Accurate location helps responders reach the incident faster.</p>

              <div className="location-row">
                <label className="sr-only" htmlFor="location-input">
                  Emergency location
                </label>
                <input
                  id="location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter address, landmark or location"
                />
                <button
                  type="button"
                  className="location-btn"
                  onClick={getLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? "Locating…" : "Use my location"}
                </button>
              </div>

              <div className="location-note">
                <span aria-hidden="true">●</span>
                Location data is used only to coordinate emergency response.
              </div>
            </div>
          </section>

          {/* STEP 03 */}
          <section className="form-section">
            <div className="section-number">03</div>
            <div className="section-content">
              <h2>How many people are affected?</h2>
              <p>Give an approximate number if the exact count is unknown.</p>

              <label className="sr-only" htmlFor="people-input">
                Number of people affected
              </label>
              <input
                id="people-input"
                className="number-input"
                type="number"
                min="0"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
          </section>

          {/* STEP 04 */}
          <section className="form-section">
            <div className="section-number">04</div>
            <div className="section-content">
              <h2>Describe the situation.</h2>
              <p>
                Tell responders what they need to know — visible dangers,
                injuries, or anything that may affect the response.
              </p>

              <label className="sr-only" htmlFor="description-input">
                Emergency description
              </label>
              <textarea
                id="description-input"
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is happening…"
              />
              <div className="char-count">{description.length}/500</div>
            </div>
          </section>

          {/* STEP 05 */}
          <section className="form-section">
            <div className="section-number">05</div>
            <div className="section-content">
              <h2>Add visual evidence.</h2>
              <p>If it's safe to do so, upload a photo or video of the situation.</p>

              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <div className="upload-icon" aria-hidden="true">↑</div>
                <strong>{fileName ? fileName : "Upload photo or video"}</strong>
                <small>
                  {fileName
                    ? "File selected"
                    : `Click to browse · optional · up to ${MAX_FILE_SIZE_MB}MB`}
                </small>
              </label>
            </div>
          </section>

          {error && (
            <div className="form-error" role="alert" ref={errorRef}>
              <span aria-hidden="true">!</span>
              {error}
            </div>
          )}

          <div className="submit-area">
            <button type="submit" className="submit-emergency" disabled={submitting}>
              <span aria-hidden="true">⚠</span>
              {submitting ? "Submitting report…" : "Submit emergency report"}
            </button>
            <p>
              Only submit genuine emergency information. If you're in
              immediate danger, move to a safe location whenever possible.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}