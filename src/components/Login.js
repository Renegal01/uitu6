import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserFIO } from "./globals"; // Импортируем функцию для установки ФИО

function Login({ setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/login", { username, password });
      if (response.status === 200) {
        const userRole = response.data.role; // Получаем роль пользователя
        const userFIO = response.data.fio; // Получаем ФИО пользователя

        setRole(userRole); // Сохраняем роль в состоянии
        setUserFIO(userFIO); // Устанавливаем ФИО в глобальной переменной

        navigate("/users"); // Перенаправляем на страницу /users
      }
    } catch (error) {
      alert("Ошибка авторизации. Проверьте логин и пароль.");
      console.error(error);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleLogin} style={{ width: "300px", textAlign: "center" }}>
        <h2>Авторизация</h2>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Логин:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Пароль:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
