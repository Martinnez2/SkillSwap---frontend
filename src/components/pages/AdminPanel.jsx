import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllUsers,
  updateUserStatus,
  deleteUserAccount,
} from "../../services/userService";
import "../../styles/AdminPanel.css";
import {
  getAnnouncements,
  deleteAnnouncement,
} from "../../services/announcementService";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("surname");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  const handleBlock = (id) => {
    const updatedUsers = updateUserStatus(id, "blocked");
    setUsers(updatedUsers);

    const announcements = getAnnouncements();
    announcements
      .filter((a) => a.userId === String(id))
      .forEach((a) => deleteAnnouncement(a.id));
  };

  const handleUnblock = (id) => {
    const updatedUsers = updateUserStatus(id, "active");
    setUsers(updatedUsers);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Czy na pewno chcesz usunąć tego użytkownika i jego ogłoszenia?"
    );
    if (!confirm) return;
    deleteUserAccount(id);
    const updatedUsers = getAllUsers();
    setUsers(updatedUsers);
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
      `${u.name} ${u.surname} ${u.username}`
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
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <Link to={`/userView/${user.id}`}>Zobacz profil</Link>
              </td>
              <td>
                {user.status === "active" ? (
                  <button onClick={() => handleBlock(user.id)}>Zablokuj</button>
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
