import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { API_KEY } from "../API_KAY/api";
import "./Actor.css";
import { MovieContext } from "../context/RootContext.jsx";

const Actor = ({ movieId }) => {
  const [actors, setActors] = useState([]);
  const [movie, setMovie] = useState(null);

  const { lang } = useContext(MovieContext);

  useEffect(() => {
    if (!movieId) return;

    const getData = async () => {
      try {
        const [actorsRes, movieRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: {
              api_key: API_KEY,
              language: lang || "ky-KG",
            },
          }),

          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
              api_key: API_KEY,
              language: lang || "ky-KG",
            },
          }),
        ]);

        setActors(actorsRes.data.cast || []);
        setMovie(movieRes.data);
      } catch (error) {
        console.error("Актёрлорду жүктөөдө ката кетти:", error);
      }
    };

    getData();
  }, [movieId, lang]);

  const translations = {
    "ky-KG": {
      actors: "Башкы ролдордо",
      status: "Статус",
      original: "Баштапкы аталышы",
      budget: "Бюджет",
      revenue: "Кассалык киреше",
      none: "Маалымат жок",
    },

    "ru-RU": {
      actors: "В главных ролях",
      status: "Статус",
      original: "Исходное название",
      budget: "Бюджет",
      revenue: "Сборы",
      none: "Нет данных",
    },

    "en-US": {
      actors: "Cast",
      status: "Status",
      original: "Original title",
      budget: "Budget",
      revenue: "Revenue",
      none: "No data",
    },
  };

  const ui = translations[lang] || translations["ky-KG"];

  return (
    <section className="actorsSection">
      <div className="container">
        <div className="actorsContent">
          <div className="actorsLeft">
            <h2>{ui.actors}</h2>

            <div className="actorsList">
              {actors
                .filter((actor) => actor.profile_path)
                .slice(0, 15)
                .map((actor) => (
                  <div className="actorCard" key={actor.id}>
                    <img
                      className="actorImage"
                      src={`https://image.tmdb.org/t/p/w342${actor.profile_path}`}
                      alt={actor.name}
                    />

                    <div className="actorInfo">
                      <h3>{actor.name}</h3>

                      {actor.character && <p>{actor.character}</p>}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {movie && (
            <div className="movieFacts">
              <div className="fact">
                <h3>{ui.status}</h3>
                <p>{movie.status || ui.none}</p>
              </div>

              <div className="fact">
                <h3>{ui.original}</h3>
                <p>{movie.original_title || ui.none}</p>
              </div>

              <div className="fact">
                <h3>{ui.budget}</h3>
                <p>
                  {movie.budget
                    ? `$${movie.budget.toLocaleString("en-US")}`
                    : ui.none}
                </p>
              </div>

              <div className="fact">
                <h3>{ui.revenue}</h3>
                <p>
                  {movie.revenue
                    ? `$${movie.revenue.toLocaleString("en-US")}`
                    : ui.none}
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
