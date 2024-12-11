import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/incidents");
      setIncidents(response.data);
    } catch (error) {
      console.error("Ошибка загрузки инцидентов:", error);
    }
  };

  const deleteIncident = async (incidentId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот инцидент?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/incidents/${incidentId}`);
        fetchIncidents();
      } catch (error) {
        console.error("Ошибка при удалении инцидента:", error);
      }
    }
  };

  const handleEdit = (incident) => {
    navigate(`/edit-incident/${incident.id}`);
  };

  const handleView = (incident) => {
    navigate(`/view-incident/${incident.id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Список инцидентов</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "10px" }}>ID</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Тема</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Статус</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Услуга</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Ответственный</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Инициатор</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Комментарий</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <td style={{ border: "1px solid black", padding: "10px" }}>{incident.id}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{incident.theme}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{incident.status}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{incident.service_name}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{incident.responsible}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{incident.initiator}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{incident.comment}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  <button onClick={() => handleView(incident)}>Открыть</button>{" "}
                  <button onClick={() => handleEdit(incident)}>Редактировать</button>{" "}
                  <button onClick={() => deleteIncident(incident.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/new-incident")}
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
          Добавить новый инцидент
        </button>
      </div>
    </div>
  );
}

export default Incidents;
