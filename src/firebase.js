// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

// Сиздин уникалдуу Firebase конфигурацияңыз (мурдагыдай туура)
const firebaseConfig = {
  apiKey: "AIzaSyBz6u6tlc44OACU7GyScnv_lJcTGpe4tgU",
  authDomain: "kunduz-react-cabinet.firebaseapp.com",
  projectId: "kunduz-react-cabinet",
  storageBucket: "kunduz-react-cabinet.firebasestorage.app",
  messagingSenderId: "810689373546",
  appId: "1:810689373546:web:6f2bb2dfb5aabe08a57113"
};

// Firebase-ти ишке киргизүү
const app = initializeApp(firebaseConfig);

// Аутентификация кызматын ишке киргизүү жана экспорттоо
export const auth = getAuth(app);