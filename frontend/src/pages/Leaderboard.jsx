import { useEffect, useState } from "react";
import Loader from "../components/ui/Loader";
import api from "../services/api";
import trophyIcon from "../icons/icon_trophy.png";
import leafIcon from "../icons/icon_leaf.png";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setError("You must be logged in to view the leaderboard"); setLoading(false); return; }
        const res = await api.get("/leaderboard");
        const data = Array.isArray(res.data) ? res.data : res.data.leaderboard || [];
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load leaderboard");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <Loader fullScreen text="Loading leaderboard..." />;

  const getTier = (pts) => {
    if (pts >= 500) return { label: "Eco Champion", color: "var(--neon-purple)", chipClass: "chip-purple" };
    if (pts >= 250) return { label: "Planet Protector", color: "var(--neon-gold)", chipClass: "chip-gold" };
    if (pts >= 100) return { label: "Eco Explorer", color: "var(--neon-blue)", chipClass: "chip-blue" };
    return { label: "Eco Starter", color: "var(--neon-green)", chipClass: "chip-green" };
  };

  const rankColors = ["var(--neon-gold)", "#94a3b8", "#cd7c3a"];
  const rankLabels = ["1ST", "2ND", "3RD"];
  const podiumHeights = [200, 160, 140];

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }} className="animate-fadeIn">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <img src={trophyIcon} alt="" style={{ width: 64, height: 64, filter: "drop-shadow(0 0 16px rgba(251,191,36,0.7))" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "#f1f5f9", marginBottom: 8 }}>
            ECO <span style={{ color: "var(--neon-gold)" }} className="glow-gold">LEADERBOARD</span>
          </h1>
          <p style={{ color: "#64748b", fontFamily: "var(--font-heading)", fontSize: "0.78rem", letterSpacing: "0.1em" }}>
            TOP ECO WARRIORS MAKING A DIFFERENCE
          </p>
          <div className="neon-divider" style={{ maxWidth: 300, margin: "1rem auto 0" }} />
        </div>

        {error ? (
          <div className="game-card" style={{ textAlign: "center", borderColor: "rgba(248,113,113,0.3)", padding: "3rem" }}>
            <p style={{ color: "var(--neon-red)", fontFamily: "var(--font-heading)", marginBottom: "1rem" }}>{error}</p>
            <button className="btn-danger" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : users.length === 0 ? (
          <div className="game-card" style={{ textAlign: "center", padding: "3rem" }}>
            <img src={trophyIcon} alt="" style={{ width: 60, opacity: 0.3, margin: "0 auto 1rem" }} />
            <p style={{ color: "#64748b", fontFamily: "var(--font-heading)" }}>No players yet. Be the first!</p>
          </div>
        ) : (
          <>
            {/* ── PODIUM ── */}
            {users.length >= 3 && !isMobile && (
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "1rem", marginBottom: "3rem" }}>
                {[users[1], users[0], users[2]].map((u, i) => {
                  const actualRank = i === 0 ? 1 : i === 1 ? 0 : 2;
                  const h = [podiumHeights[1], podiumHeights[0], podiumHeights[2]][i];
                  const c = [rankColors[1], rankColors[0], rankColors[2]][i];
                  const label = [rankLabels[1], rankLabels[0], rankLabels[2]][i];
                  const tier = getTier(u.eco_points);
                  return (
                    <div key={u.id} style={{ flex: 1, maxWidth: 240, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      {/* Player info above podium */}
                      <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: "50%",
                          background: `linear-gradient(135deg, ${c}33, ${c}11)`,
                          border: `2px solid ${c}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          margin: "0 auto 8px",
                          fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 900, color: c,
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.82rem", color: "#f1f5f9", fontWeight: 700, marginBottom: 4 }}>{u.name}</p>
                        <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: c, fontWeight: 900 }}>{u.eco_points} XP</p>
                      </div>
                      {/* Podium block */}
                      <div style={{
                        width: "100%", height: h,
                        background: `linear-gradient(180deg, ${c}22, ${c}08)`,
                        border: `1px solid ${c}44`,
                        borderBottom: "none",
                        borderRadius: "12px 12px 0 0",
                        display: "flex", alignItems: "flex-start", justifyContent: "center",
                        paddingTop: "1rem",
                      }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 900, color: c }}>{label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── FULL LIST ── */}
            <div className="game-card">
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "#f1f5f9", marginBottom: "1.25rem", letterSpacing: "0.08em" }}>
                FULL RANKINGS
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {users.map((u, i) => {
                  const tier = getTier(u.eco_points);
                  const isTop3 = i < 3;
                  const rankC = isTop3 ? rankColors[i] : "#374151";
                  const maxPts = users[0]?.eco_points || 1;
                  return (
                    <div key={u.id} style={{
                      display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
                      padding: "0.9rem 1.1rem",
                      background: isTop3 ? `linear-gradient(90deg, ${rankColors[i]}08, transparent)` : "var(--bg-dark)",
                      border: `1px solid ${isTop3 ? rankColors[i] + "33" : "var(--bg-border)"}`,
                      borderRadius: 10,
                      transition: "transform 0.2s",
                    }}>
                      {/* Rank number */}
                      <div style={{ width: 36, textAlign: "center", fontFamily: "var(--font-heading)", fontWeight: 900, color: rankC, fontSize: "0.95rem", flexShrink: 0 }}>
                        {isTop3 ? rankLabels[i] : `#${i + 1}`}
                      </div>

                      {/* Avatar */}
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${rankC}33, ${rankC}11)`,
                        border: `1.5px solid ${rankC}66`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-heading)", fontWeight: 900, color: rankC, fontSize: "1rem",
                        flexShrink: 0,
                      }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name + tier + bar */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.88rem", color: "#f1f5f9", fontWeight: 700 }}>{u.name}</span>
                          <span className={`stat-chip ${tier.chipClass}`} style={{ fontSize: "0.58rem" }}>{tier.label}</span>
                        </div>
                        <div className="xp-bar-track" style={{ height: 5 }}>
                          <div className="xp-bar-fill" style={{ width: `${(u.eco_points / maxPts) * 100}%` }} />
                        </div>
                      </div>

                      {/* Points */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, color: tier.color, fontSize: "1.1rem" }}>{u.eco_points}</p>
                        <p style={{ fontSize: "0.6rem", color: "#475569", fontFamily: "var(--font-heading)", letterSpacing: "0.08em" }}>XP</p>
                      </div>
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