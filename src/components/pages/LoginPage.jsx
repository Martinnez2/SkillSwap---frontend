import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LoginPage.css";
//import mockUsers from "../../mock_data/mockUsers";
import { getAllUsers } from "../../services/userService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = getAllUsers();
    const user = users.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (user) {
      console.log("Zalogowano pomyślnie:", user.username);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      if (user.role === "ADMIN") {
        navigate("/home");
      } else {
        navigate("/home");
      }
    } else {
      setError("Nieprawidłowa nazwa użytkownika lub hasło.");
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-box">
          <h2>Logowanie</h2>
          <form onSubmit={handleSubmit}>
            <label>Użytkownik:</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />

            <label>Hasło:</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Zaloguj</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
