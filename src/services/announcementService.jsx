import mockUsers from "../mock_data/mockUsers";
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

function getUsers() {
  return getDataFromLocalStorage(LOCAL_STORAGE_KEY_USERS, mockUsers);
}

export function getAllAnnouncements() {
  return getAnnouncements();
}

export function deleteAnnouncement(id) {
  const announcements = getAnnouncements();
  const updatedAnnouncements = announcements.filter(
    (announcement) => announcement.id !== id
  );
  saveDataToLocalStorage(LOCAL_STORAGE_KEY_ANNOUNCEMENTS, updatedAnnouncements);
  return updatedAnnouncements;
}

export function getAnnouncementById(id) {
  return getAnnouncements().find((announcement) => announcement.id === id);
}

export function createAnnouncement(newAnnouncement) {
  const announcements = getAnnouncements();
  const updatedAnnouncements = [...announcements, newAnnouncement];
  saveDataToLocalStorage(LOCAL_STORAGE_KEY_ANNOUNCEMENTS, updatedAnnouncements);
  return updatedAnnouncements;
}

export function updateAnnouncement(updatedAnnouncement) {
  const announcements = getAnnouncements();
  const updatedAnnouncements = announcements.map((a) =>
    a.id === updatedAnnouncement.id ? { ...a, ...updatedAnnouncement } : a
  );
  saveDataToLocalStorage(LOCAL_STORAGE_KEY_ANNOUNCEMENTS, updatedAnnouncements);
  return updatedAnnouncements;
}

export function getUserById(id) {
  const users = getUsers();
  return users.find((user) => user.id === id);
}

export function saveAnnouncements(data) {
  saveDataToLocalStorage(LOCAL_STORAGE_KEY_ANNOUNCEMENTS, data);
}
