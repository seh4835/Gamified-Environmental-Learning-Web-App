import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserSubmissions } from "../../services/api";
import leafIcon from "../../icons/icon_leaf.png";
import trophyIcon from "../../icons/icon_trophy.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === "teacher" || user?.role === "admin";
  const isStudent = user && !isAdmin;

  const navLinkClass = ({ isActive }) =>
    `nav-link${isActive ? " nav-link-active" : ""}`;

  // Fetch student submission status
  useEffect(() => {
    if (!isStudent) return;
    const fetchSubs = async () => {
      try {
        const res = await getUserSubmissions();
        setSubmissions(res.data);
      } catch { /* silent */ }
    };
    fetchSubs();
    // Refresh every 60s
    const interval = setInterval(fetchSubs, 60000);
    return () => clearInterval(interval);
  }, [isStudent]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pendingCount  = submissions.filter(s => s.status === "pending").length;
  const approvedCount = submissions.filter(s => s.status === "approved" || s.status === "Approved").length;
  const rejectedCount = submissions.filter(s => s.status === "rejected" || s.status === "Rejected").length;

  const statusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved") return { color: "#00ff88", bg: "rgba(0,255,136,0.12)", border: "rgba(0,255,136,0.3)" };
    if (s === "rejected") return { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)" };
    return { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)" };
  };

  return (
    <nav style={{
      background: "rgba(0,0,0,0.97)",
      borderBottom: "1px solid rgba(0,255,136,0.12)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", height: 64, gap: 24 }}>

          {/* LOGO */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src={leafIcon} alt="EcoLearn" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <span style={{
              fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 800,
              color: "var(--neon-green)", letterSpacing: "0.08em",
              textShadow: "0 0 12px rgba(0,255,136,0.5)",
            }}>ECOLEARN</span>
          </Link>

          {/* CENTER NAV */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }} className="hidden-mobile">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>

            {!isAdmin && (
              <>
                <NavLink to="/modules" className={navLinkClass}>Modules</NavLink>
                <NavLink to="/challenges" className={navLinkClass}>Challenges</NavLink>
              </>
            )}

            <NavLink to="/leaderboard" className={navLinkClass}>Leaderboard</NavLink>

            <a href="/ar/scan.html" target="_blank" rel="noopener noreferrer" className="nav-link">
              AR Scan
            </a>

            {isAdmin && (
              <>
                <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                <NavLink to="/submissions" className={navLinkClass}>Submissions</NavLink>
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
            {!user ? (
              <>
                <NavLink to="/login" className="nav-link">Login</NavLink>
                <Link to="/register" className="btn-primary" style={{ fontSize: "0.7rem", padding: "0.5rem 1.1rem" }}>
                  Register
                </Link>
              </>
            ) : (
              <>
                {!isAdmin && (
                  <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                )}
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>

                {/* ── STUDENT SUBMISSION STATUS BELL ── */}
                {isStudent && submissions.length > 0 && (
                  <div ref={dropdownRef} style={{ position: "relative" }}>
                    <button
                      onClick={() => setStatusOpen(o => !o)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "5px 10px",
                        background: pendingCount > 0 ? "rgba(251,191,36,0.12)" : "rgba(0,255,136,0.08)",
                        border: `1px solid ${pendingCount > 0 ? "rgba(251,191,36,0.4)" : "rgba(0,255,136,0.25)"}`,
                        borderRadius: 6, cursor: "pointer",
                        fontFamily: "var(--font-heading)", fontSize: "0.62rem",
                        color: pendingCount > 0 ? "#fbbf24" : "#00ff88",
                        letterSpacing: "0.06em",
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                    >
                      MISSIONS
                      {/* Notification dot */}
                      {pendingCount > 0 && (
                        <span style={{
                          position: "absolute", top: -5, right: -5,
                          width: 16, height: 16,
                          background: "#fbbf24", borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.5rem", fontWeight: 900, color: "#080c14",
                          fontFamily: "var(--font-heading)",
                          boxShadow: "0 0 8px rgba(251,191,36,0.7)",
                        }}>{pendingCount}</span>
                      )}
                    </button>

                    {/* Dropdown panel */}
                    {statusOpen && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 8px)", right: 0,
                        width: 300,
                        background: "#0a0a0a",
                        border: "1px solid #222",
                        borderRadius: 14,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,255,136,0.04)",
                        overflow: "hidden",
                        zIndex: 200,
                      }}>
                        {/* Header */}
                        <div style={{
                          padding: "0.85rem 1rem",
                          borderBottom: "1px solid #1a1a1a",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                          <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.68rem", color: "#f1f5f9", letterSpacing: "0.1em" }}>
                            MY SUBMISSIONS
                          </span>
                          <div style={{ display: "flex", gap: 6 }}>
                            {approvedCount > 0 && (
                              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: "#00ff88", background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.25)", padding: "1px 7px", borderRadius: 3 }}>
                                {approvedCount} APPROVED
                              </span>
                            )}
                            {pendingCount > 0 && (
                              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: "#fbbf24", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", padding: "1px 7px", borderRadius: 3 }}>
                                {pendingCount} PENDING
                              </span>
                            )}
                            {rejectedCount > 0 && (
                              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: "#f87171", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)", padding: "1px 7px", borderRadius: 3 }}>
                                {rejectedCount} REJECTED
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Submission rows */}
                        <div style={{ maxHeight: 280, overflowY: "auto" }}>
                          {submissions.map((sub, i) => {
                            const sc = statusColor(sub.status);
                            return (
                              <div key={sub.id || i} style={{
                                padding: "0.75rem 1rem",
                                borderBottom: "1px solid #111",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                gap: 8,
                              }}>
                                <div>
                                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", color: "#e2e8f0", fontWeight: 600 }}>
                                    {sub.module || `Challenge #${sub.challenge_id}`}
                                  </p>
                                  <p style={{ fontSize: "0.62rem", color: "#475569", marginTop: 2, fontFamily: "var(--font-heading)" }}>
                                    {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : ""}
                                  </p>
                                </div>
                                <span style={{
                                  fontFamily: "var(--font-heading)", fontSize: "0.58rem",
                                  color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
                                  padding: "2px 8px", borderRadius: 4, letterSpacing: "0.06em",
                                  whiteSpace: "nowrap", flexShrink: 0,
                                }}>
                                  {sub.status?.toUpperCase()}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Footer link */}
                        <div style={{ padding: "0.6rem 1rem", borderTop: "1px solid #1a1a1a", textAlign: "center" }}>
                          <Link
                            to="/submissions"
                            onClick={() => setStatusOpen(false)}
                            style={{ fontFamily: "var(--font-heading)", fontSize: "0.62rem", color: "#64748b", textDecoration: "none", letterSpacing: "0.08em" }}
                            onMouseOver={e => { e.currentTarget.style.color = "#00ff88"; }}
                            onMouseOut={e => { e.currentTarget.style.color = "#64748b"; }}
                          >
                            VIEW ALL SUBMISSIONS &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* User info chip — blue for teachers, green for students */}
                <div style={{
                  padding: "4px 14px",
                  background: isAdmin ? "rgba(56,189,248,0.06)" : "rgba(0,255,136,0.06)",
                  border: `1px solid ${isAdmin ? "rgba(56,189,248,0.2)" : "rgba(0,255,136,0.15)"}`,
                  borderRadius: 6,
                  display: "flex", flexDirection: "column", alignItems: "flex-end",
                  lineHeight: 1.3,
                }}>
                  <span style={{ fontSize: "0.6rem", color: "#64748b", fontFamily: "var(--font-heading)", letterSpacing: "0.06em" }}>
                    {user.institution || (isAdmin ? "Educator" : "Player")}
                  </span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: isAdmin ? "#38bdf8" : "var(--neon-green)", fontFamily: "var(--font-heading)" }}>
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={logout}
                  style={{
                    padding: "0.45rem 1rem", background: "transparent",
                    border: "1px solid rgba(248,113,113,0.4)", borderRadius: 6,
                    color: "#f87171", fontFamily: "var(--font-heading)", fontSize: "0.65rem",
                    fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}