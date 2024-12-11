import React, { useState, useEffect } from "react";
import axios from "axios";

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/services");
      setServices(response.data);
    } catch (error) {
      console.error("Ошибка загрузки услуг:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Все услуги</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "10px" }}>ID</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Тип услуги</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Название</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.id}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.service_type}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{service.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Services;
