import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_KEY } from "../API_KAY/api";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import { MovieContext } from "../context/RootContext.jsx";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { lang } = useContext(MovieContext);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadMovies = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: API_KEY,
              language: lang || "ky-KG",
              with_origin_country: "KG",
              sort_by: "primary_release_date.desc",
              "release_date.lte": new Date().toISOString().slice(0, 10),
              page: 1,
              include_adult: false,
            },
          },
        );

        if (active) {
          setMovies(
            (response.data.results || [])
              .filter((movie) => movie.poster_path && movie.release_date)
              .slice(0, 10),
          );
        }
      } catch (error) {
        console.error(error);
        if (active) setMovies([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMovies();

    return () => {
      active = false;
    };
  }, [lang]);

  const translations = {
    "ky-KG": {
      title: "Кыргыз кино дүйнөсүнө кош келиңиз!",
      subtitle: "Кыргыз тасмаларын көрүңүз. Жаңы окуялар ушул жерден башталат.",
      placeholder: "Тасма издөө...",
      search: "Издөө",
      featured: "Кыргыз тасмалары",
      loading: "Тасмалар жүктөлүүдө...",
      empty: "Кыргыз тасмалары азырынча табылган жок.",
      watch: "Маалымат",
    },
    "ru-RU": {
      title: "Добро пожаловать в мир кыргызского кино!",
      subtitle: "Открывайте кыргызские фильмы и новые истории.",
      placeholder: "Найти фильм...",
      search: "Поиск",
      featured: "Кыргызские фильмы",
      loading: "Загрузка фильмов...",
      empty: "Кыргызские фильмы пока не найдены.",
      watch: "Подробнее",
    },
    "en-US": {
      title: "Welcome to Kyrgyz cinema!",
      subtitle: "Discover Kyrgyz films and new stories.",
      placeholder: "Search for a movie...",
      search: "Search",
      featured: "Kyrgyz films",
      loading: "Loading movies...",
      empty: "No Kyrgyz movies found yet.",
      watch: "Details",
    },
  };

  const t = translations[lang] || translations["ky-KG"];

  const doSearch = () => {
    const value = query.trim();
    if (value) navigate(`/search/${encodeURIComponent(value)}`);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-kicker">ТАТТЫБҮБҮ ТУРСУНБАЕВА АТЫНДАГЫ</div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>

            <div className="hero-search">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder={t.placeholder}
              />
              <button onClick={doSearch}>{t.search}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-movies">
        <div className="container">
          <div className="section-title-row">
            <h2>{t.featured}</h2>
            <span>СОҢ-КӨЛ</span>
          </div>

          {loading ? (
            <p className="hero-message">{t.loading}</p>
          ) : movies.length === 0 ? (
            <p className="hero-message">{t.empty}</p>
          ) : (
            <div className="hero-movies-row">
              {movies.map((movie) => (
                <div
                  className="hero-movie-card"
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(`/movie/${movie.id}`);
                  }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                  />
                  <div className="hero-movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date?.slice(0, 4)}</p>
                    <span>{t.watch} →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Hero;
