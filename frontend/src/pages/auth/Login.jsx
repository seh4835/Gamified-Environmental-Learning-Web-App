import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";
import leafIcon from "../../icons/icon_leaf.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(formData);
      if (res.success) navigate("/dashboard");
      else setError(res.message);
    } catch (err) {
      setError(err?.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen text="Logging in..." />;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-deep)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(0,255,136,0.05) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)",
    }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src={leafIcon} alt="EcoLearn" style={{ width: 64, height: 64, objectFit: "contain", filter: "drop-shadow(0 0 16px rgba(0,255,136,0.7))", marginBottom: 12 }} />
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--neon-green)", letterSpacing: "0.1em" }} className="glow-green">
            ECOLEARN
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "var(--font-heading)", letterSpacing: "0.08em", marginTop: 4 }}>
            CONTINUE YOUR ECO QUEST
          </p>
        </div>

        {/* Card */}
        <div className="game-card" style={{ padding: "clamp(1rem, 4vw, 2.5rem)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#f1f5f9", marginBottom: "0.25rem" }}>Welcome Back</h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.75rem" }}>Sign in to continue your sustainability journey.</p>

          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              color: "var(--neon-red)",
              fontSize: "0.82rem",
              marginBottom: "1.25rem",
              fontFamily: "var(--font-body)",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontSize: "0.68rem", color: "#64748b", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className="game-input"
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontSize: "0.68rem", color: "#64748b", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                PASSWORD
              </label>
              <input
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                placeholder="Enter your password"
                className="game-input"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.85rem", marginTop: 4 }}>
              Sign In
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.82rem", color: "#64748b" }}>
            No account?{" "}
            <Link to="/register" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 600 }}>
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}