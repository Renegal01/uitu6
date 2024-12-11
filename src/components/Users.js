import React, { useState, useEffect } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [fio, setFio] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState(""); // Добавляем состояние для пароля
  const [editingUserId, setEditingUserId] = useState(null); // Для отслеживания редактируемого пользователя

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://127.0.0.1:5000/users");
    setUsers(response.data);
  };

  const addUser = async () => {
    if (!username || !fio || !role || !password) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    await axios.post("http://127.0.0.1:5000/users", { username, fio, role, password });
    setUsername("");
    setFio("");
    setRole("");
    setPassword(""); // Очистка поля пароля после добавления
    fetchUsers();
  };

  const updateUser = async () => {
    if (!username || !fio || !role) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    const userData = { username, fio, role };
    if (password) {
      userData.password = password; // Если пароль введен, добавляем его в данные
    }

    await axios.put(`http://127.0.0.1:5000/users/${editingUserId}`, userData);
    setEditingUserId(null); // Сбрасываем редактирование
    setUsername("");
    setFio("");
    setRole("");
    setPassword(""); // Очистка поля пароля после редактирования
    fetchUsers();
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Вы уверены, что хотите удалить пользователя?")) {
      await axios.delete(`http://127.0.0.1:5000/users/${userId}`);
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setUsername(user.username);
    setFio(user.fio);
    setRole(user.role);
    setPassword(user.password); // Пароль оставляем пустым при редактировании
  };

  return (
    <div>
      <h2>Пользователи</h2>
      {/* Форма для добавления или редактирования пользователя */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="ФИО"
        value={fio}
        onChange={(e) => setFio(e.target.value)}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)} // Обработчик изменения роли
      >
        <option value="">Выберите роль</option>
        <option value="admin">Администратор</option>
        <option value="support">Техподдержка</option>
        <option value="user">Пользователь</option>
      </select>
      <input
        type="password" // Поле для пароля
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={editingUserId ? updateUser : addUser}>
        {editingUserId ? "Сохранить изменения" : "Добавить"}
      </button>

      {/* Таблица пользователей */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>Username</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>ФИО</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Роль</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Пароль</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: "1px solid black", padding: "10px" }}>{user.username}</td>
              <td style={{ border: "1px solid black", padding: "10px" }}>{user.fio}</td>
              <td style={{ border: "1px solid black", padding: "10px" }}>{user.role}</td>
              <td style={{ border: "1px solid black", padding: "10px" }}>{user.password}</td>
              <td style={{ border: "1px solid black", padding: "10px" }}>
                <button onClick={() => handleEdit(user)}>Редактировать</button>{" "}
                <button onClick={() => deleteUser(user.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
