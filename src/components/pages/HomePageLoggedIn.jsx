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
        <ul className="offer-list">
          <li>
            <strong>Wymiana umiejętności</strong>
          </li>
          <li>
            <strong>Ogłoszenia</strong>
          </li>
          <li>
            <strong>Opinie i oceny</strong>
          </li>
          <li>
            <strong>Networking</strong>
          </li>
          <li>
            <strong>Inspiracje</strong>
          </li>
          <li>
            <strong>Dyskusje tematyczne</strong>
          </li>
          <li>
            <strong>Wzajemna pomoc</strong>
          </li>
          <li>
            <strong>Rozwój osobisty</strong>
          </li>
          <li>
            <strong>Mentoring</strong>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default HomePageLoggedIn;
