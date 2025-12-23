import { useState, useMemo } from "react";
import Card from "../components/Card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Категорияларды жана түстөрдү туруктуу кылуу
const categories = ["Тамак-аш", "Транспорт", "Коммуналдык", "Башка"];
const COLORS = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#03dac6"];

// Сандарды форматтоо функциясы (мисалы: 12,345.00 KGS)
const formatAmount = (amount, currency) => {
  return new Intl.NumberFormat('ky-KG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

function Home({ items, setItems, currency = "KGS", darkMode = false }) {
  const [inputType, setInputType] = useState("Киреше");
  const [inputAmount, setInputAmount] = useState("");
  const [inputDate, setInputDate] = useState(new Date().toISOString().split("T")[0]);
  const [inputCategory, setInputCategory] = useState(categories[0]);

  const addItem = () => {
    // 0 же терс сандарды кошпоо
    if (!inputAmount || parseFloat(inputAmount) <= 0) return; 
    
    const newItem = {
      id: Date.now(),
      type: inputType,
      amount: parseFloat(inputAmount),
      date: inputDate,
      category: inputType === "Киреше" ? "Эмгек акы" : inputCategory
    };
    setItems([newItem, ...items]); // Жаңы нерсени тизменин башына кошуу
    setInputAmount("");
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Балансты эсептөө (useMemo аркылуу оптималдаштыруу)
  const balance = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.type === "Киреше" ? item.amount : -item.amount), 0);
  }, [items]);

  // Диаграмманын маалыматтарын эсептөө
  const pieData = useMemo(() => {
    const allCategories = [...categories, "Эмгек акы"];
    const data = allCategories.map(cat => ({
      name: cat,
      value: items.filter(i => i.category === cat).reduce((sum, i) => sum + i.amount, 0)
    }));
    
    // Нөлдүк мааниси бар категорияларды алып салуу
    return data.filter(entry => entry.value > 0);
  }, [items]);


  // Транзакцияларды датасы боюнча сорттоо (акыркысы биринчи)
  const sortedItems = items.sort((a,b)=> new Date(b.date) - new Date(a.date));

  return (
    <div style={{ padding: "20px", paddingBottom: "80px", minHeight: "100vh", backgroundColor: darkMode ? "#121212" : "#f2f2f2", color: darkMode ? "#fff" : "#333" }}>
      <h2>💰 Менин бюджетим</h2>

      {/* Баланс */}
      <div style={{
        marginBottom: "20px",
        padding: "20px",
        borderRadius: "15px",
        background: "linear-gradient(135deg, #bb86fc, #6200ee)",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "20px",
        color: "#fff"
      }}>
        Баланс: {formatAmount(balance, currency)}
      </div>

      {/* Форма кошуу */}
      <div style={{ marginBottom: "25px", display: "flex", gap: "10px", flexWrap: "wrap", backgroundColor: darkMode ? "#1f1f1f" : "#fff", padding: "15px", borderRadius: "10px" }}>
        <select value={inputType} onChange={e => setInputType(e.target.value)} style={{ flex: "1 1 100px", padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}>
          <option value="Киреше">Киреше ⬆️</option>
          <option value="Чыгым">Чыгым ⬇️</option>
        </select>

        <input type="number" placeholder="Сумма" value={inputAmount} onChange={e => setInputAmount(e.target.value)} style={{ flex: "1 1 100px", padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }} />

        <input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)} style={{ flex: "1 1 150px", padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }} />

        {inputType === "Чыгым" && (
          <select value={inputCategory} onChange={e => setInputCategory(e.target.value)} style={{ flex: "1 1 120px", padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        )}

        <button onClick={addItem} style={{ flex: "1 1 100px", padding: "8px 15px", background: "linear-gradient(135deg, #6200ee, #3700b3)", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>
          Кошуу
        </button>
      </div>

      <h3>Транзакциялар</h3>
      {/* Транзакциялар тизмеси */}
      {sortedItems.map(item => (
        <Card
          key={item.id}
          title={`${item.type}: ${item.category}`}
          description={`${formatAmount(item.amount, currency)} — ${item.date}`}
          darkMode={darkMode}
        >
          {/* Card ичиндеги "Өчүрүү" баскычы */}
          <button onClick={() => deleteItem(item.id)} style={{ padding: "5px 10px", borderRadius: "5px", border: "none", backgroundColor: "#b00020", color: "#fff", cursor: "pointer", marginLeft: "10px" }}>
            Өчүрүү
          </button>
        </Card>
      ))}

      {/* PieChart */}
      <div style={{ marginTop: "30px", backgroundColor: darkMode ? "#1f1f1f" : "#fff", padding: "15px", borderRadius: "10px" }}>
        <h3>📊 Категориялык отчет</h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => formatAmount(value, currency)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Көрсөтүү үчүн транзакциялар жок.</p>
        )}
      </div>
    </div>
  );
}

export default Home;