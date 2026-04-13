import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import modulesIcon from "../../icons/icon_modules.png";
import challengeIcon from "../../icons/icon_challenge.png";
import trophyIcon from "../../icons/icon_trophy.png";
import badgeIcon from "../../icons/icon_badge.png";
import leafIcon from "../../icons/icon_leaf.png";

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  useEffect(() => {
    // Teachers get the command center — no stats needed
    if (!user || isTeacher) { setLoading(false); return; }
    const fetchData = async () => {
      try {
        const modulesRes = await api.get("/modules");
        setModules(modulesRes.data || []);
        try {
          const statsRes = await api.get("/users/dashboard");
          setStats(statsRes.data);
          if (updateUser && statsRes.data.eco_points !== undefined) {
             updateUser({ eco_points: statsRes.data.eco_points });
          }
        } catch {

          setStats({ eco_points: user?.eco_points || 0, quizzes_completed: 0, modules_completed: 0, challenges_completed: 0, challenges_submitted: 0, badges: [] });
        }
      } catch {
        setStats({ eco_points: user?.eco_points || 0, quizzes_completed: 0, modules_completed: 0, challenges_completed: 0, challenges_submitted: 0, badges: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isTeacher]);

  if (loading) return <Loader fullScreen text="Loading dashboard..." />;

  const ecoPoints = stats?.eco_points || user?.eco_points || 0;
  const badges = stats?.badges || [];
  const modulesDone = stats?.modules_completed || 0;
  const challengesSubmitted = stats?.challenges_submitted || 0;
  const challengesDone = stats?.challenges_completed || 0;

  const allBadgeTiers = [
    { name: "Eco Starter", desc: "10 eco points", pts: 10 },
    { name: "Rising Green", desc: "50 eco points", pts: 50 },
    { name: "Eco Explorer", desc: "100 eco points", pts: 100 },
    { name: "Planet Protector", desc: "250 eco points", pts: 250 },
    { name: "Eco Champion", desc: "500 eco points", pts: 500 },
    { name: "Sustainability Hero", desc: "1000 eco points", pts: 1000 },
  ];

  const maxPoints = 1000;
  const xpPercent = Math.min(100, (ecoPoints / maxPoints) * 100);
  const level = ecoPoints >= 1000 ? 6 : ecoPoints >= 500 ? 5 : ecoPoints >= 250 ? 4 : ecoPoints >= 100 ? 3 : ecoPoints >= 50 ? 2 : ecoPoints >= 10 ? 1 : 0;

  const isAdmin = isTeacher;

  // ── TEACHER / ADMIN VIEW ──
  if (isAdmin) {
    const TEACHER_ACTIONS = [
      {
        label: "View Submissions",
        sub: "Review student challenge proofs",
        to: "/submissions",
        color: "#00ff88",
        icon: challengeIcon,
      },
      {
        label: "Leaderboard",
        sub: "See student rankings & XP",
        to: "/leaderboard",
        color: "#38bdf8",
        icon: trophyIcon,
      },
      {
        label: "Manage Modules",
        sub: "Browse all learning modules",
        to: "/modules",
        color: "#a855f7",
        icon: modulesIcon,
      },
      {
        label: "Admin Panel",
        sub: "User management & settings",
        to: "/admin",
        color: "#fbbf24",
        icon: badgeIcon,
      },
      {
        label: "AR Scan",
        sub: "Launch the AR scanner tool",
        to: null,
        href: "/ar/scan.html",
        color: "#34d399",
        icon: leafIcon,
      },
      {
        label: "Profile",
        sub: "Edit your account details",
        to: "/profile",
        color: "#fb923c",
        icon: leafIcon,
      },
    ];

    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#e2e8f0", padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }} className="animate-fadeIn">
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #00ff88, #22c55e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 900,
              color: "#080c14", boxShadow: "0 0 28px rgba(0,255,136,0.4)", flexShrink: 0,
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "#f1f5f9" }}>
                WELCOME, <span style={{ color: "#00ff88" }} className="glow-green">{user?.name?.toUpperCase()}</span>
              </h1>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: "#00ff88", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", padding: "2px 10px", borderRadius: 4, letterSpacing: "0.1em" }}>
                  {user?.role?.toUpperCase()}
                </span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid #222", padding: "2px 10px", borderRadius: 4, letterSpacing: "0.1em" }}>
                  {user?.institution}
                </span>
              </div>
            </div>
          </div>

          {/* Divider label */}
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", color: "#475569", letterSpacing: "0.15em", marginBottom: "1.25rem" }}>
            COMMAND CENTER — SELECT AN ACTION
          </p>

          {/* Action grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.1rem" }}>
            {TEACHER_ACTIONS.map((action, i) => {
              const CardContent = (
                <div
                  style={{
                    background: "#111",
                    border: `1px solid ${action.color}22`,
                    borderRadius: 18,
                    padding: "1.75rem",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    display: "flex", alignItems: "center", gap: "1.25rem",
                    position: "relative", overflow: "hidden",
                    textDecoration: "none", color: "inherit",
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 8px 32px ${action.color}22`;
                    e.currentTarget.style.borderColor = `${action.color}44`;
                    e.currentTarget.style.background = `linear-gradient(135deg, ${action.color}0a, #111)`;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = `${action.color}22`;
                    e.currentTarget.style.background = "#111";
                  }}
                >
                  {/* Top accent */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${action.color}88, transparent)` }} />

                  {/* Icon box */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: `${action.color}15`, border: `1px solid ${action.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <img src={action.icon} alt="" style={{ width: 28, height: 28, objectFit: "contain", filter: `drop-shadow(0 0 6px ${action.color}66)` }} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>
                      {action.label}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>{action.sub}</p>
                  </div>

                  {/* Arrow */}
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: action.color, opacity: 0.7 }}>&rarr;</span>
                </div>
              );

              return action.href ? (
                <a key={i} href={action.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  {CardContent}
                </a>
              ) : (
                <Link key={i} to={action.to} style={{ textDecoration: "none" }}>
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* ── PLAYER CARD ── */}
        <div className="game-card animate-fadeIn" style={{
          background: "linear-gradient(135deg, #0d1f0d 0%, var(--bg-card) 100%)",
          border: "1px solid rgba(0,255,136,0.25)",
          marginBottom: "2rem",
          padding: "2rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80,
              background: "linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.05))",
              border: "2px solid var(--neon-green)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "var(--glow-green)",
              flexShrink: 0,
            }}>
              <img src={leafIcon} alt="" style={{ width: 48, height: 48, objectFit: "contain" }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
                <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", color: "#f1f5f9" }}>{user?.name}</h1>
                <span className="stat-chip chip-green">LVL {level}</span>
                <span className="stat-chip chip-blue" style={{ fontSize: "0.62rem" }}>{user?.institution}</span>
                {user?.role === "teacher" || user?.role === "admin"
                  ? <span className="stat-chip chip-purple">Teacher</span>
                  : <span className="stat-chip chip-purple">Student</span>}
              </div>
              <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: "0.75rem", fontFamily: "var(--font-heading)", letterSpacing: "0.06em" }}>
                XP Progress to next level
              </p>
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "var(--font-heading)" }}>{ecoPoints} XP</span>
                <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "var(--font-heading)" }}>1000 XP</span>
              </div>
            </div>

            {/* Points display */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "3rem", fontWeight: 900, color: "var(--neon-green)", lineHeight: 1 }} className="glow-green">
                {ecoPoints}
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Eco Points
              </p>
            </div>
          </div>
        </div>

        {/* ── STATS GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          {[
            { icon: modulesIcon, label: "Modules Completed", value: modulesDone, color: "var(--neon-blue)", chipClass: "chip-blue" },
            { icon: challengeIcon, label: "Challenges Submitted", value: challengesSubmitted, sub: challengesDone > 0 ? `${challengesDone} approved` : null, color: "var(--neon-purple)", chipClass: "chip-purple" },
            { icon: trophyIcon, label: "Badges Earned", value: badges.length, color: "var(--neon-gold)", chipClass: "chip-gold" },
            { icon: badgeIcon, label: "Eco Points", value: ecoPoints, color: "var(--neon-green)", chipClass: "chip-green" },
          ].map((s) => (
            <div key={s.label} className="game-card" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem" }}>
              <div style={{
                width: 52, height: 52,
                background: `${s.color}18`,
                border: `1px solid ${s.color}33`,
                borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <img src={s.icon} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 900, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: "0.73rem", color: "#64748b", fontFamily: "var(--font-heading)", letterSpacing: "0.06em", marginTop: 2 }}>
                  {s.label}
                </p>
                {s.sub && <p style={{ fontSize: "0.65rem", color: "#22c55e", marginTop: 2 }}>{s.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* ── BADGES ── */}
        <div className="game-card game-card-gold" style={{ marginBottom: "2rem" }}>
          <h2 className="game-section-title" style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Badges</h2>
          <p className="game-section-sub">Complete missions to earn achievements</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
            {allBadgeTiers.map((b) => {
              const earned = badges.some(badge => badge.name?.includes(b.name.split(" ")[1] || b.name.split(" ")[0])) || ecoPoints >= b.pts;
              const pct = Math.min(100, (ecoPoints / b.pts) * 100);
              return (
                <div key={b.name} style={{
                  background: earned ? "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.04))" : "var(--bg-dark)",
                  border: `1px solid ${earned ? "rgba(251,191,36,0.3)" : "var(--bg-border)"}`,
                  borderRadius: 12,
                  padding: "1rem",
                  opacity: earned ? 1 : 0.65,
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <img
                    src={badgeIcon}
                    alt=""
                    style={{
                      width: 40, height: 40, objectFit: "contain", marginBottom: 8,
                      filter: earned ? "drop-shadow(0 0 8px rgba(251,191,36,0.7))" : "grayscale(1) opacity(0.4)",
                    }}
                  />
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.78rem", color: earned ? "var(--neon-gold)" : "#94a3b8", fontWeight: 700, marginBottom: 4 }}>
                    {b.name}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: "#64748b" }}>{b.desc}</p>
                  {!earned && (
                    <div style={{ marginTop: 8 }}>
                      <div className="xp-bar-track" style={{ height: 4 }}>
                        <div className="xp-bar-fill xp-bar-fill-gold" style={{ width: `${pct}%` }} />
                      </div>
                      <p style={{ fontSize: "0.6rem", color: "#475569", marginTop: 3, fontFamily: "var(--font-heading)" }}>
                        {ecoPoints}/{b.pts} XP
                      </p>
                    </div>
                  )}
                  {earned && (
                    <div className="stat-chip chip-gold" style={{ marginTop: 8, fontSize: "0.58rem" }}>UNLOCKED</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="game-card" style={{ marginBottom: "2rem" }}>
          <h2 className="game-section-title" style={{ fontSize: "1.1rem", marginBottom: "1.25rem" }}>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {[
              { to: "/modules", icon: modulesIcon, label: "Learn Modules", sub: "Study & earn XP", color: "var(--neon-blue)" },
              { to: "/challenges", icon: challengeIcon, label: "Eco Challenges", sub: "Act & earn points", color: "var(--neon-purple)" },
              { to: "/leaderboard", icon: trophyIcon, label: "Leaderboard", sub: "Check your rank", color: "var(--neon-gold)" },
            ].map((a) => (
              <Link key={a.to} to={a.to} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 12, padding: "1.5rem 1rem", textAlign: "center",
                background: `${a.color}0a`,
                border: `1px solid ${a.color}22`,
                borderRadius: 14,
                textDecoration: "none",
                transition: "all 0.25s",
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = a.color + "55"; e.currentTarget.style.background = a.color + "18"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = a.color + "22"; e.currentTarget.style.background = a.color + "0a"; }}
              >
                <img src={a.icon} alt="" style={{ width: 44, height: 44, objectFit: "contain", filter: `drop-shadow(0 0 8px ${a.color}88)` }} />
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.82rem", color: "#f1f5f9", fontWeight: 700 }}>{a.label}</p>
                  <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>{a.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── MODULES ── */}
        {modules.length > 0 && (
          <div className="game-card">
            <h2 className="game-section-title" style={{ fontSize: "1.1rem", marginBottom: "1.25rem" }}>
              Available Modules <span style={{ color: "var(--neon-green)", fontSize: "0.9rem" }}>({modules.length})</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {modules.map((m) => (
                <Link key={m.id} to={`/modules/${m.id}`} style={{
                  display: "block", padding: "1.25rem",
                  background: "var(--bg-dark)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; e.currentTarget.style.transform = "none"; }}
                >
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", color: "#e2e8f0", fontWeight: 700, marginBottom: 6 }}>{m.title}</p>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5, marginBottom: 12,
                    overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {m.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="stat-chip chip-blue" style={{ fontSize: "0.6rem" }}>{m.difficulty}</span>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.72rem", color: "var(--neon-green)", fontWeight: 700 }}>+{m.points} XP</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}