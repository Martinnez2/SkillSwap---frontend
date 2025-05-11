import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/HomePage.css";
import logo from "../../images/logo.png";

const HomePageLoggedIn = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Sprawdzamy, czy użytkownik jest zalogowany
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      navigate("/login"); // Przekierowujemy na stronę logowania, jeśli nie ma użytkownika
    }
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="hero">
          <h1>Witaj, {user.username}!</h1>
          <p>Znajdź ogłoszenia, dodawaj ogłoszenia lub edytuj swój profil.</p>
          <div className="button-group">
            <Link to="/announcements" className="action-button">
              Zobacz ogłoszenia
            </Link>
            {user.role !== "ADMIN" && (
              <>
                <Link to="/add-announcement" className="action-button">
                  Dodaj nowe ogłoszenie
                </Link>
              </>
            )}
          </div>
        </div>
        <img src={logo} alt="SkillSwap Logo" className="logo" />
      </div>

      <section className="community-offer">
        <h2>Co oferuje nasza społeczność?</h2>
        <ul>
          <li>
            <strong>Wymiana umiejętności:</strong> Ucz się i ucz innych!
          </li>
          <li>
            <strong>Ogłoszenia:</strong> Dodawaj ogłoszenia.
          </li>
          <li>
            <strong>Opinie i oceny:</strong> Wymieniaj się opiniami.
          </li>
          <li>
            <strong>Networking:</strong> Buduj swoją sieć kontaktów.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default HomePageLoggedIn;
