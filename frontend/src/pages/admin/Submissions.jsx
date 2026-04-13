import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import challengeIcon from "../../icons/icon_challenge.png";
import { CHALLENGES } from "../Challenges";

const STATUS_STYLES = {
  Approved: { chipClass: "chip-green",  label: "Approved" },
  Pending:  { chipClass: "chip-gold",   label: "Pending" },
  Rejected: { chipClass: "chip-red",    label: "Rejected" },
  "Not Submitted": { chipClass: "chip-blue", label: "Not Submitted" },
};

export default function Submissions() {
  const { user } = useAuth();
  const isAdmin = user?.role === "teacher" || user?.role === "admin";

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchSubmissions(); }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get("/challenges/submissions");
      setSubmissions(res.data);
    } catch (err) { console.error("Error:", err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      await api.put(`/challenges/submissions/${id}`, { status });
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch (err) { console.error("Error:", err); }
    finally { setActionLoading(null); }
  };

  if (loading) return <Loader fullScreen text="Loading submissions..." />;

  const displaySubmissions = isAdmin ? submissions : CHALLENGES.map(c => {
    const sub = submissions.find(s => s.module === c.module);
    if (sub) return sub;
    return {
      id: "unsub-" + c.module,
      module: c.module,
      task: c.task,
      status: "Not Submitted",
      points: c.pts,
      created_at: "—"
    };
  });

  const filtered = displaySubmissions.filter(s => filter === "All" || s.status === filter);
  const counts = {
    All: displaySubmissions.length,
    Pending: displaySubmissions.filter(s => s.status === "Pending").length,
    Approved: displaySubmissions.filter(s => s.status === "Approved").length,
    Rejected: displaySubmissions.filter(s => s.status === "Rejected").length,
  };
  if (!isAdmin) {
    counts["Not Submitted"] = displaySubmissions.filter(s => s.status === "Not Submitted").length;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }} className="animate-fadeIn">
          <img src={challengeIcon} alt="" style={{ width: 52, height: 52, filter: "drop-shadow(0 0 12px rgba(168,85,247,0.7))" }} />
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "#f1f5f9" }}>
              {isAdmin ? "MANAGE " : "MY "}<span style={{ color: "var(--neon-purple)" }} className="glow-purple">SUBMISSIONS</span>
            </h1>
            <p style={{ color: "#64748b", fontFamily: "var(--font-heading)", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
              {isAdmin ? "REVIEW & APPROVE STUDENT CHALLENGE PROOFS" : "TRACK YOUR CHALLENGE SUBMISSIONS & REWARDS"}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {Object.entries(counts).map(([k, v]) => (
            <div key={k} className="game-card" style={{ textAlign: "center", padding: "1rem" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 900, color: k === "Approved" ? "var(--neon-green)" : k === "Pending" ? "var(--neon-gold)" : k === "Rejected" ? "var(--neon-red)" : "#f1f5f9", lineHeight: 1 }}>{v}</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{k}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {(isAdmin ? ["All", "Pending", "Approved", "Rejected"] : ["All", "Not Submitted", "Pending", "Approved", "Rejected"]).map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} style={{
              padding: "0.4rem 1rem",
              borderRadius: 6,
              border: `1px solid ${filter === tab ? "var(--neon-green)" : "var(--bg-border)"}`,
              background: filter === tab ? "rgba(0,255,136,0.12)" : "transparent",
              color: filter === tab ? "var(--neon-green)" : "#64748b",
              fontFamily: "var(--font-heading)",
              fontSize: "0.68rem", letterSpacing: "0.1em",
              cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s",
            }}>{tab} ({counts[tab]})</button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="game-card" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#64748b", fontFamily: "var(--font-heading)" }}>No submissions found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {filtered.map(sub => {
              const st = STATUS_STYLES[sub.status] || STATUS_STYLES.Pending;
              return (
                <div key={sub.id} className="game-card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {/* Header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "#f1f5f9", fontWeight: 700, flex: 1 }}>
                      {sub.module}
                    </h2>
                    <span className={`stat-chip ${st.chipClass}`} style={{ fontSize: "0.6rem", flexShrink: 0 }}>{st.label}</span>
                  </div>

                  {isAdmin && (
                    <p style={{ fontSize: "0.78rem", color: "var(--neon-blue)", fontFamily: "var(--font-heading)", letterSpacing: "0.06em" }}>
                      Student: {sub.user}
                    </p>
                  )}

                  {sub.task && (
                    <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>{sub.task}</p>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.68rem", color: sub.status === "Approved" ? "var(--neon-green)" : "#64748b" }}>
                      {sub.status === "Approved" ? `+${sub.points || 50} XP AWARDED` : sub.points > 0 ? `${sub.points} XP` : "Pending Review"}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "#374151", fontFamily: "var(--font-heading)" }}>
                      {sub.created_at}
                    </span>
                  </div>

                  {!isAdmin && sub.status === "Not Submitted" && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <Link to="/challenges" style={{
                        display: "inline-block", background: "rgba(56,189,248,0.1)",
                        border: "1px solid rgba(56,189,248,0.3)", borderRadius: 6,
                        color: "#38bdf8", padding: "0.4rem 1rem", fontSize: "0.68rem",
                        fontFamily: "var(--font-heading)", textDecoration: "none",
                        letterSpacing: "0.1em", transition: "all 0.2s"
                      }}
                      onMouseOver={e => e.currentTarget.style.background="rgba(56,189,248,0.2)"}
                      onMouseOut={e => e.currentTarget.style.background="rgba(56,189,248,0.1)"}
                      >
                        START MISSION &rarr;
                      </Link>
                    </div>
                  )}

                  {/* Admin approve/reject */}
                  {isAdmin && sub.status === "Pending" && (
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: 4 }}>
                      <button
                        onClick={() => updateStatus(sub.id, "Approved")}
                        disabled={actionLoading === sub.id + "Approved"}
                        className="btn-primary"
                        style={{ flex: 1, justifyContent: "center", padding: "0.5rem", fontSize: "0.68rem",
                          opacity: actionLoading === sub.id + "Approved" ? 0.7 : 1 }}
                      >
                        {actionLoading === sub.id + "Approved" ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => updateStatus(sub.id, "Rejected")}
                        disabled={actionLoading === sub.id + "Rejected"}
                        className="btn-danger"
                        style={{ flex: 1, justifyContent: "center", padding: "0.5rem", fontSize: "0.68rem",
                          opacity: actionLoading === sub.id + "Rejected" ? 0.7 : 1 }}
                      >
                        {actionLoading === sub.id + "Rejected" ? "..." : "Reject"}
                      </button>
                    </div>
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