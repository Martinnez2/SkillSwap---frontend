import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logo from "../images/logo_skill.png";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="nav-link">
          <img src={logo} alt="SkillSwap logo" style={{ height: "40px" }} />
        </Link>
        <Link to="/announcements" className="nav-link">
          Ogłoszenia
        </Link>
        <Link to="/usersList" className="nav-link">
          Użytkownicy
        </Link>
      </div>
      <div className="header-right">
        {/* Sprawdzamy, czy użytkownik jest zalogowany */}
        {user ? (
          <>
            {user.role !== "ADMIN" && (
              <Link to={`/user/${user.id}`} className="nav-link">
                Mój profil
              </Link>
            )}

            {user.role === "ADMIN" ? (
              <Link to="/admin" className="nav-link">
                Panel administratora
              </Link>
            ) : (
              <Link to="/add-announcement" className="nav-link">
                Dodaj ogłoszenie
              </Link>
            )}
            <button className="logout-button" onClick={handleLogout}>
              Wyloguj się
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Zaloguj się
            </Link>
            <Link to="/register" className="nav-link">
              Zarejestruj się
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
