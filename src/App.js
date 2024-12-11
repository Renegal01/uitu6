import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Users from "./components/Users";
import BusinessServices from "./components/BusinessServices";
import TechnicalServices from "./components/TechnicalServices";
import Incidents from "./components/Incidents";
import Messenger from "./components/Messenger";
import NewService from "./components/NewService";
import EditService from "./components/EditService"; // Новый компонент для редактирования услуг
import NewIncident from "./components/NewIncident";
import NewMessage from "./components/NewMessage";
import Login from "./components/Login";
import EditIncident from "./components/EditIncident"; // Новый компонент
import ViewIncident from "./components/ViewIncident";
import ViewService from "./components/ViewService";

function App() {
  const [role, setRole] = useState(""); // Роль пользователя
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Загрузка роли из localStorage при монтировании
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole); // Устанавливаем сохранённую роль
    }
  }, []);

  // Функция для выхода
  const handleLogout = () => {
    setRole(""); // Сбрасываем состояние роли
    localStorage.removeItem("role"); // Удаляем роль из localStorage
    window.location.href = "/login"; // Переход на страницу авторизации
  };

  return (
    <div>
      {!isLoginPage && (
        <div>
          <h1>Антивирусная контора "Каспер"</h1>
          <nav>
            {role === "admin" && (
              <>
                <a href="/users">Пользователи</a> |{" "}
                <a href="/business-services">Бизнес услуги</a> |{" "}
                <a href="/technical-services">Технические услуги</a> |{" "}
                <a href="/incidents">Инциденты</a> |{" "}
                <a href="/messenger">Мессенджер</a>
              </>
            )}
            {role === "support" && (
              <>
                <a href="/business-services">Бизнес услуги</a> |{" "}
                <a href="/technical-services">Технические услуги</a> |{" "}
                <a href="/incidents">Инциденты</a> |{" "}
                <a href="/messenger">Мессенджер</a>
              </>
            )}
            {role === "user" && (
              <>
                <a href="/incidents">Инциденты</a> |{" "}
                <a href="/messenger">Мессенджер</a>
              </>
            )}
          </nav>
          <div style={{ textAlign: "right", margin: "10px" }}>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 15px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Сменить пользователя
            </button>
          </div>
        </div>
      )}
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              setRole={(r) => {
                setRole(r);
                localStorage.setItem("role", r); // Сохраняем роль в localStorage
              }}
            />
          }
        />
        {role === "admin" && <Route path="/users" element={<Users />} />}
        {(role === "admin" || role === "support") && (
          <>
            <Route path="/business-services" element={<BusinessServices />} />
            <Route path="/technical-services" element={<TechnicalServices />} />
            <Route path="/edit-service/:id" element={<EditService />} /> {/* Новый маршрут */}
            <Route path="/edit-incident/:id" element={<EditIncident />} />
          </>
        )}
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/messenger" element={<Messenger role={role} />} />
        <Route path="/new-service" element={<NewService />} />
        <Route path="/new-incident" element={<NewIncident />} />
        <Route path="/new-message" element={<NewMessage />} />
        <Route path="*" element={<Messenger role={role} />} />
        <Route path="/view-incident/:id" element={<ViewIncident />} />
        <Route path="/view-service/:id" element={<ViewService />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
