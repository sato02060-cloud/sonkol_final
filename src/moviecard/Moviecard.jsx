import React from "react";
import { useNavigate } from "react-router-dom";
import "./Moviecard.css";
const Moviecard = ({el}) => { const navigate=useNavigate(); return <article className="searchCard" onClick={()=>navigate(`/movie/${el.id}`)}><img src={el.poster_path?`https://image.tmdb.org/t/p/w500${el.poster_path}`:"/no-image.jpg"} alt={el.title}/><div><h3>{el.title}</h3><p>{el.release_date}</p></div></article>; };
export default Moviecard;
