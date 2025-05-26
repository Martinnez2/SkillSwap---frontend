import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getAnnouncementById,
  getUserById,
  deleteAnnouncement,
} from "../../services/announcementService";
import "../../styles/AnnouncementDetails.css";

const AnnouncementDetails = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [author, setAuthor] = useState(null);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const announcementData = await getAnnouncementById(parseInt(id));
        setAnnouncement(announcementData);

        if (announcementData?.userId) {
          const userData = await getUserById(Number(announcementData.userId));
          setAuthor(userData);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania ogłoszenia:", error);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const isAdmin = loggedInUser?.role === "ADMIN";
  const isAuthor = loggedInUser?.userId === announcement?.userId;

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Czy na pewno chcesz usunąć to ogłoszenie?"
    );
    if (!confirmation) return;

    if (isAuthor || isAdmin) {
      try {
        await deleteAnnouncement(announcement.id);
        navigate("/profile/me");
      } catch (error) {
        console.error("Błąd podczas usuwania ogłoszenia:", error);
        alert("Nie udało się usunąć ogłoszenia.");
      }
    } else {
      alert("Nie masz uprawnień do usunięcia tego ogłoszenia.");
    }
  };

  if (!announcement) {
    return <p className="loading-text">Ładowanie ogłoszenia...</p>;
  }

  return (
    <div className="announcement-details">
      <h2 className="announcement-details__title">{announcement.title}</h2>

      <div className="announcement-details__meta">
        <p className="announcement-details__author">
          <strong>Autor:</strong>{" "}
          {author ? (
            <Link
              to={`/userView/${author.id}`}
              className="announcement-details__author-name"
            >
              {author.name || "Nieznane imię"} {author.surname || ""}
            </Link>
          ) : (
            "Nieznany użytkownik"
          )}
        </p>
        <p className="announcement-details__date">
          <strong>Data:</strong>{" "}
          {new Date(announcement.createdAt).toLocaleString()}
        </p>
      </div>

      <hr />
      <h2>
        <strong>Opis ogłoszenia:</strong>
      </h2>
      <div className="announcement-details__description">
        <p>{announcement.description}</p>
      </div>

      <div className="announcement-button-group">
        {isAuthor && (
          <>
            <Link
              to={`/edit-announcement/${announcement.id}`}
              className="button-edit"
            >
              Edytuj ogłoszenie
            </Link>
            <button onClick={handleDelete} className="button-delete">
              Usuń ogłoszenie
            </button>
          </>
        )}

        {!isAuthor && author && (
          <Link to={`/userView/${author.id}`} className="button-profile">
            Zobacz profil
          </Link>
        )}

        {isAdmin && !isAuthor && (
          <button onClick={handleDelete} className="button-delete">
            Usuń ogłoszenie jako administrator
          </button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementDetails;
