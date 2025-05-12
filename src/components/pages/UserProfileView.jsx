import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../../styles/UserProfileView.css";
import {
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUserAccount,
} from "../../services/userService";
import {
  getAnnouncements,
  deleteAnnouncement,
} from "../../services/announcementService";
import UserDetails from "../User/UserDetails";

import {
  getUserAnnouncements,
  toggleUserStatus,
  updateUserDescription,
  saveRatingToLocal,
  getUserRatingFromLocal,
  getAverageRating,
} from "../../services/userUtils";

const UserProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userAnnouncements, setUserAnnouncements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const u = getUserById(Number(userId));
    if (!u) {
      console.error(`User with ID ${userId} not found.`);
      setUser(null);
    } else {
      setUser(u);
      setUserAnnouncements(getUserAnnouncements(u.id, getAnnouncements));
    }
  }, [userId]);

  useEffect(() => {
    if (loggedInUser && user) {
      const existingRating = getUserRatingFromLocal(loggedInUser.id, user.id);
      if (existingRating) {
        setRating(existingRating);
        setRatingMessage(`Twoja ocena: ${existingRating} gwiazdek`);
      }
    }
  }, [loggedInUser, user]);

  useEffect(() => {
    if (user) {
      const { average, count } = getAverageRating(user.id);
      setAverageRating(average);
      setRatingCount(count);
    }
  }, [user]);

  if (!user) {
    return <p>Użytkownik nie został znaleziony.</p>;
  }

  const isBlocked = user.status === "blocked";
  const isOwnProfile = loggedInUser?.id === user.id;
  const isAdmin = loggedInUser?.role === "ADMIN";

  const handleToggleBlock = () => {
    const updated = toggleUserStatus(
      user,
      isBlocked,
      updateUserStatus,
      deleteAnnouncement,
      getAnnouncements
    );
    setUser(updated);
  };

  const handleDescriptionSave = (newDescription) => {
    const updated = updateUserDescription(
      user,
      newDescription,
      updateUser,
      isOwnProfile
    );
    setUser(updated);
    setIsEditing(false);
  };

  const handleRatingClick = (value) => {
    setRating(value);
    setRatingMessage(`Oceniłeś na ${value} gwiazdek`);
    if (loggedInUser && user && !isOwnProfile) {
      saveRatingToLocal(loggedInUser.id, user.id, value);
    }
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm(
      "Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć."
    );
    if (confirm) {
      deleteUserAccount(user.id);
      localStorage.removeItem("loggedInUser");
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div className="user-profile">
      <div className="left-column">
        <h1>
          {user.name} {user.surname}
        </h1>
        {isAdmin &&(
          <p>
            {user.email}
          </p>
        )}

        <div>
          <p className="average-rating">
            Średnia ocen:{" "}
            {ratingCount > 0
              ? `${averageRating} / 5 ★ (${ratingCount} ocen)`
              : "Brak ocen"}
          </p>
        </div>

        {isOwnProfile && isEditing ? (
          <UserDetails
            description={user.description}
            onSave={handleDescriptionSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <p>{user.description}</p>
            {isOwnProfile && !isBlocked && (
              <button onClick={() => setIsEditing(true)}>Edytuj opis</button>
            )}
          </>
        )}

        {isAdmin && (
          <button
            onClick={handleToggleBlock}
            style={{
              marginTop: "20px",
              backgroundColor: "#c0392b",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isBlocked ? "Odblokuj konto" : "Zablokuj konto"}
          </button>
        )}

        {isBlocked && (
          <div className="blocked-overlay">
            <p className="blocked-message">Konto zablokowane</p>
          </div>
        )}
      </div>

      <div className="right-column">
        <div className="announcements-list">
          <h2>Ogłoszenia użytkownika</h2>
          {userAnnouncements.length > 0 ? (
            <ul>
              {userAnnouncements.map((announcement) => (
                <li key={announcement.id}>
                  <Link to={`/announcement/${announcement.id}`}>
                    {announcement.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak ogłoszeń</p>
          )}
        </div>

        {!isOwnProfile && !isBlocked && !isAdmin && (
          <>
            <div className="rating-section">
              <h3>Oceń tego użytkownika</h3>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <span
                    key={starValue}
                    className={`star ${starValue <= rating ? "filled" : ""}`}
                    onClick={() => handleRatingClick(starValue)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              {ratingMessage && <p>{ratingMessage}</p>}
            </div>

            <Link to={`/chat/${user.id}`}>
              <button className="message-button">Wyślij wiadomość</button>
            </Link>
          </>
        )}

        {isOwnProfile && !isBlocked && (
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <button
              onClick={handleDeleteAccount}
              className="delete-account-button"
              style={{
                backgroundColor: "#c0392b",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Usuń konto
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
