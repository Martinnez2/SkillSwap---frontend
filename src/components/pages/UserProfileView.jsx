import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../../styles/UserProfileView.css";
import {
  getUserById,
  // updateUserStatus,
  deleteUserAccount,
} from "../../services/userService";
import {
  // getAnnouncements,
  // deleteAnnouncement,
  getAnnouncementsByUserId,
} from "../../services/announcementService";
import UserDetails from "../User/UserDetails";

import {
  // toggleUserStatus,
  updateUserDescription,
  getUserRatingFromLocal,
  getCurrentUser,
} from "../../services/userUtils";

import {
  addOrUpdateRate,
  getAverageRate,
  getUserRateForOwner,
} from "../../services/rateService";

import { getConversationStatus } from "../../services/chatUtils";

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

  const [hasConversation, setHasConversation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userToLoad;

        if (userId === "me") {
          userToLoad = await getCurrentUser();
        } else {
          userToLoad = await getUserById(Number(userId));
          if (!userToLoad) {
            console.error(`Nie znaleziono użytkownika o ID ${userId}`);
            setUser(null);
            return;
          }
        }

        setUser(userToLoad);

        const actualUserId = userToLoad.userId || userToLoad.id;
        if (!actualUserId) {
          console.error("Brak userId do pobrania ogłoszeń");
          return;
        }

        const announcements = await getAnnouncementsByUserId(actualUserId);
        setUserAnnouncements(announcements);
      } catch (err) {
        console.error("Błąd podczas ładowania profilu:", err);
      }
    };

    fetchData();
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
    const fetchUserRating = async () => {
      if (!loggedInUser?.id || !user?.userId) return;

      try {
        const ratingData = await getUserRateForOwner(
          loggedInUser.id,
          user.userId
        );
        if (ratingData?.value) {
          setRating(ratingData.value);
          setRatingMessage(`Twoja ocena: ${ratingData.value} gwiazdek`);
        }
      } catch (error) {
        console.error("Błąd pobierania oceny", error);
      }
    };

    fetchUserRating();
  }, [loggedInUser, user]);

  useEffect(() => {
    const fetchAverage = async () => {
      if (user) {
        try {
          const { average, count } = await getAverageRate(user.userId);
          setAverageRating(average);
          setRatingCount(count);
        } catch (error) {
          console.error("Błąd pobierania średniej oceny:", error);
        }
      }
    };
    fetchAverage();
  }, [user]);

  useEffect(() => {
    const checkConversation = async () => {
      if (loggedInUser && user && loggedInUser.id !== user.id) {
        try {
          const conversationExists = await getConversationStatus(
            loggedInUser.id,
            user.userId
          );
          setHasConversation(conversationExists);
        } catch (error) {
          console.error("Błąd podczas sprawdzania konwersacji:", error);
        }
      }
    };

    checkConversation();
  }, [loggedInUser, user]);

  if (!user) {
    return <p>Użytkownik nie został znaleziony.</p>;
  }

  const effectiveStatus = user.status || loggedInUser?.status;
  const isBlocked = effectiveStatus?.toUpperCase() === "BANNED";

  const isOwnProfile = loggedInUser?.id === user.id;
  const isAdmin = loggedInUser?.role === "ADMIN";

  // const handleToggleBlock = async () => {
  //   try {
  //     const updatedUser = await toggleUserStatus(
  //       user,
  //       isBlocked,
  //       updateUserStatus,
  //       deleteAnnouncement,
  //       getAnnouncements
  //     );
  //     setUser(updatedUser);
  //   } catch (error) {
  //     console.error("Błąd przy zmianie statusu:", error);
  //   }
  // };

  const handleDescriptionSave = async ({
    firstName,
    lastName,
    description,
  }) => {
    try {
      const updated = await updateUserDescription(user.id, {
        name: firstName,
        surname: lastName,
        description,
      });

      const updatedUser = {
        ...user,
        name: updated.name,
        surname: updated.surname,
        description: updated.description,
      };

      setUser(updatedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      setIsEditing(false);
    } catch (error) {
      console.error("Błąd aktualizacji danych użytkownika:", error);
      alert("Nie udało się zaktualizować danych.");
    }
  };

  const handleRatingClick = async (value) => {
    setRating(value);
    setRatingMessage(`Oceniłeś na ${value} gwiazdek`);
    if (loggedInUser && user && !isOwnProfile) {
      try {
        await addOrUpdateRate({
          senderId: loggedInUser.id,
          ownerId: user.userId,
          value: value,
        });

        const { average, count } = await getAverageRate(user.userId);
        setAverageRating(average);
        setRatingCount(count);
      } catch (error) {
        console.error("Błąd przy zapisie oceny:", error);
        setRatingMessage("Nie udało się zapisać oceny");
      }
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
        {isAdmin && <p>{user.email}</p>}

        <div>
          <p className="average-rating">
            Średnia ocen:{" "}
            {ratingCount > 0
              ? `${averageRating?.toFixed(2)} / 5 ★ (${ratingCount} ocen)`
              : "Brak ocen"}
          </p>
        </div>

        {isOwnProfile && isEditing ? (
          <UserDetails
            firstName={user.name}
            lastName={user.surname}
            description={user.description}
            onSave={handleDescriptionSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <p className="user-description">{user.description}</p>
            {isOwnProfile && !isBlocked && (
              <button onClick={() => setIsEditing(true)}>Edytuj profil</button>
            )}
          </>
        )}

        {/* {isAdmin && (
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
        )} */}

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
                <li key={announcement.id} className="announcement-item">
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
            {hasConversation ? (
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
            ) : (
              <p className="rating-info-message">
                Aby ocenić tego użytkownika, musisz najpierw wysłać do niego
                wiadomość.
              </p>
            )}

            <Link to={`/chat/${user.userId}`}>
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
