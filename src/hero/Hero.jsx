import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../API_KAY/api";
import { MovieContext } from "../context/RootContext";
import "./Hero.css";

const Hero = () => {
  const { lang } = useContext(MovieContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const language = lang || "ky-KG";

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      setLoading(true);
      setMovies([]);

      try {
        const today = new Date();
        const date = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, "0"),
          String(today.getDate()).padStart(2, "0"),
        ].join("-");

        const sortBy =
          activeTab === "popular"
            ? "popularity.desc"
            : "primary_release_date.desc";

        const requests = [1, 2, 3].map(async (page) => {
          const params = new URLSearchParams({
            api_key: API_KEY,
            language,
            with_origin_country: "KG",
            sort_by: sortBy,
            include_adult: "false",
            "release_date.lte": date,
            page: String(page),
          });

          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?${params}`,
            { signal: controller.signal },
          );

          if (!response.ok) {
            throw new Error(`TMDB error: ${response.status}`);
          }

          const data = await response.json();
          return data.results || [];
        });

        const results = await Promise.all(requests);

        const uniqueMovies = Array.from(
          new Map(
            results
              .flat()
              .filter(
                (movie) =>
                  movie.poster_path &&
                  movie.release_date &&
                  movie.release_date <= date &&
                  movie.original_language !== "en",
              )
              .map((movie) => [movie.id, movie]),
          ).values(),
        );

        if (!controller.signal.aborted) {
          setMovies(uniqueMovies.slice(0, 12));
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Кинолорду жүктөөдө ката кетти:", error);
          if (!controller.signal.aborted) setMovies([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchMovies();

    return () => controller.abort();
  }, [activeTab, language]);

  const handleSearch = (event) => {
    event.preventDefault();

    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <p className="hero-kicker">СОҢ-КӨЛ КИНОТЕАТРЫ</p>
        <h1>Кыргыз кино дүйнөсүнө кош келиңиз!</h1>
        <p>Кыргызстандын мыкты тасмаларын бир жерден көрүңүз.</p>

        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Кино издөө..."
          />
          <button type="submit">Издөө</button>
        </form>
      </div>

      <div className="hero-movies">
        <div className="hero-movies-header">
          <h2>Кыргыз кинолору</h2>

          <div className="hero-buttons">
            <button
              type="button"
              className={activeTab === "popular" ? "active" : ""}
              onClick={() => setActiveTab("popular")}
            >
              Популярдуу
            </button>

            <button
              type="button"
              className={activeTab === "new" ? "active" : ""}
              onClick={() => setActiveTab("new")}
            >
              Жаңы кинолор
            </button>
          </div>
        </div>

        {loading ? (
          <p className="hero-message">Кинолор жүктөлүүдө...</p>
        ) : movies.length === 0 ? (
          <p className="hero-message">Кыргыз кинолору табылган жок.</p>
        ) : (
          <div className="hero-movie-grid">
            {movies.map((movie) => (
              <div
                className="hero-movie-card"
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/movie/${movie.id}`);
                  }
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.original_title}
                  loading="lazy"
                />

                <div className="hero-movie-info">
                  <h3>{movie.title || movie.original_title}</h3>
                  <p>{movie.release_date.slice(0, 4)}</p>
                  <span>Толугураак</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
