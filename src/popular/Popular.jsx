import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../API_KAY/api";
import { MovieContext } from "../context/RootContext.jsx";
import "./Popular.css";

const Popular = () => {
  const { lang } = useContext(MovieContext);
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const text = {
    "ky-KG": {
      title: "Жаңы кыргызча кинолор",
      subtitle: "Кыргызстандын жаңы тасмалары",
      loading: "Тасмалар жүктөлүүдө...",
      error: "Тасмаларды жүктөө мүмкүн болгон жок.",
      empty: "Жаңы кыргыз тасмалары табылган жок.",
      more: "Дагы тасмалар",
    },
    "ru-RU": {
      title: "Новые кыргызские фильмы",
      subtitle: "Свежие фильмы из Кыргызстана",
      loading: "Загрузка фильмов...",
      error: "Не удалось загрузить фильмы.",
      empty: "Новые кыргызские фильмы не найдены.",
      more: "Загрузить ещё",
    },
    "en-US": {
      title: "New Kyrgyz Movies",
      subtitle: "Latest films from Kyrgyzstan",
      loading: "Loading movies...",
      error: "Could not load movies.",
      empty: "No new Kyrgyz films found.",
      more: "Load more",
    },
  }[lang] || {
    title: "Жаңы кыргызча кинолор",
    subtitle: "Кыргызстандын жаңы тасмалары",
    loading: "Тасмалар жүктөлүүдө...",
    error: "Тасмаларды жүктөө мүмкүн болгон жок.",
    empty: "Жаңы кыргыз тасмалары табылган жок.",
    more: "Дагы тасмалар",
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
              sort_by: "primary_release_date.desc",
              "primary_release_date.gte": "2025-01-01",
              "primary_release_date.lte": new Date().toISOString().slice(0, 10),
              include_adult: false,
              page,
            },
          },
        );

        if (!active) return;

        const results = (response.data.results || []).filter((movie) => {
          return (
            movie.release_date &&
            movie.release_date >= "2025-01-01" &&
            movie.release_date <= new Date().toISOString().slice(0, 10) &&
            movie.poster_path
          );
        });

        setMovies((previous) => {
          if (page === 1) return results;

          const ids = new Set(previous.map((movie) => movie.id));
          return [
            ...previous,
            ...results.filter((movie) => !ids.has(movie.id)),
          ];
        });

        setTotalPages(Math.min(response.data.total_pages || 1, 10));
      } catch (err) {
        console.error("Кыргыз фильмдерин жүктөө катасы:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMovies();

    return () => {
      active = false;
    };
  }, [lang, page]);

  return (
    <section className="kyrgyz-cinema" id="popular">
      <div className="container">
        <div className="catalog-heading">
          <div>
            <span>СОҢ-КӨЛ КИНОТЕАТРЫ</span>
            <h1>{text.title}</h1>
            <p>{text.subtitle}</p>
          </div>
          <div className="catalog-decoration">К</div>
        </div>

        {error && <p className="movies-message">{text.error}</p>}

        {loading && movies.length === 0 && !error && (
          <p className="movies-message">{text.loading}</p>
        )}

        {!loading && !error && movies.length === 0 && (
          <p className="movies-message">{text.empty}</p>
        )}

        {movies.length > 0 && (
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
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.original_title}
                  loading="lazy"
                />

                <div className="cardContent">
                  <h3>{movie.title || movie.original_title}</h3>
                  <p>{movie.release_date}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {page < totalPages && !error && movies.length > 0 && (
          <div className="load-more-wrapper">
            <button
              className="load-more-btn"
              disabled={loading}
              onClick={() => setPage((previous) => previous + 1)}
            >
              {loading ? text.loading : text.more}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Popular;
