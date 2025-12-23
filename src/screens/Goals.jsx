import { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

// Суммаларды форматтоо функциясы (мисалы: 50,000 сом)
const formatAmount = (amount, currency = "сом") => {
  return new Intl.NumberFormat('ky-KG', {
    style: 'currency',
    currency: 'KGS', // Кыргыз сомун колдонуу
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('KGS', currency).trim(); // "KGS" ордуна "сом" коёт
};

const categoryColors = {
  "💰": ["#FFD700", "#FFA500"], // Акча - сары-апельсин
  "📱": ["#00BFFF", "#1E90FF"], // Телефон - көк
  "🏠": ["#32CD32", "#228B22"], // Үй - жашыл
  "🚗": ["#FF4500", "#FF6347"], // Машина - кызгылт сары
  "✈️": ["#BA55D3", "#8A2BE2"]  // Саякат - фиолет
};

function Goals() {
  const [goals, setGoals] = useState([
    { id: 1, title: "Телефон алуу", target: 50000, saved: 12000, icon: "📱" },
    { id: 2, title: "Саякат", target: 80000, saved: 30000, icon: "✈️" }
  ]);

  // Максат кошуу үчүн стейттер
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [icon, setIcon] = useState("💰");
  
  // Аманатты кошуу/кемитүү үчүн стейттер
  const [addAmount, setAddAmount] = useState(1000); // Кошуу же кемитүү үчүн сумма
  const [addType, setAddType] = useState("add"); // "add" же "subtract"

  const addGoal = () => {
    if (!title || !target || Number(target) <= 0) {
      return alert("Максаттын аталышын жана оң сандагы керектүү сумманы толтуруңуз!");
    }
    setGoals([
      ...goals,
      {
        id: Date.now(),
        title,
        target: Number(target),
        saved: 0,
        icon
      }
    ]);
    // Форманы тазалоо
    setTitle("");
    setTarget("");
    setIcon("💰");
  };

  const updateGoalSavedAmount = (id, amount) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        let newSaved;
        if (addType === "add") {
          newSaved = goal.saved + amount;
        } else {
          // Аманатты нөлдөн төмөн түшүрбөө
          newSaved = Math.max(0, goal.saved - amount); 
        }
        return { ...goal, saved: newSaved };
      }
      return goal;
    }));
  };

  const deleteGoal = (id) => {
    if (window.confirm("Бул максатты чын эле өчүрүүнү каалайсызбы?")) {
        setGoals(goals.filter(goal => goal.id !== id));
    }
  };

  return (
    <div style={{ padding: "20px", paddingBottom: "90px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>🎯 Финансылык максаттар</h2>

      {/* Максат кошуу */}
      <div style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ marginTop: 0 }}>Жаңы максат түзүү</h3>
        <input
          placeholder="Максаттын аталышы (мис: Үйгө ремонт)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          type="number"
          placeholder="Керектүү сумма (сом)"
          value={target}
          onChange={e => setTarget(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <select value={icon} onChange={e => setIcon(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "8px", border: "1px solid #ccc" }}>
          {Object.keys(categoryColors).map(key => (
              <option key={key} value={key}>{key} {key === '💰' ? 'Акча' : key === '📱' ? 'Телефон' : key === '🏠' ? 'Үй' : key === '🚗' ? 'Машина' : 'Саякат'}</option>
          ))}
        </select>

        <button
          onClick={addGoal}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            background: "linear-gradient(135deg, #6200ee, #3700b3)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ➕ Максат кошуу
        </button>
      </div>

      {/* Максаттар тизмеси */}
      <h3>Учурдагы Максаттар</h3>
      {goals.map(goal => {
        const percent = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
        const [startColor, endColor] = categoryColors[goal.icon] || ["#6200ee", "#3700b3"];

        return (
          <div key={goal.id} style={{
            background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
            padding: "15px",
            borderRadius: "15px",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}>
            <div style={{ width: "80px", height: "80px", flexShrink: 0 }}>
              <CircularProgressbar
                value={percent}
                text={`${percent}%`}
                styles={buildStyles({
                  pathColor: percent >= 100 ? '#00e676' : '#fff', // Жашыл же ак
                  textColor: '#fff',
                  trailColor: 'rgba(255,255,255,0.3)'
                })}
              />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>{goal.icon} {goal.title}</h3>
              <p style={{ margin: "4px 0" }}>
                **{formatAmount(goal.saved)}** / **{formatAmount(goal.target)}**
              </p>
              <p style={{ color: percent >= 100 ? '#00e676' : '#fff', fontWeight: 'bold', margin: "4px 0", fontSize: "14px" }}>
                {percent >= 100 ? '✅ Аткарылды!' : `${formatAmount(goal.target - goal.saved)} калды`}
              </p>

              {/* Аманатты башкаруу блогу */}
              <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap", alignItems: "center" }}>
                {/* Кошуу/Азайтуу тандоосу */}
                <select 
                    value={addType} 
                    onChange={e => setAddType(e.target.value)}
                    style={{ padding: "6px", borderRadius: "8px", border: "1px solid #ccc", background: "#fff", color: "#333" }}
                >
                    <option value="add">Кошуу (+)</option>
                    <option value="subtract">Кемитүү (-)</option>
                </select>

                {/* Сумманы киргизүү */}
                <input
                  type="number"
                  placeholder="Сумма"
                  value={addAmount}
                  onChange={e => setAddAmount(Number(e.target.value))}
                  style={{ padding: "6px", borderRadius: "8px", border: "1px solid #ccc", width: "80px" }}
                />
                
                {/* Аракет баскычы */}
                <button
                  onClick={() => updateGoalSavedAmount(goal.id, addAmount)}
                  style={{
                    padding: "6px 12px",
                    background: addType === "add" ? "#03dac6" : "#ffc107",
                    color: addType === "add" ? "#333" : "#333",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {addType === "add" ? "Салуу" : "Чыгаруу"}
                </button>

                {/* Өчүрүү баскычы */}
                <button
                  onClick={() => deleteGoal(goal.id)}
                  style={{
                    padding: "6px 12px",
                    background: "#b00020",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                    marginLeft: 'auto' // Оңго жылдыруу
                  }}
                >
                  🗑️ Өчүрүү
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Goals;