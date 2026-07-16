import React from "react";

export function CyberCircuit() {
  return (
    <div className="circuit" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} style={{ "--i": index }} />
      ))}
    </div>
  );
}
