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

  useEffect(() => {
    const announcement = getAnnouncementById(Number(id));
    if (announcement) {
      setFormData(announcement);
    } else {
      alert("Ogłoszenie nie znalezione");
      navigate("/");
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAnnouncement(formData);
    navigate(`/announcement/${formData.id}`);
  };

  if (!formData) return <p>Ładowanie...</p>;

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
