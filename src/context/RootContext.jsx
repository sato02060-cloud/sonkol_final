import React, { createContext, useEffect, useState } from "react";

export const MovieContext = createContext();

const RootContext = ({ children }) => {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState(() => ["ky-KG","ru-RU","en-US"].includes(localStorage.getItem("sonkol-lang")) ? localStorage.getItem("sonkol-lang") : "ky-KG");

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
