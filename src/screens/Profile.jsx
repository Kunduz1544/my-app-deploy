import { useState, useEffect } from "react";

function Profile({ darkMode = false }) {
  const [name, setName] = useState("Кундуз Жанузакова");
  const [email, setEmail] = useState("kunduzzanuzakova05@gmail.com");
  const [avatar, setAvatar] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // LocalStorage'дан окуу
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    if (savedProfile) {
      setName(savedProfile.name);
      setEmail(savedProfile.email);
      setAvatar(savedProfile.avatar);
    }
  }, []);

  // Сактоо
  const saveProfile = () => {
    if (!isValidEmail(email)) {
      alert("Туура email киргизиңиз!");
      return;
    }

    localStorage.setItem(
      "profile",
      JSON.stringify({ name, email, avatar })
    );
    alert("Профиль сакталды!");
  };

  // Сүрөт жүктөө
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const changePassword = () => {
    if (!newPassword) {
      alert("Жаңы паролду жазыңыз");
      return;
    }
    if (newPassword.length < 6) {
      alert("Пароль 6+ символ болушу керек");
      return;
    }
    setNewPassword("");
    alert("Пароль ийгиликтүү өзгөртүлдү!");
  };

  const getPasswordStrength = (pass) => {
    if (pass.length > 8 && /[A-Z]/.test(pass) && /\d/.test(pass)) return "Күчтүү";
    if (pass.length >= 6) return "Орточо";
    return "Жуурт";
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  return (
    <div style={{
      padding: "20px",
      paddingBottom: "80px",
      backgroundColor: darkMode ? "#121212" : "#f5f5f5",
      color: darkMode ? "#fff" : "#333",
      minHeight: "100vh"
    }}>
      <h2 style={{ marginBottom: "20px" }}>Менин профилим</h2>

      {/* Профиль карточка */}
      <div style={{
        maxWidth: "400px",
        margin: "0 auto",
        background: darkMode ? "#1e1e1e" : "#fff",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.7)" : "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        {/* Сүрөт */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="Профиль"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${darkMode ? "#bb86fc" : "#6200ee"}`,
              marginBottom: "10px"
            }}
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" style={{
              padding: "8px 15px",
              background: "#6200ee",
              color: "#fff",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}>
              Выбрать файл
            </label>
          </div>
        </div>

        {/* Аты жана Email */}
        <label>Атыңыз:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle(darkMode)} />

        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle(darkMode)} />

        <button onClick={saveProfile} style={buttonStyle(darkMode)}>Сактоо</button>

        <hr style={{ margin: "25px 0", borderColor: darkMode ? "#333" : "#ccc" }} />

        {/* Пароль */}
        <h3>Пароль өзгөртүү</h3>
        <input
          type="password"
          placeholder="Жаңы пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle(darkMode)}
        />
        {newPassword && <p>Күчү: {getPasswordStrength(newPassword)}</p>}
        <button onClick={changePassword} style={{ ...buttonStyle(darkMode), backgroundColor: "#b00020" }}>
          Пароль өзгөртүү
        </button>
      </div>
    </div>
  );
}

const inputStyle = (darkMode) => ({
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: darkMode ? "#555" : "#ccc",
  backgroundColor: darkMode ? "#1e1e1e" : "#fff",
  color: darkMode ? "#fff" : "#333"
});

const buttonStyle = (darkMode) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#6200ee",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer"
});

export default Profile;
