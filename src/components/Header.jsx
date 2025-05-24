import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logo from "../images/logo_skill.png";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false); // Zamknij menu mobilne przy przejściu do desktopu
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="header">
      {/* Mobile bar: only on small screens */}
      <div className="mobile-bar">
        <Link to="/" className="logo-link">
          <img src={logo} alt="SkillSwap logo" style={{ height: "40px" }} />
        </Link>
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Full navigation - visible on desktop only */}
      <div className="desktop-nav">
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
          {user ? (
            <>
              {user.role !== "ADMIN" && (
                <Link to={"/profile/me"} className="nav-link">
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
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link
            to="/announcements"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Ogłoszenia
          </Link>
          <Link
            to="/usersList"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Użytkownicy
          </Link>
          {user ? (
            <>
              {user.role !== "ADMIN" && (
                <Link
                  to={`/user/${user.id}`}
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Mój profil
                </Link>
              )}
              {user.role === "ADMIN" ? (
                <Link
                  to="/admin"
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Panel administratora
                </Link>
              ) : (
                <Link
                  to="/add-announcement"
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Dodaj ogłoszenie
                </Link>
              )}
              <button
                className="logout-button"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                Wyloguj się
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Zaloguj się
              </Link>
              <Link
                to="/register"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Zarejestruj się
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
