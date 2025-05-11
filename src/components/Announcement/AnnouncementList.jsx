import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { getAllAnnouncements, getUserById } from "../../services/announcementService";
import "../../styles/AnnouncementList.css";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const navigate = useNavigate();

  const loadAnnouncements = () => {
    const data = getAllAnnouncements().map((ann) => {
      const user = getUserById(Number(ann.userId));
      return {
        ...ann,
        userName: user?.name || "Nieznany",
        userSurname: user?.surname || "Użytkownik",
      };
    });
    setAnnouncements(data);
    setAllAnnouncements(data);
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSearch = (query) => {
    const filtered = allAnnouncements.filter((ann) =>
      [ann.title, ann.description, ann.userName, ann.userSurname]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setAnnouncements(filtered);
  };

  const handleShowDetails = (id) => {
    navigate(`/announcement/${id}`);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "10px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "black" }}>Lista ogłoszeń</h2>
      <SearchBar onSearch={handleSearch} />

      {announcements.length === 0 ? (
        <p style={{ color: "black" }}>Brak ogłoszeń do wyświetlenia.</p>
      ) : (
        <div className="announcement-container">
          {announcements.map((ann) => (
            <div key={ann.id} className="announcement-card">
              <h3>{ann.title}</h3>
              <p className="description">{ann.description}</p>
              <p>
                <strong>Dodane przez:</strong> {ann.userName} {ann.userSurname}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(ann.createdAt).toLocaleString()}
              </p>
              <div className="details-button-wrapper">
                <button
                  className="details-button"
                  onClick={() => handleShowDetails(ann.id)}
                >
                  Pokaż ogłoszenie
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;
