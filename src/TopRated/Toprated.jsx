import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../API_KAY/api";
import "./Toprated.css";
import { MovieContext } from "../context/RootContext.jsx";

const Toprated = () => {
  const [movies, setMovies] = useState([]); const { lang } = useContext(MovieContext); const navigate = useNavigate();
  useEffect(() => { axios.get("https://api.themoviedb.org/3/movie/top_rated", { params:{api_key:API_KEY, language:lang, page:1} }).then(r=>setMovies(r.data.results)).catch(console.error); }, [lang]);
  const title = lang === "ru-RU" ? "Лучшие фильмы" : lang === "en-US" ? "Top rated movies" : "Мыкты тасмалар";
  return <section id="popular"><div className="container"><div className="catalog-heading"><span>СОҢ-КӨЛ • TOP</span><h1>{title}</h1></div><div className="popular">{movies.map(el=><article className="popularCard" key={el.id} onClick={()=>navigate(`/movie/${el.id}`)}><div className="rating">{Math.round(el.vote_average*10)}%</div><img src={el.poster_path?`https://image.tmdb.org/t/p/w500${el.poster_path}`:"/no-image.jpg"} alt={el.title}/><div className="cardContent"><h3>{el.title}</h3><p>{el.release_date}</p></div></article>)}</div></div></section>;
}; export default Toprated;
