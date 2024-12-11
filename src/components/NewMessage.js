import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewMessage() {
  const [senderId, setSenderId] = useState(""); // ID отправителя
  const [receiverId, setReceiverId] = useState(""); // ID получателя
  const [subject, setSubject] = useState(""); // Тема сообщения
  const [message, setMessage] = useState(""); // Текст сообщения
  const [users, setUsers] = useState([]); // Список пользователей
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка обязательных полей
    if (!senderId || !receiverId || !message) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    const payload = {
      sender_id: parseInt(senderId, 10),
      receiver_id: parseInt(receiverId, 10),
      subject,
      message,
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/messages", payload);
      alert("Сообщение успешно отправлено!");
      navigate("/messenger");
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      alert("Не удалось отправить сообщение");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Новое сообщение</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Отправитель:</label>
          <select
            onChange={(e) => setSenderId(e.target.value)}
            value={senderId}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          >
            <option value="">Выберите отправителя</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fio}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Получатель:</label>
          <select
            onChange={(e) => setReceiverId(e.target.value)}
            value={receiverId}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          >
            <option value="">Выберите получателя</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fio}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Тема сообщения:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Сообщение:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
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
            Отправить
          </button>
          <button
            type="button"
            onClick={() => navigate("/messenger")}
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

export default NewMessage;
