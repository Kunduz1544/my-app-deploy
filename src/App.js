import { useState, useEffect } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";

import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import Goals from "./screens/Goals";

// Жардамчы функция: Баштапкы маалыматтарды localStorage-дон жүктөө
const getInitialItems = () => {
    const savedItems = localStorage.getItem('budgetItems');
    if (savedItems) {
        return JSON.parse(savedItems);
    }
    // Демейки маалыматтар (Анализ иштеши үчүн Киреше керек)
    return [
        { id: 101, type: 'Киреше', amount: 50000, category: 'Эмгек акы', date: new Date().toISOString().split("T")[0] }, 
    ];
};

function App() {
    const [screen, setScreen] = useState("home");

    const [darkMode, setDarkMode] = useState(false);
    const [currency, setCurrency] = useState("KGS");
    const [notifications, setNotifications] = useState(true);
    
    // items мамлекети (state)
    const [items, setItems] = useState(getInitialItems()); 
    
    // useEffect: 'items' өзгөргөн сайын localStorage-ка сактоо
    useEffect(() => {
        localStorage.setItem('budgetItems', JSON.stringify(items));
    }, [items]);
  
    const renderScreen = () => {
        switch (screen) {
            case "home":
                return (
                    <Home
                        currency={currency}
                        darkMode={darkMode}
                        items={items}
                        setItems={setItems}
                    />
                );

            case "goals":
                return <Goals currency={currency} />;

            case "profile":
                return <Profile />;

            case "settings":
                return (
                    <Settings
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        currency={currency}
                        setCurrency={setCurrency}
                        notifications={notifications}
                        setNotifications={setNotifications}
                        setItems={setItems} // Бардык маалыматты тазалоо үчүн керек
                    />
                );

            default:
                return <Home />;
        }
    };

    return (
        <div
            style={{
                fontFamily: "sans-serif",
                minHeight: "100vh",
                backgroundColor: darkMode ? "#121212" : "#f2f2f2",
                color: darkMode ? "#fff" : "#000"
            }}
        >
            <Header title="Менин Бюджетим" />
            {renderScreen()}
            <BottomNav onChange={setScreen} />
        </div>
    );
}

export default App;