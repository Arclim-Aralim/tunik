import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../icons/AppIcons";

export function ProgramCard({ program }) {
  const Icon = program.icon;
  return (
    <article className={`program-card ${program.tone}`}>
      <div className="card-top">
        <span className="icon"><Icon size={24} /></span>
        <span className="tag">{program.tag}</span>
      </div>
      <p className="code">{program.code}</p>
      <h3>{program.title}</h3>
      <p>{program.concept}</p>
      <div className="card-bottom">
        <span>{program.room}</span>
        <Link
          to={`/program/${program.id}`}
          state={{ fromSection: "programs" }}
          aria-label={`Открыть ${program.title}`}
        >
          <ArrowRightIcon size={18} />
        </Link>
      </div>
    </article>
  );
}
