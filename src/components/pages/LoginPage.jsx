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
      // 1. Logowanie użytkownika (POST na backend)
      const loginResponse = await fetch(
        "http://localhost:8081/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // aby przesłać i odebrać ciasteczka
          body: JSON.stringify(credentials),
        }
      );

      if (!loginResponse.ok) {
        throw new Error("Nieprawidłowa nazwa użytkownika lub hasło.");
      }

      // 2. Pobranie danych zalogowanego użytkownika
      const userDetailsResponse = await fetch(
        "http://localhost:8081/api/v1/user-details/me",
        {
          credentials: "include",
        }
      );

      if (!userDetailsResponse.ok) {
        throw new Error("Błąd podczas pobierania danych użytkownika.");
      }

      const userDetails = await userDetailsResponse.json();

      // 3. Zapisz dane użytkownika w localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(userDetails));

      // 4. Przekieruj na stronę główną
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
