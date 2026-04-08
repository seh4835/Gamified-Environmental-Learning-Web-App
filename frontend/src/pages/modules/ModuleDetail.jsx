import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";
import QuizCard from "../../components/features/quiz/QuizCard";
import api from "../../services/api";
import modulesIcon from "../../icons/icon_modules.png";
import trophyIcon from "../../icons/icon_trophy.png";
import badgeIcon from "../../icons/icon_badge.png";

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const moduleId = Number(id);
  const { user, updateUser } = useAuth();

  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await api.get(`/modules/${id}`);
        setModule(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [id]);

  if (loading) return <Loader fullScreen text="Loading module..." />;
  if (!module) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "var(--font-heading)", color: "#64748b" }}>Module not found</p>
    </div>
  );

  const moduleContent = {
    1: [
      { title: "Understanding Climate Change", content: "Climate change refers to long-term alterations in temperature and weather patterns, primarily driven by human activities such as burning fossil fuels." },
      { title: "Greenhouse Effect", content: "Greenhouse gases trap heat in the atmosphere. Excess emissions amplify this effect, leading to global warming." },
      { title: "Major Causes", content: "Industrialization, deforestation, transportation emissions, and energy consumption are key contributors." },
      { title: "Global Impacts", content: "Rising sea levels, extreme weather events, melting glaciers, and ecosystem disruption." },
      { title: "Mitigation Strategies", content: "Reducing emissions, switching to renewable energy, and reforestation are key solutions." },
      { title: "Role of Individuals", content: "Energy conservation, sustainable transport, and conscious consumption reduce carbon footprint." }
    ],
    2: [
      { title: "Waste Management Basics", content: "Waste management involves collection, processing, and disposal of waste to reduce environmental harm." },
      { title: "Types of Waste", content: "Organic, recyclable, hazardous, and electronic waste require different handling." },
      { title: "Circular Economy", content: "A system where resources are reused, reducing waste and environmental impact." },
      { title: "Plastic Pollution", content: "Plastic waste persists for centuries, harming ecosystems and marine life." },
      { title: "Recycling & Composting", content: "Recycling conserves resources, while composting reduces organic waste." },
      { title: "Daily Actions", content: "Segregate waste, avoid single-use plastics, and promote reuse." }
    ],
    3: [
      { title: "Water Scarcity", content: "Freshwater resources are limited and unevenly distributed across the globe." },
      { title: "Groundwater Depletion", content: "Excessive extraction leads to falling water tables and long-term shortages." },
      { title: "Rainwater Harvesting", content: "Capturing rainwater helps recharge groundwater and reduce dependency." },
      { title: "Efficient Usage", content: "Drip irrigation and low-flow systems conserve water." },
      { title: "Impact on Society", content: "Water shortages affect agriculture, health, and economic stability." },
      { title: "Individual Role", content: "Fix leaks, reduce wastage, and reuse water wherever possible." }
    ],
    4: [
      { title: "Renewable Energy Overview", content: "Renewable energy comes from natural sources like sunlight and wind." },
      { title: "Solar Energy", content: "Solar panels convert sunlight into electricity efficiently." },
      { title: "Wind & Hydro", content: "Wind turbines and hydroelectric dams generate large-scale clean energy." },
      { title: "Advantages", content: "Reduces emissions and dependence on fossil fuels." },
      { title: "Challenges", content: "Initial cost and infrastructure requirements." },
      { title: "Future Scope", content: "Rapid adoption globally with technological advancements." }
    ],
    5: [
      { title: "Biodiversity Importance", content: "Biodiversity ensures ecosystem stability and supports life." },
      { title: "Ecosystem Balance", content: "Each species plays a role in maintaining ecological equilibrium." },
      { title: "Threats", content: "Deforestation, pollution, climate change, and habitat loss." },
      { title: "Conservation Methods", content: "Protected areas, wildlife laws, and sustainable practices." },
      { title: "Impact of Loss", content: "Disrupted food chains and ecological imbalance." },
      { title: "Individual Actions", content: "Plant trees and reduce pollution." }
    ],
    6: [
      { title: "Sustainable Agriculture", content: "Farming methods that preserve resources and environment." },
      { title: "Organic Farming", content: "Avoids synthetic chemicals and promotes soil health." },
      { title: "Soil Conservation", content: "Prevents erosion and maintains fertility." },
      { title: "Efficient Irrigation", content: "Drip irrigation reduces water usage." },
      { title: "Food Sustainability", content: "Reducing food waste ensures better resource utilization." },
      { title: "Future Practices", content: "Agroecology and precision farming are emerging trends." }
    ],
    7: [
      { title: "Urban Sustainability", content: "Cities must balance development with environmental protection." },
      { title: "Smart Cities", content: "Use technology for efficient energy and resource management." },
      { title: "Green Infrastructure", content: "Parks, green roofs, and eco-friendly buildings." },
      { title: "Transport Systems", content: "Public transport and EVs reduce emissions." },
      { title: "Waste Management", content: "Urban recycling systems improve sustainability." },
      { title: "Future Cities", content: "Sustainable urban planning is key to future living." }
    ],
    8: [
      { title: "Carbon Footprint", content: "Measure of total greenhouse gases produced by activities." },
      { title: "Major Sources", content: "Transport, electricity, food, and lifestyle choices." },
      { title: "Impact", content: "Higher footprint accelerates climate change." },
      { title: "Reduction Methods", content: "Energy efficiency, sustainable transport, and reduced waste." },
      { title: "Lifestyle Changes", content: "Minimalism and conscious consumption." },
      { title: "Tracking", content: "Carbon calculators help measure impact." }
    ],
    9: [
      { title: "Environmental Policies", content: "Governments create policies to regulate environmental impact." },
      { title: "Global Agreements", content: "Paris Agreement and UN climate frameworks." },
      { title: "SDGs", content: "17 Sustainable Development Goals guide global sustainability." },
      { title: "NEP 2020", content: "Promotes experiential environmental learning in India." },
      { title: "Implementation", content: "Policies require active participation from citizens." },
      { title: "Future Direction", content: "Stronger enforcement and global cooperation." }
    ],
    10: [
      { title: "Community Action", content: "Local communities play a crucial role in sustainability." },
      { title: "Eco-Clubs", content: "Schools and colleges drive awareness initiatives." },
      { title: "Clean-Up Drives", content: "Community participation improves local environments." },
      { title: "Grassroots Impact", content: "Small actions collectively create large impact." },
      { title: "Collaboration", content: "NGOs and governments support initiatives." },
      { title: "Your Role", content: "Participate actively in local sustainability efforts." }
    ]
  };

  const slides = moduleContent[moduleId] || [];
  const nextSlide = () => currentSlide < slides.length - 1 && setCurrentSlide(currentSlide + 1);
  const prevSlide = () => currentSlide > 0 && setCurrentSlide(currentSlide - 1);
  const isLastSlide = currentSlide === slides.length - 1;
  const progressPct = slides.length ? Math.round(((currentSlide + 1) / slides.length) * 100) : 0;

  const completeModule = async () => {
    setCompleting(true);
    try {
      const oldPts = user?.eco_points || 0;
      const response = await api.post(`/modules/${moduleId}/complete`);
      const newPts = response.data.total_eco_points;

      if (updateUser && newPts !== undefined) {
        updateUser({ eco_points: newPts });
      }

      const BADGE_TIERS = [
        { name: "Eco Starter", pts: 50 },
        { name: "Green Learner", pts: 150 },
        { name: "Sustainability Pro", pts: 300 },
        { name: "Eco Champion", pts: 600 },
        { name: "Planet Guardian", pts: 900 },
        { name: "Sustainability Hero", pts: 1200 },
      ];
      
      const unlocked = BADGE_TIERS.filter(b => oldPts < b.pts && newPts >= b.pts);

      setCompletionData({
        ecoPoints: response.data.eco_points || 50,
        message: response.data.message || "Module Completed!",
        unlockedBadges: unlocked
      });
      setShowCelebration(true);
    } catch (error) {
      console.error("Failed to complete module:", error);
      alert(`Error completing module: ${error.response?.data?.error || error.message}`);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000 0%, #050d05 40%, #000510 70%, #000 100%)",
      padding: "2.5rem 1.5rem",
      color: "#e2e8f0",
    }}>

      {/* ── CELEBRATION MODAL ── */}
      {showCelebration && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #0a1a0a, #111)",
            border: "1px solid rgba(0,255,136,0.4)",
            borderRadius: 24,
            padding: "3rem 2.5rem",
            maxWidth: 420, width: "90%",
            textAlign: "center",
            boxShadow: "0 0 60px rgba(0,255,136,0.2)",
            animation: "scaleUp 0.4s ease-out forwards",
          }}>
            {/* Trophy icon */}
            <div style={{ marginBottom: "1.5rem" }}>
              <img
                src={trophyIcon}
                alt=""
                style={{ width: 80, height: 80, objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(251,191,36,0.8))", margin: "0 auto" }}
              />
            </div>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "#00ff88", marginBottom: 8 }} className="glow-green">
              MISSION COMPLETE!
            </h2>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "2rem" }}>
              {module?.title}
            </p>

            {/* Points pod */}
            <div style={{
              background: "linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,255,136,0.04))",
              border: "1px solid rgba(0,255,136,0.3)",
              borderRadius: 16,
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.12em", marginBottom: 8 }}>XP EARNED</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "3.5rem", fontWeight: 900, color: "#00ff88", lineHeight: 1 }} className="glow-green">
                +{completionData?.ecoPoints}
              </p>
            </div>

            {/* Badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: "1.5rem" }}>
              <img src={badgeIcon} alt="" style={{ width: 32, height: 32, filter: "drop-shadow(0 0 8px rgba(251,191,36,0.7))" }} />
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.72rem", color: "#fbbf24", letterSpacing: "0.08em" }}>
                {completionData?.unlockedBadges?.length > 0 ? "NEW BADGE(S) UNLOCKED!" : "MODULE ACHIEVEMENT UNLOCKED"}
              </p>
            </div>

            {completionData?.unlockedBadges?.length > 0 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {completionData.unlockedBadges.map((b, i) => (
                  <div key={i} className="animate-scale-in" style={{
                    background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)",
                    borderRadius: 12, padding: "0.5rem 1rem", color: "#fbbf24",
                  }}>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", fontWeight: 700 }}>{b.name}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => { setShowCelebration(false); navigate("/modules"); }}
              style={{
                width: "100%", padding: "1rem", background: "#00ff88", border: "none",
                borderRadius: 12, fontFamily: "var(--font-heading)", fontSize: "0.9rem",
                fontWeight: 900, color: "#080c14", cursor: "pointer",
                boxShadow: "0 0 20px rgba(0,255,136,0.4)",
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/modules")}
            style={{
              background: "transparent",
              border: "1px solid #222",
              borderRadius: 8,
              color: "#64748b",
              fontFamily: "var(--font-heading)",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              padding: "0.45rem 0.9rem",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseOver={e => { e.currentTarget.style.color = "#00ff88"; e.currentTarget.style.borderColor = "rgba(0,255,136,0.4)"; }}
            onMouseOut={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#222"; }}
          >
            &larr; MODULES
          </button>

          <div style={{ flex: 1 }}>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
              fontWeight: 800,
              color: "#f1f5f9",
              lineHeight: 1.2,
            }}>
              {module?.title}
            </h1>
            <span className="stat-chip chip-green" style={{ fontSize: "0.58rem", marginTop: 6 }}>
              ACTIVE MISSION
            </span>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 900, color: "#00ff88", lineHeight: 1 }} className="glow-green">
              {progressPct}%
            </p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.55rem", color: "#64748b", letterSpacing: "0.1em" }}>COMPLETE</p>
          </div>
        </div>

        {/* ── XP PROGRESS BAR ── */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.62rem", color: "#475569", letterSpacing: "0.1em" }}>
              SLIDE {currentSlide + 1} OF {slides.length}
            </span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.62rem", color: "#00ff88" }}>
              {progressPct}% COMPLETE
            </span>
          </div>
          <div className="xp-bar-track" style={{ height: 10 }}>
            <div
              className="xp-bar-fill"
              style={{ width: `${progressPct}%`, transition: "width 0.5s ease" }}
            />
          </div>
          {/* Slide dots */}
          <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "center" }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === currentSlide ? "#00ff88" : i < currentSlide ? "rgba(0,255,136,0.4)" : "#222",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: i === currentSlide ? "0 0 8px rgba(0,255,136,0.7)" : "none",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── SLIDE CONTENT CARD ── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(17,17,17,0.98) 40%)",
          border: "1px solid rgba(0,255,136,0.2)",
          borderRadius: 20,
          padding: "2.5rem",
          marginBottom: "1.5rem",
          minHeight: 260,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Top accent line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
          }} />

          {/* Slide number badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: "1.25rem",
          }}>
            <img src={modulesIcon} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
            <span style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.62rem",
              color: "#00ff88",
              letterSpacing: "0.12em",
              background: "rgba(0,255,136,0.1)",
              border: "1px solid rgba(0,255,136,0.25)",
              padding: "2px 10px",
              borderRadius: 4,
            }}>SLIDE {currentSlide + 1}</span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#00ff88",
            marginBottom: "1.25rem",
            letterSpacing: "0.03em",
          }}>
            {slides[currentSlide]?.title}
          </h2>

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "#cbd5e1",
            lineHeight: 1.85,
            maxWidth: 680,
          }}>
            {slides[currentSlide]?.content}
          </p>
        </div>

        {/* ── NAVIGATION ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          background: "rgba(17,17,17,0.95)",
          border: "1px solid #222",
          borderRadius: 14,
          padding: "1rem 1.5rem",
          marginBottom: "2rem",
        }}>
          {/* Previous */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            style={{
              padding: "0.6rem 1.4rem",
              background: "transparent",
              border: "1px solid #333",
              borderRadius: 8,
              color: currentSlide === 0 ? "#333" : "#94a3b8",
              fontFamily: "var(--font-heading)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: currentSlide === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={e => { if (currentSlide !== 0) { e.currentTarget.style.color = "#f1f5f9"; e.currentTarget.style.borderColor = "#555"; }}}
            onMouseOut={e => { e.currentTarget.style.color = currentSlide === 0 ? "#333" : "#94a3b8"; e.currentTarget.style.borderColor = "#333"; }}
          >
            &larr; PREV
          </button>

          {/* Counter */}
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.78rem", color: "#475569" }}>
            {currentSlide + 1} / {slides.length}
          </span>

          {/* Next / Finish */}
          {isLastSlide ? (
            <button
              onClick={completeModule}
              disabled={completing}
              style={{
                padding: "0.65rem 1.8rem",
                background: completing ? "rgba(0,255,136,0.3)" : "linear-gradient(135deg, #00ff88, #22c55e)",
                border: "none",
                borderRadius: 8,
                color: "#080c14",
                fontFamily: "var(--font-heading)",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                cursor: completing ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: completing ? "none" : "0 0 20px rgba(0,255,136,0.4)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <img src={trophyIcon} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />
              {completing ? "COMPLETING..." : "FINISH MODULE"}
            </button>
          ) : (
            <button
              onClick={nextSlide}
              style={{
                padding: "0.65rem 1.4rem",
                background: "linear-gradient(135deg, #00ff88, #22c55e)",
                border: "none",
                borderRadius: 8,
                color: "#080c14",
                fontFamily: "var(--font-heading)",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 0 16px rgba(0,255,136,0.35)",
              }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = "0 0 28px rgba(0,255,136,0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.35)"; e.currentTarget.style.transform = "none"; }}
            >
              NEXT &rarr;
            </button>
          )}
        </div>

        {/* ── QUIZ CARDS (if any) ── */}
        {module?.quizzes?.map((q, i) => (
          <QuizCard key={q.id} quiz={q} index={i} />
        ))}
      </div>
    </div>
  );
}