import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { API_KEY } from "../API_KAY/api";
import "./Actor.css";
import { MovieContext } from "../context/RootContext.jsx";

const Actor = ({ movieId }) => {
  const { lang } = useContext(MovieContext);
  const [actors, setActors] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function getData() {
      setLoading(true);
      setActors([]);
      setMovie(null);

      try {
        const [creditsResponse, movieResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: {
              api_key: API_KEY,
              language: lang,
            },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
              api_key: API_KEY,
              language: lang,
            },
          }),
        ]);

        if (!active) return;

        const cast = creditsResponse.data.cast || [];

        setActors(cast.filter((person) => person.name).slice(0, 12));
        setMovie(movieResponse.data);
      } catch (error) {
        console.error("Cast loading error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (movieId) getData();
    else setLoading(false);

    return () => {
      active = false;
    };
  }, [movieId, lang]);

  const text = {
    "ky-KG": {
      actors: "Башкы ролдордо",
      status: "Статус",
      original: "Баштапкы аталышы",
      budget: "Бюджет",
      revenue: "Кассалык киреше",
      none: "Маалымат жок",
      loading: "Актёрлор жүктөлүүдө...",
    },
    "ru-RU": {
      actors: "В главных ролях",
      status: "Статус",
      original: "Оригинальное название",
      budget: "Бюджет",
      revenue: "Сборы",
      none: "Нет данных",
      loading: "Загрузка актёров...",
    },
    "en-US": {
      actors: "Cast",
      status: "Status",
      original: "Original title",
      budget: "Budget",
      revenue: "Revenue",
      none: "No data",
      loading: "Loading cast...",
    },
  }[lang] || {
    actors: "Башкы ролдордо",
    status: "Статус",
    original: "Баштапкы аталышы",
    budget: "Бюджет",
    revenue: "Кассалык киреше",
    none: "Маалымат жок",
    loading: "Актёрлор жүктөлүүдө...",
  };

  if (loading) {
    return (
      <section className="actorsSection">
        <div className="container">
          <p>{text.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="actorsSection">
      <div className="container">
        <div className="actorsContent">
          <div className="actorsLeft">
            <h2>{text.actors}</h2>

            <div className="actorsList">
              {actors.map((actor) => (
                <div className="actorCard" key={actor.id}>
                  {actor.profile_path ? (
                    <img
                      className="actorImage"
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      loading="lazy"
                    />
                  ) : null}

                  <div className="actorInfo">
                    <h3>{actor.name}</h3>
                    {actor.character && <p>{actor.character}</p>}
                  </div>
                </div>
              ))}

              {actors.length === 0 && <p>{text.none}</p>}
            </div>
          </div>

          {movie && (
            <div className="movieFacts">
              <div className="fact">
                <h3>{text.status}</h3>
                <p>{movie.status || text.none}</p>
              </div>

              <div className="fact">
                <h3>{text.original}</h3>
                <p>{movie.original_title || text.none}</p>
              </div>

              <div className="fact">
                <h3>{text.budget}</h3>
                <p>
                  {movie.budget
                    ? `$${movie.budget.toLocaleString("en-US")}`
                    : text.none}
                </p>
              </div>

              <div className="fact">
                <h3>{text.revenue}</h3>
                <p>
                  {movie.revenue
                    ? `$${movie.revenue.toLocaleString("en-US")}`
                    : text.none}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Actor;
