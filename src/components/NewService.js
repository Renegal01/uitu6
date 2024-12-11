import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewService() {
  const [name, setName] = useState("");
  const [vibor, setVibor] = useState("Бизнес услуги"); // Категория услуги
  const [serviceType, setServiceType] = useState(""); // Тип услуги
  const [description, setDescription] = useState(""); // Описание услуги
  const [price, setPrice] = useState(""); // Цена услуги
  const [priceUnit, setPriceUnit] = useState("за единицу"); // Цена за (единицу измерения)
  const navigate = useNavigate();

  // Списки типов услуг для каждой категории
  const businessServiceTypes = [
    "Услуги доступа/аренды",
    "Услуги управления",
    "Услуги ремонта",
    "Кастодиальные услуги",
    "Услуги администрирования",
    "Услуги эксплуатации",
    "Услуги создания",
  ];

  const technicalServiceTypes = [
    "Техническая поддержка",
    "Настройка оборудования",
    "Обслуживание оборудования",
    "Услуги мониторинга",
    "Услуги диагностики",
    "Услуги модернизации",
    "Обновление ПО",
  ];

  // Определяем доступные типы услуг в зависимости от выбранной категории
  const availableServiceTypes = vibor === "Бизнес услуги" ? businessServiceTypes : technicalServiceTypes;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newService = {
        name,
        vibor,
        service_type: serviceType,
        description,
        price: parseFloat(price),
        price_unit: priceUnit,
      };
      console.log("Отправляемые данные:", newService);

      await axios.post("http://127.0.0.1:5000/services", newService);
      alert("Услуга успешно добавлена!");
      navigate("/services");
    } catch (error) {
      console.error("Ошибка при добавлении услуги:", error);
      alert("Ошибка при добавлении услуги.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Добавить новую услугу</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Категория */}
        <label>
          Категория услуги:
          <select
            value={vibor}
            onChange={(e) => setVibor(e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          >
            <option value="Бизнес услуги">Бизнес услуги</option>
            <option value="Технические услуги">Технические услуги</option>
          </select>
        </label>
        {/* Название */}
        <label>
          Название услуги:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          />
        </label>
        {/* Тип услуги */}
        <label>
          Тип услуги:
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          >
            <option value="">Выберите тип услуги</option>
            {availableServiceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        {/* Описание */}
        <label>
          Описание услуги:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          />
        </label>
        {/* Цена */}
        <label>
          Цена услуги:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          />
        </label>
        {/* Цена за */}
        <label>
          Цена за:
          <select
            value={priceUnit}
            onChange={(e) => setPriceUnit(e.target.value)}
            style={{ padding: "5px", fontSize: "14px", width: "100%" }}
          >
            <option value="за единицу">за единицу</option>
            <option value="за час">за час</option>
            <option value="за проект">за проект</option>
          </select>
        </label>
        {/* Кнопки */}
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
            onClick={() => navigate("/services")}
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

export default NewService;
