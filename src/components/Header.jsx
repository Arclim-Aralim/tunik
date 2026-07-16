import React from "react";
import { Link } from "react-router-dom";
import { useSectionNavigation } from "../hooks/useSectionNavigation";

export function Header() {
  const scrollToSection = useSectionNavigation();

  return (
    <header className="header">
      <Link className="brand" to="/">
        <span className="brand-mark">T</span>
        <span>Т-университет</span>
      </Link>
      <nav aria-label="Главная навигация">
        <button type="button" onClick={() => scrollToSection("about")}>О Т-университете</button>
        <button type="button" onClick={() => scrollToSection("institute")}>Институт</button>
        <button type="button" onClick={() => scrollToSection("programs")}>Направления</button>
        <button type="button" onClick={() => scrollToSection("model")}>Модель</button>
        <Link to="/quiz">Тест</Link>
      </nav>
    </header>
  );
}
