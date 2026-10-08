import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_KEY } from "../API_KAY/api";
import "./MovieDetails.css";
import { MovieContext } from "../context/RootContext.jsx";
import Actor from "../actor/Actor";
import Video from "../video/Video";

const MovieDetails=()=>{const {id}=useParams();const navigate=useNavigate();const {lang}=useContext(MovieContext);const [movie,setMovie]=useState(null);useEffect(()=>{axios.get(`https://api.themoviedb.org/3/movie/${id}`,{params:{api_key:API_KEY,language:lang}}).then(r=>setMovie(r.data)).catch(console.error)},[id,lang]);
if(!movie)return <div className="loading">{lang==="ru-RU"?"Загрузка...":lang==="en-US"?"Loading...":"Жүктөлүүдө..."}</div>;
const ui={"ky-KG":{back:"← Артка",overview:"Кыскача маалымат",rating:"Рейтинг",actors:"Актёрлор",runtime:"мүнөт"},"ru-RU":{back:"← Назад",overview:"Обзор",rating:"Рейтинг",actors:"В главных ролях",runtime:"минут"},"en-US":{back:"← Back",overview:"Overview",rating:"Rating",actors:"Cast",runtime:"minutes"}}[lang];
const runtime=movie.runtime?`${Math.floor(movie.runtime/60)}саат ${movie.runtime%60}мүн`:(lang==="ky-KG"?"Маалымат жок":"—");
return <><section className="movieDetails" style={{backgroundImage:movie.backdrop_path?`url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`:"none"}}><div className="movieDetailsShade"/><div className="movieDetailsContainer"><button className="backBtn" onClick={()=>navigate(-1)}>{ui.back}</button><div className="movieInfo"><img className="moviePoster" src={movie.poster_path?`https://image.tmdb.org/t/p/w500${movie.poster_path}`:"/no-image.jpg"} alt={movie.title}/><div className="movieText"><div className="movie-kicker">СОҢ-КӨЛ КИНОТЕАТРЫ</div><h1>{movie.title} {movie.release_date&&<span className="releaseYear">({movie.release_date.slice(0,4)})</span>}</h1><div className="movieMetaData"><span>{movie.release_date}</span><span>•</span><span>{movie.genres?.map(g=>g.name).join(", ")}</span><span>•</span><span>{runtime}</span></div><div className="movieActionRow"><div className="ratingBadge"><b>{Math.round(movie.vote_average*10)}%</b><span>{ui.rating}</span></div></div><div className="overviewSection"><h3>{ui.overview}</h3>{movie.tagline&&<p className="tagline">{movie.tagline}</p>}<p className="overview">{movie.overview||"Маалымат жеткиликтүү эмес."}</p></div></div></div></div></section><div className="actorsContainer"><Actor movieId={id}/></div><Video videoId={id}/></>};
export default MovieDetails;
