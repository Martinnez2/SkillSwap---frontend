import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import "../../styles/HomePage.css";

const HomePageLoggedOut = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      navigate("/home");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> {/* Spinner ładowania */}
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="hero">
          <h1>Witaj w aplikacji SkillSwap!</h1>
          <p>Aplikacja do wymiany umiejętności i ogłoszeń.</p>
          <div className="button-group">
            <Link to="/register">
              <button className="register-button">Zarejestruj się</button>
            </Link>
            <Link to="/login">
              <button className="login-button">Zaloguj się</button>
            </Link>
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

export default HomePageLoggedOut;
