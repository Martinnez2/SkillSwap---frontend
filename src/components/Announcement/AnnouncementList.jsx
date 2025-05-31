import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { getAllAnnouncementsWithUsers } from "../../services/announcementService";
import "../../styles/AnnouncementList.css";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAllAnnouncementsWithUsers();
        // console.log("Odebrane ogłoszenia:", data);
        // // Sprawdzenie duplikatów ID
        // const ids = data.map((ann) => ann.id);
        // const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
        // console.log("Duplikaty ID:", duplicates);

        setAnnouncements(data);
        setAllAnnouncements(data);
      } catch (error) {
        console.error("Błąd ładowania ogłoszeń:", error);
      }
    };

    fetchAnnouncements();
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
              <p className="person">
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
