// src/screens/Goals.jsx

import { useState, useMemo } from "react"; 
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { getGoalsAnalysisComment } from "../utils/goalsAnalysis"; 


// =========================================================
// КАТАНЫ ОҢДОО: NaN, null маанилерин нөлгө айландыруучу форматтоо функциясы
// =========================================================
const formatAmount = (amount, currency = "сом") => {
    // NaN, null, undefined же бош сап болсо, 0 катары иштетүү
    const numericAmount = isNaN(Number(amount)) || amount === null || amount === "" ? 0 : Number(amount);

  return new Intl.NumberFormat('ky-KG', {
    style: 'currency',
    currency: 'KGS', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount).replace('KGS', currency).trim(); 
};

const categoryColors = {
  "💰": ["#FFD700", "#FFA500"], 
  "📱": ["#00BFFF", "#1E90FF"], 
  "🏠": ["#32CD32", "#228B22"], 
  "🚗": ["#FF4500", "#FF6347"], 
  "✈️": ["#BA55D3", "#8A2BE2"] 
};

// КАТАНЫ ОҢДОО: localStorage'дон жүктөлгөндө сандык түрдү камсыз кылуу
const getInitialGoals = () => {
    const savedGoals = localStorage.getItem('financialGoals');
    if (savedGoals) {
        try {
            const goals = JSON.parse(savedGoals);
            return goals.map(goal => ({
                ...goal,
                target: Number(goal.target) || 0, // Сөзсүз Number
                saved: Number(goal.saved) || 0   // Сөзсүз Number
            }));
        } catch (e) {
            console.error("Local Storage'дан максаттарды жүктөө катасы:", e);
            // Ката болсо, демейки максаттарды кайтаруу
            return [
                { id: 1, title: "Телефон алуу", target: 50000, saved: 12000, icon: "📱" },
                { id: 2, title: "Саякат", target: 80000, saved: 30000, icon: "✈️" }
            ];
        }
    }
    // Демейки Максаттар
    return [
        { id: 1, title: "Телефон алуу", target: 50000, saved: 12000, icon: "📱" },
        { id: 2, title: "Саякат", target: 80000, saved: 30000, icon: "✈️" }
    ];
};

function Goals({ darkMode = false }) { 
  const [goals, setGoals] = useState(getInitialGoals);
  
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(""); 
  const [icon, setIcon] = useState("💰");
  
  const [addAmount, setAddAmount] = useState(1000); 
  const [addType, setAddType] = useState("add"); 

    // localStorage-ка сактоо
    useMemo(() => {
        localStorage.setItem('financialGoals', JSON.stringify(goals));
    }, [goals]);

  const addGoal = () => {
        const targetValue = Number(target); 
    if (!title || targetValue <= 0 || isNaN(targetValue)) {
      return alert("Максаттын аталышын жана оң сандагы керектүү сумманы толтуруңуз!");
    }
    setGoals([
      ...goals,
      {
        id: Date.now(),
        title,
        target: targetValue,
        saved: 0,
        icon
      }
    ]);
    setTitle("");
    setTarget("");
  };

  const updateGoalSavedAmount = (id, amount) => {
        const numericAmount = Number(amount);
    if (numericAmount <= 0 || isNaN(numericAmount)) return; 
    
    const finalAmount = addType === "add" ? numericAmount : -numericAmount;

    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newSaved = Math.max(0, Number(goal.saved) + finalAmount); 
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
    
    const bgColor = darkMode ? "#121212" : "#f5f5f5";
    const cardBgColor = darkMode ? "#1f1f1f" : "#fff";
    const textColor = darkMode ? "#fff" : "#333";

  return (
    <div style={{ padding: "20px", paddingBottom: "90px", background: bgColor, minHeight: "100vh", color: textColor }}>
      <h2 style={{ marginBottom: "20px" }}>🎯 Финансылык максаттар</h2>
        
        {/* 💡 Максаттар боюнча Кеңештер блогу */}
      <div className="goals-analysis-box" style={{ 
          padding: '15px', 
          border: '1px solid #6200ee', 
          borderRadius: '10px', 
          marginBottom: '25px',
          whiteSpace: 'pre-wrap', 
          backgroundColor: darkMode ? "#1f1f2f" : '#e8e6ff', 
          color: darkMode ? "#bb86fc" : '#3700b3',
          borderLeft: '5px solid #6200ee'
      }}>
          <h3>💡 Максаттар боюнча Кеңештер:</h3>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.4' }}>
              {getGoalsAnalysisComment(goals)} 
          </p>
      </div>


      {/* Максат кошуу */}
      <div style={{
        background: cardBgColor,
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
          style={{ 
                width: "100%", 
                padding: "8px", 
                marginBottom: "8px", 
                borderRadius: "8px", 
                border: "1px solid #ccc",
                backgroundColor: darkMode ? "#333" : "#fff",
                color: textColor
            }}
        />

        <input
          type="number"
          placeholder="Керектүү сумма (сом)"
          value={target}
          onChange={e => setTarget(e.target.value)}
          style={{ 
                width: "100%", 
                padding: "8px", 
                marginBottom: "8px", 
                borderRadius: "8px", 
                border: "1px solid #ccc",
                backgroundColor: darkMode ? "#333" : "#fff",
                color: textColor 
            }}
        />

        <select value={icon} onChange={e => setIcon(e.target.value)} style={{ 
            width: "100%", 
            padding: "8px", 
            marginBottom: "8px", 
            borderRadius: "8px", 
            border: "1px solid #ccc",
            backgroundColor: darkMode ? "#333" : "#fff",
            color: textColor
        }}>
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
      {goals.length === 0 ? (
             <p>Учурда эч кандай максат жок.</p>
        ) : (
             goals.map(goal => {
                // Коопсуз сандык маанилерди алуу
                const targetAmount = Number(goal.target) || 0;
                const savedAmount = Number(goal.saved) || 0;
                
                // Прогрессти эсептөө: targetAmount 0 болбошун текшерүү
                const progress = targetAmount > 0 ? (savedAmount / targetAmount) : 0;
                const percent = Math.min(Math.round(progress * 100), 100); // 100% дан ашпасын
            
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
                                    pathColor: percent >= 100 ? '#00e676' : '#fff', 
                                    textColor: '#fff',
                                    trailColor: 'rgba(255,255,255,0.3)'
                                })}
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: "18px" }}>{goal.icon} {goal.title}</h3>
                            <p style={{ margin: "4px 0" }}>
                                **{formatAmount(savedAmount)}** / **{formatAmount(targetAmount)}**
                            </p>
                            <p style={{ color: percent >= 100 ? '#00e676' : '#fff', fontWeight: 'bold', margin: "4px 0", fontSize: "14px" }}>
                                {percent >= 100 ? '✅ Аткарылды!' : `${formatAmount(targetAmount - savedAmount)} калды`}
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
                                    onChange={e => setAddAmount(e.target.value)} 
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
                                        marginLeft: 'auto' 
                                    }}
                                >
                                    🗑️ Өчүрүү
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })
        )}
    </div>
  );
}

export default Goals;