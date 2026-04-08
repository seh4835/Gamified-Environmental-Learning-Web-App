import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import modulesIcon from "../../icons/icon_modules.png";
import trophyIcon from "../../icons/icon_trophy.png";

import imgClimate from "../../icons/mod_climate.png";
import imgWaste from "../../icons/mod_waste.png";
import imgWater from "../../icons/mod_water.png";
import imgEnergy from "../../icons/mod_energy.png";
import imgBio from "../../icons/mod_biodiversity.png";
import imgAgri from "../../icons/mod_agriculture.png";
import imgUrban from "../../icons/mod_urban.png";
import imgCarbon from "../../icons/mod_carbon.png";
import imgPolicy from "../../icons/mod_policy.png";

/* Use real hex values — CSS custom properties can't be interpolated in JS template literals */
const DIFFICULTY_STYLES = {
  Beginner:     { chipClass: "chip-green",  barClass: "xp-bar-fill",        pct: 33 },
  Intermediate: { chipClass: "chip-gold",   barClass: "xp-bar-fill-gold",   pct: 66 },
  Advanced:     { chipClass: "chip-purple", barClass: "xp-bar-fill-purple", pct: 100 },
};

/* Hex colours per module slot — no CSS variables */
const MODULE_HEX = [
  "#00ff88", // 0 neon green
  "#38bdf8", // 1 neon blue
  "#a855f7", // 2 neon purple
  "#fbbf24", // 3 neon gold
  "#34d399", // 4 teal
  "#fb923c", // 5 orange
  "#38bdf8", // 6
  "#a855f7", // 7
  "#00ff88", // 8
  "#fbbf24", // 9
];

/* Text colour that contrasts well against each module colour */
const BUTTON_TEXT = [
  "#080c14", // on green
  "#080c14", // on blue
  "#ffffff", // on purple
  "#080c14", // on gold
  "#080c14", // on teal
  "#080c14", // on orange
  "#080c14",
  "#ffffff",
  "#080c14",
  "#080c14",
];

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [modulesRes, dashRes] = await Promise.allSettled([
          api.get("/modules"),
          api.get("/users/dashboard"),
        ]);
        if (modulesRes.status === "fulfilled") setModules(modulesRes.value.data || []);
        else setError("Failed to load modules");
        if (dashRes.status === "fulfilled")
          setCompletedIds(dashRes.value.data.completed_module_ids || []);
      } catch {
        setError("Failed to load modules");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loader fullScreen text="Loading curriculum..." />;

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
  const filtered = filter === "All" ? modules : modules.filter(m => m.difficulty === filter);
  const completedCount = modules.filter(m => completedIds.includes(m.id)).length;

  return (
    <div style={{ minHeight: "100vh", padding: "2rem 1.5rem", background: "#000" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }} className="animate-fadeIn">
          <img src={modulesIcon} alt="" style={{ width: 52, height: 52, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.7))" }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "#f1f5f9" }}>
              LEARNING <span style={{ color: "#38bdf8" }} className="glow-blue">MODULES</span>
            </h1>
            <p style={{ color: "#64748b", fontFamily: "var(--font-heading)", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
              {modules.length} MISSIONS AVAILABLE · {completedCount} COMPLETED · EARN XP · LEVEL UP
            </p>
          </div>

          {completedCount > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0.5rem 1rem",
              background: "rgba(0,255,136,0.1)",
              border: "1px solid rgba(0,255,136,0.3)",
              borderRadius: 8,
            }}>
              <img src={trophyIcon} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#00ff88", fontWeight: 900, lineHeight: 1 }}>
                  {completedCount}/{modules.length}
                </p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: "#64748b", letterSpacing: "0.1em" }}>COMPLETED</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Overall progress bar ── */}
        {modules.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.1em" }}>YOUR PROGRESS</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", color: "#00ff88" }}>
                {Math.round((completedCount / modules.length) * 100)}%
              </span>
            </div>
            <div className="xp-bar-track" style={{ height: 10 }}>
              <div className="xp-bar-fill" style={{ width: `${(completedCount / modules.length) * 100}%` }} />
            </div>
          </div>
        )}

        {/* ── Filter tabs ── */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: 6,
                border: `1px solid ${filter === d ? "#00ff88" : "rgba(255,255,255,0.12)"}`,
                background: filter === d ? "rgba(0,255,136,0.15)" : "rgba(0,0,0,0.3)",
                color: filter === d ? "#00ff88" : "#94a3b8",
                fontFamily: "var(--font-heading)",
                fontSize: "0.68rem", letterSpacing: "0.1em",
                cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s",
              }}
            >{d}</button>
          ))}
        </div>

        {/* ── Grid ── */}
        {error ? (
          <div className="game-card" style={{ borderColor: "rgba(248,113,113,0.3)", textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#f87171", fontFamily: "var(--font-heading)" }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="game-card" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#64748b", fontFamily: "var(--font-heading)" }}>No modules available yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {filtered.map((module, index) => {
              const hex   = MODULE_HEX[index % MODULE_HEX.length];
              const txtC  = BUTTON_TEXT[index % BUTTON_TEXT.length];
              const diff  = DIFFICULTY_STYLES[module.difficulty] || DIFFICULTY_STYLES.Beginner;
              const isCompleted = completedIds.includes(module.id);

              return (
                <div
                  key={module.id}
                  className="game-card"
                  style={{
                    borderColor: isCompleted ? "rgba(0,255,136,0.4)" : `${hex}33`,
                    background: isCompleted
                      ? "rgba(15,20,15,0.97)"
                      : "rgba(17,17,17,0.97)",
                    backdropFilter: "blur(8px)",
                    display: "flex", flexDirection: "column",
                  }}
                >
                  {/* Image banner */}
                  <div style={{ position: "relative", width: "100%", height: 140, marginBottom: "1rem", borderRadius: "10px 10px 0 0", overflow: "hidden", background: `${hex}22`, borderBottom: `2px solid ${isCompleted ? "rgba(0,255,136,0.5)" : hex}` }}>
                    <img 
                      src={
                        [imgClimate, imgWaste, imgWater, imgEnergy, imgBio, imgAgri, imgUrban, imgCarbon, imgPolicy][index % 9] || modulesIcon
                      } 
                      alt="" 
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isCompleted ? 0.9 : 0.8, transition: "transform 0.3s" }} 
                      className="module-card-img"
                    />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(180deg, transparent 50%, rgba(17,17,17,1) 100%)" }} />
                    
                    {isCompleted && (
                      <div style={{
                        position: "absolute", bottom: 10, left: 10,
                        background: "#00ff88", padding: "2px 8px",
                        borderRadius: 4, display: "flex", alignItems: "center", gap: 4,
                        fontSize: "0.6rem", fontWeight: 900, color: "#080c14",
                        fontFamily: "var(--font-heading)",
                        boxShadow: "0 0 10px rgba(0,255,136,0.8)",
                      }}>
                        <img src={trophyIcon} alt="" style={{ width: 12, height: 12, filter: "brightness(0)" }} />
                        COMPLETED
                      </div>
                    )}
                  </div>

                  {/* Card content wrapper */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    {/* Chips */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      {isCompleted
                        ? <span className="stat-chip chip-green" style={{ fontSize: "0.58rem" }}>COMPLETED</span>
                        : <span className={`stat-chip ${diff.chipClass}`} style={{ fontSize: "0.58rem" }}>{module.difficulty}</span>
                      }
                      <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", color: isCompleted ? "#00ff88" : hex }}>
                        +{module.points} XP
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "var(--font-heading)", fontSize: "0.95rem",
                    color: isCompleted ? "#00ff88" : "#f1f5f9",
                    marginBottom: 8, fontWeight: 700,
                  }}>
                    {module.title}
                  </h2>

                  {/* Description */}
                  <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.6, flex: 1, marginBottom: "1rem" }}>
                    {module.description}
                  </p>

                  {/* XP bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.6rem", color: "#475569", fontFamily: "var(--font-heading)", letterSpacing: "0.08em" }}>
                      {isCompleted ? "FINISHED" : "DIFFICULTY"}
                    </span>
                    <span style={{ fontSize: "0.6rem", color: isCompleted ? "#00ff88" : hex, fontFamily: "var(--font-heading)" }}>
                      {isCompleted ? "100%" : `${diff.pct}%`}
                    </span>
                  </div>
                  <div className="xp-bar-track" style={{ marginBottom: "1.25rem" }}>
                    <div
                      className={isCompleted ? "xp-bar-fill" : `xp-bar-fill ${diff.barClass}`}
                      style={{ width: isCompleted ? "100%" : `${diff.pct}%` }}
                    />
                  </div>

                  {/* Learning focus */}
                  <div style={{
                    background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem",
                  }}>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: "#475569", letterSpacing: "0.1em", marginBottom: 6 }}>
                      LEARNING FOCUS
                    </p>
                    {["Conceptual understanding", "Cause-impact relationships", "Real-world practices", "Quiz reinforcement"].map(item => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: isCompleted ? "#00ff88" : hex, flexShrink: 0 }} />
                        <span style={{ fontSize: "0.73rem", color: "#94a3b8" }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* ── ACTION BUTTON — always clearly visible ── */}
                  {isCompleted ? (
                    <Link
                      to={`/modules/${module.id}`}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "0.7rem 1.5rem",
                        background: "rgba(0,255,136,0.15)",
                        border: "1.5px solid #00ff88",
                        borderRadius: 8,
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
                        color: "#00ff88",
                        textDecoration: "none",
                        textAlign: "center",
                        transition: "all 0.2s",
                        boxShadow: "0 0 12px rgba(0,255,136,0.25)",
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = "rgba(0,255,136,0.28)"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "rgba(0,255,136,0.15)"; }}
                    >
                      <img src={trophyIcon} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />
                      MODULE COMPLETED — REVIEW
                    </Link>
                  ) : (
                    <Link
                      to={`/modules/${module.id}`}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "0.7rem 1.5rem",
                        background: `linear-gradient(135deg, ${hex}, ${hex}cc)`,
                        border: "none",
                        borderRadius: 8,
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em",
                        color: txtC,
                        textDecoration: "none",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: `0 4px 16px ${hex}44`,
                      }}
                      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 24px ${hex}66`; }}
                      onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 16px ${hex}44`; }}
                    >
                      START MODULE
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}