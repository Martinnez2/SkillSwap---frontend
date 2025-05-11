import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAnnouncement } from "../../services/announcementService";
import "../../styles/AddAnnouncement.css";

const AddAnnouncement = () => {
  const [formData, setFormData] = useState({
    skillId: "",
    title: "",
    description: "",
    visibility: "PUBLIC",
  });

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const isBlocked = loggedInUser?.status === "blocked";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loggedInUser) {
      alert("Musisz być zalogowany, aby dodać ogłoszenie.");
      return;
    }

    if (isBlocked) {
      alert("Twoje konto jest zablokowane i nie możesz dodawać ogłoszeń.");
      return;
    }

    const newAnnouncement = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      userId: loggedInUser.id,
    };

    createAnnouncement(newAnnouncement);
    navigate("/announcements");
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
