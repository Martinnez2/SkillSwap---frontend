import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchUsersBar";
import { getAllUsers } from "../../services/userService";
import "../../styles/UsersList.css"; 

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const data = getAllUsers();
    const filtered = data.filter((user) => user?.role !== "ADMIN");
    setUsers(filtered);
    setAllUsers(filtered);
  }, []);


  const isAdmin = loggedInUser?.role === "ADMIN";

  const handleSearch = (query) => {
    const filtered = allUsers.filter((user) =>
      [user.name, user.surname, user.username]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setUsers(filtered);
  };

  const handleViewProfile = (id) => {
    navigate(`/userView/${id}`);
  };


  return (
    <div style={{ maxWidth: "1000px", margin: "10px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "black" }}>Lista użytkowników</h2>
      <SearchBar onSearch={handleSearch} />

      {users.length === 0 ? (
        <p style={{ color: "black" }}>Brak użytkowników do wyświetlenia.</p>
      ) : (
        <div className="userList-container">
          {users.map((user) => (
            <div key={user.id} className="userList-card">
              <h3>
                {user.name} {user.surname}
              </h3>
              {isAdmin && (
                <p>
                  <strong>Email:</strong> {user.email}
                </p>    
              )}
              <p>
                 <strong>Status:</strong> {user.status || "brak"}
              </p>    
              {user.description && (
                <p className="userList-description">
                  {user.description}
                </p>
              )}
              <div className="details-button-wrapper">
                <button
                  className="details-button"
                  onClick={() => handleViewProfile(user.id)}
                >
                  Zobacz profil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;
