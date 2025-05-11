import React, { useState } from "react";
import "../../styles/RegisterPage.css";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../services/userService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "USER",
    firstName: "",
    lastName: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(
      (user) => user.username === formData.username
    );

    if (userExists) {
      setErrorMessage("Użytkownik o tej nazwie już istnieje! Wybierz inną.");
      return;
    }

    const newUser = {
      ...formData,
      id: Date.now(),
      status: "active",
      name: formData.firstName || "Imię",
      surname: formData.lastName || "Nazwisko",
    };

    addUser(newUser);
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));
    setErrorMessage("");
    navigate("/");
    console.log("Użytkownik zarejestrowany:", newUser);
  };

  return (
    <div className="container">
      <div className="register-container">
        <div className="register-box">
          <h2>Rejestracja</h2>
          <form onSubmit={handleSubmit}>
            <label>Użytkownik:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <label>Hasło:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Imię:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />

            <label>Nazwisko:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <label>Rola:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="USER">Użytkownik</option>
              <option value="ADMIN">Administrator</option>
            </select>

            <button type="submit">Zarejestruj się</button>
          </form>

          {isSubmitted && errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

// === Zakomentowany kod do wersji online ===
/*
    fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Rejestracja zakończona sukcesem');
          // Można przekierować np. navigate('/login');
        } else {
          console.error('Błąd rejestracji');
        }
      })
      .catch((error) => console.error('Błąd:', error));
    */
