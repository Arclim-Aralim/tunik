import React from "react";
import { specializationGraph } from "../data/siteData";

export function SpecializationGraph() {
  return (
    <div className="t-graph" aria-label="Схема T-shaped специалиста">
      <div className="discipline-axis">
        <span aria-hidden="true">←</span>
        <strong>Дисциплины</strong>
        <span aria-hidden="true">→</span>
      </div>
      <div className="graph-stage">
        <div className="bars" aria-hidden="true">
          {specializationGraph.map((item) => (
            <div
              className={`specialization-bar ${item.kind} ${item.height}`}
              key={item.title}
            >
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
        <div className="depth-axis">
          <span aria-hidden="true">↑</span>
          <strong>Глубина экспертизы</strong>
          <span aria-hidden="true">↓</span>
        </div>
      </div>
    </div>
  );
}
