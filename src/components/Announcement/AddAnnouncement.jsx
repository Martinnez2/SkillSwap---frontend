import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAnnouncement } from "../../services/announcementService";
import "../../styles/AddAnnouncement.css";

const AddAnnouncement = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const isBlocked = loggedInUser?.status?.toUpperCase() === "BANNED";


  const [formData, setFormData] = useState({
    skillId: "",
    title: "",
    description: "",
    visibility: "WORLD",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUser?.name || !loggedInUser?.surname) {
      alert(
        "Musisz uzupełnić imię i nazwisko w profilu, aby dodać ogłoszenie."
      );
      return;
    }

    if (isBlocked) {
      alert("Twoje konto jest zablokowane i nie możesz dodawać ogłoszeń.");
      return;
    }

    if (!formData.title || !formData.description) {
      alert("Tytuł i opis są wymagane.");
      return;
    }

    const newAnnouncement = {
      userId: loggedInUser.id,
      skillId: formData.skillId ? Number(formData.skillId) : null,
      title: formData.title,
      description: formData.description,
      visibility: formData.visibility.toUpperCase(),
    };

    console.log("Tworzę ogłoszenie:", newAnnouncement);

    try {
      await createAnnouncement(newAnnouncement);
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas tworzenia ogłoszenia:", error);
      alert("Nie udało się dodać ogłoszenia. Spróbuj ponownie.");
    }
  };

  return (
    <div className="add-announcement-container">
      <div className="form-box">
        <div className="form-intro">
          <h2>Dodaj ogłoszenie</h2>
          {!isBlocked && (
            <p>
              Wypełnij formularz poniżej, aby podzielić się swoimi
              umiejętnościami.
            </p>
          )}
        </div>

        {isBlocked ? (
          <p className="blocked-message">
            Twoje konto jest zablokowane. Nie możesz dodawać ogłoszeń.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-left">
                <label>Tytuł:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <label>Kategoria umiejętności:</label>
                <select
                  name="skillId"
                  value={formData.skillId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Wybierz kategorię --</option>
                  <option value="1">Sport</option>
                  <option value="2">Języki</option>
                  <option value="3">Muzyka</option>
                  <option value="4">Programowanie</option>
                  <option value="5">Sztuka</option>
                </select>

                <label>Widoczność ogłoszenia:</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  required
                >
                  <option value="WORLD">Dla wszystkich</option>
                  <option value="COUNTRY">Dla kraju</option>
                  <option value="CITY">Dla miasta</option>
                </select>
              </div>

              <div className="form-right">
                <label>Opis:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="description-textarea"
                />
              </div>
            </div>

            <div className="submit-container">
              <button type="submit">Dodaj ogłoszenie</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAnnouncement;
