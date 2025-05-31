import { getAnnouncements, deleteAnnouncement } from "./announcementService";
import mockUsers from "../mock_data/mockUsers";
import axios from "axios";

const LOCAL_STORAGE_KEY = "users";

function getUsers() {
  const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  return users || mockUsers;
}

function saveUsers(users) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
}

export async function getAllUsers() {
  try {
    const response = await fetch("http://localhost:8081/api/v1/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Błąd komunikacji z serwerem: ${response.statusText}`);
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Błąd podczas pobierania użytkowników:", error);
    throw error;
  }
}

export async function updateUserStatus(id, status) {
  try {
    const response = await fetch(
      `http://localhost:8081/api/v1/users/${id}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      }
    );
    if (!response.ok) {
      throw new Error("Nie udało się zaktualizować statusu użytkownika");
    }
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Błąd podczas zmiany statusu użytkownika:", error);
    throw error;
  }
}

export async function deleteUserAccount(userId) {
  try {
    const announcements = await getAnnouncements();
    const userAnnouncements = announcements.filter(
      (a) => Number(a.userId) === Number(userId)
    );
    for (const ann of userAnnouncements) {
      await deleteAnnouncement(ann.id);
    }

    const response = await fetch(
      `http://localhost:8081/api/v1/users/${userId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Nie udało się usunąć użytkownika");
    }
    return true;
  } catch (error) {
    console.error("Błąd przy usuwaniu użytkownika:", error);
    throw error;
  }
}

export async function toggleUserStatus(user, isBlocked) {
  const newStatus = isBlocked ? "ACTIVE" : "BANNED";
  const updatedUser = await updateUserStatus(user.id, newStatus);
  if (newStatus === "BANNED") {
    const announcements = await getAnnouncements();
    const userAnnouncements = announcements.filter(
      (a) => Number(a.userId) === Number(user.id)
    );
    for (const ann of userAnnouncements) {
      await deleteAnnouncement(ann.id);
    }
  }

  return updatedUser;
}

// export function getUserById(id) {
//   const users = getUsers();
//   const user = users.find((user) => user.id === Number(id));
//   console.log("Fetched Users:", users);
//   console.log("Found User by ID:", user);
//   return user;
// }

export async function getUserById(userId) {
  try {
    const response = await axios.get(
      `http://localhost:8081/api/v1/user-details/${userId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania użytkownika po ID:", error);
    throw error;
  }
}

export function updateUser(updatedUser) {
  const users = getUsers();
  const newUsers = users.map((u) =>
    u.id === updatedUser.id ? { ...u, ...updatedUser } : u
  );
  saveUsers(newUsers);
  return updatedUser;
}

// export function addUser(newUser) {
//   const users = getUsers();
//   const updatedUsers = [...users, newUser];
//   saveUsers(updatedUsers);
//   return updatedUsers;
// }

export function addUser(newUser) {
  const users = getUsers();
  const userExists = users.some((user) => user.username === newUser.username);
  if (userExists) {
    console.log("Użytkownik o tym username już istnieje");
    return;
  }
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
}
