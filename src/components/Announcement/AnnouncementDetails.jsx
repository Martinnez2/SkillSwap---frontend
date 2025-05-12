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
    const foundAnnouncement = getAnnouncementById(parseInt(id));

    if (foundAnnouncement) {
      setAnnouncement(foundAnnouncement);

      const foundUser = getUserById(Number(foundAnnouncement.userId));
      setAuthor(foundUser);
    }
  }, [id]);

  const handleDelete = () => {
    if (!loggedInUser) {
      console.error("No logged in user found.");
      return;
    }

    const confirmation = window.confirm(
      "Czy na pewno chcesz usunąć to ogłoszenie?"
    );

    if (confirmation) {
      if (loggedInUser.id === announcement.userId) {
        const updatedAnnouncements = deleteAnnouncement(announcement.id);

        if (updatedAnnouncements) {
          navigate("/");
        }
      } else {
        alert(
          "Nie możesz usunąć tego ogłoszenia, ponieważ nie jesteś jego autorem."
        );
      }
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
              {author.name} {author.surname}
            </Link>
          ) : (
            "Nieznany użytkownik"
          )}
        </p>
        <p className="announcement-details__date">
          <strong>Data:</strong>{" "}
          {new Date(announcement.createdAt).toLocaleString()}
        </p>
        <br />
      </div>

      <hr />
      <h2>
        <strong>Opis ogłoszenia:</strong>
      </h2>
      <div className="announcement-details__description-container">
        <p>{announcement.description}</p>
      </div>

      {author && loggedInUser?.username === author.username && (
        <div className="announcement-button-group">
          <Link
            to={`/edit-announcement/${announcement.id}`}
            className="button-edit"
          >
            Edytuj ogłoszenie
          </Link>
          <button onClick={handleDelete} className="button-delete">
            Usuń ogłoszenie
          </button>
        </div>
      )}

      {author && loggedInUser?.username !== author.username && (
        <div className="announcement-button-group">
          <Link to={`/userView/${author.id}`} className="button-profile">
            Zobacz profil
          </Link>
        </div>
      )}
    </div>
  );
};

export default AnnouncementDetails;
