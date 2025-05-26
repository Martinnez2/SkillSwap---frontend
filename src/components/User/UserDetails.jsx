import React, { useState } from "react";
import "../../styles/UserDetails.css";

const UserDetails = ({
  firstName = "",
  lastName = "",
  description = "",
  onSave,
  onCancel,
}) => {
  const [editedFirstName, setEditedFirstName] = useState(firstName);
  const [editedLastName, setEditedLastName] = useState(lastName);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      firstName: editedFirstName,
      lastName: editedLastName,
      description: editedDescription,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="user-details-form">
      <div className="form-group">
        <label htmlFor="firstName">Imię:</label>
        <input
          type="text"
          id="firstName"
          value={editedFirstName}
          onChange={(e) => setEditedFirstName(e.target.value)}
          className="description-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Nazwisko:</label>
        <input
          type="text"
          id="lastName"
          value={editedLastName}
          onChange={(e) => setEditedLastName(e.target.value)}
          className="description-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Opis:</label>
        <textarea
          id="description"
          className="description-input"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="save-button">
          Zapisz
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Anuluj
        </button>
      </div>
    </form>
  );
};

export default UserDetails;
