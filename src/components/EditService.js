import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditService() {
  const { id } = useParams(); // Получаем ID услуги из URL
  const [service, setService] = useState(null); // Храним объект услуги
  const [isLoading, setIsLoading] = useState(true); // Индикатор загрузки данных
  const navigate = useNavigate();

  // Универсальные типы услуг, добавляем разные категории
  const serviceTypesByCategory = {
    "Бизнес услуги": [
      "Услуги доступа/аренды",
      "Услуги управления",
      "Услуги ремонта",
      "Кастодиальные услуги",
      "Услуги администрирования",
      "Услуги эксплуатации",
      "Услуги создания",
    ],
    "Технические услуги": [
      "Техническая поддержка",
      "Настройка оборудования",
      "Обслуживание оборудования",
      "Услуги мониторинга",
      "Услуги диагностики",
      "Услуги модернизации",
      "Обновление ПО",
    ],
  };

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/services/${id}`);
      setService(response.data);
      setIsLoading(false); // Завершаем загрузку
    } catch (error) {
      console.error("Ошибка загрузки данных услуги:", error);
      alert("Не удалось загрузить данные услуги.");
      navigate("/services"); // Возвращаемся на список
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!service.name || !service.service_type || !service.description || !service.price) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:5000/services/${id}`, service);
      alert("Услуга успешно обновлена!");
      navigate(service.vibor === "Бизнес услуги" ? "/business-services" : "/technical-services");
    } catch (error) {
      console.error("Ошибка при обновлении услуги:", error);
      alert("Не удалось обновить услугу.");
    }
  };

  const handleChange = (field, value) => {
    setService((prevService) => ({
      ...prevService,
      [field]: value,
    }));
  };

  if (isLoading) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Редактировать услугу</h2>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>
          Категория:
          <select
            value={service.vibor}
            onChange={(e) => handleChange("vibor", e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
            disabled
          >
            <option value="Бизнес услуги">Бизнес услуги</option>
            <option value="Технические услуги">Технические услуги</option>
          </select>
        </label>
        <label>
          Название услуги:
          <input
            type="text"
            value={service.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          />
        </label>
        <label>
          Тип услуги:
          <select
            value={service.service_type}
            onChange={(e) => handleChange("service_type", e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          >
            <option value="">Выберите тип услуги</option>
            {serviceTypesByCategory[service.vibor]?.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          Описание:
          <textarea
            value={service.description}
            onChange={(e) => handleChange("description", e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          />
        </label>
        <label>
          Цена:
          <input
            type="number"
            value={service.price}
            onChange={(e) => handleChange("price", e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          />
        </label>
        <label>
          Цена за:
          <select
            value={service.price_unit}
            onChange={(e) => handleChange("price_unit", e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          >
            <option value="за единицу">за единицу</option>
            <option value="за час">за час</option>
            <option value="за проект">за проект</option>
          </select>
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
            onClick={() =>
              navigate(service.vibor === "Бизнес услуги" ? "/business-services" : "/technical-services")
            }
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

export default EditService;
