// src/App.js - 100% Туура Иштеген Акыркы Код

import React, { useState, useEffect } from 'react';
import './App.css'; 

// 1. firebase.js файлынан auth объектисин импорттоо
import { auth } from './firebase'; 

// 2. Firebase-дин аутентификация функцияларын импорттоо
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,     
  signOut,                        
  onAuthStateChanged              
} from "firebase/auth";

function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Колдонуучунун абалын көзөмөлдөө
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); 
      setError('');
    });
    return unsubscribe;
  }, []);

  // --- Функциялар ---

  // 1. Каттоо (Регистрация)
  const handleSignUp = async () => {
    // Паролду жана Email'ди текшерүү
    if (!email || !password || password.length < 6) {
        setError("Email форматы туура болушу керек жана Пароль 6 белгиден кем болбошу керек.");
        return;
    }
    try {
      setError('');
      await createUserWithEmailAndPassword(auth, email, password); 
      setEmail('');
      setPassword('');
    } catch (e) {
      setError("Катталуу катасы: " + e.message);
    }
  };

  // 2. Кирүү (Login)
  const handleSignIn = async () => {
    if (!email || !password) {
        setError("Email жана Пароль талааларын толтуруңуз.");
        return;
    }
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword(''); 
    } catch (e) {
      setError("Кирүү катасы: Email же пароль туура эмес.");
    }
  };

  // 3. Чыгуу (Logout)
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      setError("Чыгуу катасы: " + e.message);
    }
  };

  // --- UI Компоненттерин Чыгаруу ---
  
  // Эгер колдонуучу КИРГЕН болсо: Личный Кабинет
  if (currentUser) {
    return (
      <div className="App">
        <h1 style={{ color: 'green' }}>✅ Кош келиңиз, Личный Кабинет!</h1>
        <p>Кирген $Email$: <strong>{currentUser.email}</strong></p>
        
        {/* ❗️❗️❗️ СИЗДИН НЕГИЗГИ МААЛЫМАТТАРЫҢЫЗ БУЛ ЖЕРДЕ ❗️❗️❗️ */}
        <div style={{ padding: '20px', border: '2px dashed #007bff', margin: '20px auto', maxWidth: '600px', textAlign: 'left' }}>
            <h2>Менин Жеке Маалыматтарым</h2>
            <p>Бул жерге **мурунку $React$ коддогу мазмунуңузду** (компоненттерди, таблицаларды, маалыматтарды) көчүрүп, чаптаңыз.</p>
            <p>Мисалы: Сиздин Dashboard компонентиңиз бул жерге келет.</p>
        </div>
        {/* ❗️❗️❗️ ❗️❗️❗️ ❗️❗️❗️ */}

        <button onClick={handleSignOut} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', marginTop: '15px' }}>
          Чыгуу ({currentUser.email})
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  // Эгер колдонуучу КИРЕ ЭЛЕК болсо: Кирүү/Катталуу Формасы
  return (
    <div className="App" style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Сайтка Кирүү же Катталуу</h1>
      
      {/* Email талаасы */}
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email дареги"
        style={{ padding: '10px', margin: '5px', width: '250px', border: '1px solid #ccc' }}
      />
      
      {/* Пароль талаасы */}
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль (мин. 6 белги)"
        style={{ padding: '10px', margin: '5px', width: '250px', border: '1px solid #ccc' }}
      />
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleSignIn} 
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px', borderRadius: '5px' }}>
          Кирүү (Login)
        </button>
        
        <button 
          onClick={handleSignUp}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
          Катталуу (Sign Up)
        </button>
      </div>

      {/* Ката жөнүндө билдирүү */}
      {error && <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>{error}</p>}
    </div>
  );
}

export default App;