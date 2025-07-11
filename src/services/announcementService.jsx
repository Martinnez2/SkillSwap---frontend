import axios from "axios";

const API_URL = "/api/v1/announcements";

export async function createAnnouncement(newAnnouncement) {
  try {
    const response = await axios.post(API_URL, newAnnouncement);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas tworzenia ogłoszenia:", error);
    throw error;
  }
}

export const getAnnouncementsByUserId = async (userId) => {
  try {
    const response = await fetch(`/api/v1/announcements/user/${userId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data._embedded?.announcementDTOList || [];
  } catch (error) {
    console.error("Błąd przy pobieraniu ogłoszeń użytkownika:", error);
    throw error;
  }
};

export async function getAnnouncementById(id) {
  const response = await fetch(`/api/v1/announcements/${id}`);
  if (!response.ok) throw new Error("Błąd podczas pobierania ogłoszenia");
  return response.json();
}

export const getUserById = async (id) => {
  const response = await fetch(`/api/v1/user-details/${id}`);
  if (!response.ok) {
    throw new Error("Błąd podczas pobierania danych użytkownika");
  }
  return await response.json();
};

export async function deleteAnnouncement(id) {
  const response = await fetch(`/api/v1/announcements/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Błąd podczas usuwania ogłoszenia");
  return true;
}

export async function updateAnnouncement(updatedAnnouncement) {
  try {
    const response = await fetch(
      `/api/v1/announcements/${updatedAnnouncement.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAnnouncement),
      }
    );

    if (!response.ok) {
      throw new Error("Błąd podczas aktualizacji ogłoszenia");
    }

    return await response.json();
  } catch (error) {
    console.error("Błąd podczas aktualizacji ogłoszenia:", error);
    return null;
  }
}

export async function getAnnouncements() {
  try {
    const response = await fetch("/api/v1/announcements", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Błąd komunikacji z serwerem: ${response.statusText}`);
    }
    const data = await response.json();
    const announcements = data._embedded
      ? data._embedded.announcementDTOList
      : [];
    return announcements;
  } catch (error) {
    console.error("Błąd podczas pobierania ogłoszeń:", error);
    throw error;
  }
}

export const getAllAnnouncementsWithUsers = async () => {
  const allAnnouncements = [];

  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const res = await fetch(`/api/v1/announcements?page=${page}&size=10`);
    if (!res.ok) throw new Error("Błąd podczas pobierania ogłoszeń");

    const data = await res.json();

    const announcements = data._embedded?.announcementDTOList || [];
    totalPages = data.page.totalPages;

    allAnnouncements.push(...announcements);
    page++;
  }

  const enriched = await Promise.all(
    allAnnouncements.map(async (ann) => {
      try {
        const userRes = await fetch(`/api/v1/user-details/${ann.userId}`);
        const user = await userRes.json();
        return {
          ...ann,
          userName: user.name,
          userSurname: user.surname,
        };
      } catch {
        return {
          ...ann,
          userName: "Nieznany",
          userSurname: "Użytkownik",
        };
      }
    })
  );

  return enriched;
};
