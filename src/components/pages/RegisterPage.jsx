// src/pages/RegisterPage.jsx

import React, { useState } from "react";
import "../../styles/RegisterPage.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "USER", // domyślnie "USER"
    status: "ACTIVE", // wymagane przez backend
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const res = await fetch("http://localhost:8081/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate("/login");
        return;
      }

      let problem;
      try {
        problem = await res.json();
      } catch {
        throw new Error(`Błąd serwera: ${res.status}`);
      }

      if (problem.errors) {
        setFieldErrors(problem.errors);
      }

      throw new Error(problem.detail || `Błąd ${problem.status}`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="register-container">
        <div className="register-box">
          <h2>Rejestracja</h2>
          <form onSubmit={handleSubmit} noValidate>
            <label>Nazwa użytkownika:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {fieldErrors.username && (
              <small className="error">{fieldErrors.username}</small>
            )}

            <label>Hasło:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && (
              <small className="error">{fieldErrors.password}</small>
            )}

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && (
              <small className="error">{fieldErrors.email}</small>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Rejestruję..." : "Zarejestruj się"}
            </button>
          </form>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
