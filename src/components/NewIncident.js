import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewIncident() {
  const [theme, setTheme] = useState("");
  const [status, setStatus] = useState("Открыт");
  const [serviceId, setServiceId] = useState("");
  const [responsible, setResponsible] = useState("Не назначено");
  const [initiator, setInitiator] = useState("");
  const [comment, setComment] = useState(""); // Новое поле для комментария
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/services");
        setServices(response.data);
      } catch (error) {
        console.error("Ошибка загрузки услуг:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
      }
    };

    fetchServices();
    fetchUsers();

    const savedRole = localStorage.getItem("role");
    const savedUsername = localStorage.getItem("username");

    if (savedRole) {
      setRole(savedRole);

      if (savedRole === "user" && savedUsername) {
        setInitiator(savedUsername);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!theme || !serviceId || !initiator) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    const payload = {
      theme,
      status,
      service_id: parseInt(serviceId, 10),
      responsible: role === "user" ? "Не назначено" : responsible,
      initiator,
      comment, // Передача комментария
    };

    try {
      await axios.post("http://127.0.0.1:5000/incidents", payload);
      alert("Инцидент успешно добавлен!");
      navigate("/incidents");
    } catch (error) {
      console.error("Ошибка при сохранении инцидента:", error);
      alert("Не удалось сохранить инцидент");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Добавить новый инцидент</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Тема инцидента:</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Выберите услугу:</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              marginBottom: "10px",
            }}
          >
            <option value="">Выберите услугу</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        {role !== "user" && (
          <div style={{ marginBottom: "10px" }}>
            <label>Ответственный:</label>
            <select
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            >
              <option value="Не назначено">Не назначено</option>
              {users.map((user) => (
                <option key={user.id} value={user.fio}>
                  {user.fio}
                </option>
              ))}
            </select>
          </div>
        )}
        <div style={{ marginBottom: "10px" }}>
          <label>Инициатор:</label>
          <select
            value={initiator}
            onChange={(e) => setInitiator(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              marginBottom: "10px",
            }}
          >
            <option value="">Выберите инициатора</option>
            {users.map((user) => (
              <option key={user.id} value={user.fio}>
                {user.fio}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Комментарий:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              marginBottom: "10px",
            }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Сохранить
          </button>
          <button
            type="button"
            onClick={() => navigate("/incidents")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewIncident;
