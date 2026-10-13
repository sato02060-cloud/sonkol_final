import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_KEY } from "../API_KAY/api";
import Moviecard from "../moviecard/Moviecard";
import { MovieContext } from "../context/RootContext.jsx";

const Search = () => {
  const { kinoName } = useParams();
  const { lang } = useContext(MovieContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function searchMovies() {
      setLoading(true);
      setError(false);
      setMovies([]);

      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/search/movie",
          {
            params: {
              api_key: API_KEY,
              query: kinoName,
              language: lang,
              include_adult: false,
              page: 1,
            },
          },
        );

        if (active) setMovies(response.data.results || []);
      } catch (err) {
        console.error("Movie search error:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (kinoName?.trim()) searchMovies();
    else setLoading(false);

    return () => {
      active = false;
    };
  }, [kinoName, lang]);

  const text = {
    "ky-KG": {
      title: "Издөөнүн жыйынтыгы",
      loading: "Изделүүдө...",
      empty: "Тасма табылган жок. Аталышын башкача жазып көрүңүз.",
      error: "Издөө иштеген жок. Кайра аракет кылыңыз.",
    },
    "ru-RU": {
      title: "Результаты поиска",
      loading: "Поиск...",
      empty: "Фильм не найден. Попробуйте другое название.",
      error: "Ошибка поиска. Попробуйте ещё раз.",
    },
    "en-US": {
      title: "Search results",
      loading: "Searching...",
      empty: "Movie not found. Try another title.",
      error: "Search failed. Please try again.",
    },
  }[lang] || {
    title: "Издөөнүн жыйынтыгы",
    loading: "Изделүүдө...",
    empty: "Тасма табылган жок.",
    error: "Издөө иштеген жок.",
  };

  return (
    <section
      style={{
        minHeight: "70vh",
        padding: "40px 0",
        background: "#f7f0df",
      }}
    >
      <div className="container">
        <h1
          style={{
            color: "#173b70",
            fontFamily: "Georgia, serif",
            marginBottom: 24,
          }}
        >
          {text.title}: {kinoName}
        </h1>

        {loading && <p>{text.loading}</p>}
        {error && <p>{text.error}</p>}

        {!loading && !error && movies.length === 0 && (
          <p style={{ color: "#776c59" }}>{text.empty}</p>
        )}

        {!error && movies.length > 0 && (
          <div className="popular">
            {movies.map((movie) => (
              <Moviecard key={movie.id} el={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Search;
