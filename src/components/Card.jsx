function Card({ title, description, darkMode = false }) {
  return (
    <div
      style={{
        padding: "15px",
        margin: "10px 0",
        borderRadius: "12px",
        backgroundColor: darkMode ? "#1e1e1e" : "#fff",
        boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)",
        color: darkMode ? "#fff" : "#333",
        fontWeight: "500"
      }}
    >
      <h3 style={{ margin: "0 0 5px 0" }}>{title}</h3>
      <p style={{ margin: 0 }}>{description}</p>
    </div>
  );
}

export default Card;
