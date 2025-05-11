import { getAnnouncements, saveAnnouncements } from "./announcementService";
import mockUsers from "../mock_data/mockUsers";

const LOCAL_STORAGE_KEY = "users";

function getUsers() {
  const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  return users || mockUsers;
}

function saveUsers(users) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
}

export function getAllUsers() {
  return getUsers();
}

export function updateUserStatus(id, status) {
  const users = getUsers();
  const updated = users.map((user) =>
    user.id === id ? { ...user, status } : user
  );
  saveUsers(updated);
  return updated;
}

// export function deleteUser(id) {
//   const users = getUsers();
//   const updated = users.filter((user) => user.id !== id);
//   saveUsers(updated);
//   return updated;
// }

export function deleteUserAccount(userId) {
  const users = getUsers();
  const updatedUsers = users.filter((user) => user.id !== userId);
  saveUsers(updatedUsers);
  const announcements = getAnnouncements();
  const updatedAnnouncements = announcements.filter(
    (announcement) => announcement.userId !== userId
  );
  saveAnnouncements(updatedAnnouncements);
}

export function getUserById(id) {
  const users = getUsers();
  const user = users.find((user) => user.id === Number(id));
  console.log("Fetched Users:", users);
  console.log("Found User by ID:", user);
  return user;
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
