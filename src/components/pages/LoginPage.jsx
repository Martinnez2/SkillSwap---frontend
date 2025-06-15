import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LoginPage.css";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!loginResponse.ok) {
        throw new Error("Nieprawidłowa nazwa użytkownika lub hasło.");
      }

      const userDetailsResponse = await fetch("api/v1/user-details/me", {
        credentials: "include",
      });

      if (!userDetailsResponse.ok) {
        throw new Error("Błąd podczas pobierania danych użytkownika.");
      }

      const userDetails = await userDetailsResponse.json();

      localStorage.setItem("loggedInUser", JSON.stringify(userDetails));

      navigate("/home");
    } catch (err) {
      setError(err.message);
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
