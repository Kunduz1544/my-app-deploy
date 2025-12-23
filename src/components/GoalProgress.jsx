export default function GoalProgress({ title, current, target }) {
  const percent = Math.min((current / target) * 100, 100);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{title}</strong>
        <span>{Math.round(percent)}%</span>
      </div>

      <div style={{
        height: 8,
        background: "#eee",
        borderRadius: 6,
        marginTop: 8
      }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          background: percent >= 100 ? "#4caf50" : "#2196f3",
          borderRadius: 6
        }} />
      </div>

      <small>{current} ₸ / {target} ₸</small>
    </div>
  );
}
