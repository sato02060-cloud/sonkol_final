import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_KEY } from "../API_KAY/api";
import "./MovieDetails.css";
import { MovieContext } from "../context/RootContext.jsx";
import Actor from "../actor/Actor";
import Video from "../video/Video";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useContext(MovieContext);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadMovie = async () => {
      setMovie(null);

      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: API_KEY,
              language: lang || "ky-KG",
            },
          },
        );

        let movieData = response.data;

        if (!movieData.overview || !movieData.tagline) {
          const languages = [
            ...new Set([lang || "ky-KG", "ky-KG", "ru-RU", "en-US"]),
          ];

          const translations = await Promise.all(
            languages.map(async (language) => {
              try {
                const result = await axios.get(
                  `https://api.themoviedb.org/3/movie/${id}`,
                  {
                    params: {
                      api_key: API_KEY,
                      language,
                    },
                  },
                );

                return result.data;
              } catch {
                return null;
              }
            }),
          );

          const available = translations.filter(Boolean);

          movieData = {
            ...movieData,
            overview:
              movieData.overview ||
              available.find((item) => item.overview?.trim())?.overview ||
              "",
            tagline:
              movieData.tagline ||
              available.find((item) => item.tagline?.trim())?.tagline ||
              "",
            title:
              movieData.title ||
              available.find((item) => item.title?.trim())?.title ||
              "",
          };
        }

        if (!cancelled) setMovie(movieData);
      } catch (error) {
        console.error(error);
        if (!cancelled) setMovie(null);
      }
    };

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [id, lang]);

  const translations = {
    "ky-KG": {
      back: "← Артка",
      overview: "Кыскача маалымат",
      rating: "Рейтинг",
      actors: "Актёрлор",
      noData: "Маалымат жеткиликтүү эмес.",
      loading: "Жүктөлүүдө...",
      noRuntime: "Маалымат жок",
    },
    "ru-RU": {
      back: "← Назад",
      overview: "Обзор",
      rating: "Рейтинг",
      actors: "В главных ролях",
      noData: "Информация недоступна.",
      loading: "Загрузка...",
      noRuntime: "Нет информации",
    },
    "en-US": {
      back: "← Back",
      overview: "Overview",
      rating: "Rating",
      actors: "Cast",
      noData: "Information not available.",
      loading: "Loading...",
      noRuntime: "No information",
    },
  };

  const ui = translations[lang] || translations["ky-KG"];

  if (!movie) {
    return <div className="loading">{ui.loading}</div>;
  }

  const runtime = movie.runtime
    ? lang === "ru-RU"
      ? `${Math.floor(movie.runtime / 60)} ч ${movie.runtime % 60} мин`
      : lang === "en-US"
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
        : `${Math.floor(movie.runtime / 60)} саат ${movie.runtime % 60} мүн`
    : ui.noRuntime;

  return (
    <>
      <section
        className="movieDetails"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
      >
        <div className="movieDetailsShade" />
        <div className="movieDetailsContainer">
          <button className="backBtn" onClick={() => navigate(-1)}>
            {ui.back}
          </button>

          <div className="movieInfo">
            <img
              className="moviePoster"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/no-image.jpg"
              }
              alt={movie.title || ""}
            />

            <div className="movieText">
              <div className="movie-kicker">СОҢ-КӨЛ КИНОТЕАТРЫ</div>

              <h1>
                {movie.title}
                {movie.release_date && (
                  <span className="releaseYear">
                    {" "}
                    ({movie.release_date.slice(0, 4)})
                  </span>
                )}
              </h1>

              <div className="movieMetaData">
                {movie.release_date && <span>{movie.release_date}</span>}
                {movie.genres?.length > 0 && (
                  <>
                    <span>•</span>
                    <span>
                      {movie.genres.map((genre) => genre.name).join(", ")}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{runtime}</span>
              </div>

              <div className="movieActionRow">
                <div className="ratingBadge">
                  <b>{Math.round((movie.vote_average || 0) * 10)}%</b>
                  <span>{ui.rating}</span>
                </div>
              </div>

              <div className="overviewSection">
                <h3>{ui.overview}</h3>
                {movie.tagline && <p className="tagline">{movie.tagline}</p>}
                <p className="overview">{movie.overview || ui.noData}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="actorsContainer">
        <Actor movieId={id} />
      </div>

      <Video videoId={id} />
    </>
  );
};

export default MovieDetails;
