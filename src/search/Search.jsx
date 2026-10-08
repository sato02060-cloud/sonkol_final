import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_KEY } from "../API_KAY/api";
import Moviecard from "../moviecard/Moviecard";
import { MovieContext } from "../context/RootContext.jsx";

const Search = () => {
  const [search, setSearch] = useState([]); const { kinoName } = useParams(); const { lang } = useContext(MovieContext);
  useEffect(() => { if(!kinoName)return; axios.get("https://api.themoviedb.org/3/search/movie", {params:{api_key:API_KEY, query:kinoName, language:lang}}).then(r=>setSearch(r.data.results)).catch(console.error); }, [kinoName,lang]);
  const empty = lang === "ru-RU" ? "Фильмы не найдены" : lang === "en-US" ? "No movies found" : "Тасмалар табылган жок";
  return <div style={{minHeight:"70vh",padding:"40px 0",background:"#f7f0df"}}><div className="container"><h1 style={{color:"#173b70",fontFamily:"Georgia,serif",marginBottom:24}}>{lang === "ru-RU" ? "Результаты поиска" : lang === "en-US" ? "Search results" : "Издөөнүн жыйынтыгы"}</h1><div className="popular">{search.length ? search.map(el=><Moviecard key={el.id} el={el}/>) : <h2 style={{color:"#776c59"}}>{empty}</h2>}</div></div></div>;
}; export default Search;
