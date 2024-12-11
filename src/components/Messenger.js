import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserFIO } from "./globals";

function Messenger() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentFIO = getUserFIO(); // Получаем текущее ФИО пользователя

  useEffect(() => {
    console.log(`Текущее ФИО пользователя: ${currentFIO}`);
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.fio);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/users");
      const otherUsers = response.data.filter((user) => user.fio !== currentFIO);
      setUsers(otherUsers);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    }
  };

  const fetchMessages = async (targetFIO) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/dialog?user1=${encodeURIComponent(currentFIO)}&user2=${encodeURIComponent(targetFIO)}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post("http://127.0.0.1:5000/messages", {
        sender: currentFIO,
        receiver: selectedUser.fio,
        message: newMessage,
      });
      setNewMessage("");
      fetchMessages(selectedUser.fio);
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Список пользователей */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", overflowY: "auto" }}>
        <h3>Пользователи</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: selectedUser?.fio === user.fio ? "#f0f0f0" : "white",
              }}
              onClick={() => setSelectedUser(user)}
            >
              {user.fio}
            </li>
          ))}
        </ul>
      </div>

      {/* Диалог с выбранным пользователем */}
      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
        {selectedUser ? (
          <>
            <h3>Диалог с {selectedUser.fio}</h3>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                border: "1px solid #ccc",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <strong>{msg.sender === currentFIO ? "Вы" : selectedUser.fio}:</strong>
                    <p>{msg.message}</p>
                  </div>
                ))
              ) : (
                <p>Сообщений пока нет.</p>
              )}
            </div>

            {/* Поле ввода сообщения */}
            <div style={{ display: "flex" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение..."
                style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  marginLeft: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Отправить
              </button>
            </div>
          </>
        ) : (
          <p>Выберите пользователя для начала диалога.</p>
        )}
      </div>
    </div>
  );
}

export default Messenger;
