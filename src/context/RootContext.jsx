import React, { createContext, useEffect, useState } from "react";

export const MovieContext = createContext();

const RootContext = ({ children }) => {
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("sonkol-dark");
    return savedTheme !== null ? JSON.parse(savedTheme) : false;
  });

  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("sonkol-lang");
    return ["ky-KG", "ru-RU", "en-US"].includes(savedLang)
      ? savedLang
      : "ky-KG";
  });

  useEffect(() => {
    localStorage.setItem("sonkol-dark", JSON.stringify(dark));
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("sonkol-lang", lang);
  }, [lang]);

  return (
    <MovieContext.Provider value={{ dark, setDark, lang, setLang }}>
      {children}
    </MovieContext.Provider>
  );
};

export default RootContext;
