import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { programs } from "../data/siteData";
import { ArrowLeftIcon } from "../icons/AppIcons";

export function ProgramPage() {
  const { id } = useParams();
  const program = programs.find((item) => item.id === id) ?? programs[0];
  const Icon = program.icon;

  return (
    <motion.main
      className="program-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Link className="back-link" to="/" state={{ scrollTarget: "programs" }}>
        <ArrowLeftIcon size={18} /> К направлениям
      </Link>
      <section className={`program-hero ${program.tone}`}>
        <div>
          <p className="eyebrow">{program.code} · {program.field}</p>
          <h1>{program.title}</h1>
          <p>{program.concept}</p>
        </div>
        <Icon size={112} />
      </section>
      <section className="program-detail">
        <article>
          <h2>Цели и задачи</h2>
          <p>{program.goal}</p>
        </article>
        <article>
          <h2>Основные дисциплины</h2>
          <ul>
            {program.disciplines.map((discipline) => (
              <li key={discipline}>{discipline}</li>
            ))}
          </ul>
        </article>
      </section>
      <section className="program-admission-page">
        <div className="section-heading">
          <p className="eyebrow">Поступление</p>
          <h2>Ключевые цифры по направлению</h2>
        </div>
        <div className="program-admission-grid">
          {program.admission?.map((item) => (
            <article className="program-admission-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
