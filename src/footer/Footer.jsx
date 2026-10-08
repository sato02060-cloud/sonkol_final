import React, { useContext } from "react";
import "./Footer.css";
import { MovieContext } from "../context/RootContext.jsx";

const Footer = () => {
  const { lang } = useContext(MovieContext);
  const t = {
    "ky-KG": { about:"Кинотеатр жөнүндө", address:"Дарек", addressText:"Нарын облусу, Жумгал району, Чаек айылы", schedule:"Иш убактысы", scheduleText:"Күн сайын кино дүйнөсү сиз үчүн", rights:"Бардык укуктар корголгон" },
    "ru-RU": { about:"О кинотеатре", address:"Адрес", addressText:"Нарынская область, Жумгальский район, село Чаек", schedule:"Режим работы", scheduleText:"Кино каждый день для вас", rights:"Все права защищены" },
    "en-US": { about:"About cinema", address:"Address", addressText:"Naryn Region, Jumgal District, Chaek village", schedule:"Opening", scheduleText:"Cinema every day", rights:"All rights reserved" }
  }[lang] || {};
  return <footer id="footer"><div className="container"><div className="footer-main"><div><div className="footer-brand">СОҢ-КӨЛ</div><div className="footer-sub">ТАТТЫБҮБҮ ТУРСУНБАЕВА АТЫНДАГЫ КИНОТЕАТР</div></div><div className="footer-info"><div><h3>{t.about}</h3><p>Чаек айылынын маданий жайы жана кино көрүү борбору.</p></div><div><h3>{t.address}</h3><p>{t.addressText}</p></div><div><h3>{t.schedule}</h3><p>{t.scheduleText}</p></div></div></div><div className="footer-bottom">© {new Date().getFullYear()} «Соң-Көл» кинотеатры. {t.rights}.</div></div></footer>;
}; export default Footer;
