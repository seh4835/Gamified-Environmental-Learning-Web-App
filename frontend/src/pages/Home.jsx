import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroBanner from "../icons/hero_banner.png";
import leafIcon from "../icons/icon_leaf.png";
import modulesIcon from "../icons/icon_modules.png";
import challengeIcon from "../icons/icon_challenge.png";
import trophyIcon from "../icons/icon_trophy.png";

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const features = [
    {
      icon: modulesIcon,
      title: "Learn",
      desc: "Unlock 10 interactive modules on climate, waste, water, biodiversity & more. Earn XP with every slide.",
      color: "var(--neon-blue)",
      glow: "0 0 20px rgba(56,189,248,0.3)",
    },
    {
      icon: challengeIcon,
      title: "Act",
      desc: "Complete real-world eco challenges — plant a tree, reduce waste, save water — and submit proof.",
      color: "var(--neon-purple)",
      glow: "0 0 20px rgba(168,85,247,0.3)",
    },
    {
      icon: trophyIcon,
      title: "Earn",
      desc: "Gain eco-points, unlock exclusive badges, climb the leaderboard and become a Sustainability Hero.",
      color: "var(--neon-gold)",
      glow: "0 0 20px rgba(251,191,36,0.3)",
    },
  ];

  const stats = [
    { value: "10", label: "Learning Modules" },
    { value: "10+", label: "Eco Challenges" },
    { value: "6", label: "Badges to Unlock" },
    { value: "AR", label: "Augmented Reality" },
  ];

  return (
    <div style={{ background: "#000" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: isMobile ? "auto" : "92vh", display: "flex", alignItems: "center" }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${heroBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
        }} />
        {/* Overlay gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(8,12,20,0.95) 0%, rgba(8,12,20,0.7) 50%, rgba(8,12,20,0.9) 100%)",
        }} />
        {/* Grid pattern */}
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: isMobile ? "2.5rem 1rem" : "4rem 2rem", width: "100%", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2rem" : "4rem", alignItems: "center" }}>

          {/* LEFT */}
          <div className="animate-fadeIn">
            <div className="stat-chip chip-green" style={{ marginBottom: "1.5rem" }}>
              Gamified Environmental Learning
            </div>

            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "#f1f5f9",
              marginBottom: "1.5rem",
            }}>
              Protect The Planet.{" "}
              <span style={{ color: "var(--neon-green)" }} className="glow-green">
                Level Up.
              </span>
            </h1>

            <p style={{ fontSize: isMobile ? "0.95rem" : "1.05rem", color: "#94a3b8", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 480 }}>
              EcoLearn turns environmental education into an epic quest.
              Learn sustainability concepts, complete real-world eco challenges,
              and earn points &amp; badges as you level up.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link to="/register" className="btn-primary">
                Start Your Quest
              </Link>
              <Link to="/leaderboard" className="btn-secondary">
                View Leaderboard
              </Link>
            </div>

            <p style={{ marginTop: "2rem", fontSize: "0.78rem", color: "#475569", fontFamily: "var(--font-heading)", letterSpacing: "0.06em" }}>
              Aligned with India's SDG goals and NEP 2020
            </p>
          </div>

          {/* RIGHT — floating icon */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="animate-float" style={{
              width: isMobile ? 180 : 260, height: isMobile ? 180 : 260,
              background: "radial-gradient(circle at 40% 40%, rgba(0,255,136,0.15), transparent 70%)",
              border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px rgba(0,255,136,0.15), inset 0 0 40px rgba(0,255,136,0.05)",
            }}>
              <img src={leafIcon} alt="EcoLearn" style={{ width: isMobile ? 110 : 160, height: isMobile ? 110 : 160, objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(0,255,136,0.7))" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{
        background: "var(--bg-card)",
        borderTop: "1px solid rgba(0,255,136,0.1)",
        borderBottom: "1px solid rgba(0,255,136,0.1)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "1rem" : "1.5rem 2rem", display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "1rem" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: isMobile ? "1.45rem" : "2rem", fontWeight: 900, color: "var(--neon-green)" }} className="glow-green">
                {s.value}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "var(--font-heading)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: isMobile ? "3rem 1rem" : "6rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="game-section-title" style={{ fontSize: "2rem" }}>How It Works</h2>
            <p className="game-section-sub">Three steps to becoming an Eco Champion</p>
            <div className="neon-divider" style={{ maxWidth: 200, margin: "0 auto" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1.2rem" }}>
            {features.map((f, i) => (
              <div key={f.title} className="game-card" style={{ borderColor: `${f.color}22` }}>
                <div style={{
                  width: 80, height: 80,
                  background: `linear-gradient(135deg, ${f.color}22, transparent)`,
                  border: `1px solid ${f.color}44`,
                  borderRadius: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.5rem",
                  boxShadow: f.glow,
                }}>
                  <img src={f.icon} alt={f.title} style={{ width: 48, height: 48, objectFit: "contain" }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                  <span style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: f.color,
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}30`,
                    padding: "2px 8px",
                    borderRadius: 4,
                    letterSpacing: "0.1em",
                  }}>STEP {i + 1}</span>
                  <h3 style={{ fontFamily: "var(--font-heading)", color: "#f1f5f9", fontSize: "1.1rem" }}>{f.title}</h3>
                </div>

                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AR SECTION ── */}
      <section style={{ padding: isMobile ? "3rem 1rem" : "5rem 2rem", background: "var(--bg-card)", borderTop: "1px solid var(--bg-border)", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="stat-chip chip-blue" style={{ marginBottom: "1.5rem" }}>
            Augmented Reality
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: isMobile ? "1.4rem" : "2rem", color: "#f1f5f9", marginBottom: "1rem" }}>
            Scan Objects. Discover Sustainability.
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 600, margin: "0 auto 2.5rem" }}>
            Use your camera to scan everyday objects and unlock eco-insights in real time through our AR experience.
          </p>
          <a href="/ar/scan.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ color: "var(--neon-blue)", borderColor: "var(--neon-blue)" }}>
            Launch AR Experience
          </a>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: isMobile ? "3rem 1rem" : "6rem 2rem", textAlign: "center" }}>
        <div className="grid-bg" style={{ padding: "4rem 2rem", borderRadius: 24, border: "1px solid rgba(0,255,136,0.1)", maxWidth: 800, margin: "0 auto", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,255,136,0.05) 0%, transparent 70%)" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: isMobile ? "1.45rem" : "2.2rem", color: "#f1f5f9", marginBottom: "1rem" }}>
              Ready to Make an <span style={{ color: "var(--neon-green)" }} className="glow-green">Impact?</span>
            </h2>
            <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "1rem" }}>
              Join EcoLearn and start building sustainable habits that earn real rewards.
            </p>
            <Link to="/register" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.8rem 2rem" }}>
              Create Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}