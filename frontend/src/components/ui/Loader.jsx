import leafIcon from "../../icons/icon_leaf.png";

export default function Loader({ fullScreen = false, text = "Loading..." }) {
  const spinner = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <div style={{ position: "relative", width: 56, height: 56 }}>
        <div className="loader" style={{ width: "100%", height: "100%", position: "absolute" }} />
        <img src={leafIcon} alt="" style={{ width: 28, height: 28, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", objectFit: "contain" }} />
      </div>
      {text && (
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.72rem", color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: "fixed", inset: 0,
        background: "rgba(8,12,20,0.9)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 999,
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", padding: "3rem 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {spinner}
    </div>
  );
}