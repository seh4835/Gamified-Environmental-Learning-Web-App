import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import badgeIcon from "../../icons/icon_badge.png";
import trophyIcon from "../../icons/icon_trophy.png";

const BADGE_TIERS = [
  { name: "Eco Starter", pts: 50, color: "#34d399" },
  { name: "Green Learner", pts: 150, color: "#00ff88" },
  { name: "Sustainability Pro", pts: 300, color: "#38bdf8" },
  { name: "Eco Champion", pts: 600, color: "#fbbf24" },
  { name: "Planet Guardian", pts: 900, color: "#a855f7" },
  { name: "Sustainability Hero", pts: 1200, color: "#f87171" },
];

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", institution: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({ name: authUser.name, institution: authUser.institution });
    }
  }, [authUser]);

  const handleUpdate = async () => {
    try {
      await api.put("/users/update", formData);
      setUser({ ...user, ...formData });
      setEditMode(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error("Update failed:", err); }
  };

  if (loading || !user) return <Loader fullScreen text="Loading profile..." />;

  const isTeacher = user.role === "teacher" || user.role === "admin";
  const pts = isTeacher ? 0 : (user.eco_points || 0);
  const progress = Math.min((pts / 1200) * 100, 100);
  const nextTier = BADGE_TIERS.find(b => pts < b.pts);
  const earnedTiers = BADGE_TIERS.filter(b => pts >= b.pts);

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "2.5rem 1.5rem", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }} className="animate-fadeIn">
          <div style={{
            width: 52, height: 52,
            background: isTeacher ? "rgba(56,189,248,0.12)" : "rgba(0,255,136,0.12)",
            border: `1px solid ${isTeacher ? "rgba(56,189,248,0.3)" : "rgba(0,255,136,0.3)"}`,
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 900,
            color: isTeacher ? "#38bdf8" : "#00ff88",
          }}>
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "#f1f5f9" }}>
              MY <span style={{ color: isTeacher ? "#38bdf8" : "#00ff88" }}>PROFILE</span>
            </h1>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.68rem", color: "#64748b", letterSpacing: "0.1em" }}>
              PLAYER STATS &amp; ACCOUNT SETTINGS
            </p>
          </div>
          {saved && (
            <span style={{
              marginLeft: "auto", fontFamily: "var(--font-heading)", fontSize: "0.65rem",
              color: "#00ff88", background: "rgba(0,255,136,0.1)",
              border: "1px solid rgba(0,255,136,0.3)", padding: "4px 12px", borderRadius: 6,
            }}>PROFILE SAVED</span>
          )}
        </div>

        {/* ── Player Card ── */}
        <div style={{
          background: isTeacher
            ? "linear-gradient(135deg, rgba(56,189,248,0.07), #111)"
            : "linear-gradient(135deg, rgba(0,255,136,0.07), #111)",
          border: `1px solid ${isTeacher ? "rgba(56,189,248,0.2)" : "rgba(0,255,136,0.2)"}`,
          borderRadius: 20, padding: "2rem", marginBottom: "1.25rem",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${isTeacher ? "#38bdf8" : "#00ff88"}, transparent)`,
          }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {/* Avatar */}
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: isTeacher
                  ? "linear-gradient(135deg, #38bdf8, #0ea5e9)"
                  : "linear-gradient(135deg, #00ff88, #22c55e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 900,
                color: "#080c14",
                boxShadow: isTeacher ? "0 0 24px rgba(56,189,248,0.4)" : "0 0 24px rgba(0,255,136,0.4)",
                flexShrink: 0,
              }}>
                {user.name?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                {editMode ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="game-input"
                      style={{ width: 220 }}
                      placeholder="Your name"
                    />
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={e => setFormData({ ...formData, institution: e.target.value })}
                      className="game-input"
                      style={{ width: 220 }}
                      placeholder="Institution"
                    />
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "#f1f5f9", fontWeight: 700 }}>
                      {user.name}
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.82rem", marginTop: 4 }}>{user.email}</p>
                    <p style={{ color: "#94a3b8", fontSize: "0.78rem", marginTop: 2 }}>{user.institution}</p>
                  </>
                )}
              </div>
            </div>

            {/* Role chip */}
            <span style={{
              fontFamily: "var(--font-heading)", fontSize: "0.65rem",
              color: isTeacher ? "#38bdf8" : "#00ff88",
              background: isTeacher ? "rgba(56,189,248,0.12)" : "rgba(0,255,136,0.12)",
              border: `1px solid ${isTeacher ? "rgba(56,189,248,0.3)" : "rgba(0,255,136,0.3)"}`,
              padding: "4px 14px", borderRadius: 6, letterSpacing: "0.1em",
              alignSelf: "flex-start",
            }}>
              {user.role?.toUpperCase()}
            </span>
          </div>

          {/* Edit buttons */}
          <div style={{ marginTop: "1.5rem", display: "flex", gap: 10 }}>
            {editMode ? (
              <>
                <button onClick={handleUpdate} className="btn-primary" style={{ padding: "0.5rem 1.4rem", fontSize: "0.72rem" }}>
                  SAVE CHANGES
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  style={{
                    padding: "0.5rem 1.2rem", background: "transparent",
                    border: "1px solid #333", borderRadius: 8, color: "#64748b",
                    fontFamily: "var(--font-heading)", fontSize: "0.72rem", cursor: "pointer",
                  }}
                >CANCEL</button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  padding: "0.5rem 1.4rem", background: "transparent",
                  border: `1px solid ${isTeacher ? "rgba(56,189,248,0.3)" : "rgba(0,255,136,0.3)"}`,
                  borderRadius: 8, color: isTeacher ? "#38bdf8" : "#00ff88",
                  fontFamily: "var(--font-heading)", fontSize: "0.72rem",
                  letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseOver={e => { e.currentTarget.style.background = isTeacher ? "rgba(56,189,248,0.1)" : "rgba(0,255,136,0.1)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
              >EDIT PROFILE</button>
            )}
          </div>
        </div>

        {/* ── Student-only: Stats + Badges ── */}
        {!isTeacher && (
          <>
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.62rem", color: "#475569", letterSpacing: "0.1em", marginBottom: 8 }}>
                  ECO POINTS
                </p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 900, color: "#00ff88", lineHeight: 1 }} className="glow-green">
                    {pts}
                  </p>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", color: "#64748b", marginBottom: 4 }}>XP</span>
                </div>
                {nextTier && (
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.62rem", color: "#475569", marginTop: 8 }}>
                    {nextTier.pts - pts} XP to <span style={{ color: nextTier.color }}>{nextTier.name}</span>
                  </p>
                )}
              </div>

              <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.62rem", color: "#475569", letterSpacing: "0.1em", marginBottom: 16 }}>
                  SUSTAINABILITY PROGRESS
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: "#475569" }}>ECO STARTER</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: "#fbbf24" }}>HERO</span>
                </div>
                <div className="xp-bar-track" style={{ height: 12, marginBottom: 8 }}>
                  <div className="xp-bar-fill" style={{ width: `${progress}%`, transition: "width 0.8s ease" }} />
                </div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.62rem", color: "#64748b" }}>
                  {Math.round(progress)}% towards Sustainability Hero
                </p>
              </div>
            </div>

            {/* Badges */}
            <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
                <img src={badgeIcon} alt="" style={{ width: 28, height: 28, objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(251,191,36,0.6))" }} />
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "#f1f5f9", fontWeight: 700 }}>
                  ACHIEVEMENTS &amp; BADGES
                </h3>
                {earnedTiers.length > 0 && (
                  <span style={{
                    marginLeft: "auto", fontFamily: "var(--font-heading)", fontSize: "0.6rem",
                    color: "#fbbf24", background: "rgba(251,191,36,0.1)",
                    border: "1px solid rgba(251,191,36,0.25)", padding: "2px 10px", borderRadius: 4,
                  }}>{earnedTiers.length}/{BADGE_TIERS.length} UNLOCKED</span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.9rem" }}>
                {BADGE_TIERS.map((badge, i) => {
                  const earned = pts >= badge.pts;
                  return (
                    <div key={i} style={{
                      background: earned ? `${badge.color}0d` : "#0a0a0a",
                      border: `1px solid ${earned ? `${badge.color}33` : "#1a1a1a"}`,
                      borderRadius: 12, padding: "1rem 0.75rem", textAlign: "center",
                      transition: "all 0.2s", opacity: earned ? 1 : 0.5,
                    }}>
                      <img src={trophyIcon} alt="" style={{
                        width: 36, height: 36, objectFit: "contain", margin: "0 auto 8px",
                        filter: earned ? `drop-shadow(0 0 8px ${badge.color}88)` : "grayscale(1)",
                      }} />
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", color: earned ? badge.color : "#475569", fontWeight: 700, marginBottom: 4 }}>
                        {badge.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: earned ? "#64748b" : "#333", letterSpacing: "0.08em" }}>
                        {earned ? "UNLOCKED" : `${badge.pts} XP`}
                      </p>
                      {!earned && (
                        <div style={{ marginTop: 6, height: 3, background: "#1a1a1a", borderRadius: 2 }}>
                          <div style={{
                            height: "100%", width: `${Math.min((pts / badge.pts) * 100, 100)}%`,
                            background: badge.color, borderRadius: 2, opacity: 0.6,
                          }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}