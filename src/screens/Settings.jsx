import { useState } from "react";

const availableCurrencies = {
  KGS: "Кыргыз сому (KGS)",
  USD: "АКШ доллары (USD)",
  EUR: "Евро (EUR)",
  KZT: "Казакстан тенгеси (KZT)",
  RUB: "Орус рубли (RUB)",
};

// **МААНИЛҮҮ: items жана setItems пропсторун кошуу**
function Settings({ darkMode, setDarkMode, currency, setCurrency, notifications, setNotifications, items, setItems }) {
  const [showExtra, setShowExtra] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotifications(!notifications);

  // * 1. Чыгым/Киреше тарыхын тазалоо (clearHistory ордуна setItems колдонулат)
  const handleClearHistory = () => {
    if (window.confirm("ЭСКЕРТҮҮ: Чыгым/Киреше тарыхындагы бардык маалыматтар өчүрүлөт. Улантасызбы?")) {
      setItems([]); // Транзакциялар тизмесин толугу менен тазалайт
      alert("Транзакциялар тарыхы тазаланды!");
    }
  };

  // * 2. Маалыматтарды экспорттоо (items.length катасын оңдоо үчүн кошумча текшерүү)
  const exportData = () => {
    // items бар экенин жана анын узундугу бар экенин текшерүү
    if (!items || items.length === 0) { 
      alert("Экспорттоо үчүн маалымат жок.");
      return;
    }
    
    const dataStr = JSON.stringify(items, null, 2); 
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("Маалыматтар ийгиликтүү экспорттолду!");
  };

  // * 3. Маалыматтарды импорттоо
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedItems = JSON.parse(e.target.result);
          if (Array.isArray(importedItems) && importedItems.every(i => typeof i.id === 'number' && typeof i.amount === 'number' && i.type)) {
            const replace = window.confirm("Импорттолгон маалыматтарды учурдагы транзакциялар менен АЛМАШТЫРАСЫЗБЫ? (Жок десеңиз, кошулат)");
            
            if (replace) {
                setItems(importedItems);
            } else {
                const mergedItems = [...items, ...importedItems.map(item => ({...item, id: Date.now() + Math.random()}))];
                setItems(mergedItems);
            }
            alert("Маалыматтар ийгиликтүү импорттолду!");
          } else {
            alert("Импорттолгон файлдын форматы туура эмес же маалыматтар бузулган.");
          }
        } catch (error) {
          alert("Файлды окууда ката кетти: " + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const showAppInfo = () => {
    alert(
      `Колдонмо жөнүндө:\n\nАты: Менин Бюджетим\nВерсия: 1.1.1\nМаксат: Киреше/чыгымды башкаруу, максаттарды коюу, айлык отчет алуу\nКонтакт: kunduzzanuzakova05@gmail.com`
    );
  };
  
  // ---------------- Стиль функциялары ----------------
  const buttonStyle = {
    cursor: 'pointer',
    padding: '10px 15px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: darkMode ? '#3700b3' : '#6200ee',
    color: '#fff',
    fontWeight: 'bold',
    transition: '0.3s',
    marginBottom: '10px',
    width: '100%',
    textAlign: 'left'
  };

  const sectionStyle = {
    padding: '20px',
    borderRadius: '15px',
    backgroundColor: darkMode ? '#1e1e1e' : '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    marginBottom: '20px',
    transition: '0.3s'
  };

  const toggleCircle = (active) => ({
    position: 'absolute',
    top: '3px',
    left: active ? '24px' : '3px',
    width: '22px',
    height: '22px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: '0.3s'
  });
  
  const switchStyle = {
    position: 'relative',
    width: '50px',
    height: '28px',
    borderRadius: '28px',
    cursor: 'pointer',
    transition: '0.3s',
    flexShrink: 0,
  };
  // --------------------------------------------------


  return (
    <div style={{ padding: '20px', paddingBottom: '80px', backgroundColor: darkMode ? '#121212' : '#f5f5f5', minHeight: '100vh', color: darkMode ? '#fff' : '#333' }}>
      <h2>⚙️ Настройкалар</h2>

      {/* 1. Негизги настройкалар */}
      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid ' + (darkMode ? '#333' : '#eee'), paddingBottom: '10px' }}>Жалпы</h3>

        {/* Валюта */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="currency-select">
            **Валюта**
          </label>
          <select 
            id="currency-select"
            value={currency} 
            onChange={e => setCurrency(e.target.value)} 
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333' }}
          >
            {Object.keys(availableCurrencies).map(key => (
              <option key={key} value={key}>{availableCurrencies[key]}</option>
            ))}
          </select>
        </div>

        {/* Билдирмелер */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>**Билдирмелер**</span>
          <div style={{...switchStyle, backgroundColor: notifications ? '#03dac6' : '#ccc'}} onClick={toggleNotifications}>
            <div style={toggleCircle(notifications)} />
          </div>
        </div>

        {/* Кара тема */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>**Кара тема**</span>
          <div style={{...switchStyle, backgroundColor: darkMode ? '#03dac6' : '#ccc'}} onClick={toggleDarkMode}>
            <div style={toggleCircle(darkMode)} />
          </div>
        </div>
      </div>

      {/* 2. Коопсуздук жана Маалыматтар */}
      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid ' + (darkMode ? '#333' : '#eee'), paddingBottom: '10px', cursor: 'pointer', color: '#6200ee' }} onClick={() => setShowExtra(!showExtra)}>
          Коопсуздук жана Маалыматтар {showExtra ? '▲' : '▼'}
        </h3>
        {showExtra && (
          <div style={{ marginTop: '15px' }}>
            
            {/* Маалыматтарды тазалоо */}
            <button
              onClick={handleClearHistory} 
              style={{...buttonStyle, backgroundColor: '#b00020'}} 
            >
              🗑️ Чыгым/Киреше тарыхын тазалоо
            </button>
            
            {/* Экспорттоо */}
            <button
              onClick={exportData}
              style={buttonStyle}
            >
              ⬇️ Маалыматты экспорттоо (JSON)
            </button>
            
            {/* Импорттоо */}
            <div style={{...buttonStyle, position: 'relative', overflow: 'hidden', padding: 0, backgroundColor: darkMode ? '#03dac6' : '#018786'}}>
                <span style={{padding: '10px 15px', display: 'block', color: darkMode ? '#333' : '#fff'}}>⬆️ Маалыматты импорттоо (JSON)</span>
                <input 
                    type="file" 
                    accept=".json" 
                    onChange={importData} 
                    style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer'}} 
                />
            </div>

          </div>
        )}
      </div>
      
      {/* 3. Колдонмо жөнүндө */}
      <div style={sectionStyle}>
        <button
          onClick={showAppInfo}
          style={buttonStyle}
        >
          ℹ️ Колдонмо жөнүндө
        </button>
      </div>

    </div>
  );
}

export default Settings;