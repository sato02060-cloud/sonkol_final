import React, { useContext, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "../context/RootContext.jsx";
import { CiSun } from "react-icons/ci";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { MdNightlightRound } from "react-icons/md";

const Header = () => {
  const { dark, setDark, lang, setLang } = useContext(MovieContext);
  const navigate = useNavigate();
  const [movieName, setMovieName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const translations = {
    "ky-KG": {
      home: "Башкы бет",
      popular: "Кыргызча кинолор",
      topRated: "Мыкты тасмалар",
      search: "Тасма издөө...",
      theme: "Теманы өзгөртүү",
      address: "Нарын облусу • Жумгал району • Чаек айылы",
    },
    "ru-RU": {
      home: "Главная",
      popular: "Кыргызские фильмы",
      topRated: "Лучшие фильмы",
      search: "Поиск фильма...",
      theme: "Сменить тему",
      address: "Нарынская область • Жумгальский район • село Чаек",
    },
    "en-US": {
      home: "Home",
      popular: "Kyrgyz Movies",
      topRated: "Top Rated",
      search: "Search movies...",
      theme: "Toggle theme",
      address: "Naryn Region • Jumgal District • Chaek village",
    },
  };

  const t = translations[lang] || translations["ky-KG"];

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = () => {
    const value = movieName.trim();
    if (!value) return;

    closeMenu();
    navigate(`/search/${encodeURIComponent(value)}`);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-logo">
            <svg
              viewBox="0 0 100 100"
              role="img"
              aria-label="Соң-Көл кинотеатры"
            >
              <circle cx="50" cy="50" r="49" fill="#ffc400" />

              <g fill="#080808">
                <circle cx="47" cy="22" r="5" />
                <circle cx="56" cy="30" r="5" />
                <circle cx="62" cy="39" r="5" />
                <path d="M69 20 H78 V46 H69 Z" />
                <path d="M28 23 L56 44 L51 51 L23 30 Z" />
                <path d="M27 23 L21 19 L25 16 L31 20 Z" />
                <path d="M57 45 Q61 51 53 56 L47 58 L52 51 Z" />
                <path d="M32 44 L36 47 L31 48 Z" />
              </g>

              <text
                x="50"
                y="68"
                textAnchor="middle"
                fontSize="13"
                fontWeight="900"
                letterSpacing=".3"
                fill="#080808"
                fontFamily="Arial, sans-serif"
              >
                СОҢ-КӨЛ
              </text>

              <path
                d="M15 75 H28 M72 75 H85"
                stroke="#080808"
                strokeWidth="1.5"
              />

              <text
                x="50"
                y="80"
                textAnchor="middle"
                fontSize="6"
                fontWeight="bold"
                letterSpacing="1.1"
                fill="#080808"
              >
                КИНОТЕАТР
              </text>
            </svg>
          </span>

          <span className="brand-text">
            <strong>СОҢ-КӨЛ</strong>
            <small>КИНОТЕАТР</small>
          </span>
        </Link>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            {t.home}
          </Link>

          <Link to="/popular" onClick={closeMenu}>
            {t.popular}
          </Link>

          <Link to="/toprated" onClick={closeMenu}>
            {t.topRated}
          </Link>

          <div className="mobile-search">
            <input
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t.search}
            />
            <button onClick={handleSearch} aria-label="Search">
              <FaSearch />
            </button>
          </div>
        </nav>

        <div className="header-right">
          <button
            className="theme-btn"
            onClick={() => setDark(!dark)}
            aria-label={t.theme}
          >
            {dark ? <CiSun /> : <MdNightlightRound />}
          </button>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="lang-select"
            aria-label="Тил"
          >
            <option value="ky-KG">KG</option>
            <option value="ru-RU">RU</option>
            <option value="en-US">EN</option>
          </select>

          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="search-input"
              placeholder={t.search}
            />
          </div>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <div className="cinema-address">{t.address}</div>
    </header>
  );
};

export default Header;
