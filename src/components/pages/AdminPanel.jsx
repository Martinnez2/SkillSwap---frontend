// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllUsers,
  updateUserStatus,
  deleteUserAccount,
  toggleUserStatus,
} from "../../services/userService";
import "../../styles/AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("surname");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Błąd przy pobieraniu użytkowników:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleBlock = async (user) => {
    try {
      const updatedUser = await toggleUserStatus(
        user,
        user.status === "BANNED"
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    } catch (error) {
      console.error("Błąd przy blokowaniu/uaktywnianiu użytkownika:", error);
    }
  };

  const handleUnblock = async (id) => {
    try {
      const updatedUser = await updateUserStatus(id, "ACTIVE");
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    } catch (error) {
      console.error("Błąd przy odblokowywaniu użytkownika:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Czy na pewno chcesz usunąć tego użytkownika i jego ogłoszenia?"
    );
    if (!confirmDelete) return;
    try {
      await deleteUserAccount(id);
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Błąd przy usuwaniu użytkownika:", error);
    }
  };

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const sortedUsers = [...users]
    .filter((u) => u.role !== "ADMIN")
    .filter((u) =>
      `${u.name} ${u.surname} ${u.username} ${u.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const compare = (key) => {
        if (a[key] < b[key]) return sortOrder === "asc" ? -1 : 1;
        if (a[key] > b[key]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      };

      if (sortField === "name" || sortField === "surname") {
        return compare("surname") || compare("name");
      }
      return compare(sortField);
    });

  return (
    <div className="admin-panel">
      <h2>Panel Administratora</h2>

      <input
        type="text"
        placeholder="Szukaj użytkownika..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>Użytkownik</th>
            <th
              onClick={() => handleSort("surname")}
              style={{ cursor: "pointer" }}
            >
              Imię i Nazwisko{" "}
              {sortField === "surname" && (sortOrder === "asc" ? "↓" : "↑")}
            </th>
            <th
              onClick={() => handleSort("email")}
              style={{ cursor: "pointer" }}
            >
              Email {sortField === "email" && (sortOrder === "asc" ? "↓" : "↑")}
            </th>
            <th
              onClick={() => handleSort("role")}
              style={{ cursor: "pointer" }}
            >
              Rola {sortField === "role" && (sortOrder === "asc" ? "↓" : "↑")}
            </th>
            <th
              onClick={() => handleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Status{" "}
              {sortField === "status" && (sortOrder === "asc" ? "↓" : "↑")}
            </th>
            <th>Profil</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>
                {user.name} {user.surname}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <Link to={`/userView/${user.id}`}>Zobacz profil</Link>
              </td>
              <td>
                {user.status === "ACTIVE" ? (
                  <button onClick={() => handleBlock(user)}>Zablokuj</button>
                ) : (
                  <button onClick={() => handleUnblock(user.id)}>
                    Odblokuj
                  </button>
                )}
                <button onClick={() => handleDelete(user.id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
