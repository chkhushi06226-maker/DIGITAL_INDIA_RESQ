"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="home-page">
      {/* NAVBAR */}
      <nav className="home-nav">
        <Link href="/" className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <div className="brand-title">RES-Q</div>
            <div className="brand-subtitle">DIGITAL INDIA</div>
          </div>
        </Link>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#home">Home</a>
          <a href="#how-it-works">How it works</a>
          <a href="#network">Emergency network</a>
          <a href="#about">About</a>

          <Link href="/emergency/report" className="nav-report">
            Report Emergency
          </Link>
        </div>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot"></span>
            LIVE EMERGENCY NETWORK
          </div>

          <h1>
            When every second
            <br />
            matters, <span>respond as one.</span>
          </h1>

          <p className="hero-description">
            Digital India RES-Q connects citizens, emergency responders,
            hospitals, drones, satellites and intelligent systems into one
            resilient emergency infrastructure.
          </p>

          <div className="hero-buttons">
            <Link href="/emergency/report" className="primary-button">
              Report Emergency
              <span>→</span>
            </Link>

            <Link href="/emergency/track" className="secondary-button">
              Track Emergency
              <span>↗</span>
            </Link>
          </div>

          <div className="hero-trust">
            <span>●</span>
            Designed for faster coordination
            <span className="separator">•</span>
            Built for resilient infrastructure
          </div>
        </div>

        {/* COMMAND CENTER VISUAL */}
        <div className="hero-visual">
          <div className="radar-card">
            <div className="radar-header">
              <div>
                <span className="small-label">COMMAND CENTER</span>
                <strong>Emergency Network</strong>
              </div>

              <span className="status-online">
                <i></i> ONLINE
              </span>
            </div>

            <div className="radar">
              <div className="radar-ring ring-one"></div>
              <div className="radar-ring ring-two"></div>
              <div className="radar-ring ring-three"></div>

              <div className="radar-cross horizontal"></div>
              <div className="radar-cross vertical"></div>

              <div className="radar-sweep"></div>

              <div className="radar-point point-one"></div>
              <div className="radar-point point-two"></div>
              <div className="radar-point point-three"></div>

              <div className="radar-center">
                <span>RES-Q</span>
              </div>
            </div>

            <div className="radar-footer">
              <div>
                <span>ACTIVE INCIDENTS</span>
                <strong>04</strong>
              </div>

              <div>
                <span>RESPONSE UNITS</span>
                <strong>28</strong>
              </div>

              <div>
                <span>NETWORK</span>
                <strong>99.8%</strong>
              </div>
            </div>
          </div>

          <div className="floating-card card-location">
            <div className="floating-icon">⌖</div>
            <div>
              <span>INCIDENT DETECTED</span>
              <strong>Ghaziabad, UP</strong>
            </div>
          </div>

          <div className="floating-card card-response">
            <div className="response-icon">✓</div>
            <div>
              <span>RESPONSE ASSIGNED</span>
              <strong>ETA 03 min</strong>
            </div>
          </div>

          <div className="coordinate">
            28.6692° N
            <br />
            77.4538° E
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stat">
          <strong>24/7</strong>
          <span>Emergency readiness</span>
        </div>

        <div className="stat">
          <strong>360°</strong>
          <span>Situational awareness</span>
        </div>

        <div className="stat">
          <strong>1</strong>
          <span>Unified response network</span>
        </div>

        <div className="stat">
          <strong>∞</strong>
          <span>Scalable infrastructure</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-block" id="how-it-works">
        <div className="section-heading">
          <div>
            <span className="section-label">HOW IT WORKS</span>
            <h2>From detection to response.</h2>
          </div>

          <p>
            A connected emergency ecosystem designed to move critical
            information to the right people at the right time.
          </p>
        </div>

        <div className="process-grid">
          <ProcessCard
            number="01"
            title="Detect"
            description="Citizens, sensors, drones and connected systems can report or detect emergency situations."
            icon="⌁"
          />

          <ProcessCard
            number="02"
            title="Verify"
            description="Incident information is validated using location, evidence and multiple information sources."
            icon="✓"
          />

          <ProcessCard
            number="03"
            title="Assess"
            description="Intelligent systems help evaluate severity, affected people and required resources."
            icon="◉"
          />

          <ProcessCard
            number="04"
            title="Respond"
            description="Emergency teams, hospitals and response resources are coordinated through one network."
            icon="↗"
          />
        </div>
      </section>

      {/* NETWORK */}
      <section className="network-section" id="network">
        <div className="network-copy">
          <span className="section-label">CONNECTED INFRASTRUCTURE</span>

          <h2>
            Everyone connected.
            <br />
            <span>Every response coordinated.</span>
          </h2>

          <p>
            RES-Q brings multiple emergency stakeholders together into a
            unified digital infrastructure — helping reduce communication
            gaps during critical situations.
          </p>

          <Link href="/dashboard" className="text-link">
            Open command dashboard →
          </Link>
        </div>

        <div className="network-grid">
          <NetworkItem icon="◉" title="Citizens" text="Report & track" />
          <NetworkItem icon="♢" title="Police" text="Incident response" />
          <NetworkItem icon="✚" title="Hospitals" text="Medical coordination" />
          <NetworkItem icon="△" title="Drones" text="Aerial surveillance" />
          <NetworkItem icon="✦" title="AI Systems" text="Risk assessment" />
          <NetworkItem icon="◎" title="Satellites" text="Remote connectivity" />
        </div>
      </section>

      {/* ABOUT / SDG */}
      <section className="about-section" id="about">
        <div className="about-card">
          <span className="section-label">SDG 9 • INDUSTRY, INNOVATION & INFRASTRUCTURE</span>

          <h2>
            Building infrastructure that stays connected when it matters most.
          </h2>

          <p>
            Digital India RES-Q explores how resilient digital infrastructure,
            intelligent technologies and connected emergency networks can
            strengthen disaster response and public safety.
          </p>

          <div className="about-points">
            <span>✓ Resilient infrastructure</span>
            <span>✓ Digital connectivity</span>
            <span>✓ Technology-driven innovation</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div>
          <span className="section-label">EMERGENCY RESPONSE NETWORK</span>

          <h2>
            Ready when
            <br />
            every second counts.
          </h2>
        </div>

        <Link href="/emergency/report" className="cta-button">
          Report an emergency <span>→</span>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-brand">
          <strong>RES-Q</strong>
          <span>Digital India Emergency Infrastructure</span>
        </div>

        <div className="footer-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/analytics">Analytics</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/hospitals">Hospitals</Link>
          <Link href="/drones">Drones</Link>
          <Link href="/connectivity">Connectivity</Link>
        </div>

        <div className="footer-copy">
          Prototype • Digital India RES-Q
        </div>
      </footer>

      {/* PAGE STYLES */}
      <style jsx>{`
        .home-page {
          min-height: 100vh;
          background: #06111f;
          color: #f4f8fc;
          overflow-x: hidden;
        }

        .home-nav {
          height: 76px;
          padding: 0 6vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(6, 17, 31, 0.92);
          position: relative;
          z-index: 20;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: white;
        }

        .brand-mark {
          width: 35px;
          height: 35px;
          border: 1px solid #56d8ff;
          display: grid;
          place-items: center;
          color: #56d8ff;
          border-radius: 9px;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .brand-subtitle {
          font-size: 8px;
          letter-spacing: 2px;
          color: #7f91a6;
          margin-top: 2px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-links a {
          color: #9dafc2;
          text-decoration: none;
          font-size: 13px;
          transition: 0.2s;
        }

        .nav-links a:hover {
          color: #fff;
        }

        .nav-links .nav-report {
          border: 1px solid rgba(86, 216, 255, 0.5);
          color: #62ddff;
          padding: 11px 17px;
          border-radius: 7px;
        }

        .menu-button {
          display: none;
          background: none;
          border: 0;
          color: white;
          font-size: 24px;
        }

        .hero-section {
          min-height: 650px;
          padding: 90px 7vw 70px;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          align-items: center;
          gap: 50px;
          background:
            radial-gradient(circle at 78% 45%, rgba(0, 160, 255, 0.12), transparent 32%),
            linear-gradient(180deg, #071426, #06111f);
        }

        .eyebrow,
        .section-label {
          color: #58d9ff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 22px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #48ef9b;
          box-shadow: 0 0 12px rgba(72, 239, 155, 0.8);
        }

        .hero-content h1 {
          font-size: clamp(44px, 5vw, 75px);
          line-height: 0.98;
          letter-spacing: -3px;
          margin: 0;
          max-width: 760px;
        }

        .hero-content h1 span {
          color: #59d9ff;
        }

        .hero-description {
          max-width: 620px;
          color: #91a4b9;
          line-height: 1.8;
          margin: 30px 0;
          font-size: 16px;
        }

        .hero-buttons {
          display: flex;
          gap: 13px;
          flex-wrap: wrap;
        }

        .primary-button,
        .secondary-button,
        .cta-button {
          text-decoration: none;
          padding: 14px 20px;
          border-radius: 7px;
          font-weight: 700;
          font-size: 13px;
          display: inline-flex;
          gap: 18px;
          align-items: center;
        }

        .primary-button,
        .cta-button {
          background: #54d8ff;
          color: #04101d;
        }

        .secondary-button {
          border: 1px solid #34485e;
          color: white;
        }

        .hero-trust {
          color: #61748a;
          font-size: 11px;
          margin-top: 25px;
        }

        .hero-trust span:first-child {
          color: #4bef9c;
        }

        .separator {
          margin: 0 9px;
        }

        .hero-visual {
          position: relative;
          min-height: 470px;
          display: grid;
          place-items: center;
        }

        .radar-card {
          width: min(430px, 90%);
          background: rgba(11, 29, 48, 0.92);
          border: 1px solid #243a51;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
        }

        .radar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .radar-header strong {
          display: block;
          margin-top: 5px;
          font-size: 14px;
        }

        .small-label {
          color: #6f8499;
          font-size: 8px;
          letter-spacing: 1.5px;
        }

        .status-online {
          color: #4bea99;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .status-online i {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4bea99;
          margin-right: 5px;
        }

        .radar {
          width: 300px;
          height: 300px;
          margin: 30px auto;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(83, 216, 255, 0.35);
          background:
            radial-gradient(circle, rgba(65, 212, 255, 0.08), transparent 65%);
        }

        .radar-ring {
          position: absolute;
          border: 1px solid rgba(83, 216, 255, 0.18);
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .ring-one {
          width: 75px;
          height: 75px;
        }

        .ring-two {
          width: 160px;
          height: 160px;
        }

        .ring-three {
          width: 245px;
          height: 245px;
        }

        .radar-cross {
          position: absolute;
          background: rgba(83, 216, 255, 0.12);
        }

        .horizontal {
          height: 1px;
          width: 100%;
          top: 50%;
        }

        .vertical {
          width: 1px;
          height: 100%;
          left: 50%;
        }

        .radar-sweep {
          position: absolute;
          width: 50%;
          height: 50%;
          left: 50%;
          top: 50%;
          transform-origin: 0 0;
          background: linear-gradient(
            45deg,
            rgba(78, 229, 255, 0.25),
            transparent 70%
          );
          clip-path: polygon(0 0, 100% 0, 100% 10%);
          animation: sweep 3s linear infinite;
        }

        @keyframes sweep {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .radar-point {
          width: 8px;
          height: 8px;
          background: #58dcff;
          border-radius: 50%;
          position: absolute;
          box-shadow: 0 0 14px #58dcff;
        }

        .point-one {
          left: 64%;
          top: 28%;
        }

        .point-two {
          left: 27%;
          top: 61%;
        }

        .point-three {
          left: 72%;
          top: 70%;
        }

        .radar-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 55px;
          height: 55px;
          border-radius: 50%;
          border: 1px solid #55dcff;
          display: grid;
          place-items: center;
          background: #081a2b;
          font-size: 9px;
          color: #61dcff;
          letter-spacing: 1px;
        }

        .radar-footer {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #243a51;
          padding-top: 15px;
        }

        .radar-footer span {
          display: block;
          color: #667c91;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .radar-footer strong {
          display: block;
          margin-top: 4px;
          font-size: 14px;
        }

        .floating-card {
          position: absolute;
          background: #0c2035;
          border: 1px solid #2b465e;
          padding: 12px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        .floating-card span {
          display: block;
          color: #667d93;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .floating-card strong {
          display: block;
          font-size: 11px;
          margin-top: 4px;
        }

        .floating-icon,
        .response-icon {
          width: 29px;
          height: 29px;
          border-radius: 7px;
          display: grid;
          place-items: center;
          color: #55d9ff;
          background: rgba(85, 217, 255, 0.1);
        }

        .response-icon {
          color: #4cea9a;
          background: rgba(76, 234, 154, 0.1);
        }

        .card-location {
          left: 0;
          top: 80px;
        }

        .card-response {
          right: 0;
          bottom: 80px;
        }

        .coordinate {
          position: absolute;
          right: 10px;
          top: 30px;
          color: #50677e;
          font-size: 9px;
          line-height: 1.7;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid #203449;
          border-bottom: 1px solid #203449;
          background: #071525;
        }

        .stat {
          padding: 30px;
          border-right: 1px solid #203449;
          text-align: center;
        }

        .stat:last-child {
          border-right: 0;
        }

        .stat strong {
          display: block;
          font-size: 30px;
          color: #62ddff;
        }

        .stat span {
          color: #73879b;
          font-size: 11px;
        }

        .section-block {
          padding: 110px 7vw;
          background: #081727;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 50px;
          margin-bottom: 55px;
        }

        .section-heading h2,
        .network-copy h2,
        .about-card h2,
        .final-cta h2 {
          font-size: clamp(32px, 4vw, 55px);
          letter-spacing: -2px;
          line-height: 1;
          margin: 12px 0 0;
        }

        .section-heading p {
          max-width: 400px;
          color: #7d91a7;
          line-height: 1.7;
          font-size: 13px;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .process-card {
          border: 1px solid #22394f;
          border-radius: 12px;
          padding: 25px;
          background: #0a1b2d;
          min-height: 230px;
          transition: transform 0.2s, border-color 0.2s;
        }

        .process-card:hover {
          transform: translateY(-5px);
          border-color: #3babc9;
        }

        .process-number {
          color: #587086;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .process-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: rgba(82, 214, 255, 0.09);
          color: #58d9ff;
          margin: 30px 0 20px;
          font-size: 20px;
        }

        .process-card h3 {
          margin: 0 0 10px;
          font-size: 19px;
        }

        .process-card p {
          color: #74899f;
          line-height: 1.6;
          font-size: 12px;
        }

        .network-section {
          padding: 110px 7vw;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 90px;
          align-items: center;
          background: #06111f;
        }

        .network-copy h2 span {
          color: #58d9ff;
        }

        .network-copy p {
          color: #7e93a8;
          max-width: 520px;
          line-height: 1.8;
          font-size: 14px;
          margin: 25px 0;
        }

        .text-link {
          color: #58d9ff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .network-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .network-item {
          padding: 23px;
          border: 1px solid #22384d;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
          background: #0a1b2b;
        }

        .network-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: rgba(85, 217, 255, 0.08);
          color: #58d9ff;
          display: grid;
          place-items: center;
        }

        .network-item strong {
          display: block;
          font-size: 13px;
        }

        .network-item span {
          display: block;
          color: #667c91;
          font-size: 10px;
          margin-top: 4px;
        }

        .about-section {
          padding: 90px 7vw;
          background: #071625;
        }

        .about-card {
          max-width: 900px;
          margin: auto;
          border: 1px solid #263e54;
          border-radius: 16px;
          padding: 55px;
          background:
            radial-gradient(circle at 80% 20%, rgba(85, 217, 255, 0.08), transparent 35%),
            #0a1c2e;
        }

        .about-card p {
          color: #8195aa;
          line-height: 1.8;
          max-width: 720px;
          margin: 25px 0;
        }

        .about-points {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .about-points span {
          border: 1px solid #29445b;
          padding: 9px 13px;
          border-radius: 6px;
          color: #91a7bb;
          font-size: 11px;
        }

        .final-cta {
          padding: 100px 7vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          background:
            radial-gradient(circle at 70% 50%, rgba(48, 193, 255, 0.1), transparent 35%),
            #06111f;
          border-top: 1px solid #203448;
        }

        .home-footer {
          padding: 30px 7vw;
          border-top: 1px solid #203448;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 25px;
          align-items: center;
          color: #64798e;
          font-size: 10px;
        }

        .footer-brand strong {
          display: block;
          color: white;
          font-size: 14px;
          letter-spacing: 1px;
        }

        .footer-brand span {
          display: block;
          margin-top: 4px;
        }

        .footer-links {
          display: flex;
          gap: 18px;
        }

        .footer-links a {
          color: #71869b;
          text-decoration: none;
        }

        .footer-copy {
          text-align: right;
        }

        @media (max-width: 900px) {
          .hero-section,
          .network-section {
            grid-template-columns: 1fr;
          }

          .process-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-heading {
            display: block;
          }

          .stats-section {
            grid-template-columns: repeat(2, 1fr);
          }

          .home-footer {
            grid-template-columns: 1fr;
          }

          .footer-copy {
            text-align: left;
          }

          .nav-links {
            display: none;
            position: absolute;
            top: 76px;
            left: 0;
            right: 0;
            padding: 20px;
            background: #071525;
            flex-direction: column;
            align-items: stretch;
          }

          .nav-links.open {
            display: flex;
          }

          .menu-button {
            display: block;
          }
        }

        @media (max-width: 600px) {
          .hero-section {
            padding-top: 60px;
          }

          .hero-content h1 {
            font-size: 43px;
          }

          .radar {
            width: 240px;
            height: 240px;
          }

          .process-grid,
          .stats-section,
          .network-grid {
            grid-template-columns: 1fr;
          }

          .card-location {
            left: -5px;
          }

          .card-response {
            right: -5px;
          }

          .about-card {
            padding: 30px;
          }

          .final-cta {
            display: block;
          }

          .cta-button {
            margin-top: 30px;
          }
        }
      `}</style>
    </main>
  );
}

function ProcessCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="process-card">
      <div className="process-number">{number}</div>
      <div className="process-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function NetworkItem({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="network-item">
      <div className="network-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}