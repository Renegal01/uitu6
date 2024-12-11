import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TechnicalServices() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/services");
      const technicalServices = response.data.filter(
        (service) => service.vibor === "Технические услуги"
      );
      setServices(technicalServices);
    } catch (error) {
      console.error("Ошибка загрузки технических услуг:", error);
    }
  };

  const deleteService = async (serviceId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту услугу?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/services/${serviceId}`);
        fetchServices();
      } catch (error) {
        console.error("Ошибка при удалении услуги:", error);
      }
    }
  };

  const handleView = (serviceId) => {
    navigate(`/view-service/${serviceId}`);
  };

  const handleEdit = (service) => {
    navigate(`/edit-service/${service.id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Технические услуги</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "10px" }}>ID</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Категория</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Название</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Тип услуги</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Описание</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Цена</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Цена за</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.id}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.vibor}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.name}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.service_type}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.description}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.price}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.price_unit}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  <button onClick={() => handleView(service.id)}>Открыть</button>{" "}
                  <button onClick={() => handleEdit(service)}>Редактировать</button>{" "}
                  <button onClick={() => deleteService(service.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/new-service")}
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
          Добавить новую услугу
        </button>
      </div>
    </div>
  );
}

export default TechnicalServices;
