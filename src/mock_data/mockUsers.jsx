const mockUsers = [
  {
    id: 1,
    username: "jan",
    password: "haslo123",
    name: "Jan",
    surname: "Kowalski",
    role: "USER",
    status: "active",
    description: "Jestem nauczycielem matematyki z 10-letnim doświadczeniem.",
  },
  {
    id: 2,
    username: "anna",
    password: "tajnehaslo",
    name: "Anna",
    surname: "Nowak",
    role: "USER",
    status: "blocked",
    description: "Pasjonuję się językiem angielskim i lubię uczyć innych.",
  },
  {
    id: 3,
    username: "admin",
    password: "admin",
    name: "Admin",
    surname: "Systemowy",
    role: "ADMIN",
    status: "active",
    description: "Administrator systemu.",
  },
  {
    id: 4,
    username: "test",
    password: "test",
    name: "Kuba",
    surname: "Test",
    role: "USER",
    status: "blocked",
    description: "Pasjonuję się językiem angielskim i lubię uczyć innych.",
  },
];

export default mockUsers;
