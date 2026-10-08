import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../API_KAY/api";
import "./Popular.css";
import { MovieContext } from "../context/RootContext.jsx";

const Popular = () => {
  const [popular, setPopular] = useState([]);
  const { lang } = useContext(MovieContext);
  const navigate = useNavigate();
  useEffect(() => { axios.get("https://api.themoviedb.org/3/movie/popular", { params: { api_key: API_KEY, language: lang, page: 1 } }).then(res => setPopular(res.data.results)).catch(console.error); }, [lang]);
  const title = lang === "ru-RU" ? "Популярные фильмы" : lang === "en-US" ? "Popular movies" : "Популярдуу тасмалар";
  const subtitle = lang === "ru-RU" ? "Фильмы, которые сейчас выбирают зрители" : lang === "en-US" ? "Movies viewers are choosing now" : "Көрүүчүлөр азыр тандап жаткан тасмалар";
  return <section id="popular"><div className="container"><div className="catalog-heading"><div><span>СОҢ-КӨЛ</span><h1>{title}</h1><p>{subtitle}</p></div></div><div className="popular">{popular.map(movie => <article className="popularCard" key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}><div className="rating">{Math.round(movie.vote_average * 10)}%</div><img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-image.jpg"} alt={movie.title}/><div className="cardContent"><h3>{movie.title}</h3><p>{movie.release_date}</p></div></article>)}</div></div></section>;
};
export default Popular;
