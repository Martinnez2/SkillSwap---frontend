import React, { useState } from "react";
import "../../styles/UserDetails.css";

const UserDetails = ({ description, onSave, onCancel }) => {
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedDescription);
  };

  return (
    <form onSubmit={handleSubmit} className="user-details-form">
      <div className="form-group">
        <label htmlFor="description">Wprowadź nowy opis użytkownika:</label>
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
