import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ViewIncident() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncident();
  }, []);

  const fetchIncident = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/incidents/${id}`);
      setIncident(response.data);
    } catch (error) {
      console.error("Ошибка загрузки данных инцидента:", error);
      alert("Не удалось загрузить данные инцидента.");
    }
  };

  if (!incident) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Детали инцидента</h2>
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>ID:</span>
          <span style={styles.value}>{incident.id}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Тема:</span>
          <span style={styles.value}>{incident.theme}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Статус:</span>
          <span style={styles.value}>{incident.status}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Услуга:</span>
          <span style={styles.value}>{incident.service_name}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Ответственный:</span>
          <span style={styles.value}>{incident.responsible}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Инициатор:</span>
          <span style={styles.value}>{incident.initiator}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Комментарий:</span>
          <span style={styles.value}>{incident.comment || "Отсутствует"}</span>
        </div>
      </div>
      <button
        onClick={() => navigate("/incidents")}
        style={styles.button}
      >
        Назад
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "'Arial', sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    padding: "8px 0",
    borderBottom: "1px solid #ddd",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    color: "#333",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default ViewIncident;
