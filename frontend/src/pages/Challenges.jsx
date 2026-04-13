import { useState, useEffect } from "react";
import { getUserSubmissions, recordChallengeQuiz, submitLocalChallenge } from "../services/api";
import Loader from "../components/ui/Loader";
import challengeIcon from "../icons/icon_challenge.png";
import trophyIcon from "../icons/icon_trophy.png";

export const CHALLENGES = [
  { module: "Climate Change", pts: 50, color: "#00ff88", barColor: "#00ff88",
    quiz: [
      { q: "What causes global warming?", options: ["Oxygen", "CO2 emissions", "Nitrogen", "Hydrogen"], correct: "CO2 emissions" },
      { q: "Main greenhouse gas?", options: ["O2", "CO2", "H2", "N2"], correct: "CO2" },
      { q: "Effect of climate change?", options: ["Cooling", "No change", "Rising temps", "Less rain"], correct: "Rising temps" },
      { q: "Paris Agreement goal?", options: ["Increase temp", "Reduce emissions", "Stop rain", "More coal"], correct: "Reduce emissions" },
      { q: "Major contributor?", options: ["Transport", "Trees", "Oceans", "Wind"], correct: "Transport" },
    ], task: "Plant a tree and upload a picture" },
  { module: "Waste Management", pts: 50, color: "#a855f7", barColor: "#a855f7",
    quiz: [
      { q: "Best waste practice?", options: ["Burn", "Segregate", "Dump", "Ignore"], correct: "Segregate" },
      { q: "Recyclable material?", options: ["Plastic", "Food waste", "Glass", "All"], correct: "All" },
      { q: "Composting uses?", options: ["Plastic", "Organic waste", "Metal", "Glass"], correct: "Organic waste" },
      { q: "Landfill gas?", options: ["Oxygen", "Methane", "Hydrogen", "Nitrogen"], correct: "Methane" },
      { q: "Best way to reduce waste?", options: ["Reuse", "Throw", "Burn", "Ignore"], correct: "Reuse" },
    ], task: "Segregate waste at home for 3 days and upload proof" },
  { module: "Water Conservation", pts: 50, color: "#38bdf8", barColor: "#38bdf8",
    quiz: [
      { q: "Save water by?", options: ["Open taps", "Fix leaks", "Waste", "Ignore"], correct: "Fix leaks" },
      { q: "Harvesting means?", options: ["Storing rainwater", "Drinking", "Cleaning", "None"], correct: "Storing rainwater" },
      { q: "Water scarcity?", options: ["Too much water", "Less water", "Clean water", "None"], correct: "Less water" },
      { q: "Efficient irrigation?", options: ["Drip", "Flood", "None", "All"], correct: "Drip" },
      { q: "Best to save water?", options: ["Reuse", "Waste", "Ignore", "None"], correct: "Reuse" },
    ], task: "Practice water saving for a week and upload evidence" },
  { module: "Renewable Energy", pts: 60, color: "#fbbf24", barColor: "#fbbf24",
    quiz: [
      { q: "Solar energy source?", options: ["Sun", "Wind", "Water", "Coal"], correct: "Sun" },
      { q: "Wind energy uses?", options: ["Turbines", "Cars", "Boilers", "Fans"], correct: "Turbines" },
      { q: "Hydro energy source?", options: ["Water", "Fire", "Coal", "Gas"], correct: "Water" },
      { q: "Cleanest energy?", options: ["Solar", "Coal", "Oil", "Gas"], correct: "Solar" },
      { q: "Future energy?", options: ["Renewables", "Coal", "Oil", "Gas"], correct: "Renewables" },
    ], task: "Use minimal electricity for 2 days and upload proof" },
  { module: "Biodiversity", pts: 50, color: "#34d399", barColor: "#34d399",
    quiz: [
      { q: "Biodiversity means?", options: ["Variety of life", "Only animals", "Only plants", "None"], correct: "Variety of life" },
      { q: "Main threat?", options: ["Deforestation", "Rain", "Wind", "Sun"], correct: "Deforestation" },
      { q: "Protect biodiversity?", options: ["Plant trees", "Cut trees", "Pollute", "Ignore"], correct: "Plant trees" },
      { q: "Extinction?", options: ["Species loss", "Growth", "Birth", "None"], correct: "Species loss" },
      { q: "Ecosystem?", options: ["Living system", "Machine", "Car", "None"], correct: "Living system" },
    ], task: "Plant or care for a plant and upload photo" },
  { module: "Sustainable Agriculture", pts: 60, color: "#fb923c", barColor: "#fb923c",
    quiz: [
      { q: "Organic farming?", options: ["No chemicals", "More chemicals", "None", "All"], correct: "No chemicals" },
      { q: "Soil conservation?", options: ["Protect soil", "Destroy", "Ignore", "None"], correct: "Protect soil" },
      { q: "Water saving method?", options: ["Drip irrigation", "Flooding", "None", "All"], correct: "Drip irrigation" },
      { q: "Food waste goal?", options: ["Reduce", "Increase", "Ignore", "None"], correct: "Reduce" },
      { q: "Sustainability means?", options: ["Long-term use", "Short use", "None", "All"], correct: "Long-term use" },
    ], task: "Reduce food waste and upload proof" },
  { module: "Urban Sustainability", pts: 55, color: "#38bdf8", barColor: "#38bdf8",
    quiz: [
      { q: "Smart city is?", options: ["Efficient city", "Village", "Forest", "None"], correct: "Efficient city" },
      { q: "Green transport?", options: ["Public transport", "Cars", "None", "All"], correct: "Public transport" },
      { q: "Urban waste solution?", options: ["Recycle", "Dump", "Burn", "Ignore"], correct: "Recycle" },
      { q: "Green building?", options: ["Eco building", "Normal", "None", "All"], correct: "Eco building" },
      { q: "Future cities?", options: ["Sustainable", "Polluted", "None", "All"], correct: "Sustainable" },
    ], task: "Use public transport and upload proof" },
  { module: "Carbon Footprint", pts: 55, color: "#a855f7", barColor: "#a855f7",
    quiz: [
      { q: "Carbon footprint is?", options: ["Emissions", "Water", "Soil", "None"], correct: "Emissions" },
      { q: "Reduce footprint?", options: ["Less travel", "More travel", "None", "All"], correct: "Less travel" },
      { q: "Major emission source?", options: ["Transport", "Trees", "None", "All"], correct: "Transport" },
      { q: "Energy saving tip?", options: ["Turn off lights", "Keep on", "None", "All"], correct: "Turn off lights" },
      { q: "Best lifestyle?", options: ["Sustainable", "Wasteful", "None", "All"], correct: "Sustainable" },
    ], task: "Track your carbon habits and upload proof" },
  { module: "Environmental Policy", pts: 50, color: "#00ff88", barColor: "#00ff88",
    quiz: [
      { q: "Number of SDGs?", options: ["17", "10", "5", "20"], correct: "17" },
      { q: "Paris agreement about?", options: ["Climate action", "War", "None", "All"], correct: "Climate action" },
      { q: "NEP 2020 is?", options: ["Education policy", "Law", "None", "All"], correct: "Education policy" },
      { q: "Policy aim?", options: ["Protection", "Damage", "None", "All"], correct: "Protection" },
      { q: "Global effort needs?", options: ["Cooperation", "Conflict", "None", "All"], correct: "Cooperation" },
    ], task: "Research SDGs and upload summary proof" },
  { module: "Community Action", pts: 60, color: "#fbbf24", barColor: "#fbbf24",
    quiz: [
      { q: "Community role?", options: ["Important", "Not needed", "None", "All"], correct: "Important" },
      { q: "Eco clubs are for?", options: ["Awareness", "None", "All", "Ignore"], correct: "Awareness" },
      { q: "Clean drives are?", options: ["Helpful", "Harmful", "None", "All"], correct: "Helpful" },
      { q: "Local impact level?", options: ["High", "Low", "None", "All"], correct: "High" },
      { q: "Participation is?", options: ["Essential", "Optional", "None", "All"], correct: "Essential" },
    ], task: "Join or simulate a clean-up drive and upload proof" },
];

export default function Challenges() {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [answers, setAnswers] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [completedModule, setCompletedModule] = useState(null);
  const [submittedModules, setSubmittedModules] = useState(new Set()); // modules already submitted
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fetch the user's existing submissions on load
  useEffect(() => {
    const fetchMySubmissions = async () => {
      try {
        const res = await getUserSubmissions();
        const names = new Set(res.data.map(s => s.module).filter(Boolean));
        setSubmittedModules(names);
      } catch (err) {
        console.warn("Could not fetch my submissions:", err);
      }
    };
    fetchMySubmissions();
  }, []);

  const handleAnswer = (qIndex, value) => setAnswers({ ...answers, [qIndex]: value });

  const submitQuiz = async () => {
    let score = 0;
    activeChallenge.quiz.forEach((q, i) => { if (answers[i] === q.correct) score++; });
    setQuizScore(score);
    setQuizSubmitted(true);
    try {
      await recordChallengeQuiz({
        module: activeChallenge.module,
        score,
        total: activeChallenge.quiz.length
      });
    } catch (err) { console.warn("Could not record quiz attempt:", err); }
  };

  const submitProof = async () => {
    if (!uploadedFile) return alert("Please upload a proof file first.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("module", activeChallenge.module);
      formData.append("task", activeChallenge.task);
      formData.append("quiz_score", quizScore !== null ? String(quizScore) : "0");
      formData.append("proof", uploadedFile);

      await submitLocalChallenge(formData);

      setCompletedModule(activeChallenge.module);
      setSubmittedModules(prev => new Set([...prev, activeChallenge.module]));
      setSubmissionSuccess(true);
      setActiveChallenge(null);
      setAnswers({}); setUploadedFile(null); setQuizSubmitted(false); setQuizScore(null);
    } catch (err) {
      alert("Submission failed: " + (err.response?.data?.error || err.message));
    } finally { setLoading(false); }
  };

  if (loading) return <Loader fullScreen text="Submitting challenge..." />;

  const completedCount = CHALLENGES.filter(c => submittedModules.has(c.module)).length;

  // ─── ACTIVE CHALLENGE VIEW ───
  if (activeChallenge) {
    const hex = activeChallenge.color;
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000 0%, #050508 50%, #000 100%)",
        padding: "2rem 1.5rem",
        color: "#e2e8f0",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          {/* Back */}
          <button
            onClick={() => { setActiveChallenge(null); setAnswers({}); setQuizSubmitted(false); setQuizScore(null); setUploadedFile(null); }}
            style={{
              background: "transparent", border: "1px solid #222", borderRadius: 8,
              color: "#64748b", fontFamily: "var(--font-heading)", fontSize: "0.65rem",
              letterSpacing: "0.1em", padding: "0.45rem 0.9rem", cursor: "pointer",
              marginBottom: "1.5rem", transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.color = hex; e.currentTarget.style.borderColor = `${hex}55`; }}
            onMouseOut={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#222"; }}
          >&larr; BACK TO CHALLENGES</button>

          {/* Header card */}
          <div style={{
            background: `linear-gradient(135deg, ${hex}12, rgba(17,17,17,0.98))`,
            border: `1px solid ${hex}33`,
            borderRadius: 20, padding: "1.5rem 2rem", marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }} />
            <img src={challengeIcon} alt="" style={{ width: 52, height: 52, filter: `drop-shadow(0 0 12px ${hex}88)` }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: hex, letterSpacing: "0.12em", background: `${hex}18`, border: `1px solid ${hex}30`, padding: "2px 10px", borderRadius: 4 }}>
                ACTIVE MISSION
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", color: "#f1f5f9", marginTop: 6, fontWeight: 800 }}>
                {activeChallenge.module}
              </h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 900, color: hex, lineHeight: 1 }}>+{activeChallenge.pts}</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: "#64748b", letterSpacing: "0.1em" }}>XP REWARD</p>
            </div>
          </div>

          {/* ── STEP 1: Quiz ── */}
          <div style={{
            background: "rgba(17,17,17,0.98)", border: "1px solid #222",
            borderRadius: 18, padding: "1.75rem", marginBottom: "1.25rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: "#38bdf8", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)", padding: "2px 10px", borderRadius: 4, letterSpacing: "0.1em" }}>
                STEP 1
              </span>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "#f1f5f9" }}>Quiz Questions</h3>
              {quizSubmitted && (
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-heading)", fontSize: "0.68rem", color: "#00ff88", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", padding: "2px 10px", borderRadius: 4 }}>
                  SCORE: {quizScore}/{activeChallenge.quiz.length}
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activeChallenge.quiz.map((q, i) => (
                <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "1rem 1.25rem" }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", color: "#e2e8f0", marginBottom: "0.75rem" }}>
                    <span style={{ color: hex }}>{i + 1}. </span>{q.q}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.5rem" }}>
                    {q.options.map(opt => {
                      const isCorrect = quizSubmitted && opt === q.correct;
                      const isWrong = quizSubmitted && answers[i] === opt && opt !== q.correct;
                      const isSelected = answers[i] === opt;
                      return (
                        <label key={opt} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "0.5rem 0.75rem",
                          background: isCorrect ? "rgba(0,255,136,0.12)" : isWrong ? "rgba(248,113,113,0.12)" : isSelected ? `${hex}10` : "transparent",
                          border: `1px solid ${isCorrect ? "rgba(0,255,136,0.4)" : isWrong ? "rgba(248,113,113,0.4)" : isSelected ? `${hex}33` : "#1a1a1a"}`,
                          borderRadius: 6, cursor: quizSubmitted ? "default" : "pointer", transition: "all 0.15s",
                        }}
                          onMouseOver={e => { if (!quizSubmitted) e.currentTarget.style.borderColor = `${hex}55`; }}
                          onMouseOut={e => { if (!quizSubmitted && !isSelected) e.currentTarget.style.borderColor = "#1a1a1a"; }}
                        >
                          <input
                            type="radio" name={`q${i}`}
                            onChange={() => handleAnswer(i, opt)}
                            disabled={quizSubmitted}
                            checked={isSelected}
                            style={{ accentColor: "#00ff88" }}
                          />
                          <span style={{
                            fontSize: "0.78rem",
                            color: isCorrect ? "#00ff88" : isWrong ? "#f87171" : "#94a3b8",
                            fontWeight: isCorrect ? 600 : 400,
                            textDecoration: isWrong ? "line-through" : "none",
                          }}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              {!quizSubmitted ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length < activeChallenge.quiz.length}
                  style={{
                    padding: "0.7rem 1.8rem",
                    background: Object.keys(answers).length < activeChallenge.quiz.length ? "#111" : `linear-gradient(135deg, ${hex}, ${hex}bb)`,
                    border: `1px solid ${hex}44`,
                    borderRadius: 8, color: Object.keys(answers).length < activeChallenge.quiz.length ? "#333" : "#080c14",
                    fontFamily: "var(--font-heading)", fontSize: "0.72rem", fontWeight: 800,
                    letterSpacing: "0.1em", cursor: Object.keys(answers).length < activeChallenge.quiz.length ? "not-allowed" : "pointer",
                    transition: "all 0.2s", boxShadow: Object.keys(answers).length < activeChallenge.quiz.length ? "none" : `0 0 16px ${hex}44`,
                  }}
                >
                  SUBMIT QUIZ ({Object.keys(answers).length}/{activeChallenge.quiz.length} answered)
                </button>
              ) : (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "0.6rem 1.2rem",
                  background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)",
                  borderRadius: 8, fontFamily: "var(--font-heading)", fontSize: "0.78rem", color: "#00ff88",
                }}>
                  Quiz Complete — {quizScore}/{activeChallenge.quiz.length} correct. Now complete the real-world task.
                </div>
              )}
            </div>
          </div>

          {/* ── STEP 2: Upload proof ── */}
          <div style={{
            background: "rgba(17,17,17,0.98)", border: "1px solid #222",
            borderRadius: 18, padding: "1.75rem",
            opacity: quizSubmitted ? 1 : 0.4,
            pointerEvents: quizSubmitted ? "all" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: "#a855f7", background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", padding: "2px 10px", borderRadius: 4, letterSpacing: "0.1em" }}>
                STEP 2
              </span>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "#f1f5f9" }}>Real-World Task</h3>
            </div>

            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7 }}>{activeChallenge.task}</p>
            </div>

            {/* Drop zone */}
            <label style={{
              display: "block", padding: "2rem", cursor: "pointer", textAlign: "center",
              background: uploadedFile ? "rgba(0,255,136,0.06)" : "#0a0a0a",
              border: `2px dashed ${uploadedFile ? "rgba(0,255,136,0.5)" : "#222"}`,
              borderRadius: 12, marginBottom: "1.25rem", transition: "all 0.2s",
            }}>
              <input type="file" accept="image/*" onChange={e => setUploadedFile(e.target.files[0])} style={{ display: "none" }} />
              {uploadedFile ? (
                <div>
                  <img src={challengeIcon} alt="" style={{ width: 36, height: 36, margin: "0 auto 8px", filter: "drop-shadow(0 0 8px rgba(0,255,136,0.7))" }} />
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.78rem", color: "#00ff88" }}>{uploadedFile.name}</p>
                  <p style={{ fontSize: "0.68rem", color: "#475569", marginTop: 4 }}>Click to change</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: "2rem", color: "#222", marginBottom: 8 }}>+</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.72rem", color: "#475569", letterSpacing: "0.1em" }}>UPLOAD PROOF IMAGE</p>
                  <p style={{ fontSize: "0.68rem", color: "#333", marginTop: 4 }}>Click to browse</p>
                </div>
              )}
            </label>

            <button
              onClick={submitProof}
              disabled={!uploadedFile}
              style={{
                padding: "0.7rem 1.8rem",
                background: uploadedFile ? "linear-gradient(135deg, #a855f7, #7e22ce)" : "#111",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: 8, color: uploadedFile ? "#fff" : "#333",
                fontFamily: "var(--font-heading)", fontSize: "0.72rem", fontWeight: 800,
                letterSpacing: "0.1em", cursor: uploadedFile ? "pointer" : "not-allowed",
                boxShadow: uploadedFile ? "0 0 20px rgba(168,85,247,0.35)" : "none",
                transition: "all 0.2s",
              }}
            >
              SUBMIT CHALLENGE PROOF
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── CHALLENGE GRID VIEW ───
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000 0%, #050508 50%, #000 100%)",
      padding: "2rem 1.5rem",
      color: "#e2e8f0",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }} className="animate-fadeIn">
          <img src={challengeIcon} alt="" style={{ width: 52, height: 52, filter: "drop-shadow(0 0 12px rgba(168,85,247,0.7))" }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "#f1f5f9" }}>
              ECO <span style={{ color: "#a855f7" }} className="glow-purple">CHALLENGES</span>
            </h1>
            <p style={{ color: "#64748b", fontFamily: "var(--font-heading)", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
              {CHALLENGES.length} MISSIONS · {completedCount} SUBMITTED · EARN XP · UNLOCK BADGES
            </p>
          </div>
          {completedCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.5rem 1rem", background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 8 }}>
              <img src={trophyIcon} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#00ff88", fontWeight: 900, lineHeight: 1 }}>{completedCount}/{CHALLENGES.length}</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: "#64748b", letterSpacing: "0.1em" }}>SUBMITTED</p>
              </div>
            </div>
          )}
        </div>

        {/* Overall progress */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.62rem", color: "#475569", letterSpacing: "0.1em" }}>YOUR PROGRESS</span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.62rem", color: "#a855f7" }}>{Math.round((completedCount / CHALLENGES.length) * 100)}%</span>
          </div>
          <div className="xp-bar-track" style={{ height: 8 }}>
            <div style={{ height: "100%", width: `${(completedCount / CHALLENGES.length) * 100}%`, background: "linear-gradient(90deg, #a855f7, #7e22ce)", borderRadius: 4, boxShadow: "0 0 8px rgba(168,85,247,0.6)", transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Success banner */}
        {submissionSuccess && (
          <div style={{
            background: "linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,255,136,0.04))",
            border: "1px solid rgba(0,255,136,0.35)", borderRadius: 14,
            padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
            marginBottom: "1.5rem", boxShadow: "0 0 20px rgba(0,255,136,0.1)",
          }}>
            <img src={trophyIcon} alt="" style={{ width: 38, height: 38 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-heading)", color: "#00ff88", fontSize: "0.9rem", fontWeight: 700 }}>Challenge Submitted!</p>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: 3 }}>
                <strong style={{ color: "#e2e8f0" }}>{completedModule}</strong> is awaiting teacher approval.
              </p>
            </div>
            <button onClick={() => setSubmissionSuccess(false)} style={{ background: "transparent", border: "none", color: "#475569", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
          </div>
        )}

        {/* Challenge grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {CHALLENGES.map((c, i) => {
            const isSubmitted = submittedModules.has(c.module);
            const hex = isSubmitted ? "#00ff88" : c.color;
            return (
              <div
                key={i}
                onClick={() => { if (!isSubmitted) { setActiveChallenge(c); setAnswers({}); setQuizSubmitted(false); setQuizScore(null); setUploadedFile(null); } }}
                style={{
                  background: isSubmitted ? "rgba(0,15,8,0.97)" : "rgba(17,17,17,0.98)",
                  border: `1px solid ${hex}${isSubmitted ? "44" : "22"}`,
                  borderRadius: 18, padding: "1.5rem",
                  cursor: isSubmitted ? "default" : "pointer",
                  transition: "all 0.25s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseOver={e => { if (!isSubmitted) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${hex}22`; e.currentTarget.style.borderColor = `${hex}44`; } }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${hex}${isSubmitted ? "44" : "22"}`; }}
              >
                {/* Top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${hex}, transparent)`, opacity: isSubmitted ? 1 : 0.5 }} />

                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{
                    width: 42, height: 42, flexShrink: 0,
                    background: `${hex}15`, border: `1px solid ${hex}30`,
                    borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <img src={challengeIcon} alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
                  </div>
                  {isSubmitted ? (
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", color: "#00ff88", background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.35)", padding: "3px 10px", borderRadius: 4, letterSpacing: "0.08em" }}>
                      SUBMITTED
                    </span>
                  ) : (
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", color: hex, background: `${hex}12`, border: `1px solid ${hex}28`, padding: "3px 8px", borderRadius: 4 }}>+{c.pts} XP</span>
                  )}
                </div>

                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: isSubmitted ? "#00ff88" : "#f1f5f9", marginBottom: 6, fontWeight: 700 }}>
                  {c.module}
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.76rem", marginBottom: "1.25rem" }}>
                  {c.quiz.length}-question quiz + real-world task
                </p>

                {/* XP bar */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: "0.58rem", color: "#374151", fontFamily: "var(--font-heading)", letterSpacing: "0.08em" }}>MISSION</span>
                  <span style={{ fontSize: "0.58rem", color: hex, fontFamily: "var(--font-heading)" }}>{isSubmitted ? "DONE" : `${c.pts} XP`}</span>
                </div>
                <div className="xp-bar-track" style={{ marginBottom: "1.25rem", height: 6 }}>
                  <div style={{
                    height: "100%", width: isSubmitted ? "100%" : "30%",
                    background: `linear-gradient(90deg, ${hex}, ${hex}88)`,
                    borderRadius: 3, boxShadow: `0 0 6px ${hex}55`,
                    transition: "width 0.5s ease",
                  }} />
                </div>

                {/* CTA */}
                <div style={{
                  padding: "0.5rem 1rem",
                  background: isSubmitted ? "rgba(0,255,136,0.08)" : `${hex}0d`,
                  border: `1px solid ${hex}${isSubmitted ? "30" : "1a"}`,
                  borderRadius: 6,
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.65rem",
                  color: isSubmitted ? "#00ff88" : hex,
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  {isSubmitted ? (
                    <><img src={trophyIcon} alt="" style={{ width: 16, height: 16, objectFit: "contain" }} /> CHALLENGE SUBMITTED — AWAITING APPROVAL</>
                  ) : "START CHALLENGE"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}