import { useState } from "react";

function BottomNav({ onChange }) {
  const [active, setActive] = useState("home");

  const buttons = [
    { key: "home", label: "Башкы бет" },
    { key: "goals", label: "Максаттар" },
    { key: "profile", label: "Профиль" },
    { key: "settings", label: "Жөндөөлөр" }
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "12px 0",
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
        zIndex: 100
      }}
    >
      {buttons.map((btn) => (
        <button
          key={btn.key}
          onClick={() => {
            setActive(btn.key);
            onChange(btn.key);
          }}
          style={{
            background: "none",
            border: "none",
            fontWeight: active === btn.key ? "bold" : "normal",
            color: active === btn.key ? "#6200ee" : "#555",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

export default BottomNav;
