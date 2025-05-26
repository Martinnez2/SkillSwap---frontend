import axios from "axios";

// Zwraca ogłoszenia powiązane z danym użytkownikiem
export const getUserAnnouncements = (userId, getAnnouncements) => {
  return getAnnouncements().filter((a) => Number(a.userId) === Number(userId));
};

// Zmienia status użytkownika i usuwa ogłoszenia, jeśli blokujemy
export const toggleUserStatus = (
  user,
  isBlocked,
  updateUserStatus,
  deleteAnnouncement,
  getAnnouncements
) => {
  if (!user) return null;

  const newStatus = isBlocked ? "active" : "blocked";
  updateUserStatus(user.id, newStatus);

  const updatedUser = { ...user, status: newStatus };

  if (newStatus === "blocked") {
    const announcements = getAnnouncements();
    announcements
      .filter((a) => Number(a.userId) === Number(user.id))
      .forEach((a) => deleteAnnouncement(a.id));
  }

  return updatedUser;
};

export const getCurrentUser = async () => {
  const response = await fetch("/api/v1/user-details/me", {
    credentials: "include", // jeśli używasz cookie
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych użytkownika");
  }

  return await response.json();
};

// Aktualizuje opis użytkownika i lokalnie zapisuje dane, jeśli to własny profil
export async function updateUserDescription(
  userId,
  { name, surname, description }
) {
  try {
    const response = await axios.post(
      "http://localhost:8081/api/v1/user-details",
      {
        userId,
        name,
        surname,
        description,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Błąd podczas aktualizacji danych:", error);
    throw error;
  }
}

// Ustawia ocenę i wyświetla wiadomość
export const handleUserRating = (value, setRating, setRatingMessage) => {
  if (typeof value !== "number") return;
  setRating(value);
  setRatingMessage(`Oceniłeś na ${value} gwiazdek`);
};

export const saveRatingToLocal = (senderId, ownerId, value) => {
  const ratings = JSON.parse(localStorage.getItem("ratings")) || [];
  const existingIndex = ratings.findIndex(
    (r) => r.senderId === senderId && r.ownerId === ownerId
  );

  if (existingIndex !== -1) {
    ratings[existingIndex].value = value;
    ratings[existingIndex].updatedAt = new Date().toISOString();
  } else {
    ratings.push({
      id: Date.now(),
      senderId,
      ownerId,
      value,
      createdAt: new Date().toISOString(),
    });
  }

  localStorage.setItem("ratings", JSON.stringify(ratings));
};

export const getUserRatingFromLocal = (senderId, ownerId) => {
  const ratings = JSON.parse(localStorage.getItem("ratings")) || [];
  const record = ratings.find(
    (r) => r.senderId === senderId && r.ownerId === ownerId
  );
  return record ? record.value : 0;
};

// Zwraca średnią ocenę i liczbę głosów dla danego użytkownika (ownerId)
export const getAverageRating = (ownerId) => {
  const ratingsJSON = localStorage.getItem("ratings");
  if (!ratingsJSON) return { average: 0, count: 0 };

  const ratings = JSON.parse(ratingsJSON);
  const values = Object.values(ratings)
    .filter((r) => r.ownerId === ownerId)
    .map((r) => r.value)
    .filter((v) => typeof v === "number" && v >= 1 && v <= 5);

  if (values.length === 0) return { average: 0, count: 0 };

  const total = values.reduce((sum, v) => sum + v, 0);
  const average = total / values.length;

  return {
    average: parseFloat(average.toFixed(2)),
    count: values.length,
  };
};
