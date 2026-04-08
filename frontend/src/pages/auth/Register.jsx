import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";
import leafIcon from "../../icons/icon_leaf.png";

const fields = [
  { name: "name", label: "FULL NAME", type: "text", placeholder: "Your full name" },
  { name: "email", label: "EMAIL ADDRESS", type: "email", placeholder: "you@example.com" },
  { name: "institution", label: "INSTITUTION", type: "text", placeholder: "Your school or college" },
  { name: "password", label: "PASSWORD", type: "password", placeholder: "Minimum 6 characters", minLength: 6 },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", institution: "", role: "student" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) navigate("/dashboard");
      else setError(res.message || "Registration failed. Please try again.");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen text="Creating your account..." />;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-deep)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      backgroundImage: "radial-gradient(ellipse at 70% 20%, rgba(168,85,247,0.05) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(0,255,136,0.05) 0%, transparent 50%)",
    }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src={leafIcon} alt="EcoLearn" style={{ width: 64, height: 64, objectFit: "contain", filter: "drop-shadow(0 0 16px rgba(0,255,136,0.7))", marginBottom: 12 }} />
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--neon-green)", letterSpacing: "0.1em" }} className="glow-green">
            ECOLEARN
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "var(--font-heading)", letterSpacing: "0.08em", marginTop: 4 }}>
            BEGIN YOUR ECO QUEST
          </p>
        </div>

        {/* Card */}
        <div className="game-card" style={{ padding: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#f1f5f9", marginBottom: "0.25rem" }}>Create Account</h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.75rem" }}>Join EcoLearn and start earning eco points today.</p>

          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              color: "var(--neon-red)",
              fontSize: "0.82rem",
              marginBottom: "1.25rem",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {fields.map((f) => (
              <div key={f.name}>
                <label style={{ fontFamily: "var(--font-heading)", fontSize: "0.68rem", color: "#64748b", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  required
                  minLength={f.minLength}
                  value={formData[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="game-input"
                />
              </div>
            ))}

            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontSize: "0.68rem", color: "#64748b", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                ROLE
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="game-input"
                style={{ cursor: "pointer" }}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher / Eco Coordinator</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.85rem", marginTop: 8 }}>
              Create Account
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.82rem", color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}