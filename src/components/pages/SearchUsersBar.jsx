import React, { useState } from "react";
import "../../styles/UsersList.css";

const SearchUsersBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <input
        type="text"
        placeholder="Szukaj użytkownika..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          maxWidth: "80%",
          backgroundColor: "rgb(222, 222, 222)",
          color: "black",
        }}
      />
      <button type="submit" className="search-button">
        Szukaj
      </button>
    </form>
  );
};

export default SearchUsersBar;
