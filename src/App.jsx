import React, { useContext } from "react";
import Header from "./header/Header";
import { Routes, Route } from "react-router-dom";
import Popular from "./popular/Popular";
import Toprated from "./TopRated/Toprated";
import Footer from "./footer/Footer";
import Hero from "./hero/Hero";
import MovieDetails from "./moviedetail/MovieDetails";
import { MovieContext } from "./context/RootContext.jsx";
import Search from "./search/Search.jsx";
import "./App.css";

const App=()=>{const {dark}=useContext(MovieContext);return <div id="app" className={dark?"light-mode":"cinema-mode"}><Header/><Routes><Route path="/" element={<Hero/>}/><Route path="/popular" element={<Popular/>}/><Route path="/toprated" element={<Toprated/>}/><Route path="/movie/:id" element={<MovieDetails/>}/><Route path="/search/:kinoName" element={<Search/>}/></Routes><Footer/></div>};
export default App;
