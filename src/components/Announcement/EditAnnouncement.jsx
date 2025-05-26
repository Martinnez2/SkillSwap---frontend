import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAnnouncementById,
  updateAnnouncement,
} from "../../services/announcementService";
import "../../styles/AddAnnouncement.css";

const EditAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieramy loggedInUser tylko raz na render (nie w useEffect)
  const loggedInUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      setError(null);

      try {
        const announcement = await getAnnouncementById(Number(id));
        if (!announcement) {
          alert("Ogłoszenie nie znalezione.");
          return navigate("/");
        }

        // Sprawdzenie uprawnień
        if (
          loggedInUser?.userId !== announcement.userId &&
          loggedInUser?.role !== "ADMIN"
        ) {
          alert("Nie masz uprawnień do edycji tego ogłoszenia.");
          return navigate("/");
        }

        setFormData({
          ...announcement,
          visibility: announcement.visibility || "WORLD", // zabezpieczenie na null/undefined
        });
      } catch (err) {
        console.error("Błąd podczas pobierania ogłoszenia:", err);
        setError("Wystąpił błąd podczas ładowania ogłoszenia.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id, navigate, loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updated = await updateAnnouncement(formData);
      if (!updated) {
        alert("Nie udało się zapisać zmian.");
        return;
      }
      navigate(`/announcement/${formData.id}`);
    } catch (err) {
      console.error("Błąd przy aktualizacji ogłoszenia:", err);
      alert("Nie udało się zapisać zmian.");
    }
  };

  if (loading) return <p>Ładowanie ogłoszenia...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!formData) return null;

  return (
    <div className="add-announcement-container">
      <div className="form-box">
        <div className="form-intro">
          <h2>Edytuj ogłoszenie</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-left">
              <label>Tytuł:</label>
              <input
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
            <button type="submit">Zapisz zmiany</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAnnouncement;
