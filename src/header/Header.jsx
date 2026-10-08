import React, { useContext, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "../context/RootContext.jsx";
import { CiSun } from "react-icons/ci";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { MdNightlightRound } from "react-icons/md";

const Header = () => {
  const { dark, setDark, lang, setLang } = useContext(MovieContext);
  const nav = useNavigate();
  const [movieName, setMovieName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const translations = {
    "ky-KG": {
      popular: "Популярдуу",
      topRated: "Мыкты тасмалар",
      search: "Тасма же сериал издөө...",
      theme: "Теманы өзгөртүү",
    },
    "ru-RU": {
      popular: "Популярные",
      topRated: "Лучшие фильмы",
      search: "Найти фильм или сериал...",
      theme: "Изменить тему",
    },
    "en-US": {
      popular: "Popular",
      topRated: "Top Rated",
      search: "Search for a movie or show...",
      theme: "Toggle theme",
    },
  };

  const t = translations[lang] || translations["ky-KG"];

  const handleSearch = () => {
    const value = movieName.trim();
    if (!value) return;
    setMenuOpen(false);
    nav(`/search/${encodeURIComponent(value)}`);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">✦</span>
          <span className="brand-text">
            <strong>СОҢ-КӨЛ</strong>
            <small>КИНОТЕАТР</small>
          </span>
        </Link>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>Башкы бет</Link>
          <Link to="/popular" onClick={closeMenu}>{t.popular}</Link>
          <Link to="/toprated" onClick={closeMenu}>{t.topRated}</Link>
          <div className="mobile-search">
            <input
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t.search}
            />
            <button onClick={handleSearch} aria-label="Издөө"><FaSearch /></button>
          </div>
        </nav>

        <div className="header-right">
          <button className="theme-btn" onClick={() => setDark(!dark)} aria-label={t.theme}>
            {dark ? <CiSun /> : <MdNightlightRound />}
          </button>

          <select value={lang} onChange={(e) => setLang(e.target.value)} className="lang-select" aria-label="Тил">
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
              type="text"
              className="search-input"
              placeholder={t.search}
            />
          </div>

          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <div className="cinema-address">Нарын облусу • Жумгал району • Чаек айылы • М. Матыев көчөсү, 74</div>
    </header>
  );
};

export default Header;
