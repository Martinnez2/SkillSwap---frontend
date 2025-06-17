import { getAnnouncements, deleteAnnouncement } from "./announcementService";
import axios from "axios";

export async function getAllUsers() {
  try {
    const response = await fetch("/api/v1/users", {
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
    const response = await fetch(`/api/v1/users/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
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

    const response = await fetch(`/api/v1/users/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
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

export async function getUserById(userId) {
  try {
    const response = await axios.get(`/api/v1/user-details/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania użytkownika po ID:", error);
    throw error;
  }
}
