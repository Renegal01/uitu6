import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditIncident() {
  const { id } = useParams(); // Получаем ID инцидента из URL
  const [theme, setTheme] = useState("");
  const [status, setStatus] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [responsible, setResponsible] = useState("");
  const [initiator, setInitiator] = useState("");
  const [comment, setComment] = useState(""); // Поле для комментария
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncident();
    fetchServices();
    fetchUsers();
  }, []);

  const fetchIncident = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/incidents/${id}`);
      const incident = response.data;
      setTheme(incident.theme);
      setStatus(incident.status);
      setServiceId(incident.service_id);
      setResponsible(incident.responsible);
      setInitiator(incident.initiator);
      setComment(incident.comment); // Устанавливаем комментарий
    } catch (error) {
      console.error("Ошибка загрузки данных инцидента:", error);
      alert("Не удалось загрузить данные инцидента.");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/services");
      setServices(response.data);
    } catch (error) {
      console.error("Ошибка загрузки списка услуг:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Ошибка загрузки списка пользователей:", error);
    }
  };

  const updateIncident = async (event) => {
    event.preventDefault();
    if (!theme || !status || !serviceId || !responsible || !initiator) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:5000/incidents/${id}`, {
        theme,
        status,
        service_id: serviceId,
        responsible,
        initiator,
        comment, // Передаем комментарий
      });
      alert("Инцидент успешно обновлён!");
      navigate("/incidents");
    } catch (error) {
      console.error("Ошибка при обновлении инцидента:", error);
      alert("Ошибка при обновлении инцидента.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Редактировать инцидент</h2>
      <form onSubmit={updateIncident} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>
          Тема инцидента:
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          />
        </label>
        <label>
          Статус:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          >
            <option value="Открыт">Открыт</option>
            <option value="В работе">В работе</option>
            <option value="Закрыт">Закрыт</option>
          </select>
        </label>
        <label>
          Услуга:
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          >
            <option value="">Выберите услугу</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ответственный:
          <select
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          >
            <option value="">Выберите ответственного</option>
            {users.map((user) => (
              <option key={user.id} value={user.fio}>
                {user.fio}
              </option>
            ))}
          </select>
        </label>
        <label>
          Инициатор:
          <select
            value={initiator}
            onChange={(e) => setInitiator(e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          >
            <option value="">Выберите инициатора</option>
            {users.map((user) => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </label>
        <label>
          Комментарий:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          />
        </label>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Сохранить
          </button>
          <button
            type="button"
            onClick={() => navigate("/incidents")}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditIncident;
