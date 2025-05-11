import React, { useEffect, useState } from "react";
import UserDetails from "../User/UserDetails";
import { updateUser } from "../../services/userService";
import "../../styles/UserPage.css";

const UserPage = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      setUserData(loggedInUser);
    }
  }, [loggedInUser]);

  const handleDescriptionSave = (newDescription) => {
    const updated = { ...userData, description: newDescription };
    updateUser(updated);
    localStorage.setItem("loggedInUser", JSON.stringify(updated));
    setUserData(updated);
    setIsEditing(false);
  };

  if (!userData) {
    return <p>Brak zalogowanego użytkownika. Proszę się zalogować.</p>;
  }

  const isBlocked = userData.status === "blocked";

  return (
    <div className={`user-page ${isBlocked ? "blocked" : ""}`}>
      <h2>Profil użytkownika</h2>

      <p>
        <strong>Imię:</strong> {userData.name}
      </p>
      <p>
        <strong>Nazwisko:</strong> {userData.surname}
      </p>

      {isEditing ? (
        <UserDetails
          description={userData.description}
          onSave={handleDescriptionSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <p>
            <strong>Opis:</strong> {userData.description}
          </p>

          {!isBlocked && (
            <button onClick={() => setIsEditing(true)}>Edytuj opis</button>
          )}
        </>
      )}
      {isBlocked && (
        <div className="blocked-overlay">
          <p className="blocked-message">Konto zablokowane</p>
        </div>
      )}
    </div>
  );
};

export default UserPage;
