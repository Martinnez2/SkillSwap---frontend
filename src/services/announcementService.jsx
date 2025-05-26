import axios from "axios";

const API_URL = "http://localhost:8081/api/v1/announcements";

// export async function getAllAnnouncements() {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data.content; // bo Spring Page<AnnouncementDTO>
//   } catch (error) {
//     console.error("Błąd podczas pobierania ogłoszeń:", error);
//     return [];
//   }
// }

// export async function getAnnouncementById(id) {
//   try {
//     const response = await axios.get(`${API_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Nie udało się pobrać ogłoszenia:", error);
//     return null;
//   }
// }

// 1.
export async function createAnnouncement(newAnnouncement) {
  try {
    const response = await axios.post(API_URL, newAnnouncement);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas tworzenia ogłoszenia:", error);
    throw error;
  }
}

// 2.
export const getAnnouncementsByUserId = async (userId) => {
  try {
    const response = await fetch(`/api/v1/announcements/user/${userId}`, {
      credentials: "include", // <-- ważne!
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

// export async function deleteAnnouncement(id) {
//   try {
//     await axios.delete(`${API_URL}/${id}`);
//     return true;
//   } catch (error) {
//     console.error("Nie udało się usunąć ogłoszenia:", error);
//     return false;
//   }
// }

// export async function updateAnnouncement(updatedAnnouncement) {
//   try {
//     const response = await axios.put(
//       `${API_URL}/${updatedAnnouncement.id}`,
//       updatedAnnouncement
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Błąd podczas aktualizacji ogłoszenia:", error);
//     return null;
//   }
// }

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

import mockAnnouncements from "../mock_data/mockAnnouncements";

const LOCAL_STORAGE_KEY_ANNOUNCEMENTS = "announcements";
const LOCAL_STORAGE_KEY_USERS = "users";

function getDataFromLocalStorage(key, mockData) {
  const data = JSON.parse(localStorage.getItem(key));
  if (!data) {
    console.warn(
      `Brak danych w localStorage dla klucza: ${key}. Używamy danych mock.`
    );
    return mockData;
  }
  return data;
}

function saveDataToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getAnnouncements() {
  return getDataFromLocalStorage(
    LOCAL_STORAGE_KEY_ANNOUNCEMENTS,
    mockAnnouncements
  );
}

export function getAllAnnouncements() {
  return getAnnouncements();
}

export function saveAnnouncements(data) {
  saveDataToLocalStorage(LOCAL_STORAGE_KEY_ANNOUNCEMENTS, data);
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

  // Teraz pobierz dane użytkowników dla wszystkich ogłoszeń
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
