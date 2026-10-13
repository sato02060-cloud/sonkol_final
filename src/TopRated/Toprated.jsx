import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../API_KAY/api";
import { MovieContext } from "../context/RootContext.jsx";
import "./Toprated.css";
import "../popular/Popular.css";

const Toprated = () => {
  const { lang } = useContext(MovieContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const text = {
    "ky-KG": {
      title: "Мыкты кыргызча кинолор",
      subtitle: "Кыргыз тасмаларынын рейтинги",
      loading: "Тасмалар жүктөлүүдө...",
      empty: "Рейтингде кыргыз тасмалары табылган жок.",
      error: "Тасмаларды жүктөө мүмкүн болгон жок.",
    },
    "ru-RU": {
      title: "Лучшие кыргызские фильмы",
      subtitle: "Рейтинг фильмов Кыргызстана",
      loading: "Загрузка фильмов...",
      empty: "Кыргызские фильмы в рейтинге не найдены.",
      error: "Не удалось загрузить фильмы.",
    },
    "en-US": {
      title: "Top Kyrgyz Movies",
      subtitle: "Highest-rated films from Kyrgyzstan",
      loading: "Loading movies...",
      empty: "No rated Kyrgyz movies found.",
      error: "Could not load movies.",
    },
  }[lang] || {
    title: "Мыкты кыргызча кинолор",
    subtitle: "Кыргыз тасмаларынын рейтинги",
    loading: "Тасмалар жүктөлүүдө...",
    empty: "Кыргыз тасмалары табылган жок.",
    error: "Тасмаларды жүктөө мүмкүн болгон жок.",
  };

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      setLoading(true);
      setError(false);

      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: API_KEY,
              language: lang,
              with_origin_country: "KG",
              sort_by: "vote_average.desc",
              "vote_count.gte": 1,
              include_adult: false,
              page: 1,
            },
          },
        );

        if (active) setMovies(response.data.results || []);
      } catch (err) {
        console.error("Кыргыз фильмдеринин рейтинги:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMovies();

    return () => {
      active = false;
    };
  }, [lang]);

  return (
    <section className="kyrgyz-cinema" id="toprated">
      <div className="container">
        <div className="catalog-heading">
          <div>
            <span>СОҢ-КӨЛ КИНОТЕАТРЫ</span>
            <h1>{text.title}</h1>
            <p>{text.subtitle}</p>
          </div>
          <div className="catalog-decoration">★</div>
        </div>

        {loading && <p className="movies-message">{text.loading}</p>}
        {error && <p className="movies-message">{text.error}</p>}
        {!loading && !error && movies.length === 0 && (
          <p className="movies-message">{text.empty}</p>
        )}

        {!error && movies.length > 0 && (
          <div className="popular">
            {movies.map((movie) => (
              <article
                className="popularCard"
                key={movie.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/movie/${movie.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/movie/${movie.id}`);
                  }
                }}
              >
                <div className="rating">
                  ★ {movie.vote_average?.toFixed(1) || "—"}
                </div>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/no-image.jpg"
                  }
                  alt={movie.title || movie.original_title}
                  loading="lazy"
                />
                <div className="cardContent">
                  <h3>{movie.title || movie.original_title}</h3>
                  <p>{movie.release_date || "—"}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Toprated;
