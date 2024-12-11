import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ViewService() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/services/${id}`);
      setService(response.data);
    } catch (error) {
      console.error("Ошибка загрузки данных услуги:", error);
      alert("Не удалось загрузить данные услуги.");
    }
  };

  if (!service) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Детали услуги</h2>
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>ID:</span>
          <span style={styles.value}>{service.id}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Категория:</span>
          <span style={styles.value}>{service.vibor}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Название:</span>
          <span style={styles.value}>{service.name}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Тип услуги:</span>
          <span style={styles.value}>{service.service_type}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Описание:</span>
          <span style={styles.value}>{service.description}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Цена:</span>
          <span style={styles.value}>{service.price}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Цена за:</span>
          <span style={styles.value}>{service.price_unit}</span>
        </div>
      </div>
      <button
        onClick={() => navigate(-1)}
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

export default ViewService;
