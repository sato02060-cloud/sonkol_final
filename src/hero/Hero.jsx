import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_KEY } from "../API_KAY/api";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import { MovieContext } from "../context/RootContext.jsx";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const { lang } = useContext(MovieContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://api.themoviedb.org/3/movie/popular", { params: { api_key: API_KEY, language: lang, page: 1 } })
      .then((res) => setMovies(res.data.results.slice(0, 10)))
      .catch((error) => console.error(error));
  }, [lang]);

  const t = {
    "ky-KG": { title: "Кино дүйнөсүнө кош келиңиз!", subtitle: "Тасмаларды тандаңыз, трейлерлерди көрүңүз жана жаңы окуяларды ачыңыз.", placeholder: "Тасма же сериал издөө...", search: "Издөө", featured: "Бүгүнкү тасмалар" },
    "ru-RU": { title: "Добро пожаловать в мир кино!", subtitle: "Выбирайте фильмы, смотрите трейлеры и открывайте новые истории.", placeholder: "Найти фильм или сериал...", search: "Поиск", featured: "Фильмы сегодня" },
    "en-US": { title: "Welcome to the world of cinema!", subtitle: "Choose movies, watch trailers and discover new stories.", placeholder: "Search for a movie or show...", search: "Search", featured: "Movies today" },
  }[lang] || {};

  const doSearch = () => query.trim() && navigate(`/search/${encodeURIComponent(query.trim())}`);

  return <>
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-kicker">ТАТТЫБҮБҮ ТУРСУНБАЕВА АТЫНДАГЫ</div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="hero-search">
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSearch()} placeholder={t.placeholder} />
            <button onClick={doSearch}>{t.search}</button>
          </div>
        </div>
      </div>
    </section>
    <section className="hero-movies">
      <div className="container">
        <div className="section-title-row"><h2>{t.featured}</h2><span>СОҢ-КӨЛ</span></div>
        <div className="hero-movies-row">
          {movies.map((movie) => <div className="hero-movie-card" key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "/no-image.jpg"} alt={movie.title} />
            <h3>{movie.title}</h3><p>{movie.release_date}</p>
          </div>)}
        </div>
      </div>
    </section>
  </>;
};
export default Hero;
